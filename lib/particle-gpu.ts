import type * as Three from "three";
import type { ExperienceFrame } from "./experience-input";
import { createResourceScope } from "./experience-input.ts";
import { particleFieldShader } from "./particle-field.ts";
import { createMotionClock, planMotionSteps, particleStateLayout, PARTICLE_MOTION, type MotionOptions } from "./particle-motion.ts";

const vertex = `precision highp float; in vec3 position; out vec2 vUv;
void main() { vUv = position.xy * .5 + .5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
export const particleSimulationFragment = `precision highp float; precision highp sampler2D;
in vec2 vUv;
layout(location = 0) out vec4 nextPosition;
layout(location = 1) out vec4 nextVelocity;
uniform sampler2D uRest; uniform sampler2D uPosition; uniform sampler2D uVelocity;
uniform float uTime; uniform float uFlowEnabled; uniform bool uReset;
float uOutside;
${particleFieldShader}
void main() {
  vec4 rest = texture(uRest, vUv);
  if (rest.w < 0.0) { nextPosition = vec4(0.0); nextVelocity = vec4(0.0); return; }
  if (uReset) { nextPosition = vec4(rest.xyz, 1.0); nextVelocity = vec4(0.0); return; }
  uOutside = rest.w;
  vec3 p = texture(uPosition, vUv).xyz;
  vec3 v = texture(uVelocity, vUv).xyz;
  vec3 wanted = (particleField(p) - p) * ${PARTICLE_MOTION.drive.toFixed(1)} + (rest.xyz - p) * mix(${PARTICLE_MOTION.anchorStill.toFixed(1)}, ${PARTICLE_MOTION.anchorFlow}, uFlowEnabled);
  wanted = fieldCap(wanted, ${PARTICLE_MOTION.speed});
  float dt = ${PARTICLE_MOTION.step};
  float decay = exp(-${PARTICLE_MOTION.drag.toFixed(1)} * dt);
  vec3 nv = wanted + (v - wanted) * decay;
  vec3 np = p + wanted * dt + (v - wanted) * (1.0 - decay) / ${PARTICLE_MOTION.drag.toFixed(1)};
  float radius = length(np);
  float lo = mix(0.0, 1.46, uOutside), hi = mix(1.38, 2.16, uOutside);
  if (radius < lo || radius > hi) {
    vec3 normal = radius > .00000001 ? np / radius : fieldUnit(rest.xyz);
    np = normal * clamp(radius, lo, hi);
    float radialSpeed = dot(nv, normal);
    if ((radius > hi && radialSpeed > 0.0) || (radius < lo && radialSpeed < 0.0)) nv -= normal * radialSpeed;
  }
  nextPosition = vec4(np, 1.0); nextVelocity = vec4(nv, 0.0);
}`;

type Cloud = { positions: Float32Array };
export function createParticleGPU(THREE: typeof Three, renderer: Three.WebGLRenderer, clouds: readonly Cloud[],
  centers: Three.Vector4[], vectors: Three.Vector3[], own: (cleanup: () => void) => void) {
  const layout = particleStateLayout(clouds.map(data => data.positions.length / 3));
  const scope = createResourceScope();
  const stats = { mode: "field", reason: "unsupported", size: layout.size, count: layout.count,
    bytes: 0, passes: 0, calls: 0, steps: 0, cpuMs: 0, time: 0 };
  const gl = renderer.getContext();
  let positionTexture: Three.Texture | null = null;
  let advance: ((frame: ExperienceFrame, options: MotionOptions, flow: boolean, scroll: number) => void) | null = null;
  let diagnostic: (() => { position: number[]; velocity: number[] }) | null = null;
  const result = { layout, stats, get texture() { return positionTexture; },
    step(frame: ExperienceFrame, options: MotionOptions, flow: boolean, scroll: number) {
      try { advance?.(frame, options, flow, scroll); }
      catch (error) {
        advance = diagnostic = null; positionTexture = null; scope.dispose();
        stats.mode = "field"; stats.reason = error instanceof Error ? error.message : "simulation-update";
        stats.bytes = stats.passes = stats.calls = stats.steps = 0;
      }
    },
    sample() { try { return diagnostic?.() ?? null; } catch { return null; } } };
  if (!("MAX_DRAW_BUFFERS" in gl) || !renderer.extensions.has("EXT_color_buffer_float") || gl.getParameter(gl.MAX_DRAW_BUFFERS) < 2 ||
    renderer.capabilities.maxVertexTextures < 1 || renderer.capabilities.maxTextureSize < layout.size) return result;
  const previousTarget = renderer.getRenderTarget();
  const shaderError = renderer.debug.onShaderError;
  try {
    let shadersOK = true;
    renderer.debug.onShaderError = () => { shadersOK = false; };
    const data = new Float32Array(layout.size * layout.size * 4);
    for (let i = 0; i < layout.size * layout.size; i++) data[i * 4 + 3] = -1;
    let offset = 0;
    clouds.forEach((cloud, outside) => {
      for (let i = 0; i < cloud.positions.length / 3; i++) {
        data.set(cloud.positions.subarray(i * 3, i * 3 + 3), (offset + i) * 4); data[(offset + i) * 4 + 3] = outside;
      }
      offset += cloud.positions.length / 3;
    });
    const rest = new THREE.DataTexture(data, layout.size, layout.size, THREE.RGBAFormat, THREE.FloatType);
    rest.colorSpace = THREE.NoColorSpace; rest.minFilter = rest.magFilter = THREE.NearestFilter; rest.needsUpdate = true;
    scope.add(() => rest.dispose());
    const targets = [0, 1].map(() => {
      const target = new THREE.WebGLRenderTarget(layout.size, layout.size, { count: 2, type: THREE.FloatType,
        format: THREE.RGBAFormat, colorSpace: THREE.NoColorSpace, minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter, depthBuffer: false, stencilBuffer: false, generateMipmaps: false });
      scope.add(() => target.dispose());
      renderer.setRenderTarget(target);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("float-framebuffer");
      return target;
    });
    const material = new THREE.RawShaderMaterial({ glslVersion: THREE.GLSL3, vertexShader: vertex,
      fragmentShader: particleSimulationFragment, depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: { uRest: { value: rest }, uPosition: { value: rest }, uVelocity: { value: rest },
        uTime: { value: 0 }, uFlowEnabled: { value: 0 }, uReset: { value: true },
        uImpulseCenter: { value: centers }, uImpulseVector: { value: vectors }, uScrollImpulse: { value: 0 } } });
    scope.add(() => material.dispose());
    const geometry = new THREE.PlaneGeometry(2, 2); scope.add(() => geometry.dispose());
    const scene = new THREE.Scene(), camera = new THREE.Camera();
    const quad = new THREE.Mesh(geometry, material); quad.frustumCulled = false; scene.add(quad);
    renderer.compile(scene, camera);
    if (!shadersOK) throw new Error("simulation-shader");
    for (const target of targets) { renderer.setRenderTarget(target); renderer.render(scene, camera); }
    let current = 0;
    const clock = createMotionClock();
    const bind = () => { positionTexture = targets[current].textures[0]; };
    bind(); stats.mode = "gpu"; stats.reason = "float-mrt"; stats.bytes = layout.bytes;
    advance = (frame, options, flow, scroll) => {
      const start = performance.now(), targetBefore = renderer.getRenderTarget();
      stats.passes = stats.calls = stats.steps = 0;
      try {
        const plan = planMotionSteps(clock, frame, options);
        material.uniforms.uFlowEnabled.value = flow ? 1 : 0;
        material.uniforms.uScrollImpulse.value = scroll;
        material.uniforms.uReset.value = plan.reset;
        if (plan.reset) {
          // Active sampler feedback is invalid even when the reset branch
          // doesn't read it. Bind immutable rest before writing either target.
          material.uniforms.uPosition.value = material.uniforms.uVelocity.value = rest;
          for (const target of targets) { renderer.setRenderTarget(target); renderer.render(scene, camera); stats.passes++; }
          current = 0;
        } else for (let i = 0; i < plan.steps; i++) {
          material.uniforms.uPosition.value = targets[current].textures[0];
          material.uniforms.uVelocity.value = targets[current].textures[1];
          material.uniforms.uTime.value = plan.time + (i + .5) * PARTICLE_MOTION.step;
          const next = 1 - current;
          renderer.setRenderTarget(targets[next]); renderer.render(scene, camera); current = next; stats.passes++;
        }
        bind(); stats.steps = plan.steps; stats.calls = stats.passes; stats.time = clock.time;
      } finally { renderer.setRenderTarget(targetBefore); stats.cpuMs = performance.now() - start; }
    };
    // Eight local diagnostic texels only, never a rendering position upload.
    const pBuffer = new Float32Array(32), vBuffer = new Float32Array(32);
    diagnostic = () => {
      renderer.readRenderTargetPixels(targets[current], 0, 0, 8, 1, pBuffer, undefined, 0);
      renderer.readRenderTargetPixels(targets[current], 0, 0, 8, 1, vBuffer, undefined, 1);
      return { position: Array.from(pBuffer), velocity: Array.from(vBuffer) };
    };
    own(() => { advance = null; diagnostic = null; positionTexture = null; scope.dispose(); });
  } catch (error) {
    scope.dispose(); positionTexture = null; stats.mode = "field"; stats.reason = error instanceof Error ? error.message : "simulation-setup";
  } finally { renderer.debug.onShaderError = shaderError; renderer.setRenderTarget(previousTarget); }
  return result;
}
