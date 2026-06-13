/**
 * Splits desert__rock__fixed_pack.glb into per-rock GLBs for desert biome scattering.
 * Merges entries into src/game/plantsManifest.json (and public copy; keeps forest entries).
 * Run: npm run split-desert-pack
 */
const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { KHRMaterialsPBRSpecularGlossiness } = require('@gltf-transform/extensions');
const { dedup, getBounds, metalRough, prune } = require('@gltf-transform/functions');
const { loadPlantsManifest, writePlantsManifest } = require('./plants-manifest-io');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(
  ROOT,
  'public',
  'assets',
  'idea_glbs',
  'desert__rock__fixed_pack.glb'
);
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'plants');

const DESERT_BIOMES = [1];

const COLLISION = {
  desert_large: 1.2,
  desert_rock: 0.85,
  desert_scatter: 0.45,
};

/** Rock_* subtrees only (skip Sun / lighting). */
const SPLITS = [
  { id: 'desert_monolith_01', rootNode: 'Rock_1', category: 'desert_large', targetHeight: 3.8 },
  { id: 'desert_monolith_02', rootNode: 'Rock_2', category: 'desert_large', targetHeight: 3.6 },
  { id: 'desert_monolith_03', rootNode: 'Rock_3', category: 'desert_large', targetHeight: 3.4 },
  { id: 'desert_rock_04', rootNode: 'Rock_4', category: 'desert_rock', targetHeight: 2.2 },
  { id: 'desert_rock_05', rootNode: 'Rock_5', category: 'desert_rock', targetHeight: 2.6 },
  { id: 'desert_rock_06', rootNode: 'Rock_6', category: 'desert_rock', targetHeight: 2.8 },
  { id: 'desert_rock_07', rootNode: 'Rock_7', category: 'desert_rock', targetHeight: 2.4 },
  { id: 'desert_rock_08', rootNode: 'Rock_8', category: 'desert_rock', targetHeight: 2.5 },
  { id: 'desert_scatter_09', rootNode: 'Rock_9', category: 'desert_scatter', targetHeight: 1.0 },
  { id: 'desert_scatter_10', rootNode: 'Rock_10', category: 'desert_scatter', targetHeight: 1.2 },
  { id: 'desert_scatter_11', rootNode: 'Rock_11', category: 'desert_scatter', targetHeight: 1.1 },
  { id: 'desert_scatter_12', rootNode: 'Rock_12', category: 'desert_scatter', targetHeight: 1.1 },
  { id: 'desert_rock_13', rootNode: 'Rock_13', category: 'desert_rock', targetHeight: 2.0 },
  { id: 'desert_rock_14', rootNode: 'Rock_14', category: 'desert_rock', targetHeight: 2.2 },
  { id: 'desert_scatter_15', rootNode: 'Rock_15', category: 'desert_scatter', targetHeight: 1.2 },
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
    metalRough(),
    prune(),
    dedup()
  );

  await io.write(outPath, document);
}

function buildManifestEntry(split) {
  const file = `${split.id}.glb`;
  const collisionRadius = COLLISION[split.category] ?? 0.5;

  return {
    id: split.id,
    file,
    category: split.category,
    biomes: DESERT_BIOMES,
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

  const io = new NodeIO().registerExtensions([KHRMaterialsPBRSpecularGlossiness]);
  const desertEntries = [];

  for (const split of SPLITS) {
    const outPath = path.join(OUT_DIR, `${split.id}.glb`);
    await extractProp(io, SOURCE, split, outPath);
    desertEntries.push(buildManifestEntry(split));
    const size = fs.statSync(outPath).size;
    console.log(
      `Wrote ${path.relative(ROOT, outPath)} (${size} bytes) from ${split.rootNode}`
    );
  }

  const existing = loadPlantsManifest();
  const desertIds = new Set(SPLITS.map((split) => split.id));
  const kept = existing.plants.filter((entry) => !desertIds.has(entry.id));

  const manifest = {
    plants: [...kept, ...desertEntries],
  };

  writePlantsManifest(manifest);

  console.log(
    `Merged manifest: ${kept.length} existing + ${desertEntries.length} desert = ${manifest.plants.length} total.`
  );
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
