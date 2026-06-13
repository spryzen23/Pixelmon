import { getFantasyPropDef } from './fantasyAssets';

export const VILLAGE_CENTER_X = 0;
export const VILLAGE_CENTER_Z = -22;
export const VILLAGE_HALF_SIZE = 13;

/** @typedef {{ propKey: string, x: number, z: number, rotationY?: number, scale?: number }} FantasyPlacementSpec */

/** Fixed village props in world coordinates (south of spawn). */
export const FANTASY_VILLAGE_PLACEMENTS = [
  // Ground / roads
  { propKey: 'ground_road', x: 0, z: -14, rotationY: 0, scale: 1.1 },
  { propKey: 'ground_road', x: 0, z: -18, rotationY: 0, scale: 1.0 },
  { propKey: 'ground_road', x: 0, z: -22, rotationY: 0, scale: 1.0 },
  { propKey: 'ground_road', x: 0, z: -26, rotationY: 0, scale: 1.0 },
  { propKey: 'ground_grass', x: -4, z: -20, rotationY: 0.2, scale: 0.9 },
  { propKey: 'ground_grass', x: 4, z: -20, rotationY: -0.3, scale: 0.9 },
  { propKey: 'ground_grass', x: -5, z: -24, rotationY: 0.5, scale: 0.85 },
  { propKey: 'ground_grass', x: 5, z: -24, rotationY: -0.4, scale: 0.85 },
  { propKey: 'ground_soil', x: -6, z: -22, rotationY: 0, scale: 0.8 },

  // Windmill north of village (toward spawn)
  { propKey: 'windmill', x: 8, z: -10, rotationY: -0.4, scale: 0.44 },
  { propKey: 'windmill_blade', x: 8, z: -10, rotationY: -0.4, scale: 0.44 },

  // North wall + gate (spawn side)
  { propKey: 'wall_part1', x: -8, z: -10, rotationY: Math.PI / 2, scale: 0.44 },
  { propKey: 'wall_part1', x: 8, z: -10, rotationY: -Math.PI / 2, scale: 0.44 },
  { propKey: 'wall_gate_l', x: -2.2, z: -10, rotationY: 0, scale: 0.44 },
  { propKey: 'wall_gate_r', x: 2.2, z: -10, rotationY: 0, scale: 0.44 },
  { propKey: 'wall_entrance', x: 0, z: -10.2, rotationY: 0, scale: 0.44 },
  { propKey: 'wall_tower1', x: -11, z: -10, rotationY: 0, scale: 0.44 },
  { propKey: 'wall_tower2', x: 11, z: -10, rotationY: 0, scale: 0.44 },

  // East wall
  { propKey: 'wall_part2', x: 12, z: -16, rotationY: 0, scale: 0.44 },
  { propKey: 'wall_part2', x: 12, z: -22, rotationY: 0, scale: 0.44 },
  { propKey: 'wall_part2', x: 12, z: -28, rotationY: 0, scale: 0.44 },
  { propKey: 'wall_corner', x: 12, z: -34, rotationY: 0, scale: 0.44 },

  // West wall
  { propKey: 'wall_part2', x: -12, z: -16, rotationY: Math.PI, scale: 0.44 },
  { propKey: 'wall_part2', x: -12, z: -22, rotationY: Math.PI, scale: 0.44 },
  { propKey: 'wall_part2', x: -12, z: -28, rotationY: Math.PI, scale: 0.44 },
  { propKey: 'wall_corner', x: -12, z: -34, rotationY: Math.PI, scale: 0.44 },

  // South wall
  { propKey: 'wall_part1', x: -8, z: -34, rotationY: -Math.PI / 2, scale: 0.44 },
  { propKey: 'wall_part1', x: 0, z: -34, rotationY: Math.PI, scale: 0.44 },
  { propKey: 'wall_part1', x: 8, z: -34, rotationY: Math.PI / 2, scale: 0.44 },
  { propKey: 'wall_tower1', x: -11, z: -34, rotationY: Math.PI, scale: 0.44 },
  { propKey: 'wall_tower2', x: 11, z: -34, rotationY: Math.PI, scale: 0.44 },
  { propKey: 'wall_props', x: -5, z: -33.5, rotationY: 0.3, scale: 0.44 },

  // Wooden wall accents (inner ring)
  { propKey: 'wooden_wall_1', x: -9, z: -12, rotationY: Math.PI / 2, scale: 0.44 },
  { propKey: 'wooden_wall_2', x: 9, z: -12, rotationY: -Math.PI / 2, scale: 0.44 },
  { propKey: 'wooden_wall_corner', x: -9, z: -32, rotationY: 0, scale: 0.44 },
  { propKey: 'wooden_wall_corner', x: 9, z: -32, rotationY: Math.PI, scale: 0.44 },
  { propKey: 'wooden_wall_towers', x: -10, z: -22, rotationY: Math.PI / 2, scale: 0.44 },
  { propKey: 'wooden_wall_towers', x: 10, z: -22, rotationY: -Math.PI / 2, scale: 0.44 },

  // Buildings
  { propKey: 'tavern', x: -6, z: -24, rotationY: 0.15, scale: 0.44 },
  { propKey: 'wooden_house_1', x: 6, z: -24, rotationY: -0.2, scale: 0.44 },
  { propKey: 'wooden_house_2', x: -6, z: -30, rotationY: 0.1, scale: 0.44 },
  { propKey: 'wooden_house_3', x: 6, z: -30, rotationY: -0.15, scale: 0.44 },
  { propKey: 'house1', x: -14, z: -18, rotationY: 0.5, scale: 0.4 },
  { propKey: 'house2', x: 14, z: -26, rotationY: -0.6, scale: 0.4 },
  { propKey: 'house3', x: -14, z: -28, rotationY: 0.3, scale: 0.4 },

  // Market square
  { propKey: 'cart1', x: -2, z: -18, rotationY: 0.4, scale: 0.44 },
  { propKey: 'cart2', x: 2, z: -18, rotationY: -0.3, scale: 0.44 },
  { propKey: 'cart3', x: -3, z: -20, rotationY: 0.8, scale: 0.44 },
  { propKey: 'cart4', x: 3, z: -20, rotationY: -0.5, scale: 0.44 },
  { propKey: 'storage_barrel', x: -4, z: -17, rotationY: 0, scale: 0.44 },
  { propKey: 'storage_barrel', x: 4, z: -17, rotationY: 0.2, scale: 0.44 },
  { propKey: 'storage_barrel_drink', x: -5, z: -19, rotationY: 0, scale: 0.44 },
  { propKey: 'storage_basket', x: 5, z: -19, rotationY: 0, scale: 0.44 },
  { propKey: 'storage_bag', x: 1, z: -21, rotationY: 0.1, scale: 0.44 },
  { propKey: 'furniture_table', x: 0, z: -19, rotationY: 0, scale: 0.44 },
  { propKey: 'furniture_table_round', x: -1.5, z: -21, rotationY: 0.2, scale: 0.44 },
  { propKey: 'furniture_chair1', x: -2.5, z: -19, rotationY: 0.5, scale: 0.44 },
  { propKey: 'furniture_chair2', x: 2.5, z: -19, rotationY: -0.5, scale: 0.44 },
  { propKey: 'food_apple', x: 0.3, z: -19.2, rotationY: 0, scale: 0.44 },
  { propKey: 'food_bread', x: -0.3, z: -19.2, rotationY: 0.2, scale: 0.44 },
  { propKey: 'food_corn', x: 0, z: -18.7, rotationY: 0, scale: 0.44 },

  // Tavern interior props (near tavern)
  { propKey: 'tavern_chandelier', x: -6, z: -23, rotationY: 0, scale: 0.44 },
  { propKey: 'furniture_candlestick', x: -5.2, z: -23.5, rotationY: 0, scale: 0.44 },
  { propKey: 'furniture_scroll', x: -6.8, z: -23.5, rotationY: 0.3, scale: 0.44 },
];

export function isInsideVillageBounds(x, z, padding = 1.5) {
  return (
    Math.abs(x - VILLAGE_CENTER_X) <= VILLAGE_HALF_SIZE + padding &&
    Math.abs(z - VILLAGE_CENTER_Z) <= VILLAGE_HALF_SIZE + padding
  );
}

export function buildFantasyPlacementKey(propKey, x, z) {
  return `fantasy-${propKey}-${x.toFixed(2)}-${z.toFixed(2)}`;
}

export function resolveFantasyPlacement(spec, surfaceY) {
  const def = getFantasyPropDef(spec.propKey);

  if (!def) {
    return null;
  }

  const scale = spec.scale ?? def.defaultScale;

  return {
    key: buildFantasyPlacementKey(spec.propKey, spec.x, spec.z),
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

export function getFantasyVillagePlacementCount() {
  return FANTASY_VILLAGE_PLACEMENTS.length;
}

export function getFantasyVillagePlacementKeys() {
  return FANTASY_VILLAGE_PLACEMENTS.map((spec) =>
    buildFantasyPlacementKey(spec.propKey, spec.x, spec.z)
  );
}
