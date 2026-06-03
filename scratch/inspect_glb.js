const fs = require('fs');
const path = require('path');

function inspectGlb(filename) {
  const filePath = path.join(__dirname, '..', 'public', filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const buffer = fs.readFileSync(filePath);
  
  // Read header
  const magic = buffer.toString('utf8', 0, 4);
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  
  if (magic !== 'glTF') {
    console.error(`${filename} is not a valid GLB file.`);
    return;
  }
  
  // Read chunk 0 (JSON)
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.toString('utf8', 16, 20);
  
  if (chunkType !== 'JSON') {
    console.error(`${filename} chunk 0 is not JSON.`);
    return;
  }
  
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  let gltf;
  try {
    gltf = JSON.parse(jsonStr);
  } catch (e) {
    console.error(`Failed to parse JSON in ${filename}:`, e);
    return;
  }
  
  console.log(`\n=== Inspecting ${filename} ===`);
  console.log(`GLTF Version: ${gltf.asset ? gltf.asset.version : 'unknown'}`);
  
  // Print Animations
  const animations = gltf.animations || [];
  console.log(`Animations (${animations.length}):`);
  animations.forEach((anim, i) => {
    console.log(`  - Index ${i}: "${anim.name || 'unnamed'}"`);
  });
  
  // Print Meshes/Bones
  const nodes = gltf.nodes || [];
  console.log(`Nodes Count: ${nodes.length}`);
  const boneNodes = nodes.filter(n => !n.mesh);
  const meshNodes = nodes.filter(n => n.mesh !== undefined);
  console.log(`Mesh Nodes (${meshNodes.length}):`);
  meshNodes.slice(0, 15).forEach((n, idx) => {
    console.log(`  - "${n.name || 'unnamed'}" (mesh: ${n.mesh})`);
  });
  if (meshNodes.length > 15) console.log(`  ... and ${meshNodes.length - 15} more meshes`);
  
  console.log(`Bone/Joint Nodes (${boneNodes.length}):`);
  if (filename === 'companion.glb') {
    boneNodes.forEach((n, idx) => {
      console.log(`  - "${n.name || 'unnamed'}"`);
    });
  } else {
    boneNodes.slice(0, 15).forEach((n, idx) => {
      console.log(`  - "${n.name || 'unnamed'}"`);
    });
    if (boneNodes.length > 15) console.log(`  ... and ${boneNodes.length - 15} more bones`);
  }
}

inspectGlb('player.glb');
inspectGlb('companion.glb');
inspectGlb('wild_creature.glb');
