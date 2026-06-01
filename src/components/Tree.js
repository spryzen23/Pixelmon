import { Box } from '@react-three/drei';

const SUB_VOXEL_SIZE = 0.25;
const HALF_SUB_VOXEL = SUB_VOXEL_SIZE / 2;
const TRUNK_LEVELS = 4;

const trunkBlocks = Array.from({ length: TRUNK_LEVELS }, (_, level) => ({
  key: `trunk-${level}`,
  position: [0, HALF_SUB_VOXEL + level * SUB_VOXEL_SIZE, 0],
}));

function shouldSkipLeafCorner(lx, ly, lz) {
  const isOuterCorner = Math.abs(lx) === 1 && Math.abs(lz) === 1;
  const isTopOrBottomLayer = ly === 0 || ly === 2;
  const deterministicNoise = Math.abs(lx * 13 + ly * 7 + lz * 17) % 3;

  return isOuterCorner && isTopOrBottomLayer && deterministicNoise === 0;
}

function createLeafBlocks() {
  const blocks = [];
  const trunkTopY = TRUNK_LEVELS * SUB_VOXEL_SIZE;

  for (let lx = -1; lx <= 1; lx += 1) {
    for (let ly = 0; ly <= 2; ly += 1) {
      for (let lz = -1; lz <= 1; lz += 1) {
        if (shouldSkipLeafCorner(lx, ly, lz)) {
          continue;
        }

        blocks.push({
          key: `leaf-${lx}:${ly}:${lz}`,
          position: [
            lx * SUB_VOXEL_SIZE,
            trunkTopY + HALF_SUB_VOXEL + ly * SUB_VOXEL_SIZE,
            lz * SUB_VOXEL_SIZE,
          ],
        });
      }
    }
  }

  return blocks;
}

const leafBlocks = createLeafBlocks();

export default function Tree({ x, z, surfaceY }) {
  return (
    <group position={[x, surfaceY, z]}>
      {trunkBlocks.map((block) => (
        <Box
          key={block.key}
          args={[SUB_VOXEL_SIZE, SUB_VOXEL_SIZE, SUB_VOXEL_SIZE]}
          position={block.position}
          castShadow
        >
          {/* Replace these trunk sub-voxels with an instanced/tree GLTF asset later. */}
          <meshStandardMaterial color="#7b4a21" roughness={0.85} />
        </Box>
      ))}

      {leafBlocks.map((block) => (
        <Box
          key={block.key}
          args={[SUB_VOXEL_SIZE, SUB_VOXEL_SIZE, SUB_VOXEL_SIZE]}
          position={block.position}
          castShadow
        >
          {/* Replace these leaf sub-voxels with model foliage later. */}
          <meshStandardMaterial color="#2f8a3b" roughness={0.8} />
        </Box>
      ))}
    </group>
  );
}
