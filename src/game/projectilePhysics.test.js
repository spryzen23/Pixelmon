import { Vector3 } from "three";
import {
  getParallaxThrowVector,
  DEFAULT_THROW_POWER,
  MIN_THROW_POWER,
  MAX_THROW_POWER,
} from "./projectilePhysics";

describe("projectilePhysics", () => {
  it("exports throw power bounds", () => {
    expect(MIN_THROW_POWER).toBeLessThan(DEFAULT_THROW_POWER);
    expect(MAX_THROW_POWER).toBeGreaterThan(DEFAULT_THROW_POWER);
  });

  it("computes normalized throw direction from camera to target", () => {
    const camera = {
      position: new Vector3(0, 2, 5),
      getWorldDirection: (target) => target.set(0, 0, -1),
    };
    const player = {
      position: new Vector3(0, 1, 0),
      rotation: { y: 0 },
    };
    const origin = new Vector3();
    const direction = new Vector3();

    getParallaxThrowVector(camera, player, origin, direction);
    expect(Math.hypot(direction.x, direction.y, direction.z)).toBeCloseTo(1, 5);
  });
});
