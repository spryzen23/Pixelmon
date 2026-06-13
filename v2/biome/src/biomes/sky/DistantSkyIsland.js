import { useMemo } from 'react';

const SKY_ISLAND_PLACEMENTS = {
  0: {
    position: [74, 46, -172],
    rotation: [0.08, -0.35, 0],
    scale: 1.15,
  },
  1: {
    position: [-168, 42, -62],
    rotation: [0.06, 0.74, 0],
    scale: 1.05,
  },
  2: {
    position: [176, 50, 48],
    rotation: [0.1, -1.18, 0],
    scale: 1.22,
  },
  3: {
    position: [-96, 49, 164],
    rotation: [0.07, 2.42, 0],
    scale: 1.12,
  },
  4: {
    position: [152, 45, -138],
    rotation: [0.08, -0.78, 0],
    scale: 1.08,
  },
  5: {
    position: [-164, 54, 92],
    rotation: [0.1, 1.88, 0],
    scale: 1.18,
  },
};

function Block({ color, opacity = 0.72, position, size }) {
  return (
    <mesh position={position} receiveShadow={false} castShadow={false}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        depthWrite={false}
        fog
        opacity={opacity}
        roughness={0.82}
        transparent
      />
    </mesh>
  );
}

function CloudPuff({ position, scale = 1 }) {
  const blocks = [
    [0, 0, 0, 3.4],
    [2.1, -0.1, 0.4, 2.4],
    [-2.2, -0.05, -0.2, 2.2],
    [0.4, 0.65, -0.35, 2],
  ];

  return (
    <group position={position}>
      {blocks.map(([x, y, z, size], index) => (
        <Block
          key={index}
          color="#f5fbff"
          opacity={0.38}
          position={[x * scale, y * scale, z * scale]}
          size={[size * scale, size * 0.38 * scale, size * scale]}
        />
      ))}
    </group>
  );
}

export default function DistantSkyIsland({ currentBiome = 0 }) {
  const placement = SKY_ISLAND_PLACEMENTS[currentBiome] ||
    SKY_ISLAND_PLACEMENTS[0];
  const rimBlocks = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => {
      const angle = (index / 20) * Math.PI * 2;
      const radius = 8 + Math.sin(index * 2.7) * 1.2;

      return [
        Math.cos(angle) * radius,
        Math.sin(index * 1.9) * 0.6,
        Math.sin(angle) * radius * 0.72,
        2.8 + Math.sin(index) * 0.55,
      ];
    });
  }, []);

  return (
    <group
      position={placement.position}
      rotation={placement.rotation}
      scale={[placement.scale, placement.scale, placement.scale]}
    >
      <Block color="#6bcf4e" opacity={0.42} position={[0, 2.7, 0]} size={[15, 1.2, 10]} />
      <Block color="#3f8f3a" opacity={0.38} position={[0, 1.8, 0]} size={[18, 1.5, 11]} />
      {rimBlocks.map(([x, y, z, size], index) => (
        <Block
          key={`rim-${index}`}
          color={index % 3 === 0 ? '#7dd961' : '#4f9c43'}
          opacity={0.36}
          position={[x, 2.25 + y, z]}
          size={[size, 1.2, size * 0.86]}
        />
      ))}
      <Block color="#69736f" opacity={0.45} position={[0, -1.4, 0]} size={[12, 4.8, 8]} />
      <Block color="#4e5855" opacity={0.42} position={[0, -5.7, 0]} size={[7.4, 4.2, 5.1]} />
      <Block color="#36413f" opacity={0.38} position={[0, -9.2, 0]} size={[3.6, 3.3, 2.4]} />
      <CloudPuff position={[-8, -2.8, 2]} scale={1.1} />
      <CloudPuff position={[9, -3.6, -1.4]} scale={0.92} />
    </group>
  );
}
