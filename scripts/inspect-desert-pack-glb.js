/**
 * Lists hierarchy and bounds for desert__rock__fixed_pack.glb.
 * Run: node scripts/inspect-desert-pack-glb.js
 */
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { KHRMaterialsPBRSpecularGlossiness } = require('@gltf-transform/extensions');
const { getBounds } = require('@gltf-transform/functions');

const SOURCE = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'idea_glbs',
  'desert__rock__fixed_pack.glb'
);

async function main() {
  const io = new NodeIO().registerExtensions([KHRMaterialsPBRSpecularGlossiness]);
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
      const maxD = Math.max(
        bounds.max[0] - bounds.min[0],
        bounds.max[1] - bounds.min[1],
        bounds.max[2] - bounds.min[2]
      );

      if (Number.isFinite(height)) {
        extra = ` h=${height.toFixed(2)} maxD=${maxD.toFixed(2)}`;
      }
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
