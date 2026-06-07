import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';
import AnimatedModel from '../../entities/AnimatedModel';
import ModelErrorBoundary from '../../entities/ModelErrorBoundary';
import {
  getIceRoomById,
  getIceRoomInteriorExitPosition,
  getIceRoomLandmarks,
  ICE_ROOM_INTERIOR_EXIT_RADIUS,
  KYUREM_GUARDIAN_RADIUS,
  VOXEL_SIZE,
} from '../../world';

function GuardianFallback({ color = '#172033' }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[1.1, 1.5, 1.1]} />
        <meshStandardMaterial color={color} roughness={0.58} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.75, 0]}>
        <boxGeometry args={[1.45, 0.68, 1.45]} />
        <meshStandardMaterial color="#8ee7ff" roughness={0.35} emissive="#1a6d8f" />
      </mesh>
    </group>
  );
}

const CAVE_MOUTH_ROCKS = [
  [-1.35, -0.08, 0.02, 0.62, 1.12, 0.42, '#111a23'],
  [1.32, -0.04, 0, 0.68, 1.2, 0.42, '#121f2c'],
  [-0.56, 0.92, 0.03, 0.78, 0.56, 0.4, '#1b2e3e'],
  [0.52, 1.02, 0.01, 0.9, 0.52, 0.4, '#20364a'],
  [0, 1.34, -0.02, 0.7, 0.38, 0.36, '#0b1420'],
  [-1.02, -0.7, 0.05, 0.56, 0.34, 0.38, '#46677f'],
  [1.02, -0.66, 0.05, 0.62, 0.32, 0.38, '#5c8398'],
];

const CAVERN_EDGE_ROCKS = [
  [-4.15, 0.52, -2.85, 0.85, 1.05, 1.08],
  [-3.35, 0.62, -3.12, 0.95, 1.25, 0.78],
  [-2.32, 0.74, -3.36, 1.15, 1.48, 0.7],
  [-1.08, 0.6, -3.48, 0.95, 1.2, 0.82],
  [0.02, 0.7, -3.58, 1.12, 1.4, 0.74],
  [1.18, 0.63, -3.46, 0.98, 1.26, 0.78],
  [2.38, 0.78, -3.28, 1.08, 1.56, 0.88],
  [3.45, 0.58, -3.02, 0.92, 1.16, 0.94],
  [4.25, 0.5, -2.54, 0.78, 1.0, 1.24],
  [-4.38, 0.68, -1.48, 0.72, 1.36, 1.1],
  [-4.46, 0.9, -0.34, 0.7, 1.8, 1.28],
  [-4.24, 0.62, 1.04, 0.76, 1.24, 1.36],
  [-3.7, 0.54, 2.42, 0.95, 1.08, 1.1],
  [4.34, 0.66, -1.22, 0.78, 1.32, 1.18],
  [4.48, 0.82, 0.22, 0.68, 1.64, 1.36],
  [4.16, 0.58, 1.56, 0.84, 1.16, 1.22],
  [3.35, 0.5, 2.62, 1.05, 1.0, 0.98],
  [-2.4, 0.42, 3.26, 1.25, 0.84, 0.72],
  [-0.88, 0.36, 3.45, 1.1, 0.72, 0.66],
  [0.72, 0.38, 3.48, 1.28, 0.76, 0.68],
  [2.18, 0.42, 3.28, 1.18, 0.84, 0.72],
];

const CAVERN_LOW_ROCKS = [
  [-3.05, 0.18, 0.98, 0.9, 0.36, 0.7],
  [-2.4, 0.14, -1.52, 0.7, 0.28, 0.62],
  [2.7, 0.16, 1.06, 0.78, 0.32, 0.68],
  [2.18, 0.12, -1.48, 0.55, 0.24, 0.52],
  [-0.52, 0.1, 2.32, 0.75, 0.2, 0.44],
  [1.15, 0.12, 2.12, 0.66, 0.24, 0.48],
];

const CAVERN_CRYSTALS = [
  [-3.0, 0.42, -1.85, 0.55, 0.85, 0.48],
  [3.05, 0.38, -1.72, 0.52, 0.76, 0.46],
  [-3.12, 0.32, 1.52, 0.48, 0.64, 0.42],
  [2.95, 0.3, 1.72, 0.48, 0.6, 0.42],
  [0.15, 0.22, 2.66, 0.34, 0.44, 0.3],
];

