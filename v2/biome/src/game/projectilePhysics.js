import { Vector3 } from 'three';

export const DEFAULT_THROW_POWER = 10;
export const MIN_THROW_POWER = 6;
export const MAX_THROW_POWER = 18;
export const THROW_POWER_STEP = 1;
export const PROJECTILE_SPEED = DEFAULT_THROW_POWER;
export const PROJECTILE_LIFETIME = 3.25;
export const MAX_PROJECTILE_DISTANCE = 18;
export const PROJECTILE_GRAVITY = 9.8;
export const PROJECTILE_UPWARD_BOOST = 4;
export const PROJECTILE_RADIUS = 0.18;
export const THROW_TARGET_DISTANCE = 50;
export const THROW_SHOULDER_X_OFFSET = 0;
export const THROW_SHOULDER_Y_OFFSET = 1;
export const THROW_SHOULDER_Z_OFFSET = 0;

const shoulderOffset = new Vector3(
  THROW_SHOULDER_X_OFFSET,
  0,
  THROW_SHOULDER_Z_OFFSET
);
const cameraForward = new Vector3();
const cameraTarget = new Vector3();

export function getPlayerShoulderOrigin(player, origin) {
  return origin
    .copy(player.position)
    .add(shoulderOffset)
    .setY(player.position.y + THROW_SHOULDER_Y_OFFSET);
}

export function getParallaxThrowVector(camera, player, origin, direction) {
  getPlayerShoulderOrigin(player, origin);
  camera.getWorldDirection(cameraForward);
  cameraForward.normalize();
  cameraTarget
    .copy(camera.position)
    .addScaledVector(cameraForward, THROW_TARGET_DISTANCE);

  return direction.subVectors(cameraTarget, origin).normalize();
}
