import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, FogExp2, MathUtils } from 'three';

const PARTICLE_COUNT = 3000;
const TORNADO_PARTICLE_COUNT = 850;
const STORM_RADIUS = 30;
const STORM_HEIGHT = 20;
const TORNADO_HEIGHT = 17;
const TORNADO_BOTTOM_RADIUS = 0.35;
const TORNADO_TOP_RADIUS = 4.8;
const CLEAR_FOG_DENSITY = 0.006;
const STORM_FOG_DENSITY = 0.055;
const CLEAR_FOG_COLOR = new Color('#d8eefb');
const STORM_FOG_COLOR = new Color('#d2b48c');
const WIND_X_SPEED = 12;
const WIND_Z_SPEED = 5;
const PARTICLE_COLOR = '#d2b48c';

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export default function Sandstorm({ playerRef }) {
  const { scene } = useThree();
  const pointsRef = useRef();
  const tornadoRef = useRef();
  const previousFogRef = useRef(null);
  const [isStorming, setIsStorming] = useState(false);
  const positions = useMemo(() => {
    const nextPositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const offset = index * 3;

      nextPositions[offset] = randomRange(-STORM_RADIUS, STORM_RADIUS);
      nextPositions[offset + 1] = randomRange(0, STORM_HEIGHT);
      nextPositions[offset + 2] = randomRange(-STORM_RADIUS, STORM_RADIUS);
    }

    return nextPositions;
  }, []);
  const tornadoData = useMemo(() => {
    const nextPositions = new Float32Array(TORNADO_PARTICLE_COUNT * 3);
    const heights = new Float32Array(TORNADO_PARTICLE_COUNT);
    const angles = new Float32Array(TORNADO_PARTICLE_COUNT);
    const radiusOffsets = new Float32Array(TORNADO_PARTICLE_COUNT);
    const speeds = new Float32Array(TORNADO_PARTICLE_COUNT);

    for (let index = 0; index < TORNADO_PARTICLE_COUNT; index += 1) {
      const offset = index * 3;
      const heightPercent = Math.random();

      heights[index] = heightPercent * TORNADO_HEIGHT;
      angles[index] = randomRange(0, Math.PI * 2);
      radiusOffsets[index] = randomRange(-0.35, 0.45);
      speeds[index] = randomRange(2.6, 4.8);
      nextPositions[offset] = 0;
      nextPositions[offset + 1] = heights[index];
      nextPositions[offset + 2] = 0;
    }

    return {
      angles,
      heights,
      positions: nextPositions,
      radiusOffsets,
      speeds,
    };
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
      }, randomRange(15000, 30000));
    };

    const scheduleStorm = () => {
      timeoutId = window.setTimeout(() => {
        if (isCancelled) {
          return;
        }

        setIsStorming(false);
        scheduleClear();
      }, randomRange(10000, 20000));
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
    const tornado = tornadoRef.current;

    if (!points) {
      return;
    }

    const player = playerRef?.current;
    const centerX = player?.position.x || 0;
    const centerZ = player?.position.z || 0;
    const geometry = points.geometry;
    const positionAttribute = geometry.attributes.position;
    const array = positionAttribute.array;
    const windX = WIND_X_SPEED * delta;
    const windZ = WIND_Z_SPEED * delta;
    const stormIntensity = isStorming ? 1 : 0;
    const elapsedTime = clock.elapsedTime;

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const offset = index * 3;

      array[offset] += windX;
      array[offset + 2] += windZ;

      if (array[offset] - centerX > STORM_RADIUS) {
        array[offset] = centerX - STORM_RADIUS;
        array[offset + 1] = randomRange(0, STORM_HEIGHT);
      }

      if (array[offset] - centerX < -STORM_RADIUS) {
        array[offset] = centerX + STORM_RADIUS;
        array[offset + 1] = randomRange(0, STORM_HEIGHT);
      }

      if (array[offset + 2] - centerZ > STORM_RADIUS) {
        array[offset + 2] = centerZ - STORM_RADIUS;
        array[offset + 1] = randomRange(0, STORM_HEIGHT);
      }

      if (array[offset + 2] - centerZ < -STORM_RADIUS) {
        array[offset + 2] = centerZ + STORM_RADIUS;
        array[offset + 1] = randomRange(0, STORM_HEIGHT);
      }
    }

    positionAttribute.needsUpdate = true;

    const targetOpacity = isStorming ? 0.8 : 0;
    points.material.opacity = MathUtils.lerp(
      points.material.opacity,
      targetOpacity,
      0.045
    );

    if (tornado) {
      const tornadoAttribute = tornado.geometry.attributes.position;
      const tornadoArray = tornadoAttribute.array;
      const tornadoCenterX = centerX + 10;
      const tornadoCenterZ = centerZ - 8;

      for (let index = 0; index < TORNADO_PARTICLE_COUNT; index += 1) {
        const offset = index * 3;
        const height = tornadoData.heights[index];
        const heightPercent = height / TORNADO_HEIGHT;
        const curvedHeight = Math.pow(heightPercent, 1.35);
        const baseRadius = MathUtils.lerp(
          TORNADO_BOTTOM_RADIUS,
          TORNADO_TOP_RADIUS,
          curvedHeight
        );
        const swirlAngle =
          tornadoData.angles[index] +
          tornadoData.speeds[index] * elapsedTime +
          heightPercent * 9.5;
        const radius =
          baseRadius +
          tornadoData.radiusOffsets[index] +
          Math.sin(elapsedTime * 2.2 + index) * 0.18;

        tornadoArray[offset] = tornadoCenterX + Math.cos(swirlAngle) * radius;
        tornadoArray[offset + 1] =
          height + Math.sin(elapsedTime * 3 + index * 0.11) * 0.18;
        tornadoArray[offset + 2] = tornadoCenterZ + Math.sin(swirlAngle) * radius;
      }

      tornadoAttribute.needsUpdate = true;
      tornado.material.opacity = MathUtils.lerp(
        tornado.material.opacity,
        stormIntensity * 0.62,
        0.04
      );
      tornado.rotation.y += delta * 0.6;
    }

    if (scene.fog?.isFogExp2) {
      const targetDensity = isStorming
        ? STORM_FOG_DENSITY
        : CLEAR_FOG_DENSITY;
      const targetColor = isStorming ? STORM_FOG_COLOR : CLEAR_FOG_COLOR;

      scene.fog.density = MathUtils.lerp(
        scene.fog.density,
        targetDensity,
        0.035
      );
      scene.fog.color.lerp(targetColor, 0.025);
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={PARTICLE_COLOR}
          depthWrite={false}
          opacity={0}
          size={0.15}
          transparent
        />
      </points>
      <points ref={tornadoRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={tornadoData.positions}
            count={TORNADO_PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c6a06d"
          depthWrite={false}
          opacity={0}
          size={0.22}
          transparent
        />
      </points>
    </>
  );
}
