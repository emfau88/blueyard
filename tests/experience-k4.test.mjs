import assert from "node:assert/strict";
import { test } from "node:test";
import { Matrix4, Quaternion, Euler, Vector3, PerspectiveCamera, OrthographicCamera, Raycaster, Sphere } from "three";
import { initialExperienceFrame, pointerInViewport } from "../lib/experience-input.ts";
import { intersectParticleRay, projectParticlePointer, createParticleInteractionState,
  sampleParticleInteraction, PARTICLE_SHELL_RADIUS, PARTICLE_HALO_RADIUS, MAX_PARTICLE_POINTER_SPEED } from "../lib/particle-interaction.ts";

const close = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const closePoint = (a, b) => a.forEach((value, index) => close(value, b[index]));
const pose = (position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) =>
  new Matrix4().compose(new Vector3(...position), new Quaternion().setFromEuler(new Euler(...rotation)), new Vector3(...scale));
function scene(world = pose(), camera = new PerspectiveCamera(32, 1.6, .1, 100)) {
  if (camera.position.length() === 0) camera.position.set(0, 0, 5.15);
  camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
  return { camera, world, projection: { inverseProjection: camera.projectionMatrixInverse.elements,
    cameraWorld: camera.matrixWorld.elements, inverseWorld: world.clone().invert().elements } };
}
const options = { mouse: true, scroll: true, flow: true, freeze: false, visible: true, width: 1440, height: 900 };
const frame = (id, x = 0, overrides = {}) => ({ ...initialExperienceFrame(), id, delta: .016, intervalMs: 16,
  pointer: { x, y: 0, active: true, velocityX: 0, velocityY: 0 }, ...overrides });

test("particle picking returns the front shell, soft halo, and no hit behind or outside", () => {
  closePoint(intersectParticleRay([0, 0, 5], [0, 0, -3]).point, [0, 0, PARTICLE_SHELL_RADIUS]);
  assert.equal(intersectParticleRay([1.8, 0, 5], [0, 0, -1]).region, "halo");
  assert.equal(intersectParticleRay([3, 0, 5], [0, 0, -1]).region, "none");
  assert.equal(intersectParticleRay([0, 0, 5], [0, 0, 1]).region, "none");
  for (const [origin, direction] of [[[NaN, 0, 0], [0, 0, -1]], [[0, 0, 5], [0, 0, 0]]]) {
    assert.equal(intersectParticleRay(origin, direction).influence, 0);
  }
});

test("halo influence and hit position meet continuously at the shell limb and fade to zero", () => {
  const below = intersectParticleRay([PARTICLE_SHELL_RADIUS - 1e-8, 0, 5], [0, 0, -1]);
  const above = intersectParticleRay([PARTICLE_SHELL_RADIUS + 1e-8, 0, 5], [0, 0, -1]);
  assert.ok(Math.hypot(...below.point.map((v, i) => v - above.point[i])) < .001);
  close(above.influence, 1);
  let previous = 1;
  for (let r = PARTICLE_SHELL_RADIUS; r <= PARTICLE_HALO_RADIUS + .01; r += .005) {
    const hit = intersectParticleRay([r, 0, 5], [0, 0, -1]);
    assert.ok(hit.point.every(Number.isFinite));
    assert.ok(hit.influence >= 0 && hit.influence <= previous);
    previous = hit.influence;
  }
  close(intersectParticleRay([PARTICLE_HALO_RADIUS - 1e-6, 0, 5], [0, 0, -1]).influence, 0);
});

test("projection matches Three's analytic ray under translation, rotation, scaling and camera changes", () => {
  const cameras = [new PerspectiveCamera(32, 1.6, .1, 100), new PerspectiveCamera(51, .5, .2, 80),
    new OrthographicCamera(-3, 3, 2, -2, .1, 100)];
  for (const camera of cameras) {
    camera.position.set(3, 2, 8); camera.lookAt(.3, -.2, 0);
    for (const world of [pose(), pose([.3, -.2, 0], [.4, .6, -.2], [.8, 1.2, .7])]) {
      const setup = scene(world, camera);
      const localFront = camera.position.clone().applyMatrix4(world.clone().invert()).normalize().multiplyScalar(PARTICLE_SHELL_RADIUS);
      const ndc = localFront.clone().applyMatrix4(world).project(camera);
      const raycaster = new Raycaster(); raycaster.setFromCamera(ndc, camera);
      const expected = raycaster.ray.clone().applyMatrix4(world.clone().invert()).intersectSphere(new Sphere(new Vector3(), PARTICLE_SHELL_RADIUS), new Vector3());
      const hit = projectParticlePointer(ndc.x, ndc.y, setup.projection);
      assert.equal(hit.region, "shell");
      closePoint(hit.point, expected.toArray()); closePoint(hit.point, localFront.toArray());
      const back = new Vector3(...hit.point).applyMatrix4(world).project(camera);
      close(back.x, ndc.x); close(back.y, ndc.y);
    }
  }
});

test("screen picking is independent of framebuffer DPR and rejects invalid projection matrices", () => {
  const setup = scene();
  const ndc = pointerInViewport(760, 420, 1440, 900);
  const hit = projectParticlePointer(ndc.x, ndc.y, setup.projection);
  for (const dpr of [1, 1.35, 2, 3]) {
    const physical = pointerInViewport(760 * dpr, 420 * dpr, 1440 * dpr, 900 * dpr);
    closePoint(projectParticlePointer(physical.x, physical.y, setup.projection).point, hit.point);
  }
  assert.equal(projectParticlePointer(0, 0, { ...setup.projection, inverseWorld: new Array(16).fill(0) }).region, "none");
});

