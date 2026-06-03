import { Box } from '@react-three/drei';

const SUB_VOXEL_SIZE = 0.25;
const HALF = SUB_VOXEL_SIZE / 2;
const TRUNK_LEVELS = 7;

const trunkBlocks = Array.from({ length: TRUNK_LEVELS }, (_, level) => ({
  key: `trunk-${level}`,
  position: [0, HALF + level * SUB_VOXEL_SIZE, 0],
}));

function createPineFoliageBlocks() {
  const blocks = [];
  const trunkTopY = TRUNK_LEVELS * SUB_VOXEL_SIZE;
  const tiers = [
    { layer: 0, extent: 2, snowCap: false },
    { layer: 1, extent: 1, snowCap: false },
    { layer: 2, extent: 1, snowCap: true },
    { layer: 3, extent: 0, snowCap: true },
  ];

  tiers.forEach(({ layer, extent, snowCap }) => {
    const y = trunkTopY + HALF + layer * SUB_VOXEL_SIZE;

    if (extent === 0) {
      blocks.push({
        key: `pine-tip-${layer}`,
        position: [0, y, 0],
        snowCap,
      });
      return;
    }

    for (let lx = -extent; lx <= extent; lx += 1) {
      for (let lz = -extent; lz <= extent; lz += 1) {
        if (Math.abs(lx) === extent && Math.abs(lz) === extent) {
          continue;
        }

        blocks.push({
          key: `pine-${layer}-${lx}-${lz}`,
          position: [lx * SUB_VOXEL_SIZE, y, lz * SUB_VOXEL_SIZE],
          snowCap: snowCap && Math.abs(lx) + Math.abs(lz) <= 1,
        });
      }
    }
  });

  return blocks;
}

const foliageBlocks = createPineFoliageBlocks();

export default function PineTree({ x, z, surfaceY }) {
  return (
    <group position={[x, surfaceY, z]}>
      {trunkBlocks.map((block) => (
        <Box
          key={block.key}
          args={[SUB_VOXEL_SIZE, SUB_VOXEL_SIZE, SUB_VOXEL_SIZE]}
          position={block.position}
          castShadow
        >
          <meshStandardMaterial color="#4a3d32" roughness={0.9} />
        </Box>
      ))}

      {foliageBlocks.map((block) => (
        <Box
          key={block.key}
          args={[SUB_VOXEL_SIZE, SUB_VOXEL_SIZE, SUB_VOXEL_SIZE]}
          position={block.position}
          castShadow
        >
          <meshStandardMaterial
            color={block.snowCap ? '#e8f2fa' : '#1e4a32'}
            roughness={block.snowCap ? 0.75 : 0.82}
          />
        </Box>
      ))}
    </group>
  );
}
