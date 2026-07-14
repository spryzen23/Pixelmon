import {
  isPrimaryWalking,
  matchesCategory,
  resolveAnimationClip,
  resolveActionClip,
  shouldUseNativeLocomotionClip,
} from "./animationUtils";

const playerClips = [
  "Walking",
  "House",
  "YoTeEligo",
  "Rapping",
  "HipHop",
  "Salsa",
  "Singing",
  "Fight",
  "Talking",
  "HipHop2",
];

test("resolveAnimationClip picks Walking for Walk action", () => {
  expect(
    resolveAnimationClip(playerClips, "Walk", ["Run", "Walk", "Idle"])
  ).toBe("Walking");
});

test("resolveAnimationClip prefers Run for Run action", () => {
  expect(resolveAnimationClip(["Walking", "Run", "Idle"], "Run", "Idle")).toBe(
    "Run"
  );
});

test("resolveAnimationClip picks Jump for Jump action", () => {
  expect(resolveAnimationClip(["Idle", "Jump", "Run"], "Jump", "Idle")).toBe(
    "Jump"
  );
});

test("resolveAnimationClip picks Walking for Idle when no Idle clip exists", () => {
  expect(resolveAnimationClip(playerClips, "Idle", ["Idle", "Walk"])).toBe(
    "Walking"
  );
});

test("resolveAnimationClip returns null when no clip matches intent", () => {
  expect(resolveAnimationClip(["Chariard_dizzy"], "Walk", "Idle")).toBeNull();
});

test("shouldUseNativeLocomotionClip rejects emote clips", () => {
  expect(shouldUseNativeLocomotionClip("House")).toBe(false);
  expect(shouldUseNativeLocomotionClip("HipHop")).toBe(false);
});

test("shouldUseNativeLocomotionClip accepts gerund locomotion clips", () => {
  expect(shouldUseNativeLocomotionClip("Walking")).toBe(true);
  expect(shouldUseNativeLocomotionClip("Running")).toBe(true);
});

test("shouldUseNativeLocomotionClip accepts real locomotion names", () => {
  expect(shouldUseNativeLocomotionClip("Idle")).toBe(true);
  expect(shouldUseNativeLocomotionClip("Walk")).toBe(true);
  expect(shouldUseNativeLocomotionClip("Jump")).toBe(true);
  expect(shouldUseNativeLocomotionClip("AshArmature|AshWalk")).toBe(true);
});

test("isPrimaryWalking ignores fallback action names", () => {
  expect(isPrimaryWalking("Idle")).toBe(false);
  expect(isPrimaryWalking("Walk")).toBe(true);
});

test("matchesCategory detects wing and fin bones", () => {
  expect(matchesCategory("LeftWing", "wing")).toBe(true);
  expect(matchesCategory("TailFin", "fin")).toBe(true);
  expect(matchesCategory("Antenna_L", "antenna")).toBe(true);
});

test("resolveActionClip finds flee clips", () => {
  expect(resolveActionClip(["Idle", "Flee_Run"], ["flee"])).toBe("Flee_Run");
});

test("resolveAnimationClip matches custom prefixed animation clips", () => {
  const customClips = ["pm0023_00_idle", "pm0023_00_walk", "pm0023_00_run"];
  expect(resolveAnimationClip(customClips, "Idle", ["Walk"])).toBe(
    "pm0023_00_idle"
  );
  expect(resolveAnimationClip(customClips, "Walk", ["Idle"])).toBe(
    "pm0023_00_walk"
  );
});