const CAVERN_CEILING_SHADOWS = [
  [-2.8, 3.0, -1.55, 1.75, 0.48, 1.2],
  [-0.65, 3.18, -2.25, 1.45, 0.5, 1.05],
  [1.72, 3.02, -1.72, 1.65, 0.48, 1.25],
  [3.28, 2.82, 0.12, 1.22, 0.44, 1.7],
  [-3.45, 2.85, 0.36, 1.12, 0.44, 1.65],
];

function getRoomYaw(room) {
  return Math.abs(room.entranceCenter[0] - room.chamberCenter[0]) >
    Math.abs(room.entranceCenter[2] - room.chamberCenter[2])
    ? Math.PI / 2
    : 0;
}

function CaveMouth({ onEnterRoom = () => {}, playerRef, room }) {
  const enteredRef = useRef(false);
  const armedAtRef = useRef(null);
  const [x, y, z] = room.entranceCenter;
  const yaw = getRoomYaw(room);

  useFrame((state) => {
    const player = playerRef?.current;

    if (!player || enteredRef.current) {
      return;
    }

    if (armedAtRef.current === null) {
      armedAtRef.current = state.clock.elapsedTime + 0.35;
      return;
    }

    if (state.clock.elapsedTime < armedAtRef.current) {
      return;
    }

    const dx = player.position.x - x;
    const dz = player.position.z - z;

    if (Math.hypot(dx, dz) <= 1.45) {
      enteredRef.current = true;
      onEnterRoom(room.id);
    }
  });

  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.62, -0.12]} scale={[1.2, 0.9, 1]}>
        <circleGeometry args={[1.18, 24]} />
        <meshBasicMaterial
          color="#020407"
          depthWrite={false}
          opacity={0.99}
          side={DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[0, 0.62, -0.14]} scale={[1.35, 1.05, 1]}>
        <ringGeometry args={[1.08, 1.32, 24]} />
        <meshBasicMaterial
          color="#071525"
          depthWrite={false}
          opacity={0.74}
          side={DoubleSide}
          transparent
        />
      </mesh>
      {CAVE_MOUTH_ROCKS.map(([rockX, rockY, rockZ, width, height, depth, color], index) => (
        <mesh
          key={index}
          castShadow
          receiveShadow
          position={[rockX, rockY + 0.62, rockZ]}
        >
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
      <pointLight color="#5db7ff" distance={4.5} intensity={0.55} position={[0, 0.95, 0.9]} />
    </group>
  );
}

function KyuremGuardian({ room }) {
  const url = useMemo(() => encodeURI(room.assetUrl), [room.assetUrl]);

  return (
    <group position={room.guardianPosition}>
      <ModelErrorBoundary
        resetKey={url}
        fallback={<GuardianFallback color={room.id === 'black' ? '#111827' : '#d9f4ff'} />}
      >
        <Suspense fallback={<GuardianFallback color={room.id === 'black' ? '#111827' : '#d9f4ff'} />}>
          <AnimatedModel
            url={url}
            actionName="Idle"
            fallbackActionName={['Walk', 'Run']}
            rotation={room.modelRotation}
            scale={room.modelScale}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
}

function RoomShell({ room }) {
  const [x, y, z] = room.chamberCenter;
  const wallColor = room.id === 'black' ? '#0b1420' : '#132330';
  const wallAccent = room.id === 'black' ? '#18293a' : '#203948';
  const floorColor = room.id === 'black' ? '#6ca3b5' : '#9bddeb';
  const iceColor = room.id === 'black' ? '#28a9dc' : '#77e8ff';
  const glowColor = room.id === 'black' ? '#31b6ff' : '#9ff4ff';

  return (
    <group position={[x, y, z]}>
      <mesh receiveShadow position={[0, -0.07, 0]}>
        <boxGeometry args={[VOXEL_SIZE * 10.4, 0.1, VOXEL_SIZE * 9.2]} />
        <meshStandardMaterial color="#07101a" roughness={0.95} />
      </mesh>

      <mesh receiveShadow position={[-1.55, 0, -0.08]}>
        <boxGeometry args={[VOXEL_SIZE * 5.1, 0.12, VOXEL_SIZE * 4.9]} />
        <meshStandardMaterial color={floorColor} roughness={0.62} />
      </mesh>
      <mesh receiveShadow position={[1.8, 0.01, -0.1]}>
        <boxGeometry args={[VOXEL_SIZE * 4.55, 0.12, VOXEL_SIZE * 4.2]} />
        <meshStandardMaterial color="#b9eef8" roughness={0.56} />
      </mesh>
      <mesh receiveShadow position={[0.1, 0.03, 1.95]}>
        <boxGeometry args={[VOXEL_SIZE * 3.8, 0.1, VOXEL_SIZE * 1.95]} />
        <meshStandardMaterial color="#83c8d8" roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[KYUREM_GUARDIAN_RADIUS * 1.85, 40]} />
        <meshBasicMaterial color="#9ff4ff" transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {CAVERN_EDGE_ROCKS.map(([rockX, rockY, rockZ, width, height, depth], index) => (
        <mesh key={`edge-${index}`} castShadow receiveShadow position={[rockX, rockY, rockZ]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? wallAccent : wallColor}
            roughness={0.94}
          />
        </mesh>
      ))}

      {CAVERN_LOW_ROCKS.map(([rockX, rockY, rockZ, width, height, depth], index) => (
        <mesh key={`low-${index}`} castShadow receiveShadow position={[rockX, rockY, rockZ]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color="#263d4e" roughness={0.9} />
        </mesh>
      ))}

      {CAVERN_CEILING_SHADOWS.map(([rockX, rockY, rockZ, width, height, depth], index) => (
        <mesh key={`ceiling-${index}`} castShadow receiveShadow position={[rockX, rockY, rockZ]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color="#030812" roughness={0.98} />
        </mesh>
      ))}

      {CAVERN_CRYSTALS.map(([crystalX, crystalY, crystalZ, width, height, depth], index) => (
        <group key={`crystal-${index}`} position={[crystalX, crystalY, crystalZ]}>
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={iceColor}
              emissive="#0878a8"
              emissiveIntensity={0.85}
              roughness={0.28}
            />
          </mesh>
          <pointLight color={glowColor} distance={3.5} intensity={0.62} position={[0, 0.55, 0]} />
        </group>
      ))}

      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[KYUREM_GUARDIAN_RADIUS * 0.9, KYUREM_GUARDIAN_RADIUS * 1.62, 40]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.26} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.78, -2.92]}>
        <boxGeometry args={[VOXEL_SIZE * 4.2, VOXEL_SIZE * 0.5, VOXEL_SIZE * 0.55]} />
        <meshStandardMaterial color="#050a11" roughness={0.96} />
      </mesh>
      <pointLight color={glowColor} distance={12} intensity={1.65} position={[0, 2.35, 0]} />
      <pointLight color="#244bff" distance={8} intensity={0.65} position={[0, 1.65, -2.3]} />
    </group>
  );
}

