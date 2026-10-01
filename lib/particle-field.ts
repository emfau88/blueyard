import type { ExperienceFrame } from "./experience-input";
import type { ParticleInteractionFrame } from "./particle-interaction";

export type FieldVector = [number, number, number];
export const PARTICLE_FIELD = {
  slots: 4, decay: 2.4, gain: .9, impulseLimit: .24,
  trailInterval: .14, trailDistance: .24,
  inside: { radius: 1.12, weight: .95, delay: .025, flow: .055, cohesion: .85, concentration: 4, scroll: .14, displacement: .28, minRadius: 0, maxRadius: 1.38 },
  outside: { radius: .94, weight: 1.25, delay: .075, flow: .075, cohesion: .45, concentration: 2, scroll: .22, displacement: .38, minRadius: 1.46, maxRadius: 2.16 },
} as const;
export type ParticleImpulse = { center: FieldVector; vector: FieldVector; age: number };
export type ParticleFieldState = {
  impulses: ParticleImpulse[]; latest: number; scroll: number; frameId: number; width: number; height: number;
};
export type ParticleFieldOptions = { mouse: boolean; scroll: boolean; freeze: boolean; visible: boolean; width: number; height: number };
const magnitude = (p: FieldVector) => Math.hypot(...p);
const add = (a: FieldVector, b: FieldVector): FieldVector => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (p: FieldVector, k: number): FieldVector => [p[0] * k, p[1] * k, p[2] * k];
const subtract = (a: FieldVector, b: FieldVector): FieldVector => add(a, scale(b, -1));
const cross = (a: FieldVector, b: FieldVector): FieldVector => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: FieldVector, b: FieldVector) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (p: FieldVector) => scale(p, 1 / Math.max(magnitude(p), 1e-8));
const cap = (p: FieldVector, limit: number) => scale(p, Math.min(1, limit / Math.max(magnitude(p), 1e-8)));
const blankImpulse = (): ParticleImpulse => ({ center: [0, 0, 0], vector: [0, 0, 0], age: 0 });

/** Analytic density transport, not independent particle trajectories. Moving
 * compact lobes compress local volume while coherent curl carries the pattern.
 * The fallback evaluates rest coordinates; the GPU branch samples the same
 * force at its current position. Both use the shared effect clock. */
export function sampleParticleFlow(rest: FieldVector, time: number, outside: boolean): FieldVector {
  const profile = outside ? PARTICLE_FIELD.outside : PARTICLE_FIELD.inside;
  let flow = scale(cap(cross(rest, [Math.sin(rest[2] * 2 + time * .33),
    Math.cos(rest[0] * 1.8 - time * .27), Math.sin(rest[1] * 2.2 + time * .23)]), 1), profile.flow);
  for (let i = 0; i < 2; i++) {
    const phase = time * .38 + i * 2.4;
    let center: FieldVector = [.6 * Math.cos(phase), .45 * Math.sin(phase * .73 + i), .5 * Math.sin(phase)];
    if (outside) center = scale(unit(center), 1.78);
    const offset = subtract(rest, center);
    const weight = Math.exp(-dot(offset, offset) * profile.concentration) * (.72 + .28 * Math.sin(phase * .91 + i));
    const axis = unit([Math.sin(phase), .7, Math.cos(phase * .63)]);
    const compression = -profile.cohesion * Math.sin(phase * .91 + i);
    flow = add(flow, scale(add(scale(cross(axis, offset), .65), scale(offset, compression)), weight));
  }
  return flow;
}
export function createParticleFieldState(): ParticleFieldState {
  return { impulses: Array.from({ length: PARTICLE_FIELD.slots }, blankImpulse), latest: -1, scroll: 0, frameId: 0, width: 0, height: 0 };
}
export function resetParticleField(state: ParticleFieldState) {
  for (const impulse of state.impulses) { impulse.vector = [0, 0, 0]; impulse.age = 0; }
  state.latest = -1; state.scroll = 0;
}

/** Constant-size state, never particle-position uploads. Exact exponential
 * integration for a held input; no accumulated scroll position or Euler drift. */
