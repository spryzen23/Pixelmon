import { Vector3 } from "three";
import {
  WILD_CREATURE_HEIGHT,
  getEntityY,
  getRandomGrassPosition,
  isWalkablePosition,
} from "./world";

export const ALPHA_SPAWN_RADIUS = 1.4;
export const ALPHA_SPAWN_DISTANCES = [16, 18, 20, 22, 24, 14, 12];

const alphaForward = new Vector3();
const alphaSpawnTarget = new Vector3();

/**
 * Place alpha spawn in front of the player/camera (master GameScene behavior).
 * @returns {[number, number, number]} world position
 */
export function getAlphaSpawnPosition(
  player,
  camera,
  currentBiome,
  caveZone = null,
  deps = {}
) {
  const walkable = deps.isWalkablePosition || isWalkablePosition;
  const entityY = deps.getEntityY || getEntityY;
  const randomGrass = deps.getRandomGrassPosition || getRandomGrassPosition;
  const distances = deps.distances || ALPHA_SPAWN_DISTANCES;
  const radius = deps.radius ?? ALPHA_SPAWN_RADIUS;

  camera.getWorldDirection(alphaForward);
  alphaForward.y = 0;

  if (alphaForward.lengthSq() < 0.0001) {
    alphaForward.set(
      Math.sin(player.rotation.y),
      0,
      Math.cos(player.rotation.y)
    );
  }

  alphaForward.normalize();

  for (const distance of distances) {
    alphaSpawnTarget.set(
      player.position.x + alphaForward.x * distance,
      0,
      player.position.z + alphaForward.z * distance
    );

    if (
      walkable(
        alphaSpawnTarget.x,
        alphaSpawnTarget.z,
        radius,
        currentBiome,
        caveZone
      )
    ) {
      return [
        alphaSpawnTarget.x,
        entityY(
          alphaSpawnTarget.x,
          alphaSpawnTarget.z,
          WILD_CREATURE_HEIGHT,
          undefined,
          currentBiome,
          caveZone
        ),
        alphaSpawnTarget.z,
      ];
    }
  }

  return randomGrass(
    radius,
    WILD_CREATURE_HEIGHT,
    player.position.x + alphaForward.x * distances[0],
    player.position.z + alphaForward.z * distances[0],
    8,
    currentBiome,
    caveZone
  );
}

/** @internal for tests */
export function _resetSpawnVectors() {
  alphaForward.set(0, 0, 0);
  alphaSpawnTarget.set(0, 0, 0);
}
