import { getVillagePropDef } from "./villageAssets";

export const VILLAGE_CENTER_X = 0;
export const VILLAGE_CENTER_Z = -22;
export const VILLAGE_HALF_SIZE = 13;

/** @typedef {{ propKey: string, x: number, z: number, rotationY?: number, scale?: number }} VillagePlacementSpec */

export function isInsideVillageBounds(x, z, padding = 1.5) {
  return (
    Math.abs(x - VILLAGE_CENTER_X) <= VILLAGE_HALF_SIZE + padding &&
    Math.abs(z - VILLAGE_CENTER_Z) <= VILLAGE_HALF_SIZE + padding
  );
}

export function buildVillagePlacementKey(propKey, x, z) {
  return `village-${propKey}-${x.toFixed(2)}-${z.toFixed(2)}`;
}

export function resolveVillagePlacement(spec, surfaceY) {
  const def = getVillagePropDef(spec.propKey);

  if (!def) {
    return null;
  }

  const scale = spec.scale ?? def.defaultScale;

  return {
    key: buildVillagePlacementKey(spec.propKey, spec.x, spec.z),
    propKey: spec.propKey,
    nodeName: def.nodeName,
    x: spec.x,
    z: spec.z,
    surfaceY,
    rotationY: spec.rotationY ?? 0,
    scale,
    collisionRadius: def.collisionRadius,
  };
}