export function stepParticleField(state: ParticleFieldState, frame: ExperienceFrame,
  input: ParticleInteractionFrame, options: ParticleFieldOptions): void {
  const resized = state.width !== options.width || state.height !== options.height;
  const resumed = !Number.isFinite(frame.delta) || !Number.isFinite(frame.intervalMs) ||
    frame.delta <= 0 || frame.intervalMs > 250 || frame.id <= state.frameId;
  state.frameId = frame.id; state.width = options.width; state.height = options.height;
  if (frame.reducedMotion || !options.visible || resized || resumed) { resetParticleField(state); return; }
  if (options.freeze) return; // Preserve vector, age and scroll, not just the input.
  const dt = Math.min(frame.delta, .064);
  const decay = Math.exp(-PARTICLE_FIELD.decay * dt);
  for (const impulse of state.impulses) {
    impulse.age += dt;
    impulse.vector = options.mouse ? scale(impulse.vector, decay) : [0, 0, 0];
  }
  const speed = magnitude(input.pointer.velocity);
  if (options.mouse && input.pointer.influence > 0 && speed > 1e-5 && Number.isFinite(speed) && input.pointer.point.every(Number.isFinite)) {
    let impulse = state.impulses[state.latest];
    if (!impulse || impulse.age >= PARTICLE_FIELD.trailInterval ||
      magnitude(subtract(impulse.center, input.pointer.point)) >= PARTICLE_FIELD.trailDistance) {
      state.latest = (state.latest + 1) % PARTICLE_FIELD.slots;
      impulse = state.impulses[state.latest];
      impulse.center = [...input.pointer.point]; impulse.vector = [0, 0, 0]; impulse.age = dt;
    }
    const integral = (1 - decay) / PARTICLE_FIELD.decay;
    impulse.vector = cap(add(impulse.vector, scale(cap(input.pointer.velocity, 12),
      PARTICLE_FIELD.gain * Math.min(1, input.pointer.influence) * integral)), PARTICLE_FIELD.impulseLimit);
  }
  const scrollTarget = options.scroll && Number.isFinite(input.scrollVelocity) ? Math.max(-1, Math.min(1, input.scrollVelocity / 8)) : 0;
  state.scroll = options.scroll ? state.scroll * decay + scrollTarget * (1 - decay) : 0;
}

/** CPU oracle of the vertex field, for bounds/return tests, NOT per-frame
 * rendering. GPU uses the same coefficients and equations below. */
export function sampleParticleField(rest: FieldVector, state: ParticleFieldState, time: number,
  outside: boolean, flowEnabled: boolean): FieldVector {
  const profile = outside ? PARTICLE_FIELD.outside : PARTICLE_FIELD.inside;
  let displacement: FieldVector = [0, 0, 0];
  if (flowEnabled) displacement = sampleParticleFlow(rest, time, outside);
  displacement = add(displacement, scale(cap(cross(unit([.35, .8, .2]), rest), 1),
    state.scroll * profile.scroll * (.75 + .25 * Math.cos(rest[1] * 2))));
  for (const impulse of state.impulses) {
    const offset = subtract(rest, impulse.center);
    const distance = Math.min(1, magnitude(offset) / profile.radius);
    const weight = 1 - distance * distance * (3 - 2 * distance);
    const normal = unit(impulse.center);
    const tangent = unit(cross(normal, Math.abs(normal[1]) > .9 ? [1, 0, 0] : [0, 1, 0]));
    const swirl = scale(cross(normal, offset), dot(impulse.vector, tangent) * .65 / profile.radius);
    const response = 1 - Math.exp(-impulse.age / profile.delay);
    displacement = add(displacement, scale(add(impulse.vector, swirl), weight * profile.weight * response));
  }
  displacement = cap(displacement, profile.displacement);
  let point = add(rest, displacement);
  const radius = magnitude(point);
  if (radius > profile.maxRadius) point = scale(point, profile.maxRadius / radius);
  if (radius < profile.minRadius) point = radius > 1e-8 ? scale(point, profile.minRadius / radius) : scale(unit(rest), profile.minRadius);
  // Projection onto the inner halo sphere is non-convex: it can slightly
  // increase displacement. Limit the angle at the final radius as well.
  const finalRadius = magnitude(point), restRadius = magnitude(rest);
  if (magnitude(subtract(point, rest)) > profile.displacement && finalRadius > 1e-8 && restRadius > 1e-8) {
    const normal = unit(rest), direction = unit(point);
    const cosine = Math.max(-1, Math.min(1, (restRadius ** 2 + finalRadius ** 2 - profile.displacement ** 2) / (2 * restRadius * finalRadius)));
    const tangent = unit(subtract(direction, scale(normal, dot(normal, direction))));
    point = scale(add(scale(normal, cosine), scale(tangent, Math.sqrt(Math.max(0, 1 - cosine ** 2)))), finalRadius);
  }
  return point;
}

