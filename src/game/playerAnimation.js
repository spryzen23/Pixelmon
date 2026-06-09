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
