import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

const SHOULDER_OFFSET_X = 1.2;
const CAMERA_HEIGHT = 1.8;
const CAMERA_DISTANCE = 3.2;
const POSITION_SMOOTHING = 14;
const WORLD_UP = new Vector3(0, 1, 0);

export default function ThirdPersonCamera({ targetRef }) {
  const desiredPosition = useRef(new Vector3());
  const lookForward = useRef(new Vector3());
  const lookRight = useRef(new Vector3());
  const initialized = useRef(false);
  const sampleTimer = useRef(0);

  useFrame(({ camera }, delta) => {
    const target = targetRef.current;

    if (!target) {
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
      lookRight.current.set(
        lookForward.current.z,
        0,
        -lookForward.current.x
      );
    }

    lookRight.current.normalize();

    desiredPosition.current
      .copy(target.position)
      .addScaledVector(lookRight.current, SHOULDER_OFFSET_X)
      .addScaledVector(lookForward.current, -CAMERA_DISTANCE);
    desiredPosition.current.y = target.position.y + CAMERA_HEIGHT;

    sampleTimer.current += delta;
    if (sampleTimer.current >= 0.75) {
      sampleTimer.current = 0;
      const playerYawDeg = +((target.rotation.y * 180) / Math.PI).toFixed(1);
      const cameraYawDeg = +(
        (Math.atan2(lookForward.current.x, lookForward.current.z) * 180) /
        Math.PI
      ).toFixed(1);
      // #region agent log
      fetch('http://127.0.0.1:7494/ingest/f6ae2fc6-304a-4fe4-bc2e-1432ec00b765', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'efcfd8',
        },
        body: JSON.stringify({
          sessionId: 'efcfd8',
          runId: 'movement-ux-v2',
          hypothesisId: 'H4',
          location: 'ThirdPersonCamera.js:useFrame',
          message: 'camera follow uses look yaw (not player yaw)',
          data: {
            playerYawDeg,
            cameraLookYawDeg: cameraYawDeg,
            offsetUsesCameraLook: true,
            distToDesired: +camera.position.distanceTo(desiredPosition.current).toFixed(3),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion
    }

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
