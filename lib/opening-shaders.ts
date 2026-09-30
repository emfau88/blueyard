// Placeholder Computation material, replaced by spatial fibers in Bulk 8.
// The liquid transition lives exclusively in the world compositor.
export const contourVertexShader = /* glsl */ `
  varying vec3 vPoint;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPoint = normalize(position);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;
export const contourFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vPoint;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float facing = max(0.0, dot(n, v));
    float flow = vPoint.y * 2.2 + .24 * sin(vPoint.x * 5.0 + vPoint.z * 3.0) + .16 * sin(vPoint.z * 8.0 - vPoint.x * 4.0);
    float strands = pow(.5 + .5 * sin(flow * 180.0), 12.0);
    float bundles = smoothstep(-.2, .4, sin(flow * 18.0));
    float rim = pow(1.0 - facing, 3.0);
    float spec = pow(max(0.0, dot(reflect(-normalize(vec3(1.2, 1.5, 2.0)), n), v)), 48.0);
    vec3 color = mix(vec3(.53, .53, .85), vec3(.86, .85, .98), facing);
    color = mix(color, vec3(.27, .37, .77), strands * bundles * .85);
    color += rim * vec3(.29, .32, .40) + spec * vec3(.8, .67, .83);
    color += pow(.5 + .5 * sin(flow * 27.0), 35.0) * vec3(.27, .13, .28);
    gl_FragColor = vec4(color, uOpacity);
    #include <colorspace_fragment>
  }
`;
