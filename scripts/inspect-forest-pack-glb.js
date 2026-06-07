/**
 * Lists hierarchy and bounds for low_poly_forest_tree_pack.glb.
 * Run: node scripts/inspect-forest-pack-glb.js
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
  'low_poly_forest_tree_pack.glb'
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

    if (mesh || node.listChildren().length > 0) {
      const bounds = getBounds(node);
      const height = bounds.max[1] - bounds.min[1];
      extra = ` h=${height.toFixed(2)}`;
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
