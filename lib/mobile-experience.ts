import { advanceScroll, SCROLL_UNITS, smoothRange } from "./opening-motion.ts";
import { experienceScenes } from "./experience-scenes.ts";

export const MOBILE_SCROLL_UNITS = 9.5;

// Compress input distance, not the shared render timeline. Every effect/keyframe
// remains reachable; links, scene anchors and desktop motion stay unchanged.
const mobileStops = [
  { timeline: 0, scroll: 0 },
  { timeline: 2, scroll: 1.25 },
  { timeline: 3, scroll: 2.05 },
  { timeline: 4.25, scroll: 2.65 },
  { timeline: 6.5, scroll: 4.1 },
  { timeline: 10.5, scroll: 5.75 },
  { timeline: 13.5, scroll: 7.15 },
  { timeline: SCROLL_UNITS, scroll: MOBILE_SCROLL_UNITS },
] as const;

function mapDistance(value: number, input: "timeline" | "scroll", output: "timeline" | "scroll") {
  const bounded = Math.max(0, Math.min(mobileStops.at(-1)![input], value));
  for (let index = 1; index < mobileStops.length; index++) {
    const from = mobileStops[index - 1], to = mobileStops[index];
    if (bounded <= to[input]) {
      const mix = (bounded - from[input]) / (to[input] - from[input]);
      return from[output] + (to[output] - from[output]) * mix;
    }
  }
  return mobileStops.at(-1)![output];
}

export function mobileScrollDistance(progress: number) {
  return mapDistance(progress * SCROLL_UNITS, "timeline", "scroll");
}

export function advanceResponsiveScroll(progress: number, deltaPixels: number, height: number, mobile: boolean) {
  if (!mobile) return advanceScroll(progress, deltaPixels, height);
  const distance = mobileScrollDistance(progress) + deltaPixels / Math.max(1, height);
  return mapDistance(distance, "scroll", "timeline") / SCROLL_UNITS;
}

/** Keep later mobile copy readable across the long model transitions. */
export function mobileSceneTrack(progress: number, index: number, height: number) {
  const units = progress * SCROLL_UNITS;
  const anchor = experienceScenes[index].anchor * SCROLL_UNITS;
  const previous = experienceScenes[index - 1].anchor * SCROLL_UNITS;
  const next = experienceScenes[index + 1]?.anchor;
  const entry = index === 3
    ? smoothRange(units, 5.6, 6.3)
    : smoothRange(units, (previous + anchor) / 2 - .3, (previous + anchor) / 2 + .3);
  const exit = next === undefined ? 0
    : smoothRange(units, (anchor + next * SCROLL_UNITS) / 2 - .3, (anchor + next * SCROLL_UNITS) / 2 + .3);
  return { opacity: entry * (1 - exit), shift: ((1 - entry) - exit) * height * .5 };
}
