import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { initialExperienceFrame } from "../lib/experience-input.ts";
import { createIntroParticles, particleVertexShader, shellVertexShader } from "../lib/intro-particles.ts";
import { createParticleFieldState, stepParticleField, sampleParticleField, PARTICLE_FIELD, particleFieldShader } from "../lib/particle-field.ts";

const close = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const vectorClose = (a, b) => a.forEach((n, i) => close(n, b[i]));
const magnitude = p => Math.hypot(...p);
const distance = (a, b) => magnitude(a.map((v, i) => v - b[i]));
const frame = (id, delta = 1 / 60, more = {}) => ({ ...initialExperienceFrame(), id, delta, intervalMs: delta * 1000, ...more });
const options = { mouse: true, scroll: true, freeze: false, visible: true, width: 1440, height: 900 };
const input = (velocity = [0, 0, 0], scrollVelocity = 0, point = [0, 0, 1.45], influence = 1) =>
  ({ pointer: { velocity, point, influence, region: influence ? "shell" : "none" }, scrollVelocity, flowEnabled: true });
function prime() {
  const state = createParticleFieldState();
  stepParticleField(state, frame(1, 0), input(), options);
  return state;
}

test("field integrates a held input exactly across 30/60/120 Hz instead of growing per frame", () => {
  const states = [];
  for (const hz of [30, 60, 120]) {
    const state = prime();
    for (let i = 0; i < hz / 10; i++) stepParticleField(state, frame(i + 2, 1 / hz), input([1, 0, 0], 4), options);
    const expected = PARTICLE_FIELD.gain * (1 - Math.exp(-PARTICLE_FIELD.decay * .1)) / PARTICLE_FIELD.decay;
    close(state.impulses[0].vector[0], expected);
    close(state.scroll, .5 * (1 - Math.exp(-PARTICLE_FIELD.decay * .1)));
    close(state.impulses[0].age, .1);
    states.push(state);
  }
  for (const state of states.slice(1)) {
    vectorClose(sampleParticleField([.15, 0, 1.1], state, .1, false, false), sampleParticleField([.15, 0, 1.1], states[0], .1, false, false));
  }
});

test("four bounded local impulse slots retain old places and never mutate rest buffers", () => {
  const state = prime();
  for (let i = 0; i < 50; i++) stepParticleField(state, frame(i + 2), input([12, -8, 5], 30, [i % 3 * .35, .2, 1.2]), options);
  assert.equal(state.impulses.length, 4);
  assert.ok(new Set(state.impulses.map(s => s.center.join())).size > 1);
  for (const impulse of state.impulses) assert.ok(magnitude(impulse.vector) <= PARTICLE_FIELD.impulseLimit + 1e-8);
  assert.ok(Math.abs(state.scroll) <= 1);
  const data = createIntroParticles(128, false);
  const before = data.positions.slice();
  for (let i = 0; i < 128; i++) sampleParticleField(Array.from(data.positions.slice(i * 3, i * 3 + 3)), state, 2, false, true);
  assert.deepEqual(data.positions, before);
});

test("stationary cursor creates no impulse; a departing cursor leaves bounded decaying local trails", () => {
  const state = prime();
  stepParticleField(state, frame(2), input(), options);
  assert.equal(state.latest, -1);
  stepParticleField(state, frame(3), input([4, 0, 0]), options);
  const initial = magnitude(state.impulses[0].vector);
  stepParticleField(state, frame(4), input([0, 0, 0], 0, [0, 0, 0], 0), options);
  assert.ok(magnitude(state.impulses[0].vector) > 0);
  assert.ok(magnitude(state.impulses[0].vector) < initial);
  assert.ok(distance(sampleParticleField([.15, 0, 1.1], state, 0, false, false), [.15, 0, 1.1]) > 0);
  vectorClose(sampleParticleField([0, 0, -1.2], state, 0, false, false), [0, 0, -1.2]);
});

test("mouse/scroll impulses return below one percent after three seconds at 30/60/120 Hz", () => {
  for (const hz of [30, 60, 120]) {
    const state = prime();
    stepParticleField(state, frame(2), input([10, 0, 0], 20), options);
    const initial = magnitude(state.impulses[0].vector), scroll = state.scroll;
    for (let i = 0; i < hz * 3; i++) stepParticleField(state, frame(i + 3, 1 / hz), input(), options);
    assert.ok(magnitude(state.impulses[0].vector) / initial < .01);
    assert.ok(state.scroll / scroll < .01);
    close(magnitude(state.impulses[0].vector) / initial, Math.exp(-PARTICLE_FIELD.decay * 3));
    vectorClose(sampleParticleField([.1, 0, 1.1], createParticleFieldState(), 3, false, false), [.1, 0, 1.1]);
  }
});

test("scroll-only stays signed and reversible without generating local mouse impulses", () => {
  const positive = prime(), negative = prime();
  for (let id = 2; id <= 80; id++) {
    stepParticleField(positive, frame(id), input([0, 0, 0], 8), options);
    stepParticleField(negative, frame(id), input([0, 0, 0], -8), options);
  }
  close(positive.scroll, -negative.scroll); assert.equal(positive.latest, -1);
  const rest = [.2, .1, .7];
  const forward = sampleParticleField(rest, positive, 0, false, false);
  const reverse = sampleParticleField(rest, negative, 0, false, false);
  forward.forEach((v, i) => close(v - rest[i], rest[i] - reverse[i]));
});

