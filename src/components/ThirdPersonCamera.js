import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

const CAMERA_DISTANCE = 7;
const CAMERA_HEIGHT = 4.8;
const POSITION_SMOOTHING = 7;
const LOOK_SMOOTHING = 8;
const LOOK_AT_HEIGHT = 0.9;

export default function ThirdPersonCamera({ targetRef }) {
  const desiredPosition = useRef(new Vector3());
  const desiredLookAt = useRef(new Vector3());
  const smoothedLookAt = useRef(new Vector3());
  const forward = useRef(new Vector3());
  const initialized = useRef(false);

  useFrame(({ camera }, delta) => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    forward.current
      .set(Math.sin(target.rotation.y), 0, Math.cos(target.rotation.y))
      .normalize();

    desiredPosition.current
      .copy(target.position)
      .addScaledVector(forward.current, -CAMERA_DISTANCE);
    desiredPosition.current.y = target.position.y + CAMERA_HEIGHT;

    desiredLookAt.current.set(
      target.position.x + forward.current.x * 1.15,
      target.position.y + LOOK_AT_HEIGHT,
      target.position.z + forward.current.z * 1.15
    );

    if (!initialized.current) {
      camera.position.copy(desiredPosition.current);
      smoothedLookAt.current.copy(desiredLookAt.current);
      initialized.current = true;
    }

    const positionAlpha = 1 - Math.exp(-POSITION_SMOOTHING * delta);
    const lookAlpha = 1 - Math.exp(-LOOK_SMOOTHING * delta);

    camera.position.lerp(desiredPosition.current, positionAlpha);
    smoothedLookAt.current.lerp(desiredLookAt.current, lookAlpha);
    camera.lookAt(smoothedLookAt.current);
  });

  return null;
}
