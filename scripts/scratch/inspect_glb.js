import fs from 'fs';
import path from 'path';

function inspectGlbNodes(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  
  // Read JSON chunk
  const chunkLength = fileBuffer.readUInt32LE(12);
  const jsonBuffer = fileBuffer.slice(20, 20 + chunkLength);
  const gltfJson = JSON.parse(jsonBuffer.toString('utf8'));
  
  console.log(`\n=== Nodes in: ${path.basename(filePath)} ===`);
  if (gltfJson.nodes) {
    gltfJson.nodes.forEach((node, idx) => {
      console.log(`Node [${idx}]: "${node.name}" (parent/children details omitted)`);
    });
  }
}

const baseDir = 'e:/maha/Pixelmon/public/assets/models/glb/regular';
inspectGlbNodes(path.join(baseDir, '23.glb')); // Ekans
inspectGlbNodes(path.join(baseDir, '147.glb')); // Dratini
