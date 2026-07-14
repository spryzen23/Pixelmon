import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

const SHOULDER_OFFSET_X = 1.2;
const CAMERA_HEIGHT = 1.8;
const CAMERA_DISTANCE = 3.2;
const LOOK_HEIGHT = 0.6;
const POSITION_SMOOTHING = 14;
const WORLD_UP = new Vector3(0, 1, 0);

export default function ThirdPersonCamera({ targetRef }) {
  const desiredPosition = useRef(new Vector3());
  const lookForward = useRef(new Vector3());
  const lookRight = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const initialized = useRef(false);

  useFrame(({ camera }, delta) => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    lookTarget.current.set(
      target.position.x,
      target.position.y + LOOK_HEIGHT,
      target.position.z
    );

    if (!initialized.current) {
      camera.getWorldDirection(lookForward.current);
      lookForward.current.y = 0;
      if (lookForward.current.lengthSq() < 1e-6) {
        lookForward.current.set(0, 0, -1);
      }
      lookForward.current.normalize();
      lookRight.current.crossVectors(lookForward.current, WORLD_UP).normalize();

      desiredPosition.current
        .copy(target.position)
        .addScaledVector(lookRight.current, SHOULDER_OFFSET_X)
        .addScaledVector(lookForward.current, -CAMERA_DISTANCE);
      desiredPosition.current.y = target.position.y + CAMERA_HEIGHT;

      camera.position.copy(desiredPosition.current);
      camera.lookAt(lookTarget.current);
      initialized.current = true;
      return;
    }

    camera.getWorldDirection(lookForward.current);
    lookForward.current.y = 0;

    if (lookForward.current.lengthSq() < 1e-6) {
      lookForward.current.set(
        Math.sin(camera.rotation.y),
        0,
        Math.cos(camera.rotation.y)
      );
    }

    lookForward.current.normalize();
    lookRight.current.crossVectors(lookForward.current, WORLD_UP);

    if (lookRight.current.lengthSq() < 1e-6) {
      lookRight.current.set(lookForward.current.z, 0, -lookForward.current.x);
    }

    lookRight.current.normalize();

    desiredPosition.current
      .copy(target.position)
      .addScaledVector(lookRight.current, SHOULDER_OFFSET_X)
      .addScaledVector(lookForward.current, -CAMERA_DISTANCE);
    desiredPosition.current.y = target.position.y + CAMERA_HEIGHT;

    const positionAlpha = 1 - Math.exp(-POSITION_SMOOTHING * delta);
    camera.position.lerp(desiredPosition.current, positionAlpha);
  });

  return null;
}
