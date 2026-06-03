import { MathUtils } from 'three';

export function lerpAngle(from, to, alpha) {
  const angleDelta =
    MathUtils.euclideanModulo(to - from + Math.PI, Math.PI * 2) - Math.PI;

  return MathUtils.lerp(from, from + angleDelta, alpha);
}

/** Left-side limb detection for Pokemon-style rigs (LThigh, LLeg) and humanoid names. */
export function isLeftSide(name) {
  const n = name.toLowerCase();

  if (n.includes('left')) {
    return true;
  }

  if (n.includes('right')) {
    return false;
  }

  if (n.includes('lfeeler') || n.includes('lvine')) {
    return true;
  }

  if (n.includes('rfeeler') || n.includes('rvine')) {
    return false;
  }

  if (/^l(thigh|leg|foot|toe|hip|arm|forearm|hand|shoulder|ear|finger)/.test(n)) {
    return true;
  }

  if (/^r(thigh|leg|foot|toe|hip|arm|forearm|hand|shoulder|ear|finger)/.test(n)) {
    return false;
  }

  return false;
}

export function matchesCategory(name, category) {
  const n = name.toLowerCase();

  switch (category) {
    case 'upperLeg':
      return (
        n.includes('thigh') ||
        n.includes('upleg') ||
        (n.includes('hip') && !n.includes('end') && !n.includes('waist'))
      );
    case 'lowerLeg':
      return (
        (n.includes('leg') || n.includes('shin')) &&
        !n.includes('upleg') &&
        !n.includes('fore') &&
        !n.includes('thigh') &&
        !n.includes('feeler')
      );
    case 'foot':
      return n.includes('foot') || n.includes('toe') || n.includes('shoe');
    case 'upperArm':
      return n.includes('shoulder') || (n.includes('arm') && !n.includes('fore'));
    case 'lowerArm':
      return n.includes('forearm');
    case 'hand':
      return n.includes('hand') || n.includes('finger');
    case 'head':
      return (
        n.includes('head') ||
        n.includes('jaw') ||
        n.includes('neck') ||
        n.includes('ear')
      );
    case 'spine':
      return (
        n.includes('spine') ||
        n.includes('waist') ||
        n.includes('torso') ||
        n.includes('shirt') ||
        n.includes('vest') ||
        n.includes('coat_back') ||
        n.includes('coat_panel') ||
        n.includes('coat_tail')
      );
    case 'tail':
      return n.includes('tail');
    case 'vine':
      return n.includes('vine') || n.includes('feeler');
    case 'rigid':
      return (
        n.includes('geometry') ||
        n === 'bulbasaur' ||
        (n.includes('bulbasaur') && !n.includes('vine'))
      );
    default:
      return false;
  }
}

/**
 * Pick a GLB clip that matches Idle vs Walk intent (partial name match).
 * Returns null when no clip fits — caller should use procedural animation.
 */
export function resolveAnimationClip(names, actionName, fallbackActionName) {
  if (!names || names.length === 0) {
    return null;
  }

  const primary = String(actionName || '');

  if (/walk|run|jog/i.test(primary)) {
    return names.find((name) => /walk|run|jog/i.test(name)) || null;
  }

  if (/idle/i.test(primary)) {
    return (
      names.find((name) => /idle|stand|house|talk|wait|breath/i.test(name)) ||
      null
    );
  }

  const preferred = [
    actionName,
    ...(Array.isArray(fallbackActionName)
      ? fallbackActionName
      : [fallbackActionName]),
  ].filter(Boolean);

  for (const preferredName of preferred) {
    const exact = names.find(
      (name) => name.toLowerCase() === String(preferredName).toLowerCase()
    );
    if (exact) {
      return exact;
    }
  }

  return null;
}

/** True when the current actionName requests walk/run (ignores fallback list). */
export function isPrimaryWalking(actionName) {
  return /walk|run|jog/i.test(String(actionName || ''));
}

/** True when the current actionName requests idle/stand. */
export function isPrimaryIdle(actionName) {
  return /idle/i.test(String(actionName || ''));
}

/**
 * Dance/emote GLBs (e.g. player.glb) should use procedural bone animation
 * instead of non-locomotion clips like House or HipHop.
 */
export function shouldUseNativeLocomotionClip(clipName) {
  if (!clipName) {
    return false;
  }

  const lower = clipName.toLowerCase();

  if (
    /house|rap|salsa|sing|fight|talk|hip|yote|eligo|dizzy|mega|gmax/i.test(
      lower
    )
  ) {
    return false;
  }

  if (/asharmature\|ash(idle|walk|jog|run)/i.test(lower)) {
    return true;
  }

  if (/^(idle|idling|walk|walking|run|running|jog|jogging)$/.test(lower)) {
    return true;
  }

  return false;
}

export function isStrafeLeanPart(name) {
  const n = name.toLowerCase();

  return (
    matchesCategory(name, 'spine') ||
    matchesCategory(name, 'head') ||
    matchesCategory(name, 'upperArm') ||
    matchesCategory(name, 'lowerArm') ||
    matchesCategory(name, 'hand') ||
    n.includes('coat_panel') ||
    n.includes('coat_tail')
  );
}
