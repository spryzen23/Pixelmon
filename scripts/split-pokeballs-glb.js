/**
 * Splits public/assets/pokeballs_pokemon (1).glb into three pokeball GLBs.
 * Run: npm run split-pokeballs
 */
const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { center, getBounds, prune } = require('@gltf-transform/functions');

function normalizeToSize(targetSize = 1) {
  return (document) => {
    const scene = document.getRoot().listScenes()[0];
    const bounds = getBounds(scene);
    const size = Math.max(
      bounds.max[0] - bounds.min[0],
      bounds.max[1] - bounds.min[1],
      bounds.max[2] - bounds.min[2]
    );

    if (!size) {
      return;
    }

    const factor = targetSize / size;

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

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'public', 'assets', 'pokeballs_pokemon (1).glb');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'pokeballs');

const SPLITS = [
  { id: 'standard', rootNode: 'Sphere001' },
  { id: 'great', rootNode: 'Sphere003' },
  { id: 'ultra', rootNode: 'Sphere008' },
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

async function extractBall(io, sourcePath, rootNodeName, outPath) {
  const document = await io.read(sourcePath);
  const target = findNodeByName(document.getRoot(), rootNodeName);

  if (!target) {
    throw new Error(`Node "${rootNodeName}" not found in ${sourcePath}`);
  }

  const scene = document.getRoot().listScenes()[0];
  const worldMatrix = target.getWorldMatrix();

  scene.listChildren().forEach((child) => child.dispose());

  scene.addChild(target);
  target.setMatrix(worldMatrix);

  await document.transform(center({ pivot: 'center' }), normalizeToSize(1), prune());

  await io.write(outPath, document);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Source GLB missing:', SOURCE);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const io = new NodeIO();

  for (const { id, rootNode } of SPLITS) {
    const outPath = path.join(OUT_DIR, `${id}.glb`);
    await extractBall(io, SOURCE, rootNode, outPath);
    const size = fs.statSync(outPath).size;
    console.log(`Wrote ${path.relative(ROOT, outPath)} (${size} bytes) from ${rootNode}`);
  }

  const manifest = {
    balls: SPLITS.map(({ id }) => ({
      id,
      file: `${id}.glb`,
      modelScale: 1,
    })),
  };

  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
