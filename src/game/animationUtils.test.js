import {
  isPrimaryWalking,
  resolveAnimationClip,
  shouldUseNativeLocomotionClip,
} from './animationUtils';

const playerClips = [
  'Walking',
  'House',
  'YoTeEligo',
  'Rapping',
  'HipHop',
  'Salsa',
  'Singing',
  'Fight',
  'Talking',
  'HipHop2',
];

test('resolveAnimationClip picks Walking for Walk action', () => {
  expect(
    resolveAnimationClip(playerClips, 'Walk', ['Run', 'Walk', 'Idle'])
  ).toBe('Walking');
});

test('resolveAnimationClip picks standing clip for Idle action', () => {
  const clip = resolveAnimationClip(playerClips, 'Idle', ['Idle', 'Walk']);
  expect(['House', 'Talking']).toContain(clip);
});

test('resolveAnimationClip returns null when no clip matches intent', () => {
  expect(resolveAnimationClip(['Chariard_dizzy'], 'Walk', 'Idle')).toBeNull();
});

test('shouldUseNativeLocomotionClip rejects emote clips', () => {
  expect(shouldUseNativeLocomotionClip('House')).toBe(false);
  expect(shouldUseNativeLocomotionClip('HipHop')).toBe(false);
});

test('shouldUseNativeLocomotionClip accepts gerund locomotion clips', () => {
  expect(shouldUseNativeLocomotionClip('Walking')).toBe(true);
  expect(shouldUseNativeLocomotionClip('Running')).toBe(true);
});

test('shouldUseNativeLocomotionClip accepts real locomotion names', () => {
  expect(shouldUseNativeLocomotionClip('Idle')).toBe(true);
  expect(shouldUseNativeLocomotionClip('Walk')).toBe(true);
  expect(shouldUseNativeLocomotionClip('AshArmature|AshWalk')).toBe(true);
});

test('isPrimaryWalking ignores fallback action names', () => {
  expect(isPrimaryWalking('Idle')).toBe(false);
  expect(isPrimaryWalking('Walk')).toBe(true);
});
