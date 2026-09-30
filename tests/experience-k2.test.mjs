import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { initialExperienceFrame, sampleExperienceFrame, pointerInViewport, renderDimensions, createResourceScope } from "../lib/experience-input.ts";
import { particleFragmentShader, shellFragmentShader } from "../lib/intro-particles.ts";
import { contourFragmentShader } from "../lib/opening-shaders.ts";

const pointer = { x: 0, y: 0, active: true };
test("shared frame exposes units and bounded input velocities, then decays without changing progress", () => {
  let frame = sampleExperienceFrame(initialExperienceFrame(), .1, pointer, 16, false);
  assert.equal(frame.scrollVelocity, 0);
  frame = sampleExperienceFrame(frame, .2, { ...pointer, x: .4 }, 16, false);
  assert.ok(frame.scrollVelocity > 0 && frame.scrollVelocity <= 30);
  assert.ok(frame.pointer.velocityX > 0 && frame.pointer.velocityX <= 8);
  assert.equal(frame.pointer.velocityY, 0);
  for (let i = 0; i < 200; i++) frame = sampleExperienceFrame(frame, .2, { ...pointer, x: .4 }, 16, false);
  assert.equal(frame.progress, .2);
  assert.equal(frame.scrollUnits, .2 * 19);
  assert.ok(Math.abs(frame.scrollVelocity) < 1e-8 && Math.abs(frame.pointer.velocityX) < 1e-8);
  frame = sampleExperienceFrame(frame, .19, pointer, 16, false);
  assert.ok(frame.scrollVelocity < 0);
});

test("velocity damping is frame-independent at rest", () => {
  const base = { ...initialExperienceFrame(.3), id: 1, scrollVelocity: 3,
    pointer: { ...pointer, velocityX: 2, velocityY: -1 } };
  const a = sampleExperienceFrame(base, .3, pointer, 32, false);
  const b = sampleExperienceFrame(sampleExperienceFrame(base, .3, pointer, 16, false), .3, pointer, 16, false);
  assert.ok(Math.abs(a.scrollVelocity - b.scrollVelocity) < 1e-12);
  assert.ok(Math.abs(a.pointer.velocityY - b.pointer.velocityY) < 1e-12);
});

test("tab resume, reduced motion and freeze do not inject velocity or advance effect time", () => {
  const base = { ...initialExperienceFrame(.3), id: 1, time: 12, scrollVelocity: 3 };
  for (const [interval, reduced, freeze] of [[5000, false, false], [16, true, false], [16, false, true]]) {
    const frame = sampleExperienceFrame(base, .4, { ...pointer, x: 1 }, interval, reduced, 19, freeze);
    assert.equal(frame.time, 12);
    assert.equal(frame.scrollVelocity, 0);
    assert.equal(frame.pointer.velocityX, 0);
    assert.equal(frame.progress, .4);
  }
});

test("screen coordinates use NDC with Y up, independent of render resolution", () => {
  assert.deepEqual(pointerInViewport(0, 0, 1000, 500), { x: -1, y: 1, active: true });
  assert.deepEqual(pointerInViewport(500, 250, 1000, 500), pointer);
  assert.deepEqual(pointerInViewport(1000, 500, 1000, 500), { x: 1, y: -1, active: true });
  assert.equal(pointerInViewport(-100, 700, 1000, 500).x, -1);
});

test("render buffers are capped by mobile DPR, pixel budget and GPU texture limits", () => {
  assert.equal(renderDimensions(390, 844, 3).ratio, 1.35);
  assert.equal(renderDimensions(1440, 900, 1).ratio, 1);
  for (const [w, h, dpr, limit] of [[7680, 4320, 3, 4096], [1000, 2000, 2, 1024], [0, 0, 1, 4096]]) {
    const size = renderDimensions(w, h, dpr, limit);
    assert.ok(size.width >= 1 && size.height >= 1);
    assert.ok(size.width * size.height <= 4_000_000);
    assert.ok(size.width <= limit && size.height <= limit);
  }
});

test("partial resource scopes dispose in reverse order, exactly once", () => {
  const result = [], scope = createResourceScope();
  scope.add(() => result.push("renderer")); scope.add(() => result.push("target")); scope.add(() => result.push("callback"));
  scope.dispose(); scope.dispose(); scope.add(() => result.push("late"));
  assert.deepEqual(result, ["callback", "target", "renderer", "late"]);
});

test("world shaders no longer discard along independent transition boundaries", () => {
  for (const shader of [particleFragmentShader, shellFragmentShader, contourFragmentShader]) {
    assert.doesNotMatch(shader, /uBoundary|liquidEdge|uResolution/);
  }
});

test("one frame loop owns DOM and WebGL, intermediate targets are linear", () => {
  const source = path => readFileSync(new URL(path, import.meta.url), "utf8");
  const canvas = source("../components/experience-canvas.tsx");
  const landing = source("../components/emfau-landing.tsx");
  const pipeline = source("../lib/world-renderer.ts");
  assert.doesNotMatch(canvas, /setAnimationLoop|requestAnimationFrame|addEventListener\("pointermove"/);
  assert.match(landing, /drawRef\.current\?\.\(frame\)/);
  assert.match(pipeline, /colorSpace: THREE\.LinearSRGBColorSpace/);
  assert.match(pipeline, /renderer\.outputColorSpace = THREE\.SRGBColorSpace/);
  assert.match(pipeline, /finally \{ renderer\.setRenderTarget\(null\); \}/);
});
