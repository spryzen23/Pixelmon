const fs = require('fs');
const path = require('path');

// Minimal GLB bone name dump via ASCII search for mixamorig arm nodes
const glbPath = path.join(__dirname, '..', 'public', 'player.glb');
const buf = fs.readFileSync(glbPath);
const text = buf.toString('latin1');
const targets = [
  'mixamorig:LeftShoulder',
  'mixamorig:LeftArm',
  'mixamorig:LeftForeArm',
  'mixamorig:RightShoulder',
  'mixamorig:RightArm',
  'mixamorig:RightForeArm',
];

for (const bone of targets) {
  const idx = text.indexOf(bone);
  console.log(bone, idx >= 0 ? 'present' : 'missing');
}
