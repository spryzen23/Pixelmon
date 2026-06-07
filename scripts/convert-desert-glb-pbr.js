/**
 * Converts existing desert_*.glb files from specular-glossiness to metallic-roughness.
 * Run: node scripts/convert-desert-glb-pbr.js
 */
const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { KHRMaterialsPBRSpecularGlossiness } = require('@gltf-transform/extensions');
const { dedup, metalRough, prune } = require('@gltf-transform/functions');

const PLANTS_DIR = path.join(__dirname, '..', 'public', 'assets', 'plants');

async function main() {
  const io = new NodeIO().registerExtensions([KHRMaterialsPBRSpecularGlossiness]);
  const files = fs
    .readdirSync(PLANTS_DIR)
    .filter((name) => name.startsWith('desert_') && name.endsWith('.glb'));

  for (const file of files) {
    const filePath = path.join(PLANTS_DIR, file);
    const document = await io.read(filePath);
    await document.transform(metalRough(), prune(), dedup());
    await io.write(filePath, document);
    const size = fs.statSync(filePath).size;
    console.log(`Converted ${file} (${size} bytes)`);
  }

  console.log(`Done. ${files.length} desert GLBs updated.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
