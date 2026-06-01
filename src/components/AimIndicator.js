import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';
import {
  PROJECTILE_GRAVITY,
  PROJECTILE_RADIUS,
  PROJECTILE_UPWARD_SPEED,
  THROW_FORWARD_OFFSET,
  THROW_HEIGHT_OFFSET,
} from '../game/projectilePhysics';
import { getTerrainSurfaceY } from '../game/world';

const SIMULATION_STEP = 0.08;
const MAX_SIMULATION_TIME = 3;
const forward = new Vector3();
const start = new Vector3();
const velocity = new Vector3();
const point = new Vector3();

function createThrowArc(player, throwPower) {
  player.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  start
    .copy(player.position)
    .addScaledVector(forward, THROW_FORWARD_OFFSET);
  start.y += THROW_HEIGHT_OFFSET;

  velocity.copy(forward).multiplyScalar(throwPower);
  velocity.y = PROJECTILE_UPWARD_SPEED;

  const points = [];
  let landingPoint = start.clone();

  for (let t = 0; t <= MAX_SIMULATION_TIME; t += SIMULATION_STEP) {
    point.set(
      start.x + velocity.x * t,
      start.y + velocity.y * t - 0.5 * PROJECTILE_GRAVITY * t * t,
      start.z + velocity.z * t
    );

    points.push(point.clone());

    const groundY = getTerrainSurfaceY(point.x, point.z) + PROJECTILE_RADIUS;

    if (point.y <= groundY && t > 0) {
      landingPoint = point.clone();
      landingPoint.y = groundY + 0.025;
      points[points.length - 1] = landingPoint.clone();
      break;
    }
  }

  return { landingPoint, points };
}

export default function AimIndicator({ ball, playerRef, throwPower }) {
  const lastSignature = useRef('');
  const [arc, setArc] = useState(() => ({
    landingPoint: new Vector3(0, 0, 0),
    points: [],
  }));

  useFrame(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const signature = [
      player.position.x.toFixed(2),
      player.position.y.toFixed(2),
      player.position.z.toFixed(2),
      player.rotation.y.toFixed(2),
      throwPower.toFixed(2),
    ].join(':');

    if (signature === lastSignature.current) {
      return;
    }

    lastSignature.current = signature;
    setArc(createThrowArc(player, throwPower));
  });

  if (arc.points.length < 2) {
    return null;
  }

  return (
    <group>
      <Line
        points={arc.points}
        color={ball?.accentColor || '#fff3a8'}
        lineWidth={2}
        transparent
        opacity={0.72}
        dashed
        dashScale={0.6}
        dashSize={0.28}
        gapSize={0.18}
      />

      <mesh
        position={arc.landingPoint}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.3, 0.48, 32]} />
        <meshBasicMaterial
          color={ball?.accentColor || '#fff3a8'}
          depthWrite={false}
          opacity={0.68}
          transparent
        />
      </mesh>
    </group>
  );
}
