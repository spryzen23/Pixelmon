import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

const SHOULDER_OFFSET_X = 1;
const CAMERA_HEIGHT = 2;
const CAMERA_DISTANCE = 4;

export default function ThirdPersonCamera({ targetRef }) {
  const desiredPosition = useRef(new Vector3());
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());

  useFrame(({ camera }) => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    camera.getWorldDirection(forward.current);
    forward.current.y = 0;

    if (forward.current.lengthSq() < 0.0001) {
      forward.current.set(
        Math.sin(target.rotation.y),
        0,
        Math.cos(target.rotation.y)
      );
    }

    forward.current.normalize();

    right.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
    right.current.y = 0;

    if (right.current.lengthSq() < 0.0001) {
      right.current.set(forward.current.z, 0, -forward.current.x);
    }

    right.current.normalize();

    desiredPosition.current
      .copy(target.position)
      .addScaledVector(right.current, SHOULDER_OFFSET_X)
      .addScaledVector(forward.current, -CAMERA_DISTANCE);
    desiredPosition.current.y = target.position.y + CAMERA_HEIGHT;

    camera.position.copy(desiredPosition.current);
  });

  return null;
}
