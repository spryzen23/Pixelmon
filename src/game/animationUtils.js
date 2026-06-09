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
    case 'wing':
      return n.includes('wing') || n.includes('feather') || n.includes('bat');
    case 'fin':
      return n.includes('fin') || n.includes('flipper');
    case 'antenna':
      return n.includes('antenna') || n.includes('horn') || n.includes('feeler');
    case 'float':
      return n.includes('float') || n.includes('hover') || n.includes('cloud');
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

  const primary = String(actionName || '').toLowerCase();
  const preferred = [
    actionName,
    ...(Array.isArray(fallbackActionName) ? fallbackActionName : [fallbackActionName]),
  ].filter(Boolean).map(x => x.toLowerCase());

  // 1. Try exact matches first
  for (const preferredName of preferred) {
    const exact = names.find((name) => name.toLowerCase() === preferredName);
    if (exact) {
      return exact;
    }
  }

  // 2. Standard regex mappings for walk/run/jump/crouch
  const findFirst = (patterns) =>
    names.find((name) => patterns.some((pattern) => pattern.test(name))) || null;

  if (/run|sprint|jog/i.test(primary)) {
    const runClip = findFirst([/^run(ning)?$/i, /^jog(ging)?$/i, /run|jog/i]);
    if (runClip) return runClip;
  }

  if (/walk/i.test(primary)) {
    const walkClip = findFirst([/^walk(ing)?$/i, /walk/i]);
    if (walkClip) return walkClip;
  }

  if (/jump|leap/i.test(primary)) {
    const jumpClip = findFirst([/^jump(ing)?$/i, /jump|leap/i]);
    if (jumpClip) return jumpClip;
  }

  if (/crouch|duck|sneak/i.test(primary)) {
    const crouchClip = findFirst([/^crouch(ing)?$/i, /^duck(ing)?$/i, /crouch|duck|sneak/i]);
    if (crouchClip) return crouchClip;
  }

  // 3. Try partial matches for each preferred action in order (e.g. pm0023_00_idle containing idle)
  for (const preferredName of preferred) {
    const partial = names.find((name) => name.toLowerCase().includes(preferredName));
    if (partial) {
      return partial;
    }
  }

  // 4. Default fallbacks for idle
  if (/idle/i.test(primary)) {
    const standClip = names.find(
      (name) =>
        /stand|standing|wait|breath/i.test(name) &&
        !/house|hip|rap|salsa|talk|fight|sing/i.test(name)
    );
    if (standClip) return standClip;
  }

  // 5. Fallback to any clip containing common locomotion words
  const fallbackWords = ['idle', 'walk', 'run', 'stand', 'wait'];
  for (const word of fallbackWords) {
    const fallback = names.find((name) => name.toLowerCase().includes(word));
    if (fallback) return fallback;
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

export function isPrimaryJumping(actionName) {
  return /jump|leap/i.test(String(actionName || ''));
}

export function isPrimaryCrouching(actionName) {
  return /crouch|duck|sneak/i.test(String(actionName || ''));
}

/** Resolve attack/flee/special action clips when present in GLB. */
export function resolveActionClip(names, hints = []) {
  if (!names?.length || !hints?.length) {
    return null;
  }

  const lowerHints = hints.map((h) => String(h).toLowerCase());

  return (
    names.find((name) => {
      const lower = name.toLowerCase();
      return lowerHints.some((hint) => lower.includes(hint));
    }) || null
  );
}

export function shouldUseNativeAnimationClip(clipName) {
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

  if (/idle|idling|walk|walking|run|running|jog|jogging|jump|jumping|crouch|crouching|duck|sneak|stand|standing|wait|slither/i.test(lower)) {
    return true;
  }

  return false;
}

export function shouldUseNativeLocomotionClip(clipName) {
  return shouldUseNativeAnimationClip(clipName);
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
