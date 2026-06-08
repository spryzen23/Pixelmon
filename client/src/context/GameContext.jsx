import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { api } from '../api';

const GameContext = createContext(null);

export const SCREENS = {
  welcome: 'welcome',
  modeSelect: 'modeSelect',
  playerSelect: 'playerSelect',
  profileSetup: 'profileSetup',
  mapSelect: 'mapSelect',
  loading: 'loading',
  inGame: 'inGame',
  gameComplete: 'gameComplete',
  pokedex: 'pokedex',
  battleRoyale: 'battleRoyale',
  minigameHub: 'minigameHub',
  battleArena: 'battleArena',
  dailyGrid: 'dailyGrid',
  clueGuesser: 'clueGuesser',
  triviaTraining: 'triviaTraining',
};

export const GAME_MODES = {
  campaign: 'campaign',
  sandbox: 'sandbox',
  battleRoyale: 'battleRoyale',
  minigameHub: 'minigameHub',
};

export function GameProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.welcome);
  const [player, setPlayer] = useState(null);
  const [session, setSession] = useState(null);
  const [gameRuntime, setGameRuntime] = useState(null);
  const [completeStats, setCompleteStats] = useState(null);
  const [biomeMap, setBiomeMap] = useState(null);
  const [spawnLadder, setSpawnLadder] = useState(null);
  const [gameMode, setGameMode] = useState(GAME_MODES.campaign);

  const goTo = useCallback((next) => setScreen(next), []);

  const addCoins = useCallback(
    async (amount) => {
      if (!player) {
        const localCoins = Number(localStorage.getItem('pixelmon-localCoins') || 150) + amount;
        localStorage.setItem('pixelmon-localCoins', localCoins);
        return localCoins;
      }
      const nextCoins = (player.coins || 150) + amount;
      try {
        const updatedPlayer = await api.patchPlayer(player.id, { coins: nextCoins });
        setPlayer(updatedPlayer);
        return nextCoins;
      } catch (err) {
        console.error('Failed to sync coins', err);
        return nextCoins;
      }
    },
    [player]
  );

  const spendCoins = useCallback(
    async (amount) => {
      if (!player) {
        const currentLocal = Number(localStorage.getItem('pixelmon-localCoins') || 150);
        if (currentLocal < amount) return false;
        const nextCoins = currentLocal - amount;
        localStorage.setItem('pixelmon-localCoins', nextCoins);
        return true;
      }
      const currentCoins = player.coins || 150;
      if (currentCoins < amount) return false;
      const nextCoins = currentCoins - amount;
      try {
        const updatedPlayer = await api.patchPlayer(player.id, { coins: nextCoins });
        setPlayer(updatedPlayer);
        return true;
      } catch (err) {
        console.error('Failed to sync coins', err);
        return false;
      }
    },
    [player]
  );

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      goTo,
      player,
      setPlayer,
      session,
      setSession,
      gameRuntime,
      setGameRuntime,
      completeStats,
      setCompleteStats,
      biomeMap,
      setBiomeMap,
      spawnLadder,
      setSpawnLadder,
      gameMode,
      setGameMode,
      addCoins,
      spendCoins,
    }),
    [screen, goTo, player, session, gameRuntime, completeStats, biomeMap, spawnLadder, gameMode, addCoins, spendCoins]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame outside GameProvider');
  return ctx;
}

