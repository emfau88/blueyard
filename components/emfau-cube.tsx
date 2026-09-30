"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import type { Material, Texture } from "three";
import type { SectorId } from "@/lib/content";

type Props = {
  activeSector: SectorId;
  label: string;
  onActivate: (sector: SectorId) => void;
  onSectorChange: (sector: SectorId) => void;
};

const cubeOrder: SectorId[] = ["web", "games", "labs"];

const targets: Record<SectorId, { x: number; y: number }> = {
  web: { x: -0.24, y: -Math.PI / 2 + 0.38 },
  games: { x: Math.PI / 2 - 0.38, y: 0.26 },
  labs: { x: -0.22, y: Math.PI / 2 - 0.38 },
};

function cycleSector(current: SectorId, step: number) {
  const index = cubeOrder.indexOf(current);
  return cubeOrder[(index + step + cubeOrder.length) % cubeOrder.length];
}

export function EmfauCube({ activeSector, label, onActivate, onSectorChange }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeSector);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    activeRef.current = activeSector;
  }, [activeSector]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    void import("three")
      .then((THREE) => {
        if (disposed || !mountRef.current) return;

        const mount = mountRef.current;
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        try {
          const probe = document.createElement("canvas");
          if (!probe.getContext("webgl2") && !probe.getContext("webgl")) {
            throw new Error("WebGL unavailable");
          }

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
          camera.position.set(0, 0.15, 5.4);

          const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
          renderer.setClearColor(0x000000, 0);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.4 : 1.8));
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFShadowMap;
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          mount.appendChild(renderer.domElement);

          const textureFor = (name: string, background: string, foreground = "#0b0d12") => {
            const canvas = document.createElement("canvas");
            canvas.width = 768;
            canvas.height = 768;
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Canvas unavailable");
            context.fillStyle = background;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = "rgba(11,13,18,.2)";
            context.lineWidth = 3;
            for (let line = 96; line < 768; line += 96) {
              context.beginPath();
              context.moveTo(line, 0);
              context.lineTo(line, 768);
              context.stroke();
              context.beginPath();
              context.moveTo(0, line);
              context.lineTo(768, line);
              context.stroke();
            }
            context.fillStyle = foreground;
            context.font = "700 132px Arial Narrow, Arial, sans-serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(name.toUpperCase(), 384, 390);
            context.font = "500 26px monospace";
            context.letterSpacing = "8px";
            context.fillText("EMFAU / DIRECTION", 384, 660);
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
            return texture;
          };

          const webTexture = textureFor("WEB", "#7086ff");
          const gamesTexture = textureFor("GAMES", "#ff5b2e");
          const labsTexture = textureFor("LABS", "#48d7cc");
          const darkTexture = textureFor("EMFAU", "#12151d", "#f2efe8");
          const markTexture = new THREE.TextureLoader().load(
            "/brand/emfau-mark.svg",
            () => {
              markTexture.colorSpace = THREE.SRGBColorSpace;
              markTexture.needsUpdate = true;
            },
          );
          markTexture.colorSpace = THREE.SRGBColorSpace;

          const material = (map: Texture, color = 0xffffff) =>
            new THREE.MeshPhysicalMaterial({
              map,
              color,
              metalness: 0.16,
              roughness: 0.34,
              clearcoat: 0.7,
              clearcoatRoughness: 0.22,
            });

          const materials = [
            material(webTexture),
            material(labsTexture),
            material(gamesTexture),
            material(darkTexture),
            material(markTexture, 0xf2efe8),
            material(darkTexture),
          ];

          const group = new THREE.Group();
          group.rotation.set(-0.08, 0, -0.04);
          scene.add(group);

          const cube = new THREE.Mesh(new THREE.BoxGeometry(2.35, 2.35, 2.35), materials);
          cube.castShadow = true;
          cube.receiveShadow = true;
          group.add(cube);

          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(cube.geometry, 20),
            new THREE.LineBasicMaterial({ color: 0xf2efe8, transparent: true, opacity: 0.24 }),
          );
          cube.add(edges);

          const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 8),
            new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.38 }),
          );
          floor.rotation.x = -Math.PI / 2;
          floor.position.y = -1.72;
          floor.receiveShadow = true;
          scene.add(floor);

          scene.add(new THREE.HemisphereLight(0xf2efe8, 0x10131b, 1.4));
          const key = new THREE.DirectionalLight(0xffffff, 3.1);
          key.position.set(3.5, 5, 4);
          key.castShadow = true;
          key.shadow.mapSize.set(1024, 1024);
          scene.add(key);
          const blue = new THREE.PointLight(0x7086ff, 18, 9);
          blue.position.set(-3, 0, 2);
          scene.add(blue);
          const orange = new THREE.PointLight(0xff4a22, 14, 8);
          orange.position.set(3, -1, 1);
          scene.add(orange);

          const resize = () => {
            const rect = mount.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            renderer.setSize(rect.width, rect.height, false);
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
          };
          const observer = new ResizeObserver(resize);
          observer.observe(mount);
          resize();

          const startedAt = performance.now();
          let animationFrame = 0;
          let intro = 0;

          const render = () => {
            const elapsed = (performance.now() - startedAt) / 1000;
            intro = Math.min(1, intro + (prefersReduced ? 1 : 0.018));
            const destination = targets[activeRef.current];
            const eased = 1 - Math.pow(1 - intro, 3);
            const idleX = prefersReduced ? 0 : Math.sin(elapsed * 0.65) * 0.035;
            const idleY = prefersReduced ? 0 : Math.cos(elapsed * 0.5) * 0.045;
            const pointerX = prefersReduced ? 0 : pointerRef.current.y * 0.11;
            const pointerY = prefersReduced ? 0 : pointerRef.current.x * 0.14;

            const targetX = destination.x * eased + idleX + pointerX;
            const targetY = destination.y * eased + idleY + pointerY;
            group.rotation.x += (targetX - group.rotation.x) * (prefersReduced ? 1 : 0.075);
            group.rotation.y += (targetY - group.rotation.y) * (prefersReduced ? 1 : 0.075);
            group.rotation.z += (-0.04 - group.rotation.z) * 0.05;

            renderer.render(scene, camera);
            animationFrame = window.requestAnimationFrame(render);
          };

          renderer.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            setFailed(true);
          });

          render();
          setReady(true);

          cleanup = () => {
            observer.disconnect();
            window.cancelAnimationFrame(animationFrame);
            cube.geometry.dispose();
            edges.geometry.dispose();
            (edges.material as Material).dispose();
            floor.geometry.dispose();
            (floor.material as Material).dispose();
            materials.forEach((item) => item.dispose());
            [webTexture, gamesTexture, labsTexture, darkTexture, markTexture].forEach((texture) => texture.dispose());
            renderer.dispose();
            renderer.domElement.remove();
          };
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  const handleActivate = () => {
    if (activating) return;
    setActivating(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360;
    window.setTimeout(() => onActivate(activeSector), delay);
  };

  return (
    <button
      aria-label={label}
      className={`emfau-cube-control ${ready && !failed ? "is-ready" : "is-fallback"} ${activating ? "is-activating" : ""}`}
      onBlur={() => { pointerRef.current = { x: 0, y: 0 }; }}
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          onSectorChange(cycleSector(activeSector, 1));
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          onSectorChange(cycleSector(activeSector, -1));
        }
      }}
      onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 }; }}
      onPointerMove={handlePointerMove}
      type="button"
    >
      <span className="cube-fallback" aria-hidden="true">
        <img src="/brand/emfau-mark.svg" alt="" />
      </span>
      <span className="cube-canvas" ref={mountRef} aria-hidden="true" />
      <span className="cube-hint" aria-hidden="true">← {activeSector} →</span>
    </button>
  );
}
