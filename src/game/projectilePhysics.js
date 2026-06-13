import { Vector3 } from 'three';

export const DEFAULT_THROW_POWER = 10;
export const MIN_THROW_POWER = 6;
export const MAX_THROW_POWER = 18;
export const THROW_POWER_STEP = 1;
export const PROJECTILE_SPEED = DEFAULT_THROW_POWER;
export const PROJECTILE_LIFETIME = 3.25;
export const MAX_PROJECTILE_DISTANCE = 18;
export const PROJECTILE_GRAVITY = 9.8;
export const PROJECTILE_UPWARD_BOOST = 5;
export const PROJECTILE_RADIUS = 0.18;
export const THROW_TARGET_DISTANCE = 50;
export const THROW_SHOULDER_X_OFFSET = 0.5;
export const THROW_SHOULDER_Y_OFFSET = 1;
export const THROW_SHOULDER_Z_OFFSET = 0;

const lookDir = new Vector3();
const targetPoint = new Vector3();
const shoulderRight = new Vector3();
const shoulderForward = new Vector3();

export function getPlayerShoulderOrigin(player, origin) {
  const yaw = player.rotation.y;

  shoulderRight.set(Math.cos(yaw), 0, -Math.sin(yaw));
  shoulderForward.set(Math.sin(yaw), 0, Math.cos(yaw));

  return origin
    .copy(player.position)
    .addScaledVector(shoulderRight, THROW_SHOULDER_X_OFFSET)
    .addScaledVector(shoulderForward, THROW_SHOULDER_Z_OFFSET)
    .setY(player.position.y + THROW_SHOULDER_Y_OFFSET);
}

export function getParallaxThrowVector(camera, player, origin, direction) {
  camera.getWorldDirection(lookDir);
  lookDir.normalize();

  getPlayerShoulderOrigin(player, origin);

  // The UI crosshair is the center of the camera lens, so this target is the
  // exact mathematical aim point the player sees on screen.
  targetPoint
    .copy(camera.position)
    .addScaledVector(lookDir, THROW_TARGET_DISTANCE);

  return direction.subVectors(targetPoint, origin).normalize();
}
