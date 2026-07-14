export const FANTASY_GLB_URL = "/assets/idea_glbs/fantasy_assets.glb";

export const FANTASY_BIOME_ID = 6;

export const FANTASY_COLLISION = {
  small: 0.35,
  plant: 0.5,
  tree: 1.1,
  rock: 0.7,
  cart: 1.0,
  wall: 0.9,
  house: 2.4,
  tavern: 3.0,
  windmill: 2.8,
  ground: 0.2,
};

/** Logical prop key → GLB node name and spawn metadata. */
export const FANTASY_PROP_DEFS = {
  oak_tree1: {
    nodeName: "Oak_tree1",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  oak_tree2: {
    nodeName: "Oak_tree2",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  birch_tree1: {
    nodeName: "Birch_tree1",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  birch_tree2: {
    nodeName: "Birch_tree2",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  willow_tree1: {
    nodeName: "Willow_tree1",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  willow_tree2: {
    nodeName: "Willow_tree2",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  pine_tree1: {
    nodeName: "Pine_tree1",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  deciduous_tree1: {
    nodeName: "Deciduous_tree1",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  deciduous_tree2: {
    nodeName: "Deciduous_tree2",
    category: "tree",
    defaultScale: 0.55,
    collisionRadius: FANTASY_COLLISION.tree,
  },
  bush1: {
    nodeName: "Bush1",
    category: "plant",
    defaultScale: 0.45,
    collisionRadius: FANTASY_COLLISION.plant,
  },
  fern1: {
    nodeName: "Fern1",
    category: "plant",
    defaultScale: 0.4,
    collisionRadius: FANTASY_COLLISION.small,
  },
  fern2: {
    nodeName: "Fern2",
    category: "plant",
    defaultScale: 0.4,
    collisionRadius: FANTASY_COLLISION.small,
  },
  flower1: {
    nodeName: "Flower1",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  flower2: {
    nodeName: "Flower2",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  flower3: {
    nodeName: "Flower3",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  flower4: {
    nodeName: "Flower4",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  flower5: {
    nodeName: "Flower5",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  grass1: {
    nodeName: "Grass1",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  grass2: {
    nodeName: "Grass2",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  grass3: {
    nodeName: "Grass3",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  mushroom1: {
    nodeName: "Mushroom1",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  mushroom2: {
    nodeName: "Mushroom2",
    category: "plant",
    defaultScale: 0.35,
    collisionRadius: FANTASY_COLLISION.small,
  },
  sunflower: {
    nodeName: "Sunflower",
    category: "plant",
    defaultScale: 0.4,
    collisionRadius: FANTASY_COLLISION.small,
  },
  rock1: {
    nodeName: "Rock1",
    category: "rock",
    defaultScale: 0.5,
    collisionRadius: FANTASY_COLLISION.rock,
  },
  rock2: {
    nodeName: "Rock2",
    category: "rock",
    defaultScale: 0.5,
    collisionRadius: FANTASY_COLLISION.rock,
  },
  rock3: {
    nodeName: "Rock3",
    category: "rock",
    defaultScale: 0.5,
    collisionRadius: FANTASY_COLLISION.rock,
  },
  stone1: {
    nodeName: "Stone1_LOD0",
    category: "rock",
    defaultScale: 0.45,
    collisionRadius: FANTASY_COLLISION.rock,
  },
  stone2: {
    nodeName: "Stone2_LOD0",
    category: "rock",
    defaultScale: 0.45,
    collisionRadius: FANTASY_COLLISION.rock,
  },
  tavern: {
    nodeName: "Tavern_LOD0",
    category: "building",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.tavern,
  },
  wooden_house_1: {
    nodeName: "WoodenHouse_1_LOD0",
    category: "building",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.house,
  },
  wooden_house_2: {
    nodeName: "WoodenHouse_2_LOD0",
    category: "building",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.house,
  },
  wooden_house_3: {
    nodeName: "WoodenHouse_3_LOD0",
    category: "building",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.house,
  },
  house1: {
    nodeName: "House1",
    category: "building",
    defaultScale: 0.4,
    collisionRadius: FANTASY_COLLISION.house,
  },
  house2: {
    nodeName: "House2",
    category: "building",
    defaultScale: 0.4,
    collisionRadius: FANTASY_COLLISION.house,
  },
  house3: {
    nodeName: "House3",
    category: "building",
    defaultScale: 0.4,
    collisionRadius: FANTASY_COLLISION.house,
  },
  windmill: {
    nodeName: "Windmill_LOD0",
    category: "landmark",
    defaultScale: 0.4,
    collisionRadius: FANTASY_COLLISION.windmill,
  },
  windmill_blade: {
    nodeName: "Windmill_blade_LOD0",
    category: "landmark",
    defaultScale: 0.4,
    collisionRadius: 0,
  },
  wall_part1: {
    nodeName: "Wall_part1",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wall_part2: {
    nodeName: "Wall_part2",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wall_corner: {
    nodeName: "Wall_corner",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wall_entrance: {
    nodeName: "Wall_entrance",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wall_gate_l: {
    nodeName: "Wall_gateL",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: 0.5,
  },
  wall_gate_r: {
    nodeName: "Wall_gateR",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: 0.5,
  },
  wall_tower1: {
    nodeName: "Wall_tower1",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wall_tower2: {
    nodeName: "Wall_tower2",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wall_props: {
    nodeName: "Wall_props",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  wooden_wall_1: {
    nodeName: "WoodenWall_1",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wooden_wall_2: {
    nodeName: "WoodenWall_2",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wooden_wall_corner: {
    nodeName: "WoodenWall_Corner",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  wooden_wall_gate_l: {
    nodeName: "Village1_WoodenWallGateL",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: 0.5,
  },
  wooden_wall_gate_r: {
    nodeName: "Village1_WoodenWallGateR",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: 0.5,
  },
  wooden_wall_towers: {
    nodeName: "WoodenWall_Towers",
    category: "wall",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.wall,
  },
  cart1: {
    nodeName: "cart1_LOD0",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.cart,
  },
  cart2: {
    nodeName: "cart2_LOD0",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.cart,
  },
  cart3: {
    nodeName: "cart3_LOD0",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.cart,
  },
  cart4: {
    nodeName: "cart4_LOD0",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.cart,
  },
  storage_barrel: {
    nodeName: "storage_barrel",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  storage_barrel_drink: {
    nodeName: "storage_barrel_drink",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  storage_basket: {
    nodeName: "storage_basket",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  storage_bag: {
    nodeName: "storage_bag",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  food_apple: {
    nodeName: "Food_apple",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  food_bread: {
    nodeName: "Food_bread_1",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  food_corn: {
    nodeName: "Food_corn",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  furniture_table: {
    nodeName: "Furniture_table",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  furniture_table_round: {
    nodeName: "Furniture_table_round",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  furniture_chair1: {
    nodeName: "Furniture_chair1",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  furniture_chair2: {
    nodeName: "Furniture_chair2",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  furniture_candlestick: {
    nodeName: "Furniture_candlestick1",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  tavern_chandelier: {
    nodeName: "Tavern_interior_chandelier",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  furniture_scroll: {
    nodeName: "Furniture_scroll",
    category: "prop",
    defaultScale: 0.42,
    collisionRadius: FANTASY_COLLISION.small,
  },
  ground_grass: {
    nodeName: "ground_grass",
    category: "ground",
    defaultScale: 0.5,
    collisionRadius: FANTASY_COLLISION.ground,
  },
  ground_road: {
    nodeName: "ground_road",
    category: "ground",
    defaultScale: 0.5,
    collisionRadius: FANTASY_COLLISION.ground,
  },
  ground_soil: {
    nodeName: "ground_soil",
    category: "ground",
    defaultScale: 0.5,
    collisionRadius: FANTASY_COLLISION.ground,
  },
};

const CATEGORY_VARIANTS = Object.entries(FANTASY_PROP_DEFS).reduce(
  (acc, [key, def]) => {
    if (!acc[def.category]) {
      acc[def.category] = [];
    }
    acc[def.category].push(key);
    return acc;
  },
  {}
);

export function getFantasyPropDef(propKey) {
  return FANTASY_PROP_DEFS[propKey] || null;
}

export function getFantasyPropVariants(category) {
  return CATEGORY_VARIANTS[category] || [];
}

export function pickFantasyPropVariant(category, roll) {
  const variants = getFantasyPropVariants(category);

  if (variants.length === 0) {
    return null;
  }

  const index = Math.floor(roll * variants.length) % variants.length;

  return variants[index];
}

export function isFantasyNodeAllowed(nodeName) {
  if (!nodeName) {
    return false;
  }

  if (nodeName.includes("UCX") || nodeName.startsWith("Object_")) {
    return false;
  }

  if (/LOD[123]/.test(nodeName)) {
    return false;
  }

  return true;
}

export function getFantasyNodeNames() {
  return Object.values(FANTASY_PROP_DEFS).map((def) => def.nodeName);
}
