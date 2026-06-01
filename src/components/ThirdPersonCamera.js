import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

const SHOULDER_OFFSET_X = 1.2;
const CAMERA_HEIGHT = 1.8;
const CAMERA_DISTANCE = 3;
const POSITION_SMOOTHING = 12;

export default function ThirdPersonCamera({ targetRef }) {
  const desiredPosition = useRef(new Vector3());
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());
  const initialized = useRef(false);

  useFrame(({ camera }, delta) => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    forward.current.set(
      Math.sin(target.rotation.y),
      0,
      Math.cos(target.rotation.y)
    );
    right.current.set(
      Math.cos(target.rotation.y),
      0,
      -Math.sin(target.rotation.y)
    );

    desiredPosition.current
      .copy(target.position)
      .addScaledVector(right.current, SHOULDER_OFFSET_X)
      .addScaledVector(forward.current, -CAMERA_DISTANCE);
    desiredPosition.current.y = target.position.y + CAMERA_HEIGHT;

    if (!initialized.current) {
      camera.position.copy(desiredPosition.current);
      initialized.current = true;
      return;
    }

    const positionAlpha = 1 - Math.exp(-POSITION_SMOOTHING * delta);
    camera.position.lerp(desiredPosition.current, positionAlpha);
  });

  return null;
}
