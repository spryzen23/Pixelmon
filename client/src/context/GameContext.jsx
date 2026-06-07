import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const GameContext = createContext(null);

export const SCREENS = {
  welcome: 'welcome',
  playerSelect: 'playerSelect',
  profileSetup: 'profileSetup',
  mapSelect: 'mapSelect',
  loading: 'loading',
  inGame: 'inGame',
  gameComplete: 'gameComplete',
  pokedex: 'pokedex',
};

export function GameProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.welcome);
  const [player, setPlayer] = useState(null);
  const [session, setSession] = useState(null);
  const [gameRuntime, setGameRuntime] = useState(null);
  const [completeStats, setCompleteStats] = useState(null);
  const [biomeMap, setBiomeMap] = useState(null);
  const [spawnLadder, setSpawnLadder] = useState(null);

  const goTo = useCallback((next) => setScreen(next), []);

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
    }),
    [screen, goTo, player, session, gameRuntime, completeStats, biomeMap, spawnLadder]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame outside GameProvider');
  return ctx;
}
