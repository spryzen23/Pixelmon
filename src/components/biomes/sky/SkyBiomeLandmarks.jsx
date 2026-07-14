import { useMemo } from "react";
import {
  SKY_BIOME_ID,
  VOXEL_SIZE,
  getTerrainSurfaceY,
} from "../../../game/biomeLandmarks";

const CLOUD = "#f7fcff";
const CLOUD_SHADE = "#d7edf8";
const SKY_STONE = "#b7c6d1";
const GOLD = "#f5dc76";
const TRUNK = "#5d3d25";
const LEAF = "#3d9838";
const LEAF_LIGHT = "#62bd54";
const FLOWER = "#f3d4ff";

function Block({
  color,
  emissive,
  opacity = 1,
  position,
  roughness = 0.72,
  size,
}) {
  return (
    <mesh castShadow={opacity >= 0.9} receiveShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive || "#000000"}
        emissiveIntensity={emissive ? 0.28 : 0}
        opacity={opacity}
        roughness={roughness}
        transparent={opacity < 1}
      />
    </mesh>
  );
}

function getGroundedPosition(x, z, yOffset = 0) {
  return [x, getTerrainSurfaceY(x, z, SKY_BIOME_ID) + yOffset, z];
}

function CloudPuff({ position, scale = 1 }) {
  const s = scale;
  const cubes = [
    [0, 0.16, 0, 1.25, CLOUD],
    [0.78, 0.12, 0.1, 0.9, CLOUD],
    [-0.76, 0.1, -0.05, 0.92, CLOUD_SHADE],
    [0.08, 0.4, -0.18, 0.82, CLOUD],
    [1.35, 0.04, -0.12, 0.58, CLOUD_SHADE],
    [-1.28, 0.02, 0.18, 0.55, CLOUD],
  ];

  return (
    <group position={position}>
      {cubes.map(([x, y, z, size, color], index) => (
        <Block
          key={index}
          color={color}
          opacity={0.72}
          position={[x * s, y * s, z * s]}
          size={[size * s, size * 0.45 * s, size * s]}
        />
      ))}
    </group>
  );
}

function SkyTree({ position, scale = 1 }) {
  const s = scale;
  const leafBlocks = [
    [0, 1.15, 0, 1, LEAF],
    [0.48, 1.1, 0.1, 0.78, LEAF_LIGHT],
    [-0.48, 1.1, -0.1, 0.78, LEAF],
    [0.1, 1.48, -0.08, 0.72, LEAF_LIGHT],
    [0.12, 1.05, 0.54, 0.62, FLOWER],
    [-0.24, 1.25, -0.52, 0.5, FLOWER],
  ];

  return (
    <group position={position}>
      <Block
        color={TRUNK}
        position={[0, 0.42 * s, 0]}
        size={[0.28 * s, 0.84 * s, 0.28 * s]}
      />
      {leafBlocks.map(([x, y, z, size, color], index) => (
        <Block
          key={index}
          color={color}
          position={[x * s, y * s, z * s]}
          size={[size * s, size * s, size * s]}
        />
      ))}
    </group>
  );
}

function SkyGate({ position }) {
  return (
    <group position={position}>
      <Block
        color={SKY_STONE}
        position={[-1.15, 0.8, 0]}
        size={[0.38, 1.6, 0.38]}
      />
      <Block
        color={SKY_STONE}
        position={[1.15, 0.8, 0]}
        size={[0.38, 1.6, 0.38]}
      />
      <Block
        color={SKY_STONE}
        position={[0, 1.72, 0]}
        size={[2.75, 0.38, 0.42]}
      />
      <Block
        color={GOLD}
        emissive="#fff0a0"
        position={[0, 1.22, 0]}
        size={[0.58, 0.58, 0.18]}
      />
      <pointLight
        color="#fff1a5"
        distance={7}
        intensity={0.85}
        position={[0, 1.55, 0]}
      />
    </group>
  );
}

function GrassPatch({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Block color="#79d65d" position={[0, 0.05, 0]} size={[2.2, 0.1, 0.32]} />
      <Block
        color="#bfeea7"
        position={[0.7, 0.08, 0.28]}
        size={[1.1, 0.08, 0.24]}
      />
      <Block
        color={FLOWER}
        position={[-0.85, 0.11, -0.2]}
        size={[0.34, 0.12, 0.34]}
      />
    </group>
  );
}

export default function SkyBiomeLandmarks() {
  const clouds = useMemo(
    () => [
      [-19, -9, 1.15],
      [19, -8, 1],
      [-17, 13, 0.95],
      [18, 15, 1.08],
      [0, 23, 0.9],
      [0, -25, 1.05],
    ],
    []
  );
  const trees = useMemo(
    () => [
      [-13, -7, 1.15],
      [12, -12, 0.95],
      [-9, 14, 1.05],
      [14, 10, 0.9],
    ],
    []
  );
  const patches = useMemo(
    () => [
      [-5, -5, 0.2],
      [6, 4, -0.5],
      [-12, 4, 0.9],
      [10, -2, -0.1],
    ],
    []
  );

  return (
    <group>
      {clouds.map(([x, z, scale]) => (
        <CloudPuff
          key={`${x}-${z}`}
          position={getGroundedPosition(x, z, 0.26)}
          scale={scale}
        />
      ))}
      {trees.map(([x, z, scale]) => (
        <SkyTree
          key={`tree-${x}-${z}`}
          position={getGroundedPosition(x, z, 0)}
          scale={scale}
        />
      ))}
      {patches.map(([x, z, rotation]) => (
        <GrassPatch
          key={`patch-${x}-${z}`}
          position={getGroundedPosition(x, z, 0.04)}
          rotation={rotation}
        />
      ))}
      <SkyGate position={getGroundedPosition(0, -13, 0)} />
      <Block
        color="#93d8f2"
        emissive="#79dfff"
        opacity={0.72}
        position={getGroundedPosition(-6, 4, 0.04)}
        roughness={0.28}
        size={[3.4, 0.08, 2.2]}
      />
      <pointLight
        color="#bdefff"
        distance={24}
        intensity={0.65}
        position={[0, VOXEL_SIZE * 14, 0]}
      />
    </group>
  );
}
