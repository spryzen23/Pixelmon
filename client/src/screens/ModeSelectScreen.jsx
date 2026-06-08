import { Button } from '../components/ui/Button';
import { useGame, SCREENS, GAME_MODES } from '../context/GameContext';

export function ModeSelectScreen() {
  const { goTo, setGameMode } = useGame();

  const pickMode = (mode) => {
    setGameMode(mode);
    if (mode === GAME_MODES.battleRoyale) {
      goTo(SCREENS.battleRoyale);
      return;
    }
    if (mode === GAME_MODES.sandbox) {
      goTo(SCREENS.inGame);
      return;
    }
    if (mode === GAME_MODES.minigameHub) {
      goTo(SCREENS.minigameHub);
      return;
    }
    goTo(SCREENS.welcome);
  };

  return (
    <div className="screen screen-shell mode-select-screen">
      <h2 className="screen-title">Voxel Legends</h2>
      <p className="screen-subtitle">Choose how you want to play</p>
      
      <div className="mode-grid">
        <button
          type="button"
          className="mode-card campaign"
          onClick={() => pickMode(GAME_MODES.campaign)}
        >
          <div className="mode-icon">🗺️</div>
          <div className="mode-info">
            <h3 className="mode-title">Campaign</h3>
            <p className="mode-desc">
              Progress through biomes, catch creatures, and unlock new areas in your adventure.
            </p>
          </div>
        </button>

        <button
          type="button"
          className="mode-card sandbox"
          onClick={() => pickMode(GAME_MODES.sandbox)}
        >
          <div className="mode-icon">🧭</div>
          <div className="mode-info">
            <h3 className="mode-title">Sandbox Explorer</h3>
            <p className="mode-desc">
              Explore all biomes freely with advanced spawns, analytical tracking, and test tools.
            </p>
          </div>
        </button>

        <button
          type="button"
          className="mode-card royale"
          onClick={() => pickMode(GAME_MODES.battleRoyale)}
        >
          <div className="mode-icon">⚔️</div>
          <div className="mode-info">
            <h3 className="mode-title">Battle Royale</h3>
            <p className="mode-desc">
              Join online lobbies and compete with other trainers in a timed catch race.
            </p>
          </div>
        </button>

        <button
          type="button"
          className="mode-card minigames"
          onClick={() => pickMode(GAME_MODES.minigameHub)}
        >
          <div className="mode-icon">🎓</div>
          <div className="mode-info">
            <h3 className="mode-title">Trivia & Battle Arena</h3>
            <p className="mode-desc">
              Engage in turn-based 3v3 combat, solve daily PokéGrids, guess mysteries, and earn coins!
            </p>
          </div>
        </button>
      </div>

      <div className="btn-row">
        <Button onClick={() => goTo(SCREENS.welcome)}>Back</Button>
      </div>
    </div>
  );
}
