import { useEffect, useState } from 'react';
import { useGame, SCREENS } from '../context/GameContext';
import { useToast } from '../hooks/useToast';
import { api } from '../api';
import {
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import '../styles/minigames.css';

function getDailyTargetIndex(listLength) {
  const dateStr = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % listLength;
}

export function ClueGuesserScreen() {
  const { goTo, addCoins, screen } = useGame();
  const isPractice = screen === SCREENS.clueGuesserPractice;
  const { toast } = useToast();

  // Game states
  const [speciesList, setSpeciesList] = useState([]);
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpecs, setFilteredSpecs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Initial Load: Choose daily target and load database list
  useEffect(() => {
    async function loadSession() {
      setLoading(true);
      try {
        const data = await api.getStarters();
        const starters = data.starters || [];
        setSpeciesList(starters);

        let activeTarget = null;
        let activeGuesses = [];
        let activeGameOver = false;
        let activeWon = false;

        let saved;
        if (isPractice) {
          saved = localStorage.getItem('pixelmon-clues-practice');
        } else {
          const utcDateStr = new Date().toISOString().split('T')[0];
          saved = localStorage.getItem(`pixelmon-clues:${utcDateStr}`);
        }

        if (saved) {
          const parsed = JSON.parse(saved);
          activeGuesses = parsed.guesses || [];
          activeGameOver = parsed.gameOver || false;
          activeWon = parsed.won || false;
          if (isPractice && parsed.target) {
            activeTarget = parsed.target;
          }
        }

        // If practice mode and target isn't restored, choose a random one
        // If daily mode, target is always based on the daily index
        if (!activeTarget && starters.length > 0) {
          let tSlim;
          if (isPractice) {
            const tIdx = Math.floor(Math.random() * starters.length);
            tSlim = starters[tIdx];
          } else {
            const tIdx = getDailyTargetIndex(starters.length);
            tSlim = starters[tIdx];
          }

          // Fetch target details from PokéAPI
          const tRes = await fetch(`/api/pokemon/${tSlim.name}`);
          const tData = await tRes.json();

          activeTarget = {
            speciesId: tSlim.speciesId,
            name: tSlim.name,
            displayName: tSlim.displayName,
            region: tSlim.region,
            types: tSlim.types,
            height: tData.height,
            weight: tData.weight,
            hp: tData.stats[0].base_stat,
            attack: tData.stats[1].base_stat,
            defense: tData.stats[2].base_stat,
            sprite: tData.sprites.other?.['official-artwork']?.front_default || tData.sprites.front_default
          };
        }

        setTarget(activeTarget);
        setGuesses(activeGuesses);
        setGameOver(activeGameOver);
        setWon(activeWon);
      } catch (err) {
        console.error("Failed to load Clue Guesser session", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [isPractice]);

  const saveLocalGuesses = (updatedGuesses, isOver, isWon, currentTarget = target) => {
    if (isPractice) {
      localStorage.setItem('pixelmon-clues-practice', JSON.stringify({
        target: currentTarget,
        guesses: updatedGuesses,
        gameOver: isOver,
        won: isWon
      }));
    } else {
      const utcDateStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(`pixelmon-clues:${utcDateStr}`, JSON.stringify({
        guesses: updatedGuesses,
        gameOver: isOver,
        won: isWon
      }));
    }
  };

  const handlePlayAgain = async () => {
    if (!isPractice || speciesList.length === 0) return;

    setLoading(true);
    try {
      // Pick a new random target
      let tSlim;
      do {
        const tIdx = Math.floor(Math.random() * speciesList.length);
        tSlim = speciesList[tIdx];
      } while (target && tSlim.name === target.name && speciesList.length > 1);

      const tRes = await fetch(`/api/pokemon/${tSlim.name}`);
      const tData = await tRes.json();

      const newTarget = {
        speciesId: tSlim.speciesId,
        name: tSlim.name,
        displayName: tSlim.displayName,
        region: tSlim.region,
        types: tSlim.types,
        height: tData.height,
        weight: tData.weight,
        hp: tData.stats[0].base_stat,
        attack: tData.stats[1].base_stat,
        defense: tData.stats[2].base_stat,
        sprite: tData.sprites.other?.['official-artwork']?.front_default || tData.sprites.front_default
      };

      setTarget(newTarget);
      setGuesses([]);
      setGameOver(false);
      setWon(false);
      setSearchQuery('');

      // Clear practice local storage
      localStorage.removeItem('pixelmon-clues-practice');
    } catch (err) {
      console.error("Failed to start new clue guesser practice session", err);
      toast('Failed to start new session. Retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Autocomplete filtering
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredSpecs([]);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = speciesList.filter(p =>
        p.name.includes(query) || p.displayName.toLowerCase().includes(query)
      );
      setFilteredSpecs(filtered.slice(0, 6));
    }
  }, [searchQuery, speciesList]);

  // Handle guess submission
  const handleGuessSubmit = async (guessSlim) => {
    if (gameOver || !target) return;

    // Check duplicates
    if (guesses.some(g => g.name === guessSlim.name)) {
      toast('You already guessed that Pokémon!', 'error');
      setSearchQuery('');
      return;
    }

    setLoading(true);
    try {
      // Fetch guessed pokemon stats from PokéAPI
      const res = await fetch(`/api/pokemon/${guessSlim.name}`);
      const data = await res.json();

      const guessDetails = {
        name: guessSlim.name,
        displayName: guessSlim.displayName,
        region: guessSlim.region,
        types: guessSlim.types,
        height: data.height,
        weight: data.weight,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        sprite: data.sprites.front_default || guessSlim.sprite
      };

      const updatedGuesses = [guessDetails, ...guesses];
      setGuesses(updatedGuesses);
      setSearchQuery('');

      // Check win
      if (guessSlim.name === target.name) {
        setWon(true);
        setGameOver(true);
        const winReward = isPractice ? 10 : 50;
        addCoins(winReward); // Win payout coins
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        saveLocalGuesses(updatedGuesses, true, true);
      } else if (updatedGuesses.length >= 6) {
        setGameOver(true);
        saveLocalGuesses(updatedGuesses, true, false);
      } else {
        saveLocalGuesses(updatedGuesses, false, false);
      }
    } catch (err) {
      console.error(err);
      toast('API fetch error. Retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Compare stats helper
  const getStatIndicator = (guessVal, targetVal) => {
    if (guessVal === targetVal) return { label: '🟢', color: 'bg-green-600/10 border-green-500 text-green-500' };
    const diff = Math.abs(guessVal - targetVal) / targetVal;
    if (diff <= 0.25) {
      return {
        label: guessVal > targetVal ? '🟡 ↓' : '🟡 ↑',
        color: 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
      };
    }
    return {
      label: guessVal > targetVal ? '🔴 ↓' : '🔴 ↑',
      color: 'bg-red-500/10 border-red-500 text-red-500'
    };
  };

  const getTypeIndicator = (guessTypes, targetTypes) => {
    const identical = guessTypes.length === targetTypes.length &&
      guessTypes.every(t => targetTypes.includes(t));
    if (identical) return { label: guessTypes.join('/'), color: 'bg-green-600/10 border-green-500 text-green-500' };

    const shared = guessTypes.filter(t => targetTypes.includes(t));
    if (shared.length > 0) return { label: guessTypes.join('/'), color: 'bg-yellow-500/10 border-yellow-500 text-yellow-500' };

    return { label: guessTypes.join('/'), color: 'bg-red-500/10 border-red-500 text-red-500' };
  };

  return (
    <div className="minigames-screen clue-guesser-screen">
      {loading && guesses.length === 0 ? (
        <div className="minigame-inner-header" style={{ border: 'none', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
          <button className="btn-back" onClick={() => goTo(SCREENS.minigameHub)}>
            <ArrowLeft size={14} /> Back
          </button>
          <p className="minigames-eyebrow animate-pulse">Scanning database and loading clues...</p>
        </div>
      ) : (
        <div className="minigame-container">
          <div className="minigame-content">

            <div className="grid-status-alert">
              <div className="grid-status-info">
                <span>🧠</span>
                <div>
                  <h3>Guesses: {guesses.length} / 6</h3>
                  <p>{isPractice ? 'Identify the practice mystery Pokémon! Feedback shows if region, types, size, or stats match.' : 'Identify the daily mystery Pokémon! Feedback shows if region, types, size, or stats match.'}</p>
                </div>
              </div>
              <button className="btn-back" onClick={() => goTo(SCREENS.minigameHub)}>
                <ArrowLeft size={14} /> Back
              </button>
            </div>

            {/* Guess input */}
            {!gameOver && (
              <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto 30px auto' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="dmg-calc-input"
                    placeholder="Type Pokémon name (e.g. Bulbasaur)..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                {filteredSpecs.length > 0 && (
                  <ul className="search-results-list" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 100, background: '#0d1626', border: '1px solid var(--px-border)', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {filteredSpecs.map(p => (
                      <li key={p.entryId} className="search-result-item" onClick={() => handleGuessSubmit(p)}>
                        <span>{p.displayName}</span>
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>{p.types.join('/')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Feedback table list */}
            {guesses.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--px-border)' }}>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>Sprite</th>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>Name</th>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>Types</th>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>Region</th>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>Height</th>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>Weight</th>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>HP</th>
                      <th style={{ padding: '10px', fontSize: '11px', color: 'var(--px-text-muted)' }}>Attack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guesses.map((g, idx) => {
                      const tInd = getTypeIndicator(g.types, target.types);
                      const rInd = g.region === target.region ?
                        { label: g.region, color: 'bg-green-600/10 border-green-500 text-green-500' } :
                        { label: g.region, color: 'bg-red-500/10 border-red-500 text-red-500' };
                      const hInd = getStatIndicator(g.height, target.height);
                      const wInd = getStatIndicator(g.weight, target.weight);
                      const hpInd = getStatIndicator(g.hp, target.hp);
                      const atkInd = getStatIndicator(g.attack, target.attack);

                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px' }}>
                            <img src={g.sprite} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                          </td>
                          <td style={{ padding: '8px', fontWeight: 700, textTransform: 'capitalize' }}>
                            {g.displayName}
                          </td>
                          <td style={{ padding: '8px' }}>
                            <span className={`status-badge ${tInd.color}`} style={{ border: '1px solid', textTransform: 'capitalize' }}>
                              {tInd.label}
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <span className={`status-badge ${rInd.color}`} style={{ border: '1px solid', textTransform: 'capitalize' }}>
                              {rInd.label}
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <span className={`status-badge ${hInd.color}`} style={{ border: '1px solid' }}>
                              {hInd.label} ({g.height / 10}m)
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <span className={`status-badge ${wInd.color}`} style={{ border: '1px solid' }}>
                              {wInd.label} ({g.weight / 10}kg)
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <span className={`status-badge ${hpInd.color}`} style={{ border: '1px solid' }}>
                              {hpInd.label} ({g.hp})
                            </span>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <span className={`status-badge ${atkInd.color}`} style={{ border: '1px solid' }}>
                              {atkInd.label} ({g.attack})
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {gameOver && target && (
              <div className="grid-status-alert" style={{ marginTop: '24px', background: won ? 'rgba(28,212,93,0.08)' : 'rgba(248,79,79,0.08)', borderColor: won ? 'rgba(28,212,93,0.2)' : 'rgba(248,79,79,0.2)' }}>
                <div style={{ textAlign: 'left', display: 'flex', gap: '16px', alignItems: 'center', flexGrow: 1 }}>
                  <img src={target.sprite} alt="" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                  <div>
                    <h3 style={{ color: won ? 'var(--px-success)' : 'var(--px-danger)', margin: 0 }}>
                      {won ? '🏆 Correct Guess!' : '💀 Out of Tries!'}
                    </h3>
                    <p style={{ margin: '4px 0 0 0' }}>
                      {won ? `Great job! You guessed ${target.displayName} correctly!` : `The target Pokémon was ${target.displayName} (${target.types.join('/')}, ${target.region.toUpperCase()}).`}
                    </p>
                    {isPractice && won && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--px-accent)' }}>
                        Earned PokéCoins: <strong>+10</strong> (Practice Reward)
                      </p>
                    )}
                  </div>
                </div>
                {isPractice && (
                  <button className="btn-surrender" style={{ background: 'var(--px-sky)', borderColor: 'var(--px-sky)', color: '#fff' }} onClick={handlePlayAgain}>
                    🔄 Try Another Pokémon
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
export default ClueGuesserScreen;
