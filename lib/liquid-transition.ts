import type { ExperienceFrame } from "./experience-input";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Own reconstruction, not the reference site's simulation. Screen-space units.
 * Macro position remains scroll-controlled; time/velocity only stir the band.
 * The envelope is exactly zero at both endpoints, including on reverse travel.
 */
export function liquidTransition(frame: ExperienceFrame, boundary: number, mobile: boolean, neutral = false) {
  const envelope = smooth(-.18, .12, boundary) * (1 - smooth(.88, 1.18, boundary));
  const enabled = !frame.reducedMotion && !neutral;
  return {
    envelope: enabled ? envelope : 0,
    width: mobile ? .16 : .20,
    strength: enabled ? (mobile ? .082 : .11) * envelope : 0,
    scrollImpulse: enabled ? Math.tanh(frame.scrollVelocity * .14) : 0,
    pointerX: frame.pointer.x * .5 + .5,
    pointerY: frame.pointer.y * .5 + .5,
    pointerVelocityX: enabled && frame.pointer.active ? Math.tanh(frame.pointer.velocityX * .18) : 0,
    pointerVelocityY: enabled && frame.pointer.active ? Math.tanh(frame.pointer.velocityY * .18) : 0,
    detail: mobile ? 0 : 1,
    time: frame.reducedMotion ? 0 : frame.time,
  };
}

export const liquidFieldShader = /* glsl */ `
  uniform float uBoundary;
  uniform float uScroll;
  uniform float uTime;
  uniform float uEnvelope;
  uniform float uBandWidth;
  uniform float uStrength;
  uniform float uImpulse;
  uniform float uDetail;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;
  uniform vec2 uResolution;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float liquidNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3. - 2. * f);
    return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x),
      mix(hash21(i + vec2(0., 1.)), hash21(i + 1.), f.x), f.y);
  }
  float liquidFbm(vec2 p) {
    float n = liquidNoise(p) * .58;
    n += liquidNoise(p * 2.03 + 7.1) * .28;
    if (uDetail > .5) n += liquidNoise(p * 4.07 + 19.3) * .14;
    return n / mix(.86, 1., uDetail);
  }
  // A deterministic broad crest. No time/velocity input changes its mean height.
  float liquidEdge(vec2 uv) {
    return uBoundary + uEnvelope * (liquidFbm(vec2(uv.x * 4.2, uScroll * .22)) - .5) * .13;
  }
  // x/y displacement and the SAME signed distance used to reveal both worlds.
  vec3 liquidField(vec2 uv) {
    float distance = uv.y - liquidEdge(uv);
    float band = 1. - smoothstep(.025, uBandWidth, abs(distance));
    float aspect = uResolution.x / max(1., uResolution.y);
    vec2 cursor = (uv - uPointer) * vec2(aspect, 1.);
    float influence = exp(-dot(cursor, cursor) / .032);
    vec2 localImpulse = uPointerVelocity * influence;
    vec2 p = vec2(uv.x * 3.2, distance * 7.);
    vec2 drift = vec2(uTime * .085, -uTime * .045);
    vec2 warp = vec2(liquidFbm(p + drift), liquidFbm(p * 1.3 - drift + 13.));
    float flow = liquidFbm(p + warp * 2.6 + drift);
    // Long folds rather than a repeating two-sine border. The folds bend actual
    // texture coordinates, so particles and object silhouettes refract together.
    float phase = distance * 30. + flow * 5.8 + uv.x * 1.8 + uTime * .18;
    float fold = sin(phase);
    float fine = uDetail * sin(phase * 2.3 + warp.x * 5.) * .13;
    float force = 1. + abs(uImpulse) * .20;
    vec2 offset = vec2((flow - .5) * .9 + fold * .32, fold + fine);
    offset += vec2(localImpulse.x * .28, localImpulse.y * .22 + uImpulse * .08);
    offset *= band * uStrength * force;
    // Fade horizontal displacement before the viewport edges to avoid clamped
    // vertical streaks. Vertical sampling uses mirrored guard coordinates below.
    offset.x *= smoothstep(0., .07, uv.x) * (1. - smoothstep(.93, 1., uv.x));
    float refractedDistance = distance + offset.y * .42;
    return vec3(offset, refractedDistance);
  }
  vec2 liquidSampleUV(vec2 uv) {
    vec2 inset = .5 / max(uResolution, vec2(1.));
    // Reflection at the image edge avoids an empty stripe during a strong fold.
    return clamp(1. - abs(1. - mod(uv, 2.)), inset, 1. - inset);
  }
`;
