import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { initialExperienceFrame } from "../lib/experience-input.ts";
import { createParticleFieldState, PARTICLE_FIELD } from "../lib/particle-field.ts";
import { createMotionClock, planMotionSteps, sampleParticleMotion, particleStateLayout, PARTICLE_MOTION } from "../lib/particle-motion.ts";
import * as THREE from "three";
import { createParticleGPU } from "../lib/particle-gpu.ts";

const magnitude = p => Math.hypot(...p);
const distance = (a, b) => magnitude(a.map((v, i) => v - b[i]));
const options = { enabled: true, visible: true, freeze: false, width: 1440, height: 900 };
const frame = (id, delta = 1 / 60, extra = {}) => ({ ...initialExperienceFrame(), id, delta, time: id * delta, intervalMs: delta * 1000, ...extra });
const prime = () => { const clock = createMotionClock(); planMotionSteps(clock, frame(1, 0), options); return clock; };

test("motion clock schedules exactly 120 bounded steps per second at 30/60/120 Hz", () => {
  for (const hz of [30, 60, 120]) {
    const clock = prime(); let steps = 0;
    for (let i = 0; i < hz; i++) steps += planMotionSteps(clock, frame(i + 2, 1 / hz), options).steps;
    assert.equal(steps, 120); assert.ok(Math.abs(clock.time - 1) < 1e-10);
    assert.ok(clock.remainder < PARTICLE_MOTION.step);
  }
});

test("fixed-step trajectories for held forces match at 30/60/120 Hz, not just step counts", () => {
  const results = [], rest = [.7, .2, .2], state = createParticleFieldState(); state.scroll = .6;
  for (const hz of [30, 60, 120]) {
    const clock = prime(); let m = { position: [...rest], velocity: [0, 0, 0] };
    for (let i = 0; i < hz * 3; i++) {
      const plan = planMotionSteps(clock, frame(i + 2, 1 / hz), options);
      for (let j = 0; j < plan.steps; j++) m = sampleParticleMotion(m.position, m.velocity, rest, state,
        plan.time + (j + .5) * PARTICLE_MOTION.step, false, true);
    }
    results.push(m);
  }
  for (const m of results.slice(1)) {
    assert.ok(distance(m.position, results[0].position) < 1e-10);
    assert.ok(distance(m.velocity, results[0].velocity) < 1e-10);
  }
});

test("freeze preserves state time, hidden/reduced/resize/resume/model changes reset without catch-up", () => {
  const clock = prime(); planMotionSteps(clock, frame(2), options);
  const time = clock.time, remainder = clock.remainder;
  const frozen = planMotionSteps(clock, frame(3), { ...options, freeze: true });
  assert.equal(frozen.steps, 0); assert.equal(frozen.reset, false);
  assert.equal(clock.time, time); assert.equal(clock.remainder, remainder);
  for (const [f, o] of [
    [frame(4, 0, { intervalMs: 5000 }), options],
    [frame(5, NaN), options],
    [frame(6), { ...options, width: 390 }],
    [frame(7, 1 / 60, { reducedMotion: true }), options],
    [frame(8), options],
    [frame(9), { ...options, enabled: false }],
    [frame(10), options],
    [frame(11), { ...options, visible: false }],
  ]) { const plan = planMotionSteps(clock, f, o); assert.equal(plan.reset, true); assert.equal(plan.steps, 0); }
  assert.equal(planMotionSteps(clock, frame(12), { ...options, visible: false }).steps, 0);
  const limited = planMotionSteps(prime(), frame(2, .2), options);
  assert.ok(limited.steps <= 8);
});

test("packed state maps each immutable particle to its own centered texel and accounts for five float textures", () => {
  for (const counts of [[32000, 6500], [15000, 3200]]) {
    const layout = particleStateLayout(counts); const seen = new Set();
    for (const cloud of layout.uv) for (let i = 0; i < cloud.length; i += 2) {
      const x = Math.floor(cloud[i] * layout.size), y = Math.floor(cloud[i + 1] * layout.size);
      seen.add(y * layout.size + x);
      assert.ok(Math.abs(cloud[i] * layout.size - x - .5) < 1e-4);
    }
    assert.equal(seen.size, counts[0] + counts[1]); assert.equal(layout.bytes, layout.size ** 2 * 80);
  }
  assert.throws(() => particleStateLayout([0])); assert.throws(() => particleStateLayout([1.5]));
});

test("stateful flow moves particles beyond the rest-bound field without moving the shell", () => {
  const state = createParticleFieldState(); const rest = [.7, .2, .2], copy = [...rest];
  let motion = { position: [...rest], velocity: [0, 0, 0] }, maxDistance = 0;
  for (let i = 0; i < 2400; i++) {
    motion = sampleParticleMotion(motion.position, motion.velocity, rest, state, i / 120, false, true);
    maxDistance = Math.max(maxDistance, distance(motion.position, rest));
    assert.ok(magnitude(motion.position) <= 1.38 + 1e-8); assert.ok(magnitude(motion.velocity) <= 1.2 + 1e-8);
  }
  assert.ok(maxDistance > PARTICLE_FIELD.inside.displacement, `max ${maxDistance}`);
  assert.deepEqual(rest, copy);
});

test("flow-off state returns toward rest with no historical drift; local impulses remain independent", () => {
  const rest = [.2, .2, .7], state = createParticleFieldState();
  let motion = { position: [.5, -.1, .7], velocity: [.2, 0, 0] };
  const initial = distance(motion.position, rest);
  for (let i = 0; i < 360; i++) motion = sampleParticleMotion(motion.position, motion.velocity, rest, state, i / 120, false, false);
  assert.ok(distance(motion.position, rest) < initial * .01);
  state.impulses[0].center = [...rest]; state.impulses[0].vector = [.24, 0, 0]; state.impulses[0].age = .3;
  const affected = sampleParticleMotion(rest, [0, 0, 0], rest, state, 0, false, false);
  assert.ok(distance(affected.position, rest) > 0);
  assert.equal(state.scroll, 0);
});

