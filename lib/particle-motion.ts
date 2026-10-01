import type { ExperienceFrame } from "./experience-input";
import { PARTICLE_FIELD, sampleParticleField, type FieldVector, type ParticleFieldState } from "./particle-field.ts";

export const PARTICLE_MOTION = { step: 1 / 120, maxSteps: 8, drag: 6, speed: 1.2, drive: 3, anchorFlow: .6, anchorStill: 3 } as const;
export type MotionClock = { remainder: number; time: number; frameId: number; width: number; height: number; active: boolean };
export type MotionOptions = { enabled: boolean; visible: boolean; freeze: boolean; width: number; height: number };
export function createMotionClock(): MotionClock { return { remainder: 0, time: 0, frameId: 0, width: 0, height: 0, active: false }; }
export function planMotionSteps(clock: MotionClock, frame: ExperienceFrame, options: MotionOptions) {
  const active = options.enabled && options.visible && !frame.reducedMotion;
  const invalid = frame.id <= clock.frameId || !Number.isFinite(frame.delta) || !Number.isFinite(frame.intervalMs) || frame.delta <= 0 || frame.intervalMs > 250;
  const reset = clock.active !== active || clock.width !== options.width || clock.height !== options.height || invalid;
  clock.frameId = frame.id; clock.width = options.width; clock.height = options.height; clock.active = active;
  if (reset) { clock.remainder = 0; clock.time = frame.time; return { reset: true, steps: 0, time: clock.time }; }
  if (!active || options.freeze) return { reset: false, steps: 0, time: clock.time };
  clock.remainder += Math.min(.064, frame.delta);
  const steps = Math.min(PARTICLE_MOTION.maxSteps, Math.floor((clock.remainder + 1e-10) / PARTICLE_MOTION.step));
  const time = clock.time;
  clock.remainder = Math.max(0, clock.remainder - steps * PARTICLE_MOTION.step);
  clock.time += steps * PARTICLE_MOTION.step;
  return { reset: false, steps, time };
}

/** Numerical oracle only; the renderer never uploads CPU particle positions. */
export function sampleParticleMotion(position: FieldVector, velocity: FieldVector, rest: FieldVector,
  state: ParticleFieldState, time: number, outside: boolean, flow: boolean, dt = PARTICLE_MOTION.step) {
  const profile = outside ? PARTICLE_FIELD.outside : PARTICLE_FIELD.inside;
  const target = sampleParticleField(position, state, time, outside, flow);
  let wanted = target.map((v, i) => (v - position[i]) * PARTICLE_MOTION.drive +
    (rest[i] - position[i]) * (flow ? PARTICLE_MOTION.anchorFlow : PARTICLE_MOTION.anchorStill)) as FieldVector;
  const length = Math.hypot(...wanted);
  wanted = wanted.map(v => v * Math.min(1, PARTICLE_MOTION.speed / Math.max(length, 1e-8))) as FieldVector;
  const decay = Math.exp(-PARTICLE_MOTION.drag * dt);
  let nextVelocity = wanted.map((v, i) => v + (velocity[i] - v) * decay) as FieldVector;
  let nextPosition = position.map((v, i) => v + wanted[i] * dt +
    (velocity[i] - wanted[i]) * (1 - decay) / PARTICLE_MOTION.drag) as FieldVector;
  const radius = Math.hypot(...nextPosition);
  const bounded = Math.max(profile.minRadius, Math.min(profile.maxRadius, radius));
  if (Math.abs(bounded - radius) > 1e-10) {
    const normal = radius > 1e-8 ? nextPosition.map(v => v / radius) : rest.map(v => v / Math.max(Math.hypot(...rest), 1e-8));
    nextPosition = normal.map(v => v * bounded) as FieldVector;
    const radialSpeed = nextVelocity.reduce((n, v, i) => n + v * normal[i], 0);
    if ((radius > profile.maxRadius && radialSpeed > 0) || (radius < profile.minRadius && radialSpeed < 0))
      nextVelocity = nextVelocity.map((v, i) => v - radialSpeed * normal[i]) as FieldVector;
  }
  return { position: nextPosition, velocity: nextVelocity };
}

export function particleStateLayout(counts: readonly number[]) {
  const count = counts.reduce((sum, n) => sum + n, 0);
  if (counts.some(n => !Number.isInteger(n) || n < 0) || count < 1) throw new Error("Invalid particle count");
  const size = Math.ceil(Math.sqrt(count));
  const uv = counts.map((n, cloud) => {
    const offset = counts.slice(0, cloud).reduce((sum, value) => sum + value, 0);
    const result = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { result[i * 2] = ((offset + i) % size + .5) / size; result[i * 2 + 1] = (Math.floor((offset + i) / size) + .5) / size; }
    return result;
  });
  return { count, size, uv, bytes: size * size * 4 * 4 * 5 }; // Rest + 2 × (position, velocity), RGBA32F.
}
