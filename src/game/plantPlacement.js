import { getPlantPropDef } from "./plantAssets";

/**
 * @typedef {Object} PlantPropDef
 * @property {string} nodeName
 * @property {string} file
 * @property {string} category
 * @property {number[]} biomes
 * @property {number} defaultScale
 * @property {number} collisionRadius
 * @property {string} glbUrl
 */

export function buildPlantPlacementKey(propKey, x, z) {
  return `plant-${propKey}-${x.toFixed(2)}-${z.toFixed(2)}`;
}

export function resolvePlantPlacement(spec, surfaceY) {
  const def = getPlantPropDef(spec.propKey);

  if (!def) {
    return null;
  }

  const scale = spec.scale ?? def.defaultScale;

  return {
    key: buildPlantPlacementKey(spec.propKey, spec.x, spec.z),
    propKey: spec.propKey,
    glbUrl: def.glbUrl,
    x: spec.x,
    z: spec.z,
    surfaceY,
    rotationY: spec.rotationY ?? 0,
    scale,
    collisionRadius: def.collisionRadius,
    category: def.category,
  };
}
