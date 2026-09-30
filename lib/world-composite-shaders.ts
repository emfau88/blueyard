import { liquidFieldShader } from "./liquid-transition";

export const screenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, .999, 1.0); }
`;

/** Backgrounds are now pixels in each world, not an undistortable CSS layer.
 * CSS gradient interpolation is reproduced in sRGB, then decoded to linear.
 */
export const worldBackgroundFragment = /* glsl */ `
  varying vec2 vUv;
  uniform vec2 uSize;
  uniform vec3 uSceneColor;
  uniform float uWarm;
  uniform float uWeb;
  vec3 warmBackground(vec2 uv) {
    vec2 point = vec2(uv.x, 1.0 - uv.y);
    vec2 direction = vec2(.422618, .906308);
    float gradient = .5 + dot((point - .5) * uSize, direction) / dot(uSize, abs(direction));
    vec3 color = mix(vec3(247., 214., 180.), vec3(243., 179., 150.), clamp((gradient - .06) / .56, 0., 1.));
    color = mix(color, vec3(253., 116., 107.), clamp((gradient - .62) / .38, 0., 1.));
    float radius = length((point - vec2(.42, .23)) / (vec2(.58, .77) * sqrt(2.)));
    vec3 radial = mix(vec3(252., 240., 188.), vec3(249., 233., 188.), clamp(radius / .26, 0., 1.));
    color = mix(color, radial, 1. - clamp((radius - .26) / .46, 0., 1.));
    return sRGBTransferEOTF(vec4(color / 255., 1.)).rgb;
  }
  void main() {
    float glow = exp(-length((vUv - vec2(.74, .5)) * vec2(2.8, 1.8)) * 2.);
    vec3 blue = mix(vec3(.18, .38, .88), vec3(.40, .16, .77), vUv.y);
    vec3 cold = mix(uSceneColor, mix(blue, vec3(.96, .94, 1.), glow), uWeb);
    gl_FragColor = vec4(mix(cold, warmBackground(vUv), uWarm), 1.);
    #include <colorspace_fragment>
  }
`;

/** K3: refract both complete world images; the DOM never enters this pass. */
export const worldCompositeFragment = /* glsl */ `
  ${liquidFieldShader}
  varying vec2 vUv;
  uniform sampler2D uWorldA;
  uniform sampler2D uWorldB;
  uniform float uView;
  void main() {
    vec3 color;
    // Pure endpoints and isolated diagnostics never sample an unrendered target.
    if (uView == 1. || (uView == 0. && uBoundary <= -.18)) {
      color = texture2D(uWorldA, vUv).rgb;
    } else if (uView == 2. || (uView == 0. && uBoundary >= 1.18)) {
      color = texture2D(uWorldB, vUv).rgb;
    } else {
      float baseDistance = vUv.y - liquidEdge(vUv);
      // Do not evaluate the multi-scale flow outside the narrow active band.
      if (baseDistance > uBandWidth) {
        color = texture2D(uWorldA, vUv).rgb;
      } else if (baseDistance < -uBandWidth) {
        color = texture2D(uWorldB, vUv).rgb;
      } else {
      vec3 field = liquidField(vUv);
      vec2 aUV = liquidSampleUV(vUv + field.xy);
      vec2 bUV = liquidSampleUV(vUv - field.xy * .78);
      vec3 a = texture2D(uWorldA, aUV).rgb;
      vec3 b = texture2D(uWorldB, bUV).rgb;
      float band = (1. - smoothstep(.025, uBandWidth, abs(field.z))) * uEnvelope;
      // Restrained spectral separation of the real images, not painted stripes.
      if (uDetail > .5 && band > .001) {
        vec2 split = vec2(.0018, .0007) * band;
        a.r = texture2D(uWorldA, liquidSampleUV(aUV + split)).r;
        a.b = texture2D(uWorldA, liquidSampleUV(aUV - split)).b;
        b.r = texture2D(uWorldB, liquidSampleUV(bUV + split)).r;
        b.b = texture2D(uWorldB, liquidSampleUV(bUV - split)).b;
      }
      float feather = mix(.006, .034, uEnvelope);
      float reveal = 1. - smoothstep(-feather, feather, field.z);
      color = mix(a, b, reveal);
      // A low-cost analytic refractive highlight; no full-screen bloom wash.
      vec2 slope = vec2(dFdx(field.y), dFdy(field.y)) * uResolution;
      float crest = pow(clamp(abs(slope.y) * .20, 0., 1.), 3.);
      float shine = band * (.045 + crest * .23);
      color += shine * vec3(.82, .73, 1.);
      color = mix(color, color * vec3(.98, .95, 1.04), band * .22);
      }
    }
    gl_FragColor = vec4(color, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