test("integrated inner body and outer halo retain finite radial/speed bounds under sustained forces", () => {
  const state = createParticleFieldState(); state.scroll = 1;
  for (const slot of state.impulses) { slot.center = [.2, .1, 1.2]; slot.vector = [.24, -.1, .1]; slot.age = .3; }
  for (const outside of [false, true]) {
    const rest = outside ? [1.5, 0, 0] : [0, 0, 1.2], profile = outside ? PARTICLE_FIELD.outside : PARTICLE_FIELD.inside;
    let m = { position: [...rest], velocity: [0, 0, 0] };
    for (let i = 0; i < 1200; i++) {
      m = sampleParticleMotion(m.position, m.velocity, rest, state, i / 120, outside, true);
      assert.ok([...m.position, ...m.velocity].every(Number.isFinite));
      assert.ok(magnitude(m.position) >= profile.minRadius - 1e-8 && magnitude(m.position) <= profile.maxRadius + 1e-8);
      assert.ok(magnitude(m.velocity) <= 1.2 + 1e-8);
    }
  }
});

test("GPU branch keeps two MRT targets, float capability fallback and shared-frame cleanup", () => {
  const gpu = readFileSync(new URL("../lib/particle-gpu.ts", import.meta.url), "utf8");
  const canvas = readFileSync(new URL("../components/experience-canvas.tsx", import.meta.url), "utf8");
  assert.match(gpu, /EXT_color_buffer_float/); assert.match(gpu, /FRAMEBUFFER_COMPLETE/);
  assert.match(gpu, /count: 2, type: THREE.FloatType/);
  assert.match(gpu, /layout\(location = 1\) out vec4 nextVelocity/);
  assert.match(gpu, /scope.add\(\(\) => target.dispose\(\)\)/);
  assert.doesNotMatch(gpu + canvas, /requestAnimationFrame|setAnimationLoop/);
  assert.ok(canvas.indexOf("simulation.step(frame") < canvas.indexOf("pipeline.render(camera"));
  assert.match(canvas, /simulation.stats.mode === "gpu"/);
});

function mockRenderer({ float = true, framebuffer = true, shader = true } = {}) {
  let target = null; const calls = [], disposed = [];
  const gl = { MAX_DRAW_BUFFERS: 1, FRAMEBUFFER: 2, FRAMEBUFFER_COMPLETE: 3,
    getParameter: () => 2, checkFramebufferStatus: () => framebuffer ? 3 : 0 };
  return { calls, disposed, getContext: () => gl, extensions: { has: () => float },
    capabilities: { maxVertexTextures: 4, maxTextureSize: 4096 }, debug: { onShaderError: null },
    getRenderTarget: () => target,
    setRenderTarget(t) { target = t; if (t && !disposed.includes(t)) { disposed.push(t); t.dispose = () => { t.frees = (t.frees || 0) + 1; }; } },
    compile() { if (!shader) this.debug.onShaderError(); },
    render(scene) {
      const u = scene.children[0].material.uniforms;
      assert.ok(!target.textures.includes(u.uPosition.value) && !target.textures.includes(u.uVelocity.value), "No read/write texture feedback");
      calls.push({ target, time: u.uTime.value, reset: u.uReset.value });
    },
  };
}
const clouds = () => [{ positions: new Float32Array([.2, .1, .7]) }, { positions: new Float32Array([1.5, 0, 0]) }];

test("unsupported float/framebuffer/shader retains field and disposes partial allocations", () => {
  for (const settings of [{ float: false }, { framebuffer: false }, { shader: false }]) {
    const r = mockRenderer(settings), callbacks = [];
    const gpu = createParticleGPU(THREE, r, clouds(), [], [], cb => callbacks.push(cb));
    assert.equal(gpu.stats.mode, "field"); assert.equal(gpu.texture, null); assert.equal(gpu.stats.bytes, 0);
    assert.equal(r.getRenderTarget(), null); assert.equal(r.debug.onShaderError, null);
    for (const target of r.disposed) assert.equal(target.frees, 1);
    gpu.step(frame(2), options, true, 0); assert.equal(callbacks.length, 0);
  }
});

test("GPU ping-pong updates, freeze, reset, runtime fallback and idempotent scope cleanup", () => {
  const r = mockRenderer(), callbacks = [];
  const gpu = createParticleGPU(THREE, r, clouds(), [], [], cb => callbacks.push(cb));
  assert.equal(gpu.stats.mode, "gpu"); gpu.step(frame(1, 0), options, true, 0);
  gpu.step(frame(2), options, true, 0); assert.equal(gpu.stats.steps, 2);
  const t = gpu.texture, time = gpu.stats.time;
  gpu.step(frame(3), { ...options, freeze: true }, true, 0);
  assert.equal(gpu.texture, t); assert.equal(gpu.stats.time, time); assert.equal(gpu.stats.passes, 0);
  gpu.step(frame(4, 0, { intervalMs: 5000 }), options, true, 0);
  assert.equal(gpu.stats.passes, 2); assert.equal(gpu.stats.steps, 0);
  assert.equal(r.getRenderTarget(), null);
  r.render = () => { throw new Error("test-update-failure"); };
  gpu.step(frame(5), options, true, 0);
  assert.equal(gpu.stats.mode, "field"); assert.equal(gpu.stats.reason, "test-update-failure"); assert.equal(gpu.texture, null);
  callbacks[0](); callbacks[0]();
  for (const target of r.disposed) assert.equal(target.frees, 1);
});
