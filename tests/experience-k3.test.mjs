import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { liquidTransition, liquidFieldShader } from "../lib/liquid-transition.ts";
import { initialExperienceFrame } from "../lib/experience-input.ts";

const base = { ...initialExperienceFrame(.28), id: 2, time: 20, delta: .016 };
test("liquid endpoints are exact identities with bounded, continuous activation", () => {
  for (const edge of [-.3, -.18, 1.18, 1.4]) {
    const value = liquidTransition(base, edge, false);
    assert.equal(value.envelope, 0);
    assert.equal(value.strength, 0);
  }
  let previous = 0;
  for (let edge = -.18; edge <= 1.18; edge += .001) {
    const value = liquidTransition(base, edge, false);
    assert.ok(value.envelope >= 0 && value.envelope <= 1);
    assert.ok(value.strength >= 0 && value.strength <= .12);
    assert.ok(Math.abs(value.strength - previous) < .001);
    previous = value.strength;
  }
});

test("macro band position and width do not depend on elapsed time or input velocity", () => {
  const a = liquidTransition(base, .5, false);
  const b = liquidTransition({ ...base, time: 500, scrollVelocity: 30 }, .5, false);
  assert.equal(a.envelope, b.envelope);
  assert.equal(a.width, b.width);
  assert.equal(a.strength, b.strength);
  const edgeCode = liquidFieldShader.split("float liquidEdge")[1].split("// x/y")[0];
  assert.doesNotMatch(edgeCode, /uTime|uImpulse|uPointer/);
});

test("forward/reverse impulses remain signed and bounded; no pointer impulse when inactive", () => {
  for (const v of [-10000, -30, -1, 0, 1, 30, 10000]) {
    const value = liquidTransition({ ...base, scrollVelocity: v }, .5, false);
    assert.ok(Math.abs(value.scrollImpulse) <= 1);
    assert.equal(Math.sign(value.scrollImpulse), Math.sign(v));
  }
  const value = liquidTransition({ ...base, pointer: { x: .5, y: -.5, active: false, velocityX: 8, velocityY: -8 } }, .5, false);
  assert.equal(value.pointerVelocityX, 0);
  assert.equal(value.pointerVelocityY, 0);
  assert.equal(value.pointerX, .75);
  assert.equal(value.pointerY, .25);
});

test("reduced and neutral modes disable refraction; mobile reduces cost and displacement", () => {
  for (const [frame, neutral] of [[{ ...base, reducedMotion: true }, false], [base, true]]) {
    const value = liquidTransition(frame, .5, false, neutral);
    assert.equal(value.strength, 0);
    assert.equal(value.envelope, 0);
    assert.equal(value.scrollImpulse, 0);
  }
  const mobile = liquidTransition(base, .5, true);
  assert.equal(mobile.detail, 0);
  assert.ok(mobile.strength < liquidTransition(base, .5, false).strength);
  assert.ok(mobile.width < liquidTransition(base, .5, false).width);
});

test("both full images are sampled at displaced coordinates with one shared visibility field", () => {
  const source = readFileSync(new URL("../lib/world-composite-shaders.ts", import.meta.url), "utf8");
  assert.match(source, /liquidSampleUV\(vUv \+ field\.xy\)/);
  assert.match(source, /liquidSampleUV\(vUv - field\.xy/);
  assert.match(source, /texture2D\(uWorldA, aUV\)/);
  assert.match(source, /texture2D\(uWorldB, bUV\)/);
  assert.match(source, /smoothstep\(-feather, feather, field\.z\)/);
  assert.match(source, /uBoundary <= -\.18/);
  assert.match(source, /uBoundary >= 1\.18/);
  assert.match(liquidFieldShader, /clamp\(1\. - abs\(1\. - mod/);
});
