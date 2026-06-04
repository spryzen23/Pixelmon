import { Sky } from '@react-three/drei';
import { DoubleSide } from 'three';

const SUN_POSITION = [70, 55, -95];
const CLOUD_COLOR = '#f5f8fb';
const CLOUD_SHADOW = '#d7e0e7';
const ASH_CLOUD_COLOR = '#5d5551';
const ASH_CLOUD_SHADOW = '#2f2927';

const CLOUDS = [
  {
    position: [-52, 39, -88],
    blocks: [
      [-16, 0, 0, 28, 2.8, 6],
      [-4, 0.6, 0, 34, 3, 7],
      [16, 0, 1, 22, 2.6, 5],
      [2, -1.5, 0, 18, 1.4, 5],
    ],
  },
  {
    position: [42, 43, -116],
    blocks: [
      [-18, 0, 0, 24, 2.5, 5],
      [0, 0.5, 0, 36, 2.8, 7],
      [22, 0, 0, 20, 2.3, 5],
      [8, -1.4, 0, 18, 1.3, 4],
    ],
  },
  {
    position: [6, 34, -62],
    blocks: [
      [-12, 0, 0, 22, 2.3, 5],
      [6, 0.5, 0, 30, 2.7, 6],
      [24, 0, 1, 14, 2, 4],
    ],
  },
  {
    position: [-76, 45, 14],
    blocks: [
      [-12, 0, 0, 26, 2.5, 6],
      [10, 0.5, 0, 32, 2.7, 7],
      [30, 0, 0, 18, 2.2, 5],
    ],
  },
];

function CloudBlock({ block, color = CLOUD_COLOR, shadowColor = CLOUD_SHADOW }) {
  const [x, y, z, width, height, depth] = block;

  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color={color} fog={false} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.04, 0]}>
        <boxGeometry args={[width, 0.16, depth]} />
        <meshBasicMaterial color={shadowColor} fog={false} transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

function BlockyClouds({ volcanic = false }) {
  const color = volcanic ? ASH_CLOUD_COLOR : CLOUD_COLOR;
  const shadowColor = volcanic ? ASH_CLOUD_SHADOW : CLOUD_SHADOW;

  return (
    <group>
      {CLOUDS.map((cloud, cloudIndex) => (
        <group
          key={cloudIndex}
          position={cloud.position}
          rotation={[0, cloudIndex % 2 === 0 ? 0.12 : -0.08, 0]}
        >
          {cloud.blocks.map((block, blockIndex) => (
            <CloudBlock
              key={blockIndex}
              block={block}
              color={color}
              shadowColor={shadowColor}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function SquareSun() {
  return (
    <mesh position={[34, 52, -76]} rotation={[0.12, -0.42, 0]}>
      <planeGeometry args={[8, 8]} />
      <meshBasicMaterial
        color="#fffdf2"
        depthWrite={false}
        fog={false}
        side={DoubleSide}
      />
    </mesh>
  );
}

export default function Atmosphere({ biomeType = 'grass' }) {
  const volcanic = biomeType === 'volcanic';

  return (
    <>
      <Sky
        distance={450000}
        mieCoefficient={volcanic ? 0.018 : 0.0025}
        mieDirectionalG={volcanic ? 0.82 : 0.58}
        rayleigh={volcanic ? 0.55 : 1.6}
        sunPosition={volcanic ? [22, 12, -28] : SUN_POSITION}
        turbidity={volcanic ? 12 : 3.2}
      />
      {!volcanic && <SquareSun />}
      <BlockyClouds volcanic={volcanic} />
    </>
  );
}

export { SUN_POSITION };
