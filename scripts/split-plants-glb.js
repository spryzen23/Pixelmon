/**
 * Splits public/assets/idea_glbs/plants_asset_set.glb into per-plant GLBs.
 * Run: npm run split-plants
 */
const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { getBounds, prune } = require('@gltf-transform/functions');
const { writePlantsManifest } = require('./plants-manifest-io');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'public', 'assets', 'idea_glbs', 'plants_asset_set.glb');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'plants');

const PLANT_COLLISION = {
  tree: 1.1,
  pine: 1.1,
  plant: 0.5,
};

/** Object_N → export metadata. skipExtract: manifest-only alias to another id's file. */
const SPLITS = [
  {
    id: 'tall_tree_01',
    rootNode: 'Object_2',
    category: 'tree',
    biomes: [0, 3, 4],
    targetHeight: 4.5,
  },
  {
    id: 'tall_tree_02',
    rootNode: 'Object_3',
    category: 'tree',
    biomes: [0, 3, 4],
    targetHeight: 4.5,
  },
  {
    id: 'ground_cover_01',
    rootNode: 'Object_4',
    category: 'plant',
    biomes: [0, 3, 4],
    targetHeight: 0.8,
  },
  {
    id: 'pine_tall_01',
    rootNode: 'Object_5',
    category: 'pine',
    biomes: [2, 5],
    targetHeight: 4.5,
  },
  {
    id: 'pine_tall_01b',
    rootNode: 'Object_6',
    category: 'pine',
    biomes: [2, 5],
    targetHeight: 4.5,
    skipExtract: true,
    aliasFile: 'pine_tall_01.glb',
  },
  {
    id: 'pine_tall_02',
    rootNode: 'Object_7',
    category: 'pine',
    biomes: [2, 5],
    targetHeight: 4.2,
  },
  {
    id: 'pine_medium_01',
    rootNode: 'Object_8',
    category: 'pine',
    biomes: [2, 5],
    targetHeight: 2.8,
  },
  {
    id: 'shrub_01',
    rootNode: 'Object_9',
    category: 'plant',
    biomes: [0, 3, 4],
    targetHeight: 2.5,
  },
  {
    id: 'shrub_02',
    rootNode: 'Object_10',
    category: 'plant',
    biomes: [0, 3, 4],
    targetHeight: 2.5,
  },
  {
    id: 'pine_tall_03',
    rootNode: 'Object_11',
    category: 'pine',
    biomes: [2, 5],
    targetHeight: 4.5,
  },
  {
    id: 'medium_tree_01',
    rootNode: 'Object_12',
    category: 'tree',
    biomes: [0, 3, 4],
    targetHeight: 3.2,
  },
  {
    id: 'ground_cover_02',
    rootNode: 'Object_13',
    category: 'plant',
    biomes: [0, 3, 4],
    targetHeight: 0.8,
  },
  {
    id: 'ground_cover_03',
    rootNode: 'Object_14',
    category: 'plant',
    biomes: [0, 3, 4],
    targetHeight: 0.8,
  },
  {
    id: 'medium_tree_02',
    rootNode: 'Object_15',
    category: 'tree',
    biomes: [0, 3, 4],
    targetHeight: 3.0,
  },
  {
    id: 'medium_tree_03',
    rootNode: 'Object_16',
    category: 'tree',
    biomes: [0, 3, 4],
    targetHeight: 3.0,
  },
  {
    id: 'medium_tree_04',
    rootNode: 'Object_17',
    category: 'tree',
    biomes: [0, 3, 4],
    targetHeight: 3.0,
  },
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

async function extractPlant(io, sourcePath, split, outPath) {
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
  const collisionRadius = PLANT_COLLISION[split.category] ?? 0.5;

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
    await extractPlant(io, SOURCE, split, outPath);
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
