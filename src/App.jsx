import { GameProvider, useGame, SCREENS } from './context/GameContext';
import { ToastProvider } from './hooks/useToast';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import BattleRoyaleShell from './modes/battleRoyale/BattleRoyaleShell';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { GameCompleteScreen } from './screens/GameCompleteScreen';
import { PokedexScreen } from './screens/PokedexScreen';
import { GameView } from './components/GameView';
import { MinigameHubScreen } from './screens/MinigameHubScreen';
import { BattleArenaScreen } from './screens/BattleArenaScreen';
import { DailyGridScreen } from './screens/DailyGridScreen';
import { ClueGuesserScreen } from './screens/ClueGuesserScreen';
import { TriviaTrainingScreen } from './screens/TriviaTrainingScreen';
import './App.css';

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
      return <DailyGridScreen />;
    case SCREENS.clueGuesser:
      return <ClueGuesserScreen />;
    case SCREENS.triviaTraining:
      return <TriviaTrainingScreen />;
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
