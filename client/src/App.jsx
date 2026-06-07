import { GameProvider, useGame, SCREENS } from './context/GameContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { PlayerSelectScreen } from './screens/PlayerSelectScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { MapSelectScreen } from './screens/MapSelectScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { GameCompleteScreen } from './screens/GameCompleteScreen';
import { PokedexScreen } from './screens/PokedexScreen';
import { GameView } from './components/GameView';
import './App.css';

function ScreenRouter() {
  const { screen } = useGame();

  switch (screen) {
    case SCREENS.welcome:
      return <WelcomeScreen />;
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
