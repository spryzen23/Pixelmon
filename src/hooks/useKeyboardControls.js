import { useEffect, useRef } from 'react';

const KEY_MAP = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'jump',
  KeyJ: 'jump',
  KeyC: 'crouch',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
};

const INITIAL_KEYS = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  crouch: false,
  sprint: false,
};

export default function useKeyboardControls() {
  const keys = useRef({ ...INITIAL_KEYS });

  useEffect(() => {
    const clearKeys = () => {
      Object.keys(keys.current).forEach((key) => {
        keys.current[key] = false;
      });
    };

    const updateKey = (event, isPressed) => {
      const action = KEY_MAP[event.code];

      if (!action) {
        return;
      }

      if (event.target?.tagName === 'INPUT' || event.target?.tagName === 'TEXTAREA') {
        return;
      }

      if (isPressed && event.repeat) {
        return;
      }

      event.preventDefault();
      keys.current[action] = isPressed;
    };

    const handleKeyDown = (event) => updateKey(event, true);
    const handleKeyUp = (event) => updateKey(event, false);
    const handleBlur = () => clearKeys();
    const handleVisibility = () => {
      if (document.hidden) {
        clearKeys();
      }
    };
    const handlePointerLockChange = () => {
      if (!document.pointerLockElement) {
        clearKeys();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  return keys;
}
