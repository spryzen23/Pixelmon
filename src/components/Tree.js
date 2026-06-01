import { Box } from '@react-three/drei';

export default function Tree({ x, z, surfaceY }) {
  return (
    <group position={[x, surfaceY, z]}>
      <Box args={[0.35, 1.15, 0.35]} position={[0, 0.575, 0]} castShadow>
        {/* Replace this primitive trunk with a useGLTF tree asset later. */}
        <meshStandardMaterial color="#7b4a21" roughness={0.85} />
      </Box>

      <Box args={[1.2, 0.7, 1.2]} position={[0, 1.35, 0]} castShadow>
        {/* Replace these leaf Boxes with model foliage or instanced leaf chunks later. */}
        <meshStandardMaterial color="#246b2f" roughness={0.8} />
      </Box>
      <Box args={[0.9, 0.65, 0.9]} position={[0, 1.85, 0]} castShadow>
        <meshStandardMaterial color="#2f8a3b" roughness={0.8} />
      </Box>
      <Box args={[0.65, 0.55, 0.65]} position={[0, 2.28, 0]} castShadow>
        <meshStandardMaterial color="#3fa34d" roughness={0.8} />
      </Box>
    </group>
  );
}
