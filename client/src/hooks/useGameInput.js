import { useEffect } from 'react';
import { Vector3 } from 'three';
import { getParallaxThrowVector } from '../game/projectilePhysics';

const throwForward = new Vector3();
const throwOrigin = new Vector3();

export function useGameInput({
  playerRef,
  companionRef,
  camera,
  currentBiome,
  equippedBall,
  throwPower,
  isCompanionOut,
  setIsCompanionOut,
  setCompanionSpawnPosition,
  addCompanionEffect,
  getEntityY,
  COMPANION_HEIGHT,
  onThrow,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!playerRef.current || event.repeat) return;

      const player = playerRef.current;

      if (event.code === 'KeyE') {
        event.preventDefault();
        if (isCompanionOut) {
          const source = companionRef.current || player;
          addCompanionEffect([
            source.position.x,
            source.position.y,
            source.position.z,
          ]);
          setIsCompanionOut(false);
          return;
        }

        const spawnPosition = [
          player.position.x,
          getEntityY(
            player.position.x,
            player.position.z,
            COMPANION_HEIGHT,
            undefined,
            currentBiome
          ),
          player.position.z,
        ];
        setCompanionSpawnPosition(spawnPosition);
        addCompanionEffect(spawnPosition);
        setIsCompanionOut(true);
        return;
      }

      if (event.code !== 'KeyF' && event.code !== 'Space') return;
      event.preventDefault();

      getParallaxThrowVector(camera, player, throwOrigin, throwForward);

      onThrow({
        position: [throwOrigin.x, throwOrigin.y, throwOrigin.z],
        direction: [throwForward.x, throwForward.y, throwForward.z],
        ball: equippedBall,
        throwPower,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    addCompanionEffect,
    camera,
    companionRef,
    currentBiome,
    equippedBall,
    getEntityY,
    COMPANION_HEIGHT,
    isCompanionOut,
    onThrow,
    playerRef,
    setCompanionSpawnPosition,
    setIsCompanionOut,
    throwPower,
  ]);
}
