/**
 * Lists bounds, RootNode children, and archetype base names in the village GLB.
 * Run: node scripts/inspect-village-glb.js
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
  'small_time_town__village_asset_pack.glb'
);

function getBaseName(name) {
  if (!name || name.includes('_Material') || name.startsWith('Sketchfab')) {
    return null;
  }

  if (/^(Cube|Cylinder|Plane|Sphere|Tile|World|RootNode)\b/.test(name)) {
    return null;
  }

  return name.replace(/\.\d+$/, '');
}

async function main() {
  const io = new NodeIO();
  const doc = await io.read(SOURCE);
  const scene = doc.getRoot().listScenes()[0];
  const bounds = getBounds(scene);
  const size = [
    bounds.max[0] - bounds.min[0],
    bounds.max[1] - bounds.min[1],
    bounds.max[2] - bounds.min[2],
  ];
  const center = [
    (bounds.min[0] + bounds.max[0]) / 2,
    (bounds.min[1] + bounds.max[1]) / 2,
    (bounds.min[2] + bounds.max[2]) / 2,
  ];

  console.log('bounds min', bounds.min);
  console.log('bounds max', bounds.max);
  console.log('size', size);
  console.log('center', center);

  let rootNode = null;

  scene.traverse((node) => {
    if (node.getName() === 'RootNode') {
      rootNode = node;
    }
  });

  if (!rootNode) {
    console.error('RootNode not found');
    process.exit(1);
  }

  console.log('RootNode children', rootNode.listChildren().length);

  const bases = new Map();

  rootNode.listChildren().forEach((child) => {
    const base = getBaseName(child.getName());

    if (base) {
      bases.set(base, (bases.get(base) || 0) + 1);
    }
  });

  console.log('\nArchetype base names (%d unique):', bases.size);
  [...bases.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([name, count]) => {
      console.log(`  ${name}${count > 1 ? ` (${count} instances)` : ''}`);
    });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