test("stationary screen pointer never acquires mouse velocity from scrolling or a moving camera/group", () => {
  const state = createParticleInteractionState();
  sampleParticleInteraction(state, frame(1), scene().projection, options);
  for (const [index, world] of [pose([.1, 0, 0]), pose([.2, .1, 0], [.2, .4, 0], [1.1, .9, 1])].entries()) {
    const sample = sampleParticleInteraction(state, frame(index + 2, 0, { scrollVelocity: index ? -4 : 3 }), scene(world).projection, options);
    assert.ok(sample.pointer.influence > 0); closePoint(sample.pointer.velocity, [0, 0, 0]);
    assert.equal(sample.scrollVelocity, index ? -4 : 3);
  }
  const camera = new PerspectiveCamera(40, 1.6, .1, 100); camera.position.set(.2, .1, 6); camera.lookAt(0, 0, 0);
  closePoint(sampleParticleInteraction(state, frame(4), scene(pose(), camera).projection, options).pointer.velocity, [0, 0, 0]);
});

test("actual pointer displacement is measured under the current pose and large/grazing steps are bounded", () => {
  const state = createParticleInteractionState();
  sampleParticleInteraction(state, frame(1, -.02), scene().projection, options);
  const current = scene(pose([.15, 0, 0], [.1, .2, 0], [.9, 1.1, 1]));
  const sample = sampleParticleInteraction(state, frame(2, .02), current.projection, options);
  const previousHit = projectParticlePointer(-.02, 0, current.projection);
  const currentHit = projectParticlePointer(.02, 0, current.projection);
  closePoint(sample.pointer.velocity, currentHit.point.map((v, i) => (v - previousHit.point[i]) / .016));
  assert.ok(Math.hypot(...sample.pointer.velocity) > 0);
  const fast = sampleParticleInteraction(state, frame(3, .55, { delta: .001, intervalMs: 1 }), current.projection, options);
  assert.ok(Math.hypot(...fast.pointer.velocity) <= MAX_PARTICLE_POINTER_SPEED + 1e-8);
});

test("particle mouse, scroll and flow channels are independent and freeze/reduced motion gate forces", () => {
  for (const changed of [{ mouse: false }, { scroll: false }, { flow: false }, { freeze: true }, { visible: false }]) {
    const settings = { ...options, ...changed };
    const state = createParticleInteractionState();
    sampleParticleInteraction(state, frame(1, -.02), scene().projection, settings);
    const result = sampleParticleInteraction(state, frame(2, .02, { scrollVelocity: 3 }), scene().projection, settings);
    if (settings.freeze || !settings.visible) {
      assert.equal(result.scrollVelocity, 0); assert.equal(result.pointer.influence, 0);
    } else {
      assert.equal(result.scrollVelocity, settings.scroll ? 3 : 0);
      assert.equal(result.pointer.influence, settings.mouse ? 1 : 0);
    }
    assert.equal(result.flowEnabled, settings.flow && settings.visible);
  }
  const reduced = sampleParticleInteraction(createParticleInteractionState(), frame(1, 0, { reducedMotion: true, scrollVelocity: 4 }), scene().projection, options);
  assert.equal(reduced.pointer.influence, 0); assert.equal(reduced.scrollVelocity, 0); assert.equal(reduced.flowEnabled, false);
  const inactive = sampleParticleInteraction(createParticleInteractionState(), frame(1, 0, {
    pointer: { x: 0, y: 0, active: false, velocityX: 0, velocityY: 0 }, scrollVelocity: 4 }), scene().projection, options);
  assert.equal(inactive.pointer.influence, 0); assert.equal(inactive.scrollVelocity, 4);
});

test("re-entry, resize, pause and toggling the mouse channel rebase without an impulse spike", () => {
  const projection = scene().projection;
  for (const interruption of [
    [frame(2, .02, { pointer: { x: .02, y: 0, active: false, velocityX: 0, velocityY: 0 } }), options],
    [frame(2, .02, { delta: 0, intervalMs: 5000 }), options],
    [frame(2, .02), { ...options, freeze: true }],
    [frame(2, .02), { ...options, mouse: false }],
    [frame(2, .02), { ...options, width: 390, height: 844 }],
    [frame(2, 2), options],
  ]) {
    const state = createParticleInteractionState();
    sampleParticleInteraction(state, frame(1), projection, options);
    closePoint(sampleParticleInteraction(state, interruption[0], projection, interruption[1]).pointer.velocity, [0, 0, 0]);
    const result = sampleParticleInteraction(state, frame(3, .04), projection, options);
    closePoint(result.pointer.velocity, [0, 0, 0]);
    assert.ok(sampleParticleInteraction(state, frame(4, .05), projection, options).pointer.velocity[0] > 0);
  }
  // Real UI resize invalidates stale screen coordinates until a new event.
  const state = createParticleInteractionState();
  sampleParticleInteraction(state, frame(1), projection, options);
  const resized = { ...options, width: 390, height: 844 };
  for (let id = 2; id < 5; id++) {
    sampleParticleInteraction(state, frame(id, 0, { pointer: { x: 0, y: 0, active: false, velocityX: 0, velocityY: 0 } }), projection, resized);
  }
  closePoint(sampleParticleInteraction(state, frame(5, .1), projection, resized).pointer.velocity, [0, 0, 0]);
  assert.ok(sampleParticleInteraction(state, frame(6, .11), projection, resized).pointer.velocity[0] > 0);
});
