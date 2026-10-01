import type { ExperienceFrame } from "./experience-input";

export const PARTICLE_SHELL_RADIUS = 1.45;
export const PARTICLE_HALO_RADIUS = 2.16;
export const MAX_PARTICLE_POINTER_SPEED = 12; // Kugellokale Einheiten pro Sekunde.
type Vec3 = [number, number, number];
export type ParticleProjection = {
  inverseProjection: ArrayLike<number>;
  cameraWorld: ArrayLike<number>;
  inverseWorld: ArrayLike<number>;
};
export type ParticleHit = { region: "shell" | "halo" | "none"; point: Vec3; influence: number };
export type ParticleInteractionOptions = {
  mouse: boolean; scroll: boolean; flow: boolean; freeze: boolean; visible: boolean;
  width: number; height: number;
};
export type ParticleInteractionState = {
  screenX: number; screenY: number; eligible: boolean; frameId: number;
  width: number; height: number;
};
export type ParticleInteractionFrame = {
  pointer: ParticleHit & { velocity: Vec3 };
  scrollVelocity: number;
  flowEnabled: boolean;
};
const emptyHit = (): ParticleHit => ({ region: "none", point: [0, 0, 0], influence: 0 });
const length = (p: Vec3) => Math.hypot(...p);
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const finite = (p: Vec3) => p.every(Number.isFinite);
const cap = (p: Vec3, limit: number): Vec3 => {
  const factor = Math.min(1, limit / Math.max(length(p), 1e-12));
  return [p[0] * factor, p[1] * factor, p[2] * factor];
};
function transformPoint(m: ArrayLike<number>, p: Vec3): Vec3 | null {
  if (m.length !== 16) return null;
  const [x, y, z] = p;
  const w = m[3] * x + m[7] * y + m[11] * z + m[15];
  if (!Number.isFinite(w) || Math.abs(w) < 1e-12) return null;
  const result: Vec3 = [(m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
    (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
    (m[2] * x + m[6] * y + m[10] * z + m[14]) / w];
  return finite(result) ? result : null;
}

/** Analytic front-shell hit. A near miss uses the ray's closest point inside
 * the outer halo, which meets the shell tangentially without a depth jump. */
export function intersectParticleRay(origin: Vec3, direction: Vec3,
  radius = PARTICLE_SHELL_RADIUS, halo = PARTICLE_HALO_RADIUS): ParticleHit {
  if (!finite(origin) || !finite(direction) || length(direction) < 1e-12 ||
    !Number.isFinite(radius) || !Number.isFinite(halo) || radius <= 0 || halo <= radius) return emptyHit();
  const norm = length(direction);
  const d: Vec3 = [direction[0] / norm, direction[1] / norm, direction[2] / norm];
  const closestT = -dot(origin, d);
  const closest: Vec3 = [origin[0] + d[0] * closestT, origin[1] + d[1] * closestT, origin[2] + d[2] * closestT];
  const distance = length(closest);
  const discriminant = radius * radius - distance * distance;
  if (discriminant >= -1e-10) {
    const offset = Math.sqrt(Math.max(0, discriminant));
    const near = closestT - offset, far = closestT + offset;
    const t = near >= 0 ? near : far;
    if (t >= 0) return { region: "shell", influence: 1,
      point: [origin[0] + d[0] * t, origin[1] + d[1] * t, origin[2] + d[2] * t] };
  }
  if (closestT < 0 || distance >= halo) return emptyHit();
  const fade = Math.max(0, Math.min(1, (distance - radius) / (halo - radius)));
  return { region: "halo", point: closest, influence: 1 - fade * fade * (3 - 2 * fade) };
}

/** NDC -> camera -> world -> current particle-group space. Both near and far
 * points are transformed, so this also supports rotated cameras and scaling. */
export function projectParticlePointer(x: number, y: number, projection: ParticleProjection): ParticleHit {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return emptyHit();
  const unproject = (z: number) => {
    const camera = transformPoint(projection.inverseProjection, [x, y, z]);
    const world = camera && transformPoint(projection.cameraWorld, camera);
    return world && transformPoint(projection.inverseWorld, world);
  };
  const near = unproject(-1), far = unproject(1);
  if (!near || !far) return emptyHit();
  return intersectParticleRay(near, [far[0] - near[0], far[1] - near[1], far[2] - near[2]]);
}

export function createParticleInteractionState(): ParticleInteractionState {
  return { screenX: 0, screenY: 0, eligible: false, frameId: 0, width: 0, height: 0 };
}

/** Samples actual screen displacement, not the damped velocity of previous
 * local hits. Reprojecting both screen points under THIS frame's matrices
 * prevents camera/group motion from becoming an artificial mouse force.
 * K4.2 will consume these channels for its bounded field and impulse state. */
export function sampleParticleInteraction(state: ParticleInteractionState, frame: ExperienceFrame,
  projection: ParticleProjection, options: ParticleInteractionOptions): ParticleInteractionFrame {
  const effects = options.visible && !frame.reducedMotion && !options.freeze;
  const validStep = frame.delta > 0 && frame.delta <= .064 && frame.intervalMs <= 250 && frame.id > state.frameId;
  const sameViewport = state.width === options.width && state.height === options.height;
  const pointerEnabled = effects && options.mouse && frame.pointer.active;
  const hit = pointerEnabled ? projectParticlePointer(frame.pointer.x, frame.pointer.y, projection) : emptyHit();
  let velocity: Vec3 = [0, 0, 0];
  if (pointerEnabled && validStep && sameViewport && state.eligible && hit.influence > 0 &&
    (frame.pointer.x !== state.screenX || frame.pointer.y !== state.screenY)) {
    const previous = projectParticlePointer(state.screenX, state.screenY, projection);
    if (previous.influence > 0) {
      velocity = cap([(hit.point[0] - previous.point[0]) / frame.delta,
        (hit.point[1] - previous.point[1]) / frame.delta,
        (hit.point[2] - previous.point[2]) / frame.delta], MAX_PARTICLE_POINTER_SPEED);
    }
  }
  state.screenX = frame.pointer.x; state.screenY = frame.pointer.y;
  state.eligible = pointerEnabled && validStep && hit.influence > 0;
  state.frameId = frame.id; state.width = options.width; state.height = options.height;
  return { pointer: { ...hit, velocity },
    scrollVelocity: effects && validStep && options.scroll && Number.isFinite(frame.scrollVelocity)
      ? Math.max(-30, Math.min(30, frame.scrollVelocity)) : 0,
    flowEnabled: options.visible && !frame.reducedMotion && options.flow };
}
