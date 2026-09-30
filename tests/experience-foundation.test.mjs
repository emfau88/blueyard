import assert from "node:assert/strict";
import { test } from "node:test";
import { createIntroParticles, shellVertexShader } from "../lib/intro-particles.ts";
import { loadingProgress, loadingComplete, LOAD_TIMEOUT_MS } from "../lib/experience-loading.ts";
import { experienceScenes, getNearestSceneIndex, getSceneSegment, clampProgress } from "../lib/experience-scenes.ts";
import { gatewayCardMotion, warmSceneOpacity } from "../lib/gateway-motion.ts";
import { openingMotion, openingTextMotion, advanceScroll, followScroll, unitProgress } from "../lib/opening-motion.ts";

test("small wheel steps persist, one viewport equals one scroll unit, settling is frame independent", () => {
  assert.equal(advanceScroll(0, 721, 721), unitProgress(1));
  assert.equal(advanceScroll(0, -100, 721), 0);
  assert.equal(advanceScroll(1, 100, 721), 1);
  const target = advanceScroll(0, 50, 721);
  let p = 0;
  for (let i = 0; i < 300; i++) p = followScroll(p, target, 16);
  assert.ok(Math.abs(p - target) < 1e-10 && p > 0);
  assert.ok(Math.abs(followScroll(followScroll(0, .5, 16), .5, 16) - followScroll(0, .5, 32)) < 1e-10);
});

test("opening keeps warm orb left through cards, then reveals a separate cold orb on the right", () => {
  const start = openingMotion(0, 1281 / 721);
  const rising = openingMotion(unitProgress(.5), 1281 / 721);
  assert.ok(rising.warm.y < start.warm.y);
  const manifesto = openingMotion(unitProgress(2), 1281 / 721);
  const cards = openingMotion(unitProgress(4), 1281 / 721);
  assert.deepEqual(manifesto.warm, cards.warm);
  const transition = openingMotion(unitProgress(5.5), 1281 / 721);
  assert.ok(transition.cold.x > .6 && transition.warm.x < .2);
  assert.ok(transition.boundary > 0 && transition.boundary < 1);
  assert.ok(transition.boundary > .70 && transition.boundary < .80);
  assert.ok(transition.cold.y > .6 && transition.cold.y < .65);
  assert.ok(openingMotion(unitProgress(5), 1281 / 721).boundary > .24);
  assert.ok(openingMotion(unitProgress(4), 1.5).boundary < 0);
  assert.ok(openingMotion(unitProgress(6.5), 1.5).boundary > 1);
  assert.equal(openingTextMotion(unitProgress(3), 721).gateway, 360.5);
});

test("warm sphere shell preserves geometry rather than deforming with scroll or time", () => {
  assert.match(shellVertexShader, /modelViewMatrix\s*\*\s*vec4\(position,\s*1\.0\)/);
  assert.doesNotMatch(shellVertexShader, /uDeform|uTime|sin\(|cos\(/);
});

test("folder cards enter from below, settle together, and obey reduced motion", () => {
  for (let index = 0; index < 3; index++) {
    assert.ok(gatewayCardMotion(unitProgress(2), index).offset > 300);
    assert.deepEqual(gatewayCardMotion(unitProgress(3), index), { offset: 0, scale: 1 });
    assert.ok(gatewayCardMotion(unitProgress(4), index).offset < -700);
    assert.deepEqual(gatewayCardMotion(unitProgress(2.8), index, true), { offset: 0, scale: 1 });
    let previous = Infinity;
    for (let p = unitProgress(2); p < unitProgress(3); p += 0.001) {
      const track = gatewayCardMotion(p, index);
      assert.ok(track.offset <= previous && track.offset >= 0);
      assert.ok(track.scale >= 0.8 && track.scale <= 1);
      previous = track.offset;
    }
  }
  assert.equal(warmSceneOpacity(unitProgress(2)), 1);
  assert.equal(warmSceneOpacity(unitProgress(4)), 1);
  assert.equal(warmSceneOpacity(unitProgress(6.5)), 0);
});

test("loader reports completed tasks, not elapsed time", () => {
  assert.equal(loadingProgress({ canvas: 0, font: 0, brand: 0 }), 0);
  assert.equal(loadingProgress({ canvas: 0.7, font: 1, brand: 1 }), 79);
  assert.equal(loadingComplete({ canvas: 0.99, font: 1, brand: 1 }), false);
  assert.equal(loadingProgress({ canvas: 1, font: 1, brand: 1 }), 100);
  assert.equal(loadingComplete({ canvas: 1, font: 1, brand: 1 }), true);
  assert.equal(LOAD_TIMEOUT_MS, 10000);
});

test("particle buffers are deterministic and finite, with bounded radii", () => {
  for (const outside of [false, true]) {
    const data = createIntroParticles(2000, outside);
    assert.deepEqual(data, createIntroParticles(2000, outside));
    assert.equal(data.positions.length, 6000);
    for (let i = 0; i < 2000; i++) {
      const radius = Math.hypot(...data.positions.slice(i * 3, i * 3 + 3));
      assert.ok(Number.isFinite(radius));
      assert.ok(outside ? radius >= 1.479 && radius <= 2.161 : radius <= 1.251);
      assert.ok(data.sizes[i] > 0 && data.sizes[i] < 4);
      assert.ok(data.seeds[i] >= 0 && data.seeds[i] <= 1);
    }
  }
});

test("all anchors and intermediate positions have valid timeline segments", () => {
  assert.equal(clampProgress(-1), 0);
  assert.equal(clampProgress(2), 1);
  experienceScenes.forEach((scene, index) => assert.equal(getNearestSceneIndex(scene.anchor), index));
  for (let p = 0; p <= 1; p += 0.001) {
    const { from, to, mix } = getSceneSegment(p);
    assert.ok(mix >= 0 && mix <= 1);
    assert.ok(from.anchor <= p && to.anchor >= p);
  }
});
