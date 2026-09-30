export type ExperienceSceneId =
  | "intro"
  | "manifesto"
  | "gateway"
  | "web"
  | "games"
  | "labs"
  | "contact";

export type ExperienceVisual = {
  id: ExperienceSceneId;
  anchor: number;
  background: number;
  object: number;
  rim: number;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
  cameraZ: number;
  metalness: number;
  roughness: number;
};

export const experienceScenes: readonly ExperienceVisual[] = [
  {
    id: "intro",
    anchor: 0,
    background: 0xfff0df,
    object: 0xff7f07,
    rim: 0xffa36b,
    position: [0, -1.42, 0],
    rotation: [-0.18, 0.18, 0],
    scale: 1.34,
    cameraZ: 5.15,
    metalness: 0.02,
    roughness: 0.62,
  },
  {
    id: "manifesto",
    anchor: 2 / 19,
    background: 0xfff6f4,
    object: 0xff9f7b,
    rim: 0xff6f61,
    position: [-1.55, 0.95, 0.08],
    rotation: [0.18, 0.72, -0.18],
    scale: 1.22,
    cameraZ: 5.4,
    metalness: 0.05,
    roughness: 0.52,
  },
  {
    id: "gateway",
    anchor: 3 / 19,
    background: 0xfff6f4,
    object: 0xff9f7b,
    rim: 0xff6f61,
    position: [-1.55, 0.95, 0.08],
    rotation: [0.42, 1.22, 0.12],
    scale: 1.22,
    cameraZ: 5.5,
    metalness: 0.08,
    roughness: 0.42,
  },
  {
    id: "web",
    anchor: 6.5 / 19,
    background: 0xece9ff,
    object: 0x7767ff,
    rim: 0xc9c2ff,
    position: [-1.35, 0.05, 0],
    rotation: [0.1, 1.8, -0.22],
    scale: 1.19,
    cameraZ: 5.25,
    metalness: 0.12,
    roughness: 0.34,
  },
  {
    id: "games",
    anchor: 10.5 / 19,
    background: 0xe9f5ff,
    object: 0x8fc7ff,
    rim: 0xffffff,
    position: [-1.02, 0.15, 0.05],
    rotation: [0.62, 2.45, 0.1],
    scale: 1.08,
    cameraZ: 5.05,
    metalness: 0.7,
    roughness: 0.2,
  },
  {
    id: "labs",
    anchor: 13.5 / 19,
    background: 0xffeaf8,
    object: 0xf3a8dc,
    rim: 0xffffff,
    position: [-1.42, -0.02, -0.08],
    rotation: [0.25, 3.05, -0.2],
    scale: 1.2,
    cameraZ: 5.35,
    metalness: 0.08,
    roughness: 0.25,
  },
  {
    id: "contact",
    anchor: 1,
    background: 0xf4f0ea,
    object: 0xaca8b2,
    rim: 0xffffff,
    position: [-1.65, 0.04, 0],
    rotation: [0.75, 3.8, 0.18],
    scale: 1.12,
    cameraZ: 5.1,
    metalness: 0.92,
    roughness: 0.12,
  },
] as const;

export function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getNearestSceneIndex(progress: number) {
  const units = progress * 19;
  if (units < 1.2) return 0;
  if (units < 2.6) return 1;
  if (units < 5.85) return 2;
  let nearest = 0;
  let distance = Number.POSITIVE_INFINITY;

  experienceScenes.forEach((scene, index) => {
    const currentDistance = Math.abs(progress - scene.anchor);
    if (currentDistance < distance) {
      nearest = index;
      distance = currentDistance;
    }
  });

  return nearest;
}

export function getSceneSegment(progress: number) {
  const value = clampProgress(progress);

  for (let index = 0; index < experienceScenes.length - 1; index += 1) {
    const from = experienceScenes[index];
    const to = experienceScenes[index + 1];
    if (value <= to.anchor) {
      const duration = to.anchor - from.anchor;
      return {
        from,
        to,
        mix: duration === 0 ? 0 : (value - from.anchor) / duration,
      };
    }
  }

  const finalScene = experienceScenes[experienceScenes.length - 1];
  return { from: finalScene, to: finalScene, mix: 0 };
}
