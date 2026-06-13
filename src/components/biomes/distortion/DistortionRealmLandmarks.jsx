import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';
import {
  DISTORTION_BIOME_ID,
  VOXEL_SIZE,
  getTerrainSurfaceY,
} from '../../../game/biomeLandmarks';

function getGroundedPosition(x, z, yOffset = 0) {
  return [
    x,
    getTerrainSurfaceY(x, z, DISTORTION_BIOME_ID) + yOffset,
    z,
  ];
}

function VoidWisps() {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const count = 420;
    const data = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 52;

      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] = 1 + Math.random() * 18;
      data[index * 3 + 2] = Math.sin(angle) * radius;
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) {
      return;
    }

    const time = clock.getElapsedTime();

    pointsRef.current.rotation.y = time * -0.018;
    pointsRef.current.position.y = Math.sin(time * 0.45) * 0.5;
    pointsRef.current.material.opacity = 0.34 + Math.sin(time * 1.2) * 0.08;
  });

  return (
    <points ref={pointsRef} renderOrder={8}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c37cff"
        depthWrite={false}
        opacity={0.38}
        size={0.13}
        transparent
      />
    </points>
  );
}

function FloatingFragments() {
  const groupRef = useRef();
  const fragments = useMemo(() => [
    [-18, 9, -18, 5.2, 0.5, 1.2, 0.2],
    [18, 12, -12, 4.2, 0.45, 1.4, -0.5],
    [-26, 15, 10, 6.4, 0.55, 1, 0.7],
    [24, 7, 18, 4.8, 0.5, 1.1, -0.2],
    [2, 18, -30, 7.2, 0.45, 1.2, 0.35],
    [34, 20, -28, 3.5, 0.4, 1.1, 0.9],
  ], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const time = clock.getElapsedTime();

    groupRef.current.children.forEach((child, index) => {
      child.rotation.y = time * (0.08 + index * 0.012);
      child.rotation.z = Math.sin(time * 0.34 + index) * 0.18;
      child.position.y = fragments[index][1] + Math.sin(time * 0.55 + index) * 0.35;
    });
  });

  return (
    <group ref={groupRef}>
      {fragments.map(([x, y, z, width, height, depth, rotation], index) => (
        <mesh key={index} castShadow receiveShadow position={[x, y, z]} rotation={[0.22, rotation, 0.12]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? '#211548' : '#120c2a'}
            emissive="#14052a"
            emissiveIntensity={0.3}
            roughness={0.78}
          />
        </mesh>
      ))}
    </group>
  );
}

function RuneObelisk({ position, rotation = 0, scale = 1 }) {
  const s = scale;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.9 * s, 0]}>
        <boxGeometry args={[0.38 * s, 1.8 * s, 0.38 * s]} />
        <meshStandardMaterial
          color="#190d36"
          emissive="#2c0b5c"
          emissiveIntensity={0.48}
          roughness={0.68}
        />
      </mesh>
      <mesh position={[0, 1.86 * s, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.32 * s, 0]} />
        <meshBasicMaterial color="#cf8cff" fog={false} transparent opacity={0.9} />
      </mesh>
      <pointLight color="#b95cff" distance={7 * s} intensity={1.2} position={[0, 1.6 * s, 0]} />
    </group>
  );
}

function GravityBridgeGlow() {
  const bridges = useMemo(() => [
    [0, 0, 33, -24, 8.3],
    [0, 0, -32, -26, 4.6],
    [0, 0, 31, 24, 4.3],
    [0, 0, -24, 29, 7.4],
  ], []);

  return (
    <group>
      {bridges.map(([x1, z1, x2, z2, y], index) => {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.hypot(dx, dz) * VOXEL_SIZE;
        const angle = Math.atan2(dx, dz);

        return (
          <mesh
            key={index}
            position={[
              ((x1 + x2) * VOXEL_SIZE) / 2,
              y,
              ((z1 + z2) * VOXEL_SIZE) / 2,
            ]}
            rotation={[-Math.PI / 2, 0, -angle]}
            renderOrder={4}
          >
            <planeGeometry args={[2.2, length]} />
            <meshBasicMaterial
              color="#9c50ff"
              depthWrite={false}
              opacity={0.16}
              side={DoubleSide}
              transparent
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function DistortionRealmLandmarks() {
  const obelisks = useMemo(() => [
    [4, 7, 0.2, 1],
    [-14, -6, -0.4, 0.9],
    [16, -15, 0.5, 0.85],
    [-19, 20, 0.1, 0.95],
    [24, 18, -0.7, 0.8],
  ], []);

  return (
    <group>
      <VoidWisps />
      <FloatingFragments />
      <GravityBridgeGlow />
      {obelisks.map(([x, z, rotation, scale]) => (
        <RuneObelisk
          key={`${x}-${z}`}
          position={getGroundedPosition(x, z, 0)}
          rotation={rotation}
          scale={scale}
        />
      ))}
      <hemisphereLight args={['#8e5cff', '#02010a', 0.38]} />
      <pointLight color="#7d3cff" distance={55} intensity={1.35} position={[0, 16, 0]} />
    </group>
  );
}
