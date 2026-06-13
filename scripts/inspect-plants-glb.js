/**
 * Lists hierarchy and bounds for plants_asset_set.glb.
 * Run: node scripts/inspect-plants-glb.js
 */
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { getBounds } = require('@gltf-transform/functions');

const SOURCE = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'idea_glbs',
  'plants_asset_set.glb'
);

async function main() {
  const io = new NodeIO();
  const document = await io.read(SOURCE);
  const scene = document.getRoot().listScenes()[0];

  function walk(node, depth = 0) {
    const name = node.getName() || '(unnamed)';
    const mesh = node.getMesh();
    const prefix = '  '.repeat(depth);
    let extra = '';

    if (mesh) {
      const bounds = getBounds(node);
      const sx = bounds.max[0] - bounds.min[0];
      const sy = bounds.max[1] - bounds.min[1];
      const sz = bounds.max[2] - bounds.min[2];
      extra = ` size=${sx.toFixed(1)}x${sy.toFixed(1)}x${sz.toFixed(1)}`;
    }

    console.log(`${prefix}${name}${mesh ? ' [mesh]' : ''}${extra}`);
    node.listChildren().forEach((child) => walk(child, depth + 1));
  }

  scene.listChildren().forEach((child) => walk(child, 0));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
