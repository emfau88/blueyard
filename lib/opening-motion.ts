// Scroll distance is measured in viewport heights, not equal-sized slides.
export const SCROLL_UNITS = 19;
export const OPENING_ANCHORS = { intro: 0, manifesto: 2, gateway: 3, web: 6.5 } as const;
export const unitProgress = (units: number) => units / SCROLL_UNITS;
export const smoothRange = (value: number, start: number, end: number) => {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
const poses = [
  { u: 0, x: .5, y: .515, diameter: .55, bottom: true },
  { u: .5, x: .455, y: .385, diameter: .55, bottom: true },
  { u: 1, x: .29, y: .48, diameter: .64, bottom: false },
  { u: 1.5, x: .17, y: .13, diameter: .68, bottom: false },
  { u: 2, x: .16, y: .10, diameter: .68, bottom: false },
];
/** Screen-normalized poses reconstructed from observed 1281 × 721 frames. */
export function openingMotion(progress: number, aspect: number, mobile = false) {
  const units = progress * SCROLL_UNITS;
  const sample = poses.map(pose => ({ ...pose, y: pose.y + (pose.bottom ? pose.diameter * aspect / 2 : 0) }));
  let from = sample.at(-1)!, to = from;
  for (let i = 0; i < sample.length - 1; i++) {
    if (units <= sample[i + 1].u) { from = sample[i]; to = sample[i + 1]; break; }
  }
  const t = Math.min(1, Math.max(0, (units - from.u) / Math.max(.001, to.u - from.u)));
  const mix = (a: number, b: number) => a + (b - a) * t;
  const warm = { x: mix(from.x, to.x), y: mix(from.y, to.y), diameter: mix(from.diameter, to.diameter) };
  if (mobile) {
    const travel = smoothRange(units, 0, 1.5);
    warm.x = .5 + (-.02 - .5) * travel;
    warm.y = (.52 + .75 * aspect) * (1 - travel) - .03 * travel;
    warm.diameter = 1.5 + (1.14 - 1.5) * travel;
  }
  const coldTravel = smoothRange(units, 4.5, 6);
  const cold = { x: .69 - coldTravel * .014, y: .99 - coldTravel * .49, diameter: .44 - coldTravel * .03 };
  if (mobile) { cold.x = .65; cold.y = 1.1 - coldTravel * .7; cold.diameter = 1.12; }
  return { units, warm, cold, boundary: -.18 + 1.36 * smoothRange(units, 4.25, 6.25), transition: smoothRange(units, 4.25, 6.25) };
}

export function openingTextMotion(progress: number, height: number, mobile = false) {
  const units = progress * SCROLL_UNITS;
  return {
    units,
    intro: (.234 - units) * height,
    manifesto: (.255 + (2 - units) * .83) * height,
    gateway: (3.5 - units) * height,
    bridge: (5.63 - units) * height,
    web: (.26 + (6.5 - units) * .8) * height,
    gatewayVisible: units > 2 && units < 6.1,
    // Mobile title starts higher so all three short offering cards stay reachable.
    mobileGateway: (.25 + 3 - units) * height,
    mobileManifesto: (.32 + (2 - units) * .83) * height,
    mobileWeb: (.65 + (6.5 - units) * .8) * height,
    mobile,
  };
}

export function advanceScroll(progress: number, deltaPixels: number, viewportHeight: number) {
  return Math.min(1, Math.max(0, progress + deltaPixels / Math.max(1, viewportHeight) / SCROLL_UNITS));
}

/** Frame-rate-independent settling without snapping away from the user's position. */
export function followScroll(current: number, target: number, deltaMs: number) {
  return current + (target - current) * (1 - Math.exp(-Math.min(64, Math.max(0, deltaMs)) / 85));
}
