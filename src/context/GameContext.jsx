import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { api } from '../api';

const GameContext = createContext(null);

export const SCREENS = {
  welcome: 'welcome',
  auth: 'auth',
  dashboard: 'dashboard',
  profileSetup: 'profileSetup',
  loading: 'loading',
  inGame: 'inGame',
  gameComplete: 'gameComplete',
  pokedex: 'pokedex',
  battleRoyale: 'battleRoyale',
  minigameHub: 'minigameHub',
  battleArena: 'battleArena',
  battleArenaV2: 'battleArenaV2',
  dailyGrid: 'dailyGrid',
  clueGuesser: 'clueGuesser',
  triviaTraining: 'triviaTraining',
  campaignV2: 'campaignV2',
  battleRoyaleV2: 'battleRoyaleV2',
  staticRegion: 'staticRegion',
  mapEditor: 'mapEditor',
};

export const GAME_MODES = {
  campaign: 'campaign',
  sandbox: 'sandbox',
  battleRoyale: 'battleRoyale',
  minigameHub: 'minigameHub',
  campaignV2: 'campaignV2',
  battleRoyaleV2: 'battleRoyaleV2',
  staticRegion: 'staticRegion',
  mapEditor: 'mapEditor',
};

export function GameProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.welcome);
  const [user, setUser] = useState(null);
  const [player, setPlayer] = useState(null);
  const [session, setSession] = useState(null);
  const [gameRuntime, setGameRuntime] = useState(null);
  const [completeStats, setCompleteStats] = useState(null);
  const [biomeMap, setBiomeMap] = useState(null);
  const [spawnLadder, setSpawnLadder] = useState(null);
  const [gameMode, setGameMode] = useState(GAME_MODES.campaign);

  const goTo = useCallback((next) => {
    setScreen(next);
  }, []);

  const addCoins = useCallback(
    async (amount) => {
      if (!user) {
        const localCoins = Number(localStorage.getItem('pixelmon-localCoins') || 150) + amount;
        localStorage.setItem('pixelmon-localCoins', localCoins);
        return localCoins;
      }
      const nextCoins = (user.pokecoins ?? 500) + amount;
      try {
        const updatedUser = await api.patchPlayer(user.id, { pokecoins: nextCoins });
        setUser(updatedUser);
        setPlayer((prev) => (prev ? { ...prev, coins: nextCoins } : null));
        return nextCoins;
      } catch (err) {
        console.error('Failed to sync coins', err);
        return nextCoins;
      }
    },
    [user]
  );

  const spendCoins = useCallback(
    async (amount) => {
      if (!user) {
        const currentLocal = Number(localStorage.getItem('pixelmon-localCoins') || 150);
        if (currentLocal < amount) return false;
        const nextCoins = currentLocal - amount;
        localStorage.setItem('pixelmon-localCoins', nextCoins);
        return true;
      }
      const currentCoins = user.pokecoins ?? 500;
      if (currentCoins < amount) return false;
      const nextCoins = currentCoins - amount;
      try {
        const updatedUser = await api.patchPlayer(user.id, { pokecoins: nextCoins });
        setUser(updatedUser);
        setPlayer((prev) => (prev ? { ...prev, coins: nextCoins } : null));
        return true;
      } catch (err) {
        console.error('Failed to sync coins', err);
        return false;
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      goTo,
      user,
      setUser,
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
    [screen, goTo, user, player, session, gameRuntime, completeStats, biomeMap, spawnLadder, gameMode, addCoins, spendCoins]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame outside GameProvider');
  return ctx;
}
