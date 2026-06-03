import { Box } from '@react-three/drei';

export default function Cactus({ x, z, surfaceY }) {
  return (
    <group position={[x, surfaceY, z]}>
      <Box args={[0.34, 1.25, 0.34]} position={[0, 0.625, 0]} castShadow>
        <meshStandardMaterial color="#2f8f45" roughness={0.82} />
      </Box>
      <Box args={[0.28, 0.62, 0.28]} position={[-0.34, 0.78, 0]} castShadow>
        <meshStandardMaterial color="#2a7d3d" roughness={0.82} />
      </Box>
      <Box args={[0.28, 0.62, 0.28]} position={[0.34, 0.96, 0]} castShadow>
        <meshStandardMaterial color="#2a7d3d" roughness={0.82} />
      </Box>
    </group>
  );
}
