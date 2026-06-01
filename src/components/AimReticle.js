import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';
import { getTerrainSurfaceY } from '../game/world';

const RETICLE_DISTANCE = 3;
const forward = new Vector3();

export default function AimReticle({ playerRef }) {
  const reticleRef = useRef();

  useFrame(() => {
    const player = playerRef.current;
    const reticle = reticleRef.current;

    if (!player || !reticle) {
      return;
    }

    player.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const x = player.position.x + forward.x * RETICLE_DISTANCE;
    const z = player.position.z + forward.z * RETICLE_DISTANCE;

    reticle.position.set(x, getTerrainSurfaceY(x, z) + 0.035, z);
    reticle.rotation.z = -player.rotation.y;
  });

  return (
    <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.28, 0.42, 32]} />
      <meshBasicMaterial
        color="#fff3a8"
        depthWrite={false}
        opacity={0.55}
        transparent
      />
    </mesh>
  );
}
