import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, FogExp2, MathUtils } from 'three';

const SNOW_PARTICLE_COUNT = 2400;
const SNOW_RADIUS = 34;
const SNOW_HEIGHT = 24;
const CLEAR_FOG_DENSITY = 0.005;
const STORM_FOG_DENSITY = 0.038;
const CLEAR_FOG_COLOR = new Color('#d8eefb');
const STORM_FOG_COLOR = new Color('#e8f6ff');
const SNOW_COLOR = '#f7fbff';
const WIND_X_SPEED = 1.8;
const WIND_Z_SPEED = -4.2;
const FALL_SPEED = 3.8;

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export default function Snowstorm({ playerRef }) {
  const { scene } = useThree();
  const pointsRef = useRef();
  const previousFogRef = useRef(null);
  const [isStorming, setIsStorming] = useState(false);
  const positions = useMemo(() => {
    const nextPositions = new Float32Array(SNOW_PARTICLE_COUNT * 3);

    for (let index = 0; index < SNOW_PARTICLE_COUNT; index += 1) {
      const offset = index * 3;

      nextPositions[offset] = randomRange(-SNOW_RADIUS, SNOW_RADIUS);
      nextPositions[offset + 1] = randomRange(1, SNOW_HEIGHT);
      nextPositions[offset + 2] = randomRange(-SNOW_RADIUS, SNOW_RADIUS);
    }

    return nextPositions;
  }, []);
  const driftOffsets = useMemo(() => {
    const offsets = new Float32Array(SNOW_PARTICLE_COUNT);

    for (let index = 0; index < SNOW_PARTICLE_COUNT; index += 1) {
      offsets[index] = randomRange(0, Math.PI * 2);
    }

    return offsets;
  }, []);

  useEffect(() => {
    let timeoutId;
    let isCancelled = false;

    const scheduleClear = () => {
      timeoutId = window.setTimeout(() => {
        if (isCancelled) {
          return;
        }

        setIsStorming(true);
        scheduleStorm();
      }, randomRange(12000, 26000));
    };

    const scheduleStorm = () => {
      timeoutId = window.setTimeout(() => {
        if (isCancelled) {
          return;
        }

        setIsStorming(false);
        scheduleClear();
      }, randomRange(12000, 22000));
    };

    scheduleClear();

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
    const points = pointsRef.current;

    if (!points) {
      return;
    }

    const player = playerRef?.current;
    const centerX = player?.position.x || 0;
    const centerZ = player?.position.z || 0;
    const positionAttribute = points.geometry.attributes.position;
    const array = positionAttribute.array;
    const elapsedTime = clock.elapsedTime;
    const targetOpacity = isStorming ? 0.88 : 0;
    const intensity = MathUtils.clamp(points.material.opacity / 0.88, 0, 1);

    for (let index = 0; index < SNOW_PARTICLE_COUNT; index += 1) {
      const offset = index * 3;
      const drift = Math.sin(elapsedTime * 1.4 + driftOffsets[index]) * 0.8;

      array[offset] += (WIND_X_SPEED + drift) * delta * (0.35 + intensity);
      array[offset + 1] -= FALL_SPEED * delta * (0.45 + intensity);
      array[offset + 2] += WIND_Z_SPEED * delta * (0.35 + intensity);

      if (array[offset + 1] < 0) {
        array[offset] = centerX + randomRange(-SNOW_RADIUS, SNOW_RADIUS);
        array[offset + 1] = SNOW_HEIGHT;
        array[offset + 2] = centerZ + randomRange(-SNOW_RADIUS, SNOW_RADIUS);
      }

      if (array[offset] - centerX > SNOW_RADIUS) {
        array[offset] = centerX - SNOW_RADIUS;
      }

      if (array[offset] - centerX < -SNOW_RADIUS) {
        array[offset] = centerX + SNOW_RADIUS;
      }

      if (array[offset + 2] - centerZ > SNOW_RADIUS) {
        array[offset + 2] = centerZ - SNOW_RADIUS;
      }

      if (array[offset + 2] - centerZ < -SNOW_RADIUS) {
        array[offset + 2] = centerZ + SNOW_RADIUS;
      }
    }

    positionAttribute.needsUpdate = true;
    points.material.opacity = MathUtils.lerp(
      points.material.opacity,
      targetOpacity,
      0.04
    );

    if (scene.fog?.isFogExp2) {
      const targetDensity = isStorming
        ? STORM_FOG_DENSITY
        : CLEAR_FOG_DENSITY;
      const targetColor = isStorming ? STORM_FOG_COLOR : CLEAR_FOG_COLOR;

      scene.fog.density = MathUtils.lerp(
        scene.fog.density,
        targetDensity,
        0.03
      );
      scene.fog.color.lerp(targetColor, 0.025);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={SNOW_PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={SNOW_COLOR}
        depthWrite={false}
        opacity={0}
        size={0.13}
        transparent
      />
    </points>
  );
}
