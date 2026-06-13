import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import {
  CAVE_ENTRANCE_POSITION,
  CAVE_ENTRANCE_RADIUS,
  VOXEL_SIZE,
} from '../../../game/biomeLandmarks';

const ROCK_COLOR = '#343a3d';
const DARK_DOOR_COLOR = '#090d11';

const moundBlocks = [
  [-3, 0, -2, 1, 1, 1],
  [-2, 0, -3, 1, 1, 1],
  [-1, 0, -3, 1, 1, 1],
  [0, 0, -3, 1, 1, 1],
  [1, 0, -3, 1, 1, 1],
  [2, 0, -3, 1, 1, 1],
  [3, 0, -2, 1, 1, 1],
  [-3, 1, -1, 1, 1, 1],
  [-2, 1, -2, 1, 1, 1],
  [2, 1, -2, 1, 1, 1],
  [3, 1, -1, 1, 1, 1],
  [-2, 2, -1, 1, 1, 1],
  [-1, 2, -2, 1, 1, 1],
  [0, 2, -2, 1, 1, 1],
  [1, 2, -2, 1, 1, 1],
  [2, 2, -1, 1, 1, 1],
  [-1, 3, -1, 1, 1, 1],
  [0, 3, -1, 1, 1, 1],
  [1, 3, -1, 1, 1, 1],
];

export default function CaveEntrance({
  onEnterCave,
  playerRef,
}) {
  const enteredRef = useRef(false);

  useFrame(() => {
    const player = playerRef?.current;

    if (!player || !onEnterCave || enteredRef.current) {
      return;
    }

    const dx = player.position.x - CAVE_ENTRANCE_POSITION[0];
    const dz = player.position.z - CAVE_ENTRANCE_POSITION[2];

    if (Math.hypot(dx, dz) <= CAVE_ENTRANCE_RADIUS) {
      enteredRef.current = true;
      onEnterCave();
    }
  });

  return (
    <group position={CAVE_ENTRANCE_POSITION}>
      <mesh position={[0, 0.45, -1.55]}>
        <boxGeometry args={[VOXEL_SIZE * 3, VOXEL_SIZE * 2.2, VOXEL_SIZE * 0.35]} />
        <meshBasicMaterial color={DARK_DOOR_COLOR} />
      </mesh>

      {moundBlocks.map(([x, y, z], index) => (
        <mesh
          key={index}
          castShadow
          receiveShadow
          position={[
            x * VOXEL_SIZE,
            y * VOXEL_SIZE + VOXEL_SIZE * 0.5,
            z * VOXEL_SIZE,
          ]}
        >
          <boxGeometry args={[VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE]} />
          <meshStandardMaterial color={ROCK_COLOR} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}
