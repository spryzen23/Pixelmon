import { GameProvider, useGame, SCREENS } from './context/GameContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { ModeSelectScreen } from './screens/ModeSelectScreen';
import BattleRoyaleShell from './modes/battleRoyale/BattleRoyaleShell';
import { PlayerSelectScreen } from './screens/PlayerSelectScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { MapSelectScreen } from './screens/MapSelectScreen';
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
    case SCREENS.modeSelect:
      return <ModeSelectScreen />;
    case SCREENS.battleRoyale:
      return <BattleRoyaleShell onBackToMenu={() => goTo(SCREENS.modeSelect)} />;
    case SCREENS.playerSelect:
      return <PlayerSelectScreen />;
    case SCREENS.profileSetup:
      return <ProfileSetupScreen />;
    case SCREENS.mapSelect:
      return <MapSelectScreen />;
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
      <div className="app-root">
        <ScreenRouter />
      </div>
    </GameProvider>
  );
}