function ExitTrigger({ onExitRoom = () => {}, playerRef, room }) {
  const exitRef = useRef(false);
  const armedAtRef = useRef(null);
  const exitPosition = getIceRoomInteriorExitPosition(room.id);

  useFrame((state) => {
    const player = playerRef?.current;

    if (!player || exitRef.current) {
      return;
    }

    if (armedAtRef.current === null) {
      armedAtRef.current = state.clock.elapsedTime + 0.55;
      return;
    }

    if (state.clock.elapsedTime < armedAtRef.current) {
      return;
    }

    const dx = player.position.x - exitPosition[0];
    const dz = player.position.z - exitPosition[2];

    if (Math.hypot(dx, dz) <= ICE_ROOM_INTERIOR_EXIT_RADIUS) {
      exitRef.current = true;
      onExitRoom(room.id);
    }
  });

  return (
    <group position={exitPosition}>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[VOXEL_SIZE * 2, VOXEL_SIZE * 1.8, 0.08]} />
        <meshBasicMaterial color="#040810" transparent opacity={0.82} />
      </mesh>
      <pointLight color="#bdefff" distance={4.5} intensity={0.9} position={[0, 1.1, 0.5]} />
    </group>
  );
}

export function IceKyuremRoomInterior({
  activeRoomId,
  onExitRoom,
  playerRef,
}) {
  const room = useMemo(() => getIceRoomById(activeRoomId), [activeRoomId]);

  if (!room) {
    return null;
  }

  return (
    <>
      <RoomShell room={room} />
      <KyuremGuardian room={room} />
      <ExitTrigger
        onExitRoom={onExitRoom}
        playerRef={playerRef}
        room={room}
      />
    </>
  );
}

export default function IceMountainLandmarks({
  onEnterRoom = () => {},
  playerRef,
}) {
  const rooms = useMemo(() => getIceRoomLandmarks(), []);

  return (
    <>
      {rooms.map((room) => (
        <CaveMouth
          key={room.id}
          onEnterRoom={onEnterRoom}
          playerRef={playerRef}
          room={room}
        />
      ))}
    </>
  );
}
