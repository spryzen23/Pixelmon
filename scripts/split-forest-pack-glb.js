/**
 * Splits low_poly_forest_tree_pack.glb into per-prop GLBs for biome scattering.
 * Run: npm run split-forest-pack
 */
const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { getBounds, prune } = require('@gltf-transform/functions');
const { writePlantsManifest } = require('./plants-manifest-io');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(
  ROOT,
  'public',
  'assets',
  'idea_glbs',
  'low_poly_forest_tree_pack.glb'
);
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'plants');

const PLANT_COLLISION = {
  tree: 1.1,
  pine: 1.1,
  plant: 0.5,
  rock: 0.4,
};

/**
 * Low-poly forest pack — extract whole subtrees (not leaf mesh nodes).
 * Heights in source file ~2–33 units; normalized to game-world targets.
 */
const SPLITS = [
  // Canopy trees — plains / grass biomes
  { id: 'forest_bg_tree_01', rootNode: 'Background_Tree_Atlas', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.5 },
  { id: 'forest_bg_tree_02', rootNode: 'Background_Tree_Atlas.001', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.5 },
  { id: 'forest_bg_tree_03', rootNode: 'Background_Tree_Atlas.002', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.0 },
  { id: 'forest_bg_tree_04', rootNode: 'Background_Tree_Atlas.003', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.5 },
  { id: 'forest_bg_tree_05', rootNode: 'Background_Tree_Atlas.004', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.2 },
  { id: 'forest_bg_tree_06', rootNode: 'Background_Tree_Atlas.005', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.8 },
  { id: 'forest_bg_tree_07', rootNode: 'Background_Tree_Atlas.006', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.5 },
  { id: 'forest_bg_tree_08', rootNode: 'Background_Tree_Atlas.007', category: 'tree', biomes: [0, 3, 4], targetHeight: 4.5 },

  // Snow pines — tall trunks and large canopies
  { id: 'forest_pine_01', rootNode: 'Tree_Trunk_01.001', category: 'pine', biomes: [2, 5], targetHeight: 4.8 },
  { id: 'forest_pine_02', rootNode: 'Tree_Trunk_01.002', category: 'pine', biomes: [2, 5], targetHeight: 4.2 },
  { id: 'forest_pine_03', rootNode: 'Tree_Branches_01', category: 'pine', biomes: [2, 5], targetHeight: 4.5 },
  { id: 'forest_pine_04', rootNode: 'Tree_Branches_01.002', category: 'pine', biomes: [2, 5], targetHeight: 4.0 },
  { id: 'forest_pine_05', rootNode: 'Background_Tree_Atlas.005', category: 'pine', biomes: [2, 5], targetHeight: 4.8, skipExtract: true, aliasFile: 'forest_bg_tree_06.glb' },

  // Understory — bushes and medium pieces
  { id: 'forest_bush_01', rootNode: 'Background_Tree_Atlas.008', category: 'plant', biomes: [0, 3, 4], targetHeight: 1.2 },
  { id: 'forest_bush_02', rootNode: 'Background_Tree_Atlas.009', category: 'plant', biomes: [0, 3, 4], targetHeight: 1.4 },
  { id: 'forest_bush_03', rootNode: 'Background_Tree_Atlas.010', category: 'plant', biomes: [0, 3, 4], targetHeight: 1.0 },
  { id: 'forest_bush_04', rootNode: 'Background_Tree_Atlas.011', category: 'plant', biomes: [0, 3, 4], targetHeight: 1.0 },
  { id: 'forest_bush_05', rootNode: 'Background_Tree_Atlas.012', category: 'plant', biomes: [0, 3, 4], targetHeight: 1.2 },
  { id: 'forest_shrub_01', rootNode: 'Tree_Branches_01.001', category: 'plant', biomes: [0, 3, 4], targetHeight: 2.5 },
  { id: 'forest_shrub_02', rootNode: 'Tree_Branches_02', category: 'plant', biomes: [0, 3, 4], targetHeight: 2.5 },
  { id: 'forest_shrub_03', rootNode: 'Tree_Trunk_01', category: 'plant', biomes: [0, 3, 4], targetHeight: 2.5 },
  { id: 'forest_shrub_04', rootNode: 'Tree_Trunk_02', category: 'plant', biomes: [0, 3, 4], targetHeight: 2.5 },

  // Rocks — ground scatter
  { id: 'forest_rock_01', rootNode: 'Rocks', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.5, collisionCategory: 'rock' },
  { id: 'forest_rock_02', rootNode: 'Rocks.001', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.7, collisionCategory: 'rock' },
  { id: 'forest_rock_03', rootNode: 'Rocks.002', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.6, collisionCategory: 'rock' },
  { id: 'forest_rock_04', rootNode: 'Rocks.003', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.5, collisionCategory: 'rock' },
  { id: 'forest_rock_05', rootNode: 'Rocks.004', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.55, collisionCategory: 'rock' },
  { id: 'forest_rock_06', rootNode: 'Rocks.005', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.6, collisionCategory: 'rock' },
  { id: 'forest_rock_07', rootNode: 'Rocks.006', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.65, collisionCategory: 'rock' },
  { id: 'forest_rock_08', rootNode: 'Rocks.007', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.55, collisionCategory: 'rock' },
  { id: 'forest_rock_09', rootNode: 'Rocks.008', category: 'plant', biomes: [0, 3, 4], targetHeight: 0.5, collisionCategory: 'rock' },
];

