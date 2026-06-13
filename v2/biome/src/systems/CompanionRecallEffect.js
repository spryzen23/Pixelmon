import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const PARTICLES = [
  [0.28, 0.18, 0],
  [-0.24, 0.25, 0.12],
  [0.12, 0.36, -0.24],
  [-0.1, 0.08, -0.28],
  [0.04, 0.46, 0.24],
];

export default function CompanionRecallEffect({ id, position, onComplete }) {
  const groupRef = useRef();
  const age = useRef(0);
  const completed = useRef(false);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group || completed.current) {
      return;
    }

    age.current += delta;
    const progress = Math.min(age.current / 0.65, 1);
    const pulse = 1 + progress * 1.8;

    group.scale.setScalar(pulse);
    group.rotation.y += delta * 8;

    if (progress >= 1) {
      completed.current = true;
      onComplete(id);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {PARTICLES.map((particle, index) => (
        <Sphere
          key={`${id}-${index}`}
          args={[0.08, 8, 8]}
          position={particle}
        >
          <meshStandardMaterial
            color={index % 2 === 0 ? '#fff8c6' : '#ffd928'}
            emissive={index % 2 === 0 ? '#fff0a0' : '#d99f00'}
            emissiveIntensity={0.4}
            roughness={0.45}
          />
        </Sphere>
      ))}
    </group>
  );
}
