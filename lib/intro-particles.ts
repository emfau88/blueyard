// Deterministic particle data for the emfau intro scene.
export function createIntroParticles(count: number, outside: boolean) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  let seed = outside ? 8472 : 1397;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < count; i += 1) {
    const theta = random() * Math.PI * 2;
    const z = random() * 2 - 1;
    const radial = Math.sqrt(1 - z * z);
    const radius = outside ? 1.48 + Math.pow(random(), 2.8) * 0.68 : Math.cbrt(random()) * (1.04 + 0.21 * Math.sin(theta * 3 + z * 5));
    positions[i * 3] = Math.cos(theta) * radial * radius;
    positions[i * 3 + 1] = Math.sin(theta) * radial * radius;
    positions[i * 3 + 2] = z * radius;
    sizes[i] = outside ? 0.9 + random() * 2.5 : 1.2 + random() * 2.0;
    seeds[i] = random();
  }
  return { positions, sizes, seeds };
}

export const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOutside;
  uniform float uFlowEnabled;
  varying float vSeed;
  varying float vDepth;
  void main() {
    vec3 p = position;
    float motion = (uOutside * 0.018 + (1.0 - uOutside) * 0.012) * uFlowEnabled;
    p += vec3(sin(p.y * 5.0 + uTime * 0.5), cos(p.x * 4.0 + uTime * 0.4), sin(p.z * 5.0 + uTime * 0.3)) * motion;
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * uPixelRatio * clamp(5.8 / -viewPosition.z, 0.65, 2.0);
    vSeed = aSeed;
    vDepth = p.z;
  }
`;
export const particleFragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform float uOutside;
  varying float vSeed;
  varying float vDepth;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    if (radius > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.18, 0.5, radius)) * uOpacity;
    vec3 coral = mix(vec3(0.88, 0.075, 0.055), vec3(1.0, 0.23, 0.16), vSeed);
    vec3 color = mix(coral, vec3(1.0, 0.98, 0.84), max(uOutside, step(0.90, vSeed)));
    alpha *= mix(0.56, 1.0, smoothstep(-1.4, 1.1, vDepth));
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
export const shellVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Keep the sphere silhouette round; only the object transform may change.
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;
export const shellFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float facing = max(dot(normalize(vNormal), normalize(vView)), 0.0);
    float edge = pow(1.0 - facing, 2.4);
    float rim = pow(1.0 - facing, 7.0);
    vec3 color = mix(vec3(1.0, 0.60, 0.28), vec3(1.0, 0.30, 0.44), edge * 0.94);
    color = mix(color, vec3(1.0, 0.91, 0.97), rim);
    gl_FragColor = vec4(color, (0.32 + edge * 0.44 + rim * 0.18) * uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
