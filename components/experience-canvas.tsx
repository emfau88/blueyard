"use client";

import { useEffect, useRef, type RefObject } from "react";
import { getSceneSegment } from "@/lib/experience-scenes";
import { warmSceneOpacity } from "@/lib/gateway-motion";
import { openingMotion, smoothRange } from "@/lib/opening-motion";
import { contourVertexShader, contourFragmentShader } from "@/lib/opening-shaders";
import { createIntroParticles, particleVertexShader, particleFragmentShader, shellVertexShader, shellFragmentShader } from "@/lib/intro-particles";
import { createResourceScope, renderDimensions, type ExperienceDraw, type RenderOptions } from "@/lib/experience-input";
import { createWorldRenderer } from "@/lib/world-renderer";
import { createParticleInteractionState, sampleParticleInteraction } from "@/lib/particle-interaction";

type Props = {
  drawRef: RefObject<ExperienceDraw | null>;
  optionsRef: RefObject<RenderOptions>;
  revealed: boolean;
  fallback: boolean;
  onLoad: (progress: number, fallback?: boolean) => void;
};

export function ExperienceCanvas({ drawRef, optionsRef, revealed, fallback, onLoad }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(revealed);
  useEffect(() => { revealedRef.current = revealed; }, [revealed]);

  useEffect(() => {
    if (fallback) return;
    let disposed = false;
    const resources = createResourceScope();
    const fail = () => {
      drawRef.current = null;
      resources.dispose();
      if (!disposed) onLoad(1, true);
    };
    void import("three").then((THREE) => {
      if (disposed || !mountRef.current) return;
      onLoad(.2);
      const mount = mountRef.current;
      const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance" });
      resources.add(() => { renderer.dispose(); renderer.domElement.remove(); });
      renderer.setClearColor(0x000000, 1);
      const canvas = renderer.domElement;
      canvas.className = "experience-webgl";
      canvas.dataset.rendererId = THREE.MathUtils.generateUUID();
      mount.appendChild(canvas);
      const pipeline = createWorldRenderer(THREE, renderer, resources.add);
      const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
      const group = new THREE.Group();
      pipeline.warmScene.add(group);
      const coldGroup = new THREE.Group();
      pipeline.coldScene.add(coldGroup);
      const geometry = new THREE.SphereGeometry(1.45, 80, 64);
      resources.add(() => geometry.dispose());
      const shellMaterial = new THREE.ShaderMaterial({
        vertexShader: shellVertexShader, fragmentShader: shellFragmentShader,
        transparent: true, depthWrite: false, uniforms: { uOpacity: { value: 1 } },
      });
      resources.add(() => shellMaterial.dispose());
      const shell = new THREE.Mesh(geometry, shellMaterial);
      group.add(shell);
      const worldMaterial = new THREE.MeshPhysicalMaterial({ color: 0x7767ff, roughness: .4, metalness: .1, clearcoat: .65, transparent: true, opacity: 0 });
      resources.add(() => worldMaterial.dispose());
      const worldOrb = new THREE.Mesh(geometry, worldMaterial);
      coldGroup.add(worldOrb);
      const contourMaterial = new THREE.ShaderMaterial({ vertexShader: contourVertexShader, fragmentShader: contourFragmentShader,
        uniforms: { uOpacity: { value: 1 } }, transparent: true });
      resources.add(() => contourMaterial.dispose());
      const contourOrb = new THREE.Mesh(geometry, contourMaterial);
      coldGroup.add(contourOrb);
      const mobile = mount.clientWidth < 700;
      const makeCloud = (outside: boolean) => {
        const data = createIntroParticles(outside ? (mobile ? 3200 : 6500) : (mobile ? 15000 : 32000), outside);
        const cloudGeometry = new THREE.BufferGeometry();
        resources.add(() => cloudGeometry.dispose());
        cloudGeometry.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
        cloudGeometry.setAttribute("aSize", new THREE.BufferAttribute(data.sizes, 1));
        cloudGeometry.setAttribute("aSeed", new THREE.BufferAttribute(data.seeds, 1));
        const cloudMaterial = new THREE.ShaderMaterial({
          vertexShader: particleVertexShader, fragmentShader: particleFragmentShader,
          transparent: true, depthWrite: false, depthTest: false,
          blending: outside ? THREE.AdditiveBlending : THREE.NormalBlending,
          uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uOutside: { value: outside ? 1 : 0 },
            uOpacity: { value: 1 }, uFlowEnabled: { value: 1 } },
        });
        resources.add(() => cloudMaterial.dispose());
        const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
        cloud.renderOrder = outside ? 3 : 2;
        group.add(cloud);
        return cloud;
      };
      const inside = makeCloud(false);
      const outside = makeCloud(true);
      const interactionState = createParticleInteractionState();
      const inverseParticleWorld = new THREE.Matrix4();
      const diagnosticPoint = new THREE.Vector3();
      const markerGeometry = new THREE.SphereGeometry(.038, 12, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00b7bd, depthTest: false, depthWrite: false });
      resources.add(() => markerGeometry.dispose());
      resources.add(() => markerMaterial.dispose());
      const hitMarker = new THREE.Mesh(markerGeometry, markerMaterial);
      hitMarker.visible = false;
      hitMarker.renderOrder = 10;
      group.add(hitMarker);
      const hemisphere = new THREE.HemisphereLight(0xffffff, 0xf3a36d, 2.2);
      const key = new THREE.DirectionalLight(0xffffff, 4.1);
      key.position.set(3.4, 4.2, 4.8);
      pipeline.coldScene.add(hemisphere, key);
      let width = 1, height = 1;
      let sizeDirty = true;
      const resize = () => {
        if (!mount.clientWidth || !mount.clientHeight) return;
        width = mount.clientWidth; height = mount.clientHeight;
        const size = renderDimensions(width, height, window.devicePixelRatio, renderer.capabilities.maxTextureSize);
        renderer.setPixelRatio(size.ratio);
        renderer.setSize(width, height, false);
        pipeline.resize(canvas.width, canvas.height, width, height);
        inside.material.uniforms.uPixelRatio.value = outside.material.uniforms.uPixelRatio.value = size.ratio;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        sizeDirty = false;
      };
      const observer = new ResizeObserver(() => { sizeDirty = true; });
      observer.observe(mount);
      resources.add(() => observer.disconnect());
      const onResize = () => { sizeDirty = true; };
      window.addEventListener("resize", onResize, { passive: true });
      resources.add(() => window.removeEventListener("resize", onResize));
      resize();
      onLoad(.7);
      const fromColor = new THREE.Color(), toColor = new THREE.Color();
      let entrance = 0;
      let firstFrame = true;
      let frameCount = 0, intervalTotal = 0, intervalMax = 0, cpuTotal = 0;
      let reportTime = performance.now();
      const render: ExperienceDraw = (frame) => {
        if (disposed) return;
        try {
          if (sizeDirty) resize();
          if (optionsRef.current.loseContext) {
            optionsRef.current.loseContext = false;
            renderer.forceContextLoss();
            return;
          }
          const progress = frame.progress;
          const { from, to, mix } = getSceneSegment(progress);
          const blend = THREE.MathUtils.smoothstep(mix, 0, 1);
          const lerp = (a: number, b: number) => THREE.MathUtils.lerp(a, b, blend);
          if (revealedRef.current) entrance = frame.reducedMotion ? 1 : Math.min(1, entrance + frame.delta / 1.1);
          const entry = THREE.MathUtils.smoothstep(entrance, 0, 1);
          const opening = openingMotion(progress, camera.aspect, width < 700);
          const time = frame.reducedMotion ? 0 : frame.time;
          camera.position.z = opening.units <= 6.5 ? 5.15 : lerp(from.cameraZ, to.cameraZ);
          const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(16)) * camera.position.z;
          const span = viewHeight * camera.aspect;
          group.position.set((opening.warm.x - .5) * span, (.5 - opening.warm.y) * viewHeight - (1 - entry) * .65, 0);
          group.scale.setScalar(opening.warm.diameter * span / 2.9);
          const pointer = frame.reducedMotion || !frame.pointer.active || !optionsRef.current.particleMouse ? { x: 0, y: 0 } : frame.pointer;
          group.rotation.set(lerp(from.rotation[0], to.rotation[0]) + pointer.y * .0225,
            lerp(from.rotation[1], to.rotation[1]) + pointer.x * .0275, lerp(from.rotation[2], to.rotation[2]));
          const coldPose = { x: (opening.cold.x - .5) * span, y: (.5 - opening.cold.y) * viewHeight, scale: opening.cold.diameter * span / 2.9 };
          if (opening.units <= 6.5) {
            coldGroup.position.set(coldPose.x, coldPose.y, 0);
            coldGroup.scale.setScalar(coldPose.scale);
          } else {
            coldGroup.position.set(lerp(from.id === "web" ? coldPose.x : from.position[0], to.position[0]),
              lerp(from.id === "web" ? coldPose.y : from.position[1], to.position[1]), lerp(from.position[2], to.position[2]));
            coldGroup.scale.setScalar(lerp(from.id === "web" ? coldPose.scale : from.scale, to.scale));
          }
          coldGroup.rotation.set(.1, lerp(from.rotation[1], to.rotation[1]) + time * .025, -.15);
          const warm = warmSceneOpacity(progress);
          // Projection must use the pose from this same shared frame, before
          // rendering. The numeric sampler reprojects both screen positions
          // under these matrices rather than subtracting hits of old poses.
          camera.updateWorldMatrix(true, false);
          group.updateWorldMatrix(true, false);
          inverseParticleWorld.copy(group.matrixWorld).invert();
          const interaction = sampleParticleInteraction(interactionState, frame, {
            inverseProjection: camera.projectionMatrixInverse.elements,
            cameraWorld: camera.matrixWorld.elements,
            inverseWorld: inverseParticleWorld.elements,
          }, { mouse: optionsRef.current.particleMouse, scroll: optionsRef.current.particleScroll,
            flow: optionsRef.current.particleFlow, freeze: optionsRef.current.freeze,
            visible: warm > 0 && revealedRef.current, width, height });
          inside.material.uniforms.uFlowEnabled.value = outside.material.uniforms.uFlowEnabled.value = interaction.flowEnabled ? 1 : 0;
          hitMarker.visible = optionsRef.current.particleDiagnostics && optionsRef.current.particleHitDebug && interaction.pointer.influence > 0;
          hitMarker.position.fromArray(interaction.pointer.point);
          shellMaterial.uniforms.uOpacity.value = warm;
          inside.material.uniforms.uTime.value = outside.material.uniforms.uTime.value = time;
          inside.material.uniforms.uOpacity.value = outside.material.uniforms.uOpacity.value = warm;
          shell.visible = inside.visible = outside.visible = warm > 0;
          const web = 1 - smoothRange(opening.units, 7.5, 9);
          contourOrb.visible = web > 0;
          contourMaterial.uniforms.uOpacity.value = web;
          worldOrb.visible = opening.units > 7.5;
          worldMaterial.opacity = 1 - web;
          fromColor.setHex(from.object); toColor.setHex(to.object);
          worldMaterial.color.copy(fromColor).lerp(toColor, blend);
          worldMaterial.metalness = lerp(from.metalness, to.metalness);
          worldMaterial.roughness = lerp(from.roughness, to.roughness);
          // Keep the existing sRGB background interpolation of the CSS fallback.
          fromColor.setHex(from.background).convertLinearToSRGB(); toColor.setHex(to.background).convertLinearToSRGB();
          pipeline.coldBackground.uniforms.uSceneColor.value.copy(fromColor).lerp(toColor, blend).convertSRGBToLinear();
          pipeline.coldBackground.uniforms.uWeb.value = web;
          pipeline.render(camera, opening.boundary, opening.units, optionsRef.current.view, frame);
          canvas.dataset.frameId = String(frame.id);
          if (frame.intervalMs > 0 && frame.intervalMs < 250) {
            intervalTotal += frame.intervalMs; intervalMax = Math.max(intervalMax, frame.intervalMs);
            cpuTotal += pipeline.stats.cpuMs; frameCount++;
          }
          if (performance.now() - reportTime >= 500) {
            canvas.dataset.renderStats = JSON.stringify({ ...pipeline.stats, view: optionsRef.current.view,
              frameMs: frameCount ? +(intervalTotal / frameCount).toFixed(2) : 0,
              maxFrameMs: +intervalMax.toFixed(2), cpuMs: frameCount ? +(cpuTotal / frameCount).toFixed(2) : 0,
              samples: frameCount, cssWidth: width, cssHeight: height });
            if (optionsRef.current.particleDiagnostics) {
              diagnosticPoint.fromArray(interaction.pointer.point).applyMatrix4(group.matrixWorld).project(camera);
              canvas.dataset.particleInteraction = JSON.stringify({ ...interaction, frameId: frame.id,
                pointerNdc: [frame.pointer.x, frame.pointer.y],
                projectedNdc: interaction.pointer.influence > 0 ? [diagnosticPoint.x, diagnosticPoint.y] : null,
                channels: { mouse: optionsRef.current.particleMouse, scroll: optionsRef.current.particleScroll,
                  flow: optionsRef.current.particleFlow } });
            } else delete canvas.dataset.particleInteraction;
            intervalTotal = intervalMax = cpuTotal = frameCount = 0;
            reportTime = performance.now();
          }
          if (firstFrame) { firstFrame = false; onLoad(1); }
        } catch (error) { console.error("emfau render failed", error); fail(); }
      };
      const onLost = (event: Event) => { event.preventDefault(); fail(); };
      canvas.addEventListener("webglcontextlost", onLost);
      resources.add(() => canvas.removeEventListener("webglcontextlost", onLost));
      // Parent updates DOM first, then calls this with exactly the same sample.
      drawRef.current = render;
      resources.add(() => { if (drawRef.current === render) drawRef.current = null; });
    }).catch(fail);
    return () => { disposed = true; resources.dispose(); };
  }, [drawRef, optionsRef, onLoad, fallback]);

  return <div className={`experience-canvas ${fallback ? "is-fallback" : ""}`} ref={mountRef} aria-hidden="true">{fallback ? <div className="experience-orb-fallback" /> : null}</div>;
}
