import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';
import {
  MOONLIT_BIOME_ID,
  VOXEL_SIZE,
  getTerrainSurfaceY,
} from '../../world';

const TRUNK = '#34243d';
const TRUNK_DARK = '#201628';
const LEAF_DARK = '#1f2a52';
const LEAF_MID = '#33406f';
const LEAF_SILVER = '#91a9bd';
const FLOWER_CORE = '#c8fff5';
const FLOWER_BLUE = '#6ff3ff';
const FLOWER_VIOLET = '#c08cff';

function getGroundedPosition(x, z, yOffset = 0) {
  return [
    x,
    getTerrainSurfaceY(x, z, MOONLIT_BIOME_ID) + yOffset,
    z,
  ];
}

function Block({
  color,
  emissive,
  emissiveIntensity = 0.35,
  position,
  roughness = 0.78,
  size,
}) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive || '#000000'}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
        roughness={roughness}
      />
    </mesh>
  );
}

function MoonlitTree({ position, scale = 1 }) {
  const s = scale;
  const leafBlocks = [];
  const leafSize = 0.32;
  const layers = [
    { y: 1.38, radius: 3 },
    { y: 1.72, radius: 3 },
    { y: 2.06, radius: 2 },
    { y: 2.4, radius: 2 },
    { y: 2.74, radius: 1 },
  ];

  layers.forEach((layer, layerIndex) => {
    for (let x = -layer.radius; x <= layer.radius; x += 1) {
      for (let z = -layer.radius; z <= layer.radius; z += 1) {
        const corner = Math.abs(x) === layer.radius && Math.abs(z) === layer.radius;
        const hash = Math.abs(
          Math.sin((x + 11) * 12.989 + (z + 5) * 78.233 + layerIndex * 9.7)
        );

        if (corner && hash > 0.42) {
          continue;
        }

        const color = hash > 0.78
          ? LEAF_SILVER
          : hash > 0.38
            ? LEAF_MID
            : LEAF_DARK;

        leafBlocks.push([x * leafSize, layer.y, z * leafSize, color]);
      }
    }
  });

  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((segment) => (
        <Block
          key={`trunk-${segment}`}
          color={segment % 2 === 0 ? TRUNK_DARK : TRUNK}
          position={[0, (0.18 + segment * 0.32) * s, 0]}
          roughness={0.9}
          size={[0.34 * s, 0.34 * s, 0.34 * s]}
        />
      ))}
      {leafBlocks.map(([x, y, z, color], index) => (
        <Block
          key={`leaf-${index}`}
          color={color}
          position={[x * s, y * s, z * s]}
          roughness={0.68}
          size={[leafSize * s, leafSize * s, leafSize * s]}
        />
      ))}
    </group>
  );
}

function GlowFlowerPatch({ position, rotation = 0, scale = 1 }) {
  const s = scale;
  const flowers = [
    [-0.48, 0, -0.2, FLOWER_BLUE],
    [-0.18, 0, 0.24, FLOWER_VIOLET],
    [0.22, 0, -0.08, FLOWER_CORE],
    [0.54, 0, 0.18, FLOWER_BLUE],
  ];

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {flowers.map(([x, , z, color], index) => (
        <group key={index} position={[x * s, 0, z * s]}>
          <Block
            color="#49617d"
            position={[0, 0.08 * s, 0]}
            size={[0.06 * s, 0.16 * s, 0.06 * s]}
          />
          <Block
            color={color}
            emissive={color}
            emissiveIntensity={1.1}
            position={[0, 0.22 * s, 0]}
            roughness={0.4}
            size={[0.14 * s, 0.14 * s, 0.14 * s]}
          />
        </group>
      ))}
      <pointLight color="#8ff7ff" distance={3.5 * s} intensity={0.55} position={[0, 0.65 * s, 0]} />
    </group>
  );
}

function Fireflies() {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const count = 180;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 36;

      data[i * 3] = Math.cos(angle) * radius;
      data[i * 3 + 1] = 1.2 + Math.random() * 7;
      data[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) {
      return;
    }

    const time = clock.getElapsedTime();

    pointsRef.current.rotation.y = time * 0.025;
    pointsRef.current.position.y = Math.sin(time * 0.7) * 0.18;
    pointsRef.current.material.opacity = 0.5 + Math.sin(time * 1.4) * 0.16;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d8fff4"
        depthWrite={false}
        size={0.08}
        transparent
        opacity={0.62}
      />
    </points>
  );
}