const glslFloat = (n: number) => Number.isInteger(n) ? `${n}.0` : String(n);
const glslProfile = (key: keyof typeof PARTICLE_FIELD.inside) =>
  `mix(${glslFloat(PARTICLE_FIELD.inside[key])}, ${glslFloat(PARTICLE_FIELD.outside[key])}, uOutside)`;
export const particleFieldShader = /* glsl */ `
  uniform vec4 uImpulseCenter[${PARTICLE_FIELD.slots}];
  uniform vec3 uImpulseVector[${PARTICLE_FIELD.slots}];
  uniform float uScrollImpulse;
  vec3 fieldCap(vec3 v, float limit) { return v * min(1.0, limit / max(length(v), 0.00000001)); }
  vec3 fieldUnit(vec3 v) { return v / max(length(v), 0.00000001); }
  vec3 particleEigenFlow(vec3 rest) {
    vec3 flow = fieldCap(cross(rest, vec3(sin(rest.z * 2.0 + uTime * .33),
      cos(rest.x * 1.8 - uTime * .27), sin(rest.y * 2.2 + uTime * .23))), 1.0) * ${glslProfile("flow")};
    for (int i = 0; i < 2; i++) {
      float phase = uTime * .38 + float(i) * 2.4;
      vec3 center = vec3(.6 * cos(phase), .45 * sin(phase * .73 + float(i)), .5 * sin(phase));
      center = mix(center, fieldUnit(center) * 1.78, uOutside);
      vec3 offset = rest - center;
      float weight = exp(-dot(offset, offset) * ${glslProfile("concentration")}) * (.72 + .28 * sin(phase * .91 + float(i)));
      vec3 axis = fieldUnit(vec3(sin(phase), .7, cos(phase * .63)));
      float compression = -${glslProfile("cohesion")} * sin(phase * .91 + float(i));
      flow += (cross(axis, offset) * .65 + offset * compression) * weight;
    }
    return flow;
  }
  vec3 particleField(vec3 rest) {
    vec3 displacement = particleEigenFlow(rest) * uFlowEnabled;
    displacement += fieldCap(cross(fieldUnit(vec3(.35, .8, .2)), rest), 1.0) * uScrollImpulse * ${glslProfile("scroll")} * (.75 + .25 * cos(rest.y * 2.0));
    float radius = ${glslProfile("radius")};
    for (int i = 0; i < ${PARTICLE_FIELD.slots}; i++) {
      vec3 offset = rest - uImpulseCenter[i].xyz;
      float weight = 1.0 - smoothstep(0.0, radius, length(offset));
      vec3 normal = fieldUnit(uImpulseCenter[i].xyz);
      vec3 tangent = fieldUnit(cross(normal, abs(normal.y) > .9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
      vec3 swirl = cross(normal, offset) * dot(uImpulseVector[i], tangent) * .65 / radius;
      float response = 1.0 - exp(-uImpulseCenter[i].w / ${glslProfile("delay")});
      displacement += (uImpulseVector[i] + swirl) * weight * ${glslProfile("weight")} * response;
    }
    vec3 p = rest + fieldCap(displacement, ${glslProfile("displacement")});
    float size = length(p);
    if (size > ${glslProfile("maxRadius")}) p *= ${glslProfile("maxRadius")} / size;
    if (size < ${glslProfile("minRadius")}) p = size > .00000001 ? p * ${glslProfile("minRadius")} / size : fieldUnit(rest) * ${glslProfile("minRadius")};
    float finalRadius = length(p);
    float restRadius = length(rest);
    float maxDisplacement = ${glslProfile("displacement")};
    if (length(p - rest) > maxDisplacement && finalRadius > .00000001 && restRadius > .00000001) {
      vec3 normal = fieldUnit(rest);
      vec3 direction = fieldUnit(p);
      float cosine = clamp((restRadius * restRadius + finalRadius * finalRadius - maxDisplacement * maxDisplacement) / (2.0 * restRadius * finalRadius), -1.0, 1.0);
      vec3 tangent = fieldUnit(direction - normal * dot(normal, direction));
      p = finalRadius * (normal * cosine + tangent * sqrt(max(0.0, 1.0 - cosine * cosine)));
    }
    return p;
  }
`;