function findNodeByName(root, name) {
  let found = null;

  root.listScenes().forEach((scene) => {
    scene.traverse((node) => {
      if (node.getName() === name) {
        found = node;
      }
    });
  });

  return found;
}

function alignBottomCenterXZ() {
  return (document) => {
    const scene = document.getRoot().listScenes()[0];
    const bounds = getBounds(scene);
    const minX = bounds.min[0];
    const maxX = bounds.max[0];
    const minY = bounds.min[1];
    const minZ = bounds.min[2];
    const maxZ = bounds.max[2];
    const offsetX = -(minX + maxX) / 2;
    const offsetY = -minY;
    const offsetZ = -(minZ + maxZ) / 2;

    scene.listChildren().forEach((node) => {
      const translation = node.getTranslation();
      node.setTranslation([
        translation[0] + offsetX,
        translation[1] + offsetY,
        translation[2] + offsetZ,
      ]);
    });
  };
}

function normalizeToHeight(targetHeight) {
  return (document) => {
    const scene = document.getRoot().listScenes()[0];
    const bounds = getBounds(scene);
    const height = bounds.max[1] - bounds.min[1];

    if (!height) {
      return;
    }

    const factor = targetHeight / height;

    scene.listChildren().forEach((node) => {
      const scale = node.getScale();
      node.setScale([scale[0] * factor, scale[1] * factor, scale[2] * factor]);
      const translation = node.getTranslation();
      node.setTranslation([
        translation[0] * factor,
        translation[1] * factor,
        translation[2] * factor,
      ]);
    });
  };
}

async function extractProp(io, sourcePath, split, outPath) {
  const document = await io.read(sourcePath);
  const target = findNodeByName(document.getRoot(), split.rootNode);

  if (!target) {
    throw new Error(`Node "${split.rootNode}" not found in ${sourcePath}`);
  }

  const scene = document.getRoot().listScenes()[0];
  const worldMatrix = target.getWorldMatrix();

  scene.listChildren().forEach((child) => child.dispose());

  scene.addChild(target);
  target.setMatrix(worldMatrix);
  target.setName(split.id);

  await document.transform(
    alignBottomCenterXZ(),
    normalizeToHeight(split.targetHeight),
    prune()
  );

  await io.write(outPath, document);
}

function buildManifestEntry(split) {
  const file = split.aliasFile || `${split.id}.glb`;
  const collisionKey = split.collisionCategory || split.category;
  const collisionRadius = PLANT_COLLISION[collisionKey] ?? 0.5;

  return {
    id: split.id,
    file,
    category: split.category,
    biomes: split.biomes,
    defaultScale: 1,
    collisionRadius,
    nodeName: split.id,
  };
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Source GLB missing:', SOURCE);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const io = new NodeIO();

  for (const split of SPLITS) {
    if (split.skipExtract) {
      console.log(`Skip extract ${split.rootNode} → alias ${split.aliasFile}`);
      continue;
    }

    const outPath = path.join(OUT_DIR, `${split.id}.glb`);
    await extractProp(io, SOURCE, split, outPath);
    const size = fs.statSync(outPath).size;
    console.log(
      `Wrote ${path.relative(ROOT, outPath)} (${size} bytes) from ${split.rootNode}`
    );
  }

  const manifest = {
    plants: SPLITS.map(buildManifestEntry),
  };

  writePlantsManifest(manifest);

  console.log(`Wrote manifest with ${manifest.plants.length} plant entries.`);
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
