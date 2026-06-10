'use client';

import dynamic from 'next/dynamic';
import { GameProvider, useGame, SCREENS } from './context/GameContext';
import { ToastProvider } from './hooks/useToast';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { GameCompleteScreen } from './screens/GameCompleteScreen';
import { PokedexScreen } from './screens/PokedexScreen';
import { MinigameHubScreen } from './screens/MinigameHubScreen';
import { BattleArenaScreen } from './screens/BattleArenaScreen';
import { DailyGridScreen } from './screens/DailyGridScreen';
import { ClueGuesserScreen } from './screens/ClueGuesserScreen';
import { TriviaTrainingScreen } from './screens/TriviaTrainingScreen';
import { ScreenLoadingFallback } from './components/ScreenLoadingFallback';
import './App.css';

// Defer Three.js / R3F screens so @react-three/fiber is not evaluated at App import time.
const DashboardScreen = dynamic(
  () => import('./screens/DashboardScreen').then((mod) => mod.DashboardScreen),
  { ssr: false, loading: ScreenLoadingFallback }
);
const ProfileSetupScreen = dynamic(
  () => import('./screens/ProfileSetupScreen').then((mod) => mod.ProfileSetupScreen),
  { ssr: false, loading: ScreenLoadingFallback }
);
const GameView = dynamic(
  () => import('./components/GameView').then((mod) => mod.GameView),
  { ssr: false, loading: ScreenLoadingFallback }
);
const BattleRoyaleShell = dynamic(
  () => import('./modes/battleRoyale/BattleRoyaleShell'),
  { ssr: false, loading: ScreenLoadingFallback }
);
const PokeWikiScreen = dynamic(
  () => import('./screens/PokeWikiScreen').then((mod) => mod.PokeWikiScreen),
  { ssr: false, loading: ScreenLoadingFallback }
);

function ScreenRouter() {
  const { screen, goTo } = useGame();

  switch (screen) {
    case SCREENS.welcome:
      return <WelcomeScreen />;
    case SCREENS.dashboard:
      return <DashboardScreen />;
    case SCREENS.battleRoyale:
      return <BattleRoyaleShell onBackToMenu={() => goTo(SCREENS.dashboard)} />;
    case SCREENS.profileSetup:
      return <ProfileSetupScreen />;
    case SCREENS.loading:
      return <LoadingScreen />;
    case SCREENS.inGame:
      return <GameView />;
    case SCREENS.gameComplete:
      return <GameCompleteScreen />;
    case SCREENS.pokedex:
      return <PokedexScreen />;
    case SCREENS.minigameHub:
      return <MinigameHubScreen />;
    case SCREENS.battleArena:
      return <BattleArenaScreen />;
    case SCREENS.dailyGrid:
    case SCREENS.gridPractice:
      return <DailyGridScreen />;
    case SCREENS.clueGuesser:
    case SCREENS.clueGuesserPractice:
      return <ClueGuesserScreen />;
    case SCREENS.triviaTraining:
      return <TriviaTrainingScreen />;
    case SCREENS.pokewiki:
      return <PokeWikiScreen />;
    default:
      return <WelcomeScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <ToastProvider>
        <div className="app-root">
          <ScreenRouter />
        </div>
      </ToastProvider>
    </GameProvider>
  );
}
