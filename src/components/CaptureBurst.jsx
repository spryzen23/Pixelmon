import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";

const BURST_DURATION = 1;
const PARTICLE_COUNT = 14;

function randomUnitVector(index) {
  const raw = Math.sin(index * 91.73) * 43758.5453;
  const seed = raw - Math.floor(raw);
  const azimuth = seed * Math.PI * 2;
  const elevation = 0.25 + ((seed * 1.37) % 1) * 0.75;

  return new Vector3(
    Math.cos(azimuth) * elevation,
    0.35 + ((seed * 2.19) % 1) * 0.9,
    Math.sin(azimuth) * elevation
  ).normalize();
}

export default function CaptureBurst({ id, position, onComplete }) {
  const groupRef = useRef();
  const age = useRef(0);
  const completed = useRef(false);
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
      direction: randomUnitVector(index + id.length),
      speed: 1.6 + ((index * 0.37) % 1) * 1.8,
      radius: 0.04 + ((index * 0.13) % 1) * 0.04,
    }));
  }, [id]);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group || completed.current) {
      return;
    }

    age.current += delta;
    const progress = Math.min(age.current / BURST_DURATION, 1);

    group.children.forEach((particle, index) => {
      const config = particles[index];
      const distance = config.speed * progress;
      particle.position.copy(config.direction).multiplyScalar(distance);
      particle.scale.setScalar(Math.max(1 - progress, 0.001));
    });

    if (progress >= 1) {
      completed.current = true;
      onComplete(id);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {particles.map((particle, index) => (
        <Sphere key={`${id}-${index}`} args={[particle.radius, 8, 8]}>
          <meshBasicMaterial
            color={index % 2 === 0 ? "#fff6a8" : "#ffd43b"}
            transparent
            opacity={0.9}
          />
        </Sphere>
      ))}
    </group>
  );
}
