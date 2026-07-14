import { Box } from '@react-three/drei';

export default function VoxelFallback({
  color,
  height,
  width = 0.7,
  depth = 0.7,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  return (
    <Box
      args={[width, height, depth]}
      castShadow
      receiveShadow
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshStandardMaterial color={color} roughness={0.65} />
    </Box>
  );
}
