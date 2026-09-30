/** Shared frame contract. Progress: 0..1; scroll velocity: viewport heights/s.
 * Pointer: NDC (-1..1, +Y up); pointer velocity: NDC/s; time/delta: seconds.
 * All consumers receive the same sample, after scroll settling and before draw.
 */
export type ExperiencePointer = { x: number; y: number; active: boolean };
export type ExperienceFrame = {
  id: number;
  progress: number;
  scrollUnits: number;
  scrollVelocity: number;
  pointer: ExperiencePointer & { velocityX: number; velocityY: number };
  time: number;
  delta: number;
  intervalMs: number;
  reducedMotion: boolean;
};
export type ExperienceDraw = (frame: ExperienceFrame) => void;
export type RenderView = "composite" | "neutral" | "warm" | "cold" | "direct-warm" | "direct-cold";
export type RenderOptions = { view: RenderView; freeze: boolean; loseContext: boolean };

export function initialExperienceFrame(progress = 0): ExperienceFrame {
  return { id: 0, progress, scrollUnits: progress * 19, scrollVelocity: 0,
    pointer: { x: 0, y: 0, active: false, velocityX: 0, velocityY: 0 },
    time: 0, delta: 0, intervalMs: 0, reducedMotion: false };
}

const bound = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));
export function sampleExperienceFrame(previous: ExperienceFrame, progress: number, pointer: ExperiencePointer,
  intervalMs: number, reducedMotion: boolean, scrollUnits = 19, freeze = false): ExperienceFrame {
  const resumed = previous.id === 0 || intervalMs > 250 || intervalMs <= 0;
  const delta = resumed ? 0 : Math.min(intervalMs / 1000, .064);
  const blend = 1 - Math.exp(-delta / .12);
  const effectsEnabled = !resumed && !reducedMotion && !freeze;
  const scrollSpeed = delta > 0 ? bound((progress - previous.progress) * scrollUnits / delta, 30) : 0;
  const pointerEnabled = effectsEnabled && pointer.active && previous.pointer.active;
  const px = pointerEnabled ? bound((pointer.x - previous.pointer.x) / delta, 8) : 0;
  const py = pointerEnabled ? bound((pointer.y - previous.pointer.y) / delta, 8) : 0;
  return {
    id: previous.id + 1, progress, scrollUnits: progress * scrollUnits,
    scrollVelocity: effectsEnabled ? previous.scrollVelocity + (scrollSpeed - previous.scrollVelocity) * blend : 0,
    pointer: { ...pointer,
      velocityX: pointerEnabled ? previous.pointer.velocityX + (px - previous.pointer.velocityX) * blend : 0,
      velocityY: pointerEnabled ? previous.pointer.velocityY + (py - previous.pointer.velocityY) * blend : 0 },
    time: previous.time + (effectsEnabled ? delta : 0),
    delta, intervalMs: Math.max(0, intervalMs), reducedMotion,
  };
}

/** Explicit screen-to-NDC conversion; independent of device-pixel ratio. */
export function pointerInViewport(x: number, y: number, width: number, height: number): ExperiencePointer {
  return { x: bound(x / Math.max(1, width) * 2 - 1, 1), y: bound(1 - y / Math.max(1, height) * 2, 1), active: true };
}

export function renderDimensions(width: number, height: number, deviceRatio: number, maxTextureSize = 4096) {
  const ratio = Math.min(Math.max(1, deviceRatio), width < 700 ? 1.35 : 1.75,
    maxTextureSize / Math.max(1, width, height), Math.sqrt(4_000_000 / Math.max(1, width * height)));
  return { ratio, width: Math.max(1, Math.floor(width * ratio)), height: Math.max(1, Math.floor(height * ratio)) };
}

/** Idempotent reverse-order cleanup, also usable after partial setup failure. */
export function createResourceScope() {
  const tasks: Array<() => void> = [];
  let disposed = false;
  return {
    add(cleanup: () => void) { if (disposed) cleanup(); else tasks.push(cleanup); },
    dispose() { if (disposed) return; disposed = true; for (const task of tasks.reverse()) task(); tasks.length = 0; },
  };
}
