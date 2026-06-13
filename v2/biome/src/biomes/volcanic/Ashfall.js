import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, FogExp2, MathUtils } from 'three';

const ASH_PARTICLE_COUNT = 2200;
const ASH_RADIUS = 38;
const ASH_HEIGHT = 22;
const CLEAR_FOG_DENSITY = 0.007;
const ASH_FOG_DENSITY = 0.026;
const CLEAR_FOG_COLOR = new Color('#6a3d35');
const ASH_FOG_COLOR = new Color('#3a2e2d');
const ASH_COLOR = '#5f5b56';
const EMBER_COLOR = '#ff7a18';
const WIND_X_SPEED = -2.2;
const WIND_Z_SPEED = 3.4;
const FALL_SPEED = 1.35;

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export default function Ashfall({ playerRef }) {
  const { scene } = useThree();
  const ashRef = useRef();
  const emberRef = useRef();
  const previousFogRef = useRef(null);
  const [isAshy, setIsAshy] = useState(false);
  const ashPositions = useMemo(() => {
    const positions = new Float32Array(ASH_PARTICLE_COUNT * 3);

    for (let index = 0; index < ASH_PARTICLE_COUNT; index += 1) {
      const offset = index * 3;

      positions[offset] = randomRange(-ASH_RADIUS, ASH_RADIUS);
      positions[offset + 1] = randomRange(1, ASH_HEIGHT);
      positions[offset + 2] = randomRange(-ASH_RADIUS, ASH_RADIUS);
    }

    return positions;
  }, []);
  const emberPositions = useMemo(() => {
    const count = Math.floor(ASH_PARTICLE_COUNT * 0.08);
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;

      positions[offset] = randomRange(-ASH_RADIUS, ASH_RADIUS);
      positions[offset + 1] = randomRange(1, ASH_HEIGHT * 0.65);
      positions[offset + 2] = randomRange(-ASH_RADIUS, ASH_RADIUS);
    }

    return positions;
  }, []);

  useEffect(() => {
    let timeoutId;
    let isCancelled = false;

    const scheduleClear = () => {
      timeoutId = window.setTimeout(() => {
        if (isCancelled) {
          return;
        }

        setIsAshy(true);
        scheduleAsh();
      }, randomRange(8000, 16000));
    };

    const scheduleAsh = () => {
      timeoutId = window.setTimeout(() => {
        if (isCancelled) {
          return;
        }

        setIsAshy(false);
        scheduleClear();
      }, randomRange(14000, 26000));
    };

    setIsAshy(true);
    scheduleAsh();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    previousFogRef.current = scene.fog;
    scene.fog = new FogExp2(CLEAR_FOG_COLOR, CLEAR_FOG_DENSITY);

    return () => {
      if (scene.fog?.isFogExp2) {
        scene.fog.density = CLEAR_FOG_DENSITY;
        scene.fog.color.copy(CLEAR_FOG_COLOR);
      }

      scene.fog = previousFogRef.current;
    };
  }, [scene]);

  useFrame(({ clock }, delta) => {
    const ash = ashRef.current;
    const ember = emberRef.current;

    if (!ash) {
      return;
    }

    const player = playerRef?.current;
    const centerX = player?.position.x || 0;
    const centerZ = player?.position.z || 0;
    const targetOpacity = isAshy ? 0.72 : 0.12;
    const intensity = MathUtils.clamp(ash.material.opacity / 0.72, 0, 1);
    const elapsedTime = clock.elapsedTime;
    const updateParticles = (points, count, fallMultiplier, swayMultiplier) => {
      const positionAttribute = points.geometry.attributes.position;
      const array = positionAttribute.array;

      for (let index = 0; index < count; index += 1) {
        const offset = index * 3;
        const sway = Math.sin(elapsedTime * 1.6 + index * 0.37) * swayMultiplier;

        array[offset] += (WIND_X_SPEED + sway) * delta * (0.4 + intensity);
        array[offset + 1] -= FALL_SPEED * fallMultiplier * delta;
        array[offset + 2] += WIND_Z_SPEED * delta * (0.4 + intensity);

        if (array[offset + 1] < 0.2) {
          array[offset] = centerX + randomRange(-ASH_RADIUS, ASH_RADIUS);
          array[offset + 1] = randomRange(ASH_HEIGHT * 0.5, ASH_HEIGHT);
          array[offset + 2] = centerZ + randomRange(-ASH_RADIUS, ASH_RADIUS);
        }

        if (array[offset] - centerX > ASH_RADIUS) {
          array[offset] = centerX - ASH_RADIUS;
        }

        if (array[offset] - centerX < -ASH_RADIUS) {
          array[offset] = centerX + ASH_RADIUS;
        }

        if (array[offset + 2] - centerZ > ASH_RADIUS) {
          array[offset + 2] = centerZ - ASH_RADIUS;
        }

        if (array[offset + 2] - centerZ < -ASH_RADIUS) {
          array[offset + 2] = centerZ + ASH_RADIUS;
        }
      }

      positionAttribute.needsUpdate = true;
    };

    updateParticles(ash, ASH_PARTICLE_COUNT, 1, 0.9);
    ash.material.opacity = MathUtils.lerp(ash.material.opacity, targetOpacity, 0.035);

    if (ember) {
      updateParticles(ember, emberPositions.length / 3, 0.45, 1.3);
      ember.material.opacity = MathUtils.lerp(
        ember.material.opacity,
        isAshy ? 0.38 : 0.04,
        0.035
      );
    }

    if (scene.fog?.isFogExp2) {
      scene.fog.density = MathUtils.lerp(
        scene.fog.density,
        isAshy ? ASH_FOG_DENSITY : CLEAR_FOG_DENSITY,
        0.03
      );
      scene.fog.color.lerp(isAshy ? ASH_FOG_COLOR : CLEAR_FOG_COLOR, 0.025);
    }
  });

  return (
    <>
      <points ref={ashRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={ashPositions}
            count={ASH_PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={ASH_COLOR}
          depthWrite={false}
          opacity={0}
          size={0.12}
          transparent
        />
      </points>
      <points ref={emberRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={emberPositions}
            count={emberPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={EMBER_COLOR}
          depthWrite={false}
          opacity={0}
          size={0.08}
          transparent
        />
      </points>
    </>
  );
}
