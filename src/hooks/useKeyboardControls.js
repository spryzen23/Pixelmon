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

export default function useKeyboardControls() {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    crouch: false,
    sprint: false,
  });

  useEffect(() => {
    const updateKey = (event, isPressed) => {
      const action = KEY_MAP[event.code];

      if (!action) {
        return;
      }

      event.preventDefault();
      keys.current[action] = isPressed;
    };

    const handleKeyDown = (event) => updateKey(event, true);
    const handleKeyUp = (event) => updateKey(event, false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
