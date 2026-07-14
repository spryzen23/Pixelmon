import { useCallback, useRef } from 'react';

const SFX = {
  throw: '/assets/audio/throw.mp3',
  catch: '/assets/audio/catch.mp3',
};

export function useAudioManager() {
  const cache = useRef(new Map());

  const play = useCallback((key) => {
    const url = SFX[key];
    if (!url) return;

    let audio = cache.current.get(key);
    if (!audio) {
      audio = new Audio(url);
      cache.current.set(key, audio);
    }

    audio.currentTime = 0;
    audio.play().catch(() => { });
  }, []);

  return { play };
}
