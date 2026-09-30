import type * as Three from "three";
import type { ExperienceFrame, RenderView } from "./experience-input";
import { liquidTransition } from "./liquid-transition";
import { screenVertex, worldBackgroundFragment, worldCompositeFragment } from "./world-composite-shaders";

/** One renderer, two complete world images, one final output conversion.
 * Intermediate shaders write linear light; only screen output encodes sRGB.
 * NoToneMapping/exposure 1 preserve the existing look until material tuning.
 */
export function createWorldRenderer(THREE: typeof Three, renderer: Three.WebGLRenderer,
  own: (cleanup: () => void) => void) {
  const warmScene = new THREE.Scene();
  const coldScene = new THREE.Scene();
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  own(() => quadGeometry.dispose());
  const createBackground = (scene: Three.Scene, warm: boolean) => {
    const material = new THREE.ShaderMaterial({ vertexShader: screenVertex, fragmentShader: worldBackgroundFragment,
      depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: { uSize: { value: new THREE.Vector2(1, 1) }, uSceneColor: { value: new THREE.Color(0xfff0df) },
        uWarm: { value: warm ? 1 : 0 }, uWeb: { value: 1 } } });
    own(() => material.dispose());
    const mesh = new THREE.Mesh(quadGeometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = -10;
    scene.add(mesh);
    return material;
  };
  const warmBackground = createBackground(warmScene, true);
  const coldBackground = createBackground(coldScene, false);
  const hdr = renderer.extensions.has("EXT_color_buffer_float");
  const createTarget = (name: string) => {
    const target = new THREE.WebGLRenderTarget(1, 1, {
      type: hdr ? THREE.HalfFloatType : THREE.UnsignedByteType,
      format: THREE.RGBAFormat, colorSpace: THREE.LinearSRGBColorSpace,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      depthBuffer: true, stencilBuffer: false, generateMipmaps: false,
    });
    target.texture.name = name;
    own(() => target.dispose());
    return target;
  };
  const worldA = createTarget("emfau-warm-linear");
  const worldB = createTarget("emfau-cold-linear");
  const material = new THREE.ShaderMaterial({ vertexShader: screenVertex, fragmentShader: worldCompositeFragment,
    depthWrite: false, depthTest: false,
    uniforms: { uWorldA: { value: worldA.texture }, uWorldB: { value: worldB.texture },
      uBoundary: { value: -.18 }, uScroll: { value: 0 }, uView: { value: 0 },
      uTime: { value: 0 }, uEnvelope: { value: 0 }, uBandWidth: { value: .2 }, uStrength: { value: 0 },
      uImpulse: { value: 0 }, uDetail: { value: 1 }, uPointer: { value: new THREE.Vector2(.5, .5) },
      uPointerVelocity: { value: new THREE.Vector2() }, uResolution: { value: new THREE.Vector2(1, 1) } } });
  own(() => material.dispose());
  const outputScene = new THREE.Scene();
  const quad = new THREE.Mesh(quadGeometry, material);
  quad.frustumCulled = false;
  outputScene.add(quad);
  const outputCamera = new THREE.Camera();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.info.autoReset = false;
  const stats = { passes: 0, calls: 0, textures: 0, geometries: 0, width: 1, height: 1,
    format: hdr ? "rgba16f-linear" : "rgba8-linear", cpuMs: 0, liquidStrength: 0, liquidDetail: 1 };
  let mobile = false;

  return {
    warmScene, coldScene, coldBackground, stats,
    resize(width: number, height: number, cssWidth: number, cssHeight: number) {
      worldA.setSize(width, height); worldB.setSize(width, height);
      warmBackground.uniforms.uSize.value.set(cssWidth, cssHeight);
      coldBackground.uniforms.uSize.value.set(cssWidth, cssHeight);
      stats.width = width; stats.height = height;
      mobile = cssWidth < 700;
      material.uniforms.uResolution.value.set(width, height);
    },
    render(camera: Three.Camera, boundary: number, units: number, view: RenderView, frame: ExperienceFrame) {
      const started = performance.now();
      renderer.info.reset();
      stats.passes = 0;
      material.uniforms.uBoundary.value = boundary;
      material.uniforms.uScroll.value = units;
      material.uniforms.uView.value = view === "warm" ? 1 : view === "cold" ? 2 : 0;
      const liquid = liquidTransition(frame, boundary, mobile, view === "neutral");
      material.uniforms.uTime.value = liquid.time;
      material.uniforms.uEnvelope.value = liquid.envelope;
      material.uniforms.uBandWidth.value = liquid.width;
      material.uniforms.uStrength.value = liquid.strength;
      material.uniforms.uImpulse.value = liquid.scrollImpulse;
      material.uniforms.uDetail.value = liquid.detail;
      material.uniforms.uPointer.value.set(liquid.pointerX, liquid.pointerY);
      material.uniforms.uPointerVelocity.value.set(liquid.pointerVelocityX, liquid.pointerVelocityY);
      stats.liquidStrength = liquid.strength;
      stats.liquidDetail = liquid.detail;
      const composite = view === "composite" || view === "neutral";
      try {
        if (view === "direct-warm" || view === "direct-cold") {
          renderer.setRenderTarget(null);
          renderer.render(view === "direct-warm" ? warmScene : coldScene, camera);
          stats.passes = 1;
        } else {
          // Outside the overlap, skip the invisible world entirely.
          if (view === "warm" || (composite && boundary < 1.18)) {
            renderer.setRenderTarget(worldA); renderer.render(warmScene, camera); stats.passes++;
          }
          if (view === "cold" || (composite && boundary > -.18)) {
            renderer.setRenderTarget(worldB); renderer.render(coldScene, camera); stats.passes++;
          }
          renderer.setRenderTarget(null);
          renderer.render(outputScene, outputCamera); stats.passes++;
        }
      } finally { renderer.setRenderTarget(null); }
      stats.calls = renderer.info.render.calls;
      stats.textures = renderer.info.memory.textures;
      stats.geometries = renderer.info.memory.geometries;
      stats.cpuMs = performance.now() - started;
    },
  };
}
