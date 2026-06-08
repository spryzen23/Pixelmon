import { useEffect } from 'react';
import { useGame, SCREENS } from '../context/GameContext';
import { 
  ArrowLeft, 
  Coins, 
  Flame, 
  Swords, 
  Grid, 
  Compass, 
  GraduationCap, 
  BookOpen, 
  Keyboard 
} from 'lucide-react';
import '../styles/minigames.css';

export function MinigameHubScreen() {
  const { goTo, player } = useGame();
  
  // Load coins and streaks from profile or fallback
  const coins = player ? (player.coins ?? 150) : Number(localStorage.getItem('pixelmon-localCoins') || 150);
  const dailyStreak = player?.streaks?.dailyStreak ?? Number(localStorage.getItem('pixelmon-localDailyStreak') || 0);
  const guessStreak = player?.streaks?.guessStreak ?? Number(localStorage.getItem('pixelmon-localGuessStreak') || 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if inside an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case '1':
          goTo(SCREENS.dailyGrid);
          break;
        case '2':
          goTo(SCREENS.clueGuesser);
          break;
        case '3':
          goTo(SCREENS.battleArena);
          break;
        case '4':
          goTo(SCREENS.triviaTraining);
          break;
        case '5':
          goTo(SCREENS.pokedex);
          break;
        case 'Escape':
          goTo(SCREENS.modeSelect);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goTo]);

  return (
    <div className="minigames-screen">
      <header className="minigames-header">
        <div className="minigames-title-group">
          <p className="minigames-eyebrow">Pixelmon Academy</p>
          <h1 className="minigames-title">Trivia & Battle Arena</h1>
        </div>
        <div className="minigames-header-stats">
          <div className="minigames-stat-badge accent" title="Your PokéCoins balance">
            <Coins size={15} />
            <span>{coins} Coins</span>
          </div>
          {dailyStreak > 0 && (
            <div className="minigames-stat-badge streak" title="Consecutive days logged in">
              <Flame size={15} />
              <span>{dailyStreak} Days</span>
            </div>
          )}
          {guessStreak > 0 && (
            <div className="minigames-stat-badge" title="Consecutive correct guesses streak">
              <span>🎯 {guessStreak} Streak</span>
            </div>
          )}
          <button className="btn-back" onClick={() => goTo(SCREENS.modeSelect)}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      <main className="minigames-dashboard">
        <div className="minigames-section-label">🏆 Core Challenges</div>
        <div className="minigames-bento-grid main-challenges">
          
          {/* Daily 3x3 Grid */}
          <div className="bento-card featured" onClick={() => goTo(SCREENS.dailyGrid)}>
            <span className="bento-keybind">Press 1</span>
            <div className="bento-icon-wrapper">
              <Grid size={22} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">Daily 3x3 PokéGrid</h3>
              <p className="bento-desc">Match region, typing, and legendary status criteria in a 3x3 PokeDoku grid puzzle.</p>
            </div>
            <div className="bento-footer">
              <span className="bento-reward-label">Daily Reward</span>
            </div>
          </div>

          {/* Daily Clue Guesser */}
          <div className="bento-card featured" onClick={() => goTo(SCREENS.clueGuesser)}>
            <span className="bento-keybind">Press 2</span>
            <div className="bento-icon-wrapper">
              <Compass size={22} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">Daily Clue Guesser</h3>
              <p className="bento-desc">Guess the mystery daily Pokémon using Wordle-style feedback details on stats, regions, and types.</p>
            </div>
            <div className="bento-footer">
              <span className="bento-reward-label">Daily Reward</span>
            </div>
          </div>

          {/* Battle Arena */}
          <div className="bento-card battle-arena" onClick={() => goTo(SCREENS.battleArena)}>
            <span className="bento-keybind">Press 3</span>
            <div className="bento-icon-wrapper">
              <Swords size={22} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">Pokémon Battle Arena</h3>
              <p className="bento-desc">Draft a team of 3 creatures and test your skills in turn-based strategic battles with an interactive damage calculator.</p>
            </div>
            <div className="bento-footer">
              <span className="bento-reward-label">Active Combat</span>
            </div>
          </div>

        </div>

        <div className="minigames-section-label">⚡ Training & Utilities</div>
        <div className="minigames-bento-grid training-labs">
          
          {/* Training Labs */}
          <div className="bento-card" onClick={() => goTo(SCREENS.triviaTraining)}>
            <span className="bento-keybind">Press 4</span>
            <div className="bento-icon-wrapper">
              <GraduationCap size={20} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">Training Labs</h3>
              <p className="bento-desc">Sharpen your knowledge in Speed Run, Type Matchup, Silhouette, and combination quizzes.</p>
            </div>
          </div>

          {/* View My Pokédex */}
          <div className="bento-card" onClick={() => goTo(SCREENS.pokedex)}>
            <span className="bento-keybind">Press 5</span>
            <div className="bento-icon-wrapper">
              <BookOpen size={20} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">View Pokédex</h3>
              <p className="bento-desc">Browse your caught Pokémon checklist, base stats, types, and unlocked entries catalog.</p>
            </div>
          </div>

          {/* Keyboard Help Card */}
          <div className="bento-card" style={{ cursor: 'default', background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.03)' }}>
            <div className="bento-icon-wrapper">
              <Keyboard size={20} style={{ opacity: 0.4 }} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title" style={{ opacity: 0.6 }}>Shortcuts Enabled</h3>
              <p className="bento-desc" style={{ opacity: 0.5 }}>Use keys 1-5 to navigate challenges instantly. Press Escape to exit.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