function MoonlitMist() {
  const mistRef = useRef();
  const banks = useMemo(() => [
    [-24, -20, 8.5, 2.3, 0.1],
    [-18, 8, 10, 2.6, -0.25],
    [-8, -14, 7, 2, 0.45],
    [-3, 18, 11, 2.8, -0.55],
    [8, -22, 9, 2.35, 0.3],
    [12, 10, 7.5, 2.1, -0.1],
    [20, -6, 10.5, 2.7, 0.62],
    [26, 22, 8, 2.2, -0.38],
    [-28, 24, 9.5, 2.5, 0.2],
    [2, 0, 12, 3.1, 0],
  ], []);
  const motePositions = useMemo(() => {
    const count = 260;
    const data = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 42;

      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] = 0.45 + Math.random() * 2.2;
      data[index * 3 + 2] = Math.sin(angle) * radius;
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!mistRef.current) {
      return;
    }

    const time = clock.getElapsedTime();

    mistRef.current.position.x = Math.sin(time * 0.16) * 0.45;
    mistRef.current.position.z = Math.cos(time * 0.13) * 0.36;
    mistRef.current.rotation.y = Math.sin(time * 0.08) * 0.05;
  });

  return (
    <group ref={mistRef}>
      {banks.map(([x, z, width, depth, rotation], index) => (
        <mesh
          key={`mist-${index}`}
          position={getGroundedPosition(x, z, 0.24 + index * 0.006)}
          rotation={[-Math.PI / 2, 0, rotation]}
          scale={[width * 1.35, depth * 1.55, 1]}
          renderOrder={6}
        >
          <circleGeometry args={[1, 24]} />
          <meshBasicMaterial
            color="#e5efff"
            depthTest={false}
            depthWrite={false}
            fog
            opacity={0.24}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
      {banks.map(([x, z, width, depth], index) => (
        <mesh
          key={`mist-soft-${index}`}
          position={getGroundedPosition(x + 1.5, z - 1.2, 0.38 + index * 0.006)}
          rotation={[-Math.PI / 2, 0, index * 0.41]}
          scale={[width * 0.86, depth * 0.36, 1]}
          renderOrder={7}
        >
          <circleGeometry args={[1, 20]} />
          <meshBasicMaterial
            color="#c9ddff"
            depthTest={false}
            depthWrite={false}
            fog
            opacity={0.16}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
      <points renderOrder={8}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={motePositions}
            count={motePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#eef5ff"
          depthTest={false}
          depthWrite={false}
          opacity={0.26}
          size={0.16}
          transparent
        />
      </points>
    </group>
  );
}

function MoonDisc() {
  return (
    <group position={[-38, 48, -86]}>
      <mesh>
        <sphereGeometry args={[5.8, 24, 24]} />
        <meshBasicMaterial color="#dfe8ff" fog={false} />
      </mesh>
      <pointLight color="#b8d4ff" distance={95} intensity={1.35} />
    </group>
  );
}

export default function MoonlitLandmarks() {
  const trees = useMemo(() => [
    [-20, -12, 1.25],
    [-12, 18, 1.05],
    [12, -20, 1.18],
    [21, 8, 1.12],
    [3, 25, 0.95],
    [-25, 23, 1],
    [27, -8, 1.1],
  ], []);
  const flowers = useMemo(() => [
    [-7, -6, 0.2, 1.2],
    [8, 8, -0.55, 1],
    [-16, 7, 0.1, 0.95],
    [14, -3, 0.8, 1.15],
    [2, -18, 1.1, 1],
    [22, 20, -0.2, 0.9],
  ], []);

  return (
    <group>
      <MoonDisc />
      <MoonlitMist />
      <Fireflies />
      {trees.map(([x, z, scale]) => (
        <MoonlitTree
          key={`moon-tree-${x}-${z}`}
          position={getGroundedPosition(x, z, 0)}
          scale={scale}
        />
      ))}
      {flowers.map(([x, z, rotation, scale]) => (
        <GlowFlowerPatch
          key={`moon-flower-${x}-${z}`}
          position={getGroundedPosition(x, z, 0.03)}
          rotation={rotation}
          scale={scale}
        />
      ))}
      <hemisphereLight
        args={['#b8d6ff', '#171327', 0.42]}
      />
      <pointLight color="#a9c6ff" distance={22} intensity={0.65} position={[0, VOXEL_SIZE * 8, 4]} />
    </group>
  );
}
