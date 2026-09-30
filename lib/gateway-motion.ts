/** Scroll-linked folder tracks. No independent floating/bobbing animation. */
export function gatewayCardMotion(progress: number, index: number, reduced = false, height = 721) {
  const units = progress * 19;
  const start = 2.4 + index * .05;
  const entry = Math.min(1, Math.max(0, (units - start) / (3 - start)));
  return {
    offset: reduced ? 0 : (3 - units) * height * 1.08,
    scale: reduced ? 1 : 0.8 + entry * 0.2,
  };
}

export function warmSceneOpacity(progress: number) {
  const value = Math.min(1, Math.max(0, (progress * 19 - 6.25) / .15));
  return 1 - value * value * (3 - 2 * value);
}