test("field has hard displacement/body/halo limits under extreme inputs and coherent nonuniform flow", () => {
  const state = prime();
  for (let id = 2; id < 240; id++) stepParticleField(state, frame(id), input([1e9, -1e9, 1e9], 1e9, [.1 * (id % 3), .1, 1.45]), options);
  for (const outside of [false, true]) {
    const profile = outside ? PARTICLE_FIELD.outside : PARTICLE_FIELD.inside;
    const data = createIntroParticles(3000, outside);
    for (let i = 0; i < 3000; i++) {
      const rest = Array.from(data.positions.slice(i * 3, i * 3 + 3));
      const point = sampleParticleField(rest, state, 10, outside, true);
      assert.ok(point.every(Number.isFinite));
      assert.ok(magnitude(point) >= profile.minRadius - 1e-8 && magnitude(point) <= profile.maxRadius + 1e-8);
      assert.ok(distance(point, rest) <= profile.displacement + 1e-7);
    }
  }
  const idle = createParticleFieldState();
  const innerHaloEdge = createParticleFieldState();
  for (const impulse of innerHaloEdge.impulses) {
    impulse.center = [1.48, 0, 0]; impulse.vector = [-.056, .233, 0]; impulse.age = 1;
  }
  const clampedHalo = sampleParticleField([1.48, 0, 0], innerHaloEdge, 0, true, false);
  assert.ok(magnitude(clampedHalo) >= PARTICLE_FIELD.outside.minRadius - 1e-8);
  assert.ok(distance(clampedHalo, [1.48, 0, 0]) <= PARTICLE_FIELD.outside.displacement + 1e-8);
  const a = [.2, .3, .4], b = [-.4, -.2, .1];
  const da = sampleParticleField(a, idle, 1, false, true).map((v, i) => v - a[i]);
  const db = sampleParticleField(b, idle, 1, false, true).map((v, i) => v - b[i]);
  assert.ok(distance(da, db) > .001); // Not a whole-cloud translation.
});

test("interior/exterior share impulses but have distinct support, weight and delayed response", () => {
  const state = prime();
  stepParticleField(state, frame(2, .001), input([10, 0, 0]), options);
  const rest = [.15, 0, 1.48];
  assert.notEqual(PARTICLE_FIELD.inside.radius, PARTICLE_FIELD.outside.radius);
  assert.ok(PARTICLE_FIELD.outside.delay > PARTICLE_FIELD.inside.delay);
  const first = sampleParticleField(rest, state, 0, true, false);
  for (let id = 3; id < 12; id++) stepParticleField(state, frame(id, .01), input(), options);
  assert.ok(distance(sampleParticleField(rest, state, 0, true, false), rest) > distance(first, rest));
});

test("freeze preserves field exactly, reduced/resume/resize reset it, channel switches isolate forces", () => {
  const state = prime();
  stepParticleField(state, frame(2), input([6, 0, 0], 8), options);
  const frozen = structuredClone(state.impulses), scroll = state.scroll;
  stepParticleField(state, frame(3), input([12, 0, 0], -8), { ...options, freeze: true });
  assert.deepEqual(state.impulses, frozen); assert.equal(state.scroll, scroll);
  stepParticleField(state, frame(4), input(), { ...options, mouse: false });
  assert.ok(state.impulses.every(s => magnitude(s.vector) === 0)); assert.ok(state.scroll > 0);
  stepParticleField(state, frame(5), input([4, 0, 0], 8), { ...options, scroll: false });
  assert.equal(state.scroll, 0);
  for (const [nextFrame, settings] of [
    [frame(6, 1 / 60, { reducedMotion: true }), options],
    [frame(6, 0, { intervalMs: 5000 }), options],
    [frame(6, NaN), options],
    [frame(6), { ...options, width: 390, height: 844 }],
    [frame(6), { ...options, visible: false }],
  ]) {
    const seeded = prime(); stepParticleField(seeded, frame(2), input([8, 0, 0], 8), options);
    stepParticleField(seeded, nextFrame, input([8, 0, 0], 8), settings);
    assert.equal(seeded.scroll, 0); assert.equal(seeded.latest, -1);
    assert.ok(seeded.impulses.every(s => magnitude(s.vector) === 0));
  }
  const invalid = prime(); stepParticleField(invalid, frame(2), input([NaN, 0, 0], Infinity), options);
  assert.equal(invalid.scroll, 0); assert.equal(invalid.latest, -1);
});

test("vertex field uses shared bounded equations; canvas uploads four slots, no position simulation or second loop", () => {
  assert.ok(particleVertexShader.includes(particleFieldShader));
  assert.match(particleVertexShader, /particleField\(position\)/);
  assert.match(particleFieldShader, /uImpulseCenter\[4\]/);
  assert.match(particleFieldShader, /smoothstep\(0\.0, radius, length\(offset\)\)/);
  assert.match(shellVertexShader, /vec4\(position, 1\.0\)/);
  const canvas = readFileSync(new URL("../components/experience-canvas.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(canvas, /requestAnimationFrame|setAnimationLoop|\.needsUpdate\s*=|sampleParticleField\(/);
  assert.match(canvas, /i < PARTICLE_FIELD.slots/);
});
