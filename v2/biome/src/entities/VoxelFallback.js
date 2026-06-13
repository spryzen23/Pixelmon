import { Box } from '@react-three/drei';

export default function VoxelFallback({
  color,
  height,
  width = 0.7,
  depth = 0.7,
}) {
  return (
    <Box
      args={[width, height, depth]}
      castShadow
      receiveShadow
      position={[0, 0, 0]}
    >
      <meshStandardMaterial color={color} roughness={0.65} />
    </Box>
  );
}
