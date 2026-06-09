import { useState } from 'react';
import { useGame, SCREENS } from '../context/GameContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Modal } from '../components/ui/Modal';
import {
  ArrowLeft,
  Coins,
  Flame,
  Swords,
  Grid,
  Compass,
  GraduationCap,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import '../styles/minigames.css';

export function MinigameHubScreen() {
  const { goTo, player } = useGame();

  // Load coins and streaks from profile or fallback
  const coins = player ? (player.coins ?? 150) : Number(localStorage.getItem('pixelmon-localCoins') || 150);
  const dailyStreak = player?.streaks?.dailyStreak ?? Number(localStorage.getItem('pixelmon-localDailyStreak') || 0);
  const guessStreak = player?.streaks?.guessStreak ?? Number(localStorage.getItem('pixelmon-localGuessStreak') || 0);

  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useKeyboardShortcuts({
    '1': () => goTo(SCREENS.dailyGrid),
    '2': () => goTo(SCREENS.clueGuesser),
    '3': () => goTo(SCREENS.battleArena),
    '4': () => goTo(SCREENS.battleArenaV2),
    '5': () => goTo(SCREENS.triviaTraining),
    '6': () => goTo(SCREENS.pokedex),
    Escape: () => goTo(SCREENS.dashboard),
    '?': () => setShortcutsOpen(true),
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
          <button type="button" className="btn-back" onClick={() => setShortcutsOpen(true)} title="Keyboard shortcuts">
            ?
          </button>
          <button type="button" className="btn-back" onClick={() => goTo(SCREENS.dashboard)}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      <main className="minigames-dashboard">
        <div className="minigames-section-label">🏆 Core Challenges</div>
        <div className="minigames-bento-grid main-challenges">

          {/* Daily 3x3 Grid */}
          <button type="button" className="bento-card featured" onClick={() => goTo(SCREENS.dailyGrid)}>
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
          </button>

          {/* Daily Clue Guesser */}
          <button type="button" className="bento-card featured" onClick={() => goTo(SCREENS.clueGuesser)}>
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
          </button>

          {/* Battle Arena */}
          <button type="button" className="bento-card battle-arena" onClick={() => goTo(SCREENS.battleArena)}>
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
          </button>

          {/* Battle Arena V2 */}
          <button type="button" className="bento-card battle-arena-v2" onClick={() => goTo(SCREENS.battleArenaV2)}>
            <span className="bento-keybind">Press 4</span>
            <div className="bento-icon-wrapper">
              <ShieldCheck size={22} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">Pokemon Battle Arena V2</h3>
              <p className="bento-desc">Draft a team and test the reusable battle engine with explicit teams, weather, AI, items, and catalog-backed moves.</p>
            </div>
            <div className="bento-footer">
              <span className="bento-reward-label">Battle Engine</span>
            </div>
          </button>

        </div>

        <div className="minigames-section-label">⚡ Training & Utilities</div>
        <div className="minigames-bento-grid training-labs">

          {/* Training Labs */}
          <button type="button" className="bento-card" onClick={() => goTo(SCREENS.triviaTraining)}>
            <span className="bento-keybind">Press 5</span>
            <div className="bento-icon-wrapper">
              <GraduationCap size={20} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">Training Labs</h3>
              <p className="bento-desc">Sharpen your knowledge in Speed Run, Type Matchup, Silhouette, and combination quizzes.</p>
            </div>
          </button>

          {/* View My Pokédex */}
          <button type="button" className="bento-card" onClick={() => goTo(SCREENS.pokedex)}>
            <span className="bento-keybind">Press 6</span>
            <div className="bento-icon-wrapper">
              <BookOpen size={20} />
            </div>
            <div className="bento-details">
              <h3 className="bento-title">View Pokédex</h3>
              <p className="bento-desc">Browse your caught Pokémon checklist, base stats, types, and unlocked entries catalog.</p>
            </div>
          </button>

        </div>
      </main>

      <Modal open={shortcutsOpen} title="Keyboard Shortcuts" onClose={() => setShortcutsOpen(false)}>
        <p>Press 1 — Daily PokéGrid</p>
        <p>Press 2 — Clue Guesser</p>
        <p>Press 3 — Battle Arena</p>
        <p>Press 4 — Battle Arena V2</p>
        <p>Press 5 — Training Labs</p>
        <p>Press 6 — Pokédex</p>
        <p>Escape — Back to Dashboard</p>
      </Modal>
    </div>
  );
}
