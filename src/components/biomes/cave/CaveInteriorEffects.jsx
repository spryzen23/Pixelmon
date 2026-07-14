import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Color, DoubleSide, FogExp2, Vector3 } from "three";

const MOTE_COUNT = 140;
const ARC_POINT_COUNT = 9;
const crystalLights = [
  [-8, 1.2, 2],
  [7, 1.2, 7],
  [-11, 1.2, 15],
  [12, 1.2, -9],
  [0, 1.3, -14],
];
const electricArcPairs = [
  [0, 1],
  [1, 3],
  [0, 4],
  [2, 1],
];
const floorChargePositions = [
  [-4, 0.04, 4],
  [4.5, 0.04, 12],
  [-9, 0.04, -6],
  [9, 0.04, -2],
  [1, 0.04, -11],
  [-12, 0.04, 12],
];
const tempStart = new Vector3();
const tempEnd = new Vector3();
const tempPoint = new Vector3();

function BlueMotes({ playerRef }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const data = new Float32Array(MOTE_COUNT * 3);

    for (let index = 0; index < MOTE_COUNT; index += 1) {
      data[index * 3] = (Math.random() - 0.5) * 34;
      data[index * 3 + 1] = Math.random() * 4 + 0.8;
      data[index * 3 + 2] = (Math.random() - 0.5) * 34;
    }

    return data;
  }, []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    const player = playerRef?.current;

    if (!points || !player) {
      return;
    }

    const array = points.geometry.attributes.position.array;

    for (let index = 0; index < MOTE_COUNT; index += 1) {
      const offset = index * 3;

      array[offset + 1] += delta * (0.15 + (index % 5) * 0.025);

      if (array[offset + 1] > 5.8) {
        array[offset + 1] = 0.8;
      }

      if (Math.abs(array[offset] - player.position.x) > 28) {
        array[offset] =
          player.position.x - Math.sign(array[offset] - player.position.x) * 28;
      }

      if (Math.abs(array[offset + 2] - player.position.z) > 28) {
        array[offset + 2] =
          player.position.z -
          Math.sign(array[offset + 2] - player.position.z) * 28;
      }
    }

    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MOTE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#65e8ff"
        depthWrite={false}
        opacity={0.42}
        size={0.09}
        transparent
      />
    </points>
  );
}

function ChargedCrystal({ index, position }) {
  const groupRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    const pulse = 0.86 + Math.sin(state.clock.elapsedTime * 2.6 + index) * 0.14;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(pulse);
    }

    if (lightRef.current) {
      lightRef.current.intensity =
        1.45 + Math.sin(state.clock.elapsedTime * 3.4 + index * 1.7) * 0.55;
    }
  });

  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        color="#45dfff"
        distance={10}
        intensity={1.7}
      />
      <group ref={groupRef}>
        <mesh castShadow>
          <octahedronGeometry args={[0.52, 0]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color="#5df2ff"
            opacity={0.92}
            transparent
          />
        </mesh>
        <mesh scale={1.8}>
          <octahedronGeometry args={[0.52, 0]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color="#1477ff"
            depthWrite={false}
            opacity={0.18}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}

function ElectricArc({ from, seed = 0, to }) {
  const lineRef = useRef();
  const materialRef = useRef();
  const positions = useMemo(() => new Float32Array(ARC_POINT_COUNT * 3), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const visible = Math.sin(time * 2.2 + seed * 3.4) > -0.2;
    const jitterStrength = visible ? 0.36 : 0.08;

    tempStart.fromArray(from);
    tempEnd.fromArray(to);

    for (let index = 0; index < ARC_POINT_COUNT; index += 1) {
      const alpha = index / (ARC_POINT_COUNT - 1);

      tempPoint.lerpVectors(tempStart, tempEnd, alpha);

      if (index > 0 && index < ARC_POINT_COUNT - 1) {
        tempPoint.x +=
          Math.sin(time * 17 + seed * 5.3 + index * 2.1) * jitterStrength;
        tempPoint.y +=
          Math.sin(time * 21 + seed * 3.1 + index * 4.2) * jitterStrength * 0.5;
        tempPoint.z +=
          Math.cos(time * 19 + seed * 7.7 + index * 1.8) * jitterStrength;
      }

      positions[index * 3] = tempPoint.x;
      positions[index * 3 + 1] = tempPoint.y;
      positions[index * 3 + 2] = tempPoint.z;
    }

    if (lineRef.current) {
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (materialRef.current) {
      materialRef.current.opacity = visible
        ? 0.32 + Math.random() * 0.48
        : 0.04;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={ARC_POINT_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        color="#8cf8ff"
        depthWrite={false}
        opacity={0.35}
        transparent
      />
    </line>
  );
}

function FloorCharge({ index, position }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    const pulse =
      0.65 + Math.sin(state.clock.elapsedTime * 3 + index * 1.4) * 0.35;

    if (meshRef.current) {
      meshRef.current.scale.setScalar(0.65 + pulse * 0.7);
      meshRef.current.rotation.z += 0.008 + index * 0.001;
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.12 + pulse * 0.22;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.08, 0.34, 18]} />
      <meshBasicMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        color="#2de6ff"
        depthWrite={false}
        opacity={0.22}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
}

export default function CaveInteriorEffects({ playerRef }) {
  const { scene } = useThree();

  useEffect(() => {
    const previousFog = scene.fog;
    const previousBackground = scene.background;

    scene.fog = new FogExp2("#101a24", 0.045);
    scene.background = new Color("#081018");

    return () => {
      scene.fog = previousFog;
      scene.background = previousBackground;
    };
  }, [scene]);

  return (
    <group>
      <ambientLight intensity={0.18} />
      {crystalLights.map((position, index) => (
        <ChargedCrystal key={index} index={index} position={position} />
      ))}
      {electricArcPairs.map(([fromIndex, toIndex], index) => (
        <ElectricArc
          key={`${fromIndex}-${toIndex}`}
          from={crystalLights[fromIndex]}
          seed={index + 1}
          to={crystalLights[toIndex]}
        />
      ))}
      {floorChargePositions.map((position, index) => (
        <FloorCharge key={index} index={index} position={position} />
      ))}
      <BlueMotes playerRef={playerRef} />
    </group>
  );
}
