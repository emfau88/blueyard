import assert from "node:assert/strict";
import { test } from "node:test";
import { SCROLL_UNITS, advanceScroll } from "../lib/opening-motion.ts";
import { experienceScenes } from "../lib/experience-scenes.ts";
import { MOBILE_SCROLL_UNITS, DESKTOP_SCROLL_UNITS, SCROLL_INPUT_SCALE, mobileScrollDistance, responsiveScrollDistance, advanceResponsiveScroll, mobileSceneTrack } from "../lib/mobile-experience.ts";

test("mobile takes half the shortened desktop input distance while retaining every canonical anchor", () => {
  assert.equal(MOBILE_SCROLL_UNITS, DESKTOP_SCROLL_UNITS / 2);
  for (const scene of experienceScenes) {
    const distance = mobileScrollDistance(scene.anchor);
    assert.ok(Math.abs(advanceResponsiveScroll(0, distance * 844, 844, true) - scene.anchor) < 1e-12);
    assert.ok(Math.abs(advanceResponsiveScroll(scene.anchor, -distance * 568, 568, true)) < 1e-12);
  }
  assert.equal(advanceResponsiveScroll(0, MOBILE_SCROLL_UNITS * 844, 844, true), 1);
  assert.equal(advanceResponsiveScroll(1, -MOBILE_SCROLL_UNITS * 844, 844, true), 0);
});

test("small mobile steps are reversible, additive and do not skip the liquid interval", () => {
  for (let p = .01; p < .99; p += .01) {
    const next = advanceResponsiveScroll(p, 2, 844, true);
    assert.ok(next > p && next - p < .001);
    assert.ok(Math.abs(advanceResponsiveScroll(next, -2, 844, true) - p) < 1e-12);
  }
  const first = advanceResponsiveScroll(0, 500, 844, true);
  assert.ok(Math.abs(advanceResponsiveScroll(first, 1500, 844, true) - advanceResponsiveScroll(0, 2000, 844, true)) < 1e-12);
  assert.equal(advanceResponsiveScroll(.5, -100000, 0, true), 0);
  assert.equal(advanceResponsiveScroll(.5, 100000, 0, true), 1);
});

test("desktop input is shortened by 25 percent without changing the canonical render mapping", () => {
  for (const p of [0, .15, .5, .9, 1]) for (const delta of [-3000, -100, 0, 10, 844, 3000]) {
    assert.equal(advanceResponsiveScroll(p, delta, 844, false), advanceScroll(p, delta / SCROLL_INPUT_SCALE, 844));
  }
});

test("M1 reduces every desktop/mobile input segment by exactly 25 percent, including liquid", () => {
  assert.equal(SCROLL_INPUT_SCALE, .75);
  assert.equal(DESKTOP_SCROLL_UNITS, 14.25); assert.equal(MOBILE_SCROLL_UNITS, 7.125);
  const originalStops = [[0, 0], [2, 1.25], [3, 2.05], [4.25, 2.65], [6.5, 4.1], [10.5, 5.75], [13.5, 7.15], [19, 9.5]];
  for (let i = 1; i < originalStops.length; i++) {
    const [t0, s0] = originalStops[i - 1], [t1, s1] = originalStops[i];
    for (const mix of [0, .25, .5, .75, 1]) {
      const p = (t0 + (t1 - t0) * mix) / SCROLL_UNITS;
      assert.ok(Math.abs(responsiveScrollDistance(p, true) - (s0 + (s1 - s0) * mix) * .75) < 1e-12);
      assert.ok(Math.abs(responsiveScrollDistance(p, false) - p * 19 * .75) < 1e-12);
    }
  }
});

test("shorter inputs preserve scene endpoints, reverse steps and additive wheel/touch distances at all test sizes", () => {
  for (const height of [568, 844, 900, 1080]) for (const mobile of [false, true]) {
    for (const scene of experienceScenes) {
      const pixels = responsiveScrollDistance(scene.anchor, mobile) * height;
      assert.ok(Math.abs(advanceResponsiveScroll(0, pixels, height, mobile) - scene.anchor) < 1e-12);
      assert.ok(Math.abs(advanceResponsiveScroll(scene.anchor, -pixels, height, mobile)) < 1e-12);
    }
    const a = advanceResponsiveScroll(.2, 20, height, mobile);
    const b = advanceResponsiveScroll(a, 30, height, mobile);
    assert.ok(Math.abs(b - advanceResponsiveScroll(.2, 50, height, mobile)) < 1e-12);
    assert.ok(Math.abs(advanceResponsiveScroll(b, -50, height, mobile) - .2) < 1e-12);
  }
});

test("later mobile scenes remain readable between anchors including the former contact gap", () => {
  for (const height of [568, 667, 844, 932]) {
    for (let units = 6.3; units <= SCROLL_UNITS; units += .025) {
      const tracks = [3, 4, 5, 6].map(index => mobileSceneTrack(units / SCROLL_UNITS, index, height));
      assert.ok(tracks.some(track => track.opacity >= .49), `Blank copy at ${units}`);
      for (const track of tracks) {
        assert.ok(track.opacity >= 0 && track.opacity <= 1);
        assert.ok(Number.isFinite(track.shift) && Math.abs(track.shift) <= height * .5);
      }
    }
    for (let index = 3; index < experienceScenes.length; index++) {
      assert.deepEqual(mobileSceneTrack(experienceScenes[index].anchor, index, height), { opacity: 1, shift: 0 });
    }
  }
});
