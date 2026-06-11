/** Vertical offset so fitToHeight model feet sit on the terrain under the player root. */
export function getPlayerModelYOffset(fitHeight = 0.92, crouching = false) {
  const crouchDrop = crouching ? 0.08 : 0;
  return -fitHeight / 2 - crouchDrop;
}

/** Ground Y for the player root — matches visible model height, not the physics capsule. */
export function getPlayerGroundY(
  x,
  z,
  fitHeight,
  previousY,
  currentBiome,
  getEntityYFn
) {
  return getEntityYFn(x, z, fitHeight, previousY, currentBiome);
}

/**
 * Maps locomotion flags to GLB clip names used by AnimatedModel.
 */
export function resolvePlayerAction({
  jumping = false,
  crouching = false,
  moving = false,
  hasMoveInput = false,
  sprinting = false,
} = {}) {
  if (jumping) {
    return 'Jump';
  }

  if (crouching) {
    return 'Crouch';
  }

  const locomoting = moving || hasMoveInput;

  if (locomoting) {
    return sprinting ? 'Run' : 'Walk';
  }

  return 'Idle';
}

export function getPlayerActionFallbacks(actionName) {
  switch (actionName) {
    case 'Run':
      return ['Run', 'Walk', 'Jog', 'Idle'];
    case 'Walk':
      return ['Walk', 'Run', 'Idle'];
    case 'Jump':
      return ['Jump', 'Idle'];
    case 'Crouch':
      return ['Crouch', 'Sneak', 'Duck', 'Idle'];
    default:
      return ['Idle', 'Stand', 'Walk'];
  }
}
