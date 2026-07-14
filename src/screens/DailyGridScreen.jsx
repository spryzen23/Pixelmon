import React, { useEffect, useState } from "react";
import { useGame, SCREENS } from "../context/GameContext";
import { api } from "../api";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import "../styles/minigames.css";

const CATEGORIES = {
  // Regions
  kanto: {
    id: "kanto",
    type: "region",
    label: "Kanto",
    value: "kanto",
    color: "bg-red-500",
  },
  johto: {
    id: "johto",
    type: "region",
    label: "Johto",
    value: "johto",
    color: "bg-yellow-600",
  },
  hoenn: {
    id: "hoenn",
    type: "region",
    label: "Hoenn",
    value: "hoenn",
    color: "bg-green-600",
  },
  sinnoh: {
    id: "sinnoh",
    type: "region",
    label: "Sinnoh",
    value: "sinnoh",
    color: "bg-blue-600",
  },
  unova: {
    id: "unova",
    type: "region",
    label: "Unova",
    value: "unova",
    color: "bg-slate-500",
  },

  // Types
  fire: {
    id: "fire",
    type: "type",
    label: "Fire",
    value: "fire",
    color: "bg-orange-500",
  },
  water: {
    id: "water",
    type: "type",
    label: "Water",
    value: "water",
    color: "bg-blue-400",
  },
  grass: {
    id: "grass",
    type: "type",
    label: "Grass",
    value: "grass",
    color: "bg-green-500",
  },
  electric: {
    id: "electric",
    type: "type",
    label: "Electric",
    value: "electric",
    color: "bg-yellow-500",
  },
  poison: {
    id: "poison",
    type: "type",
    label: "Poison",
    value: "poison",
    color: "bg-purple-600",
  },
  flying: {
    id: "flying",
    type: "type",
    label: "Flying",
    value: "flying",
    color: "bg-indigo-300",
  },
  psychic: {
    id: "psychic",
    type: "type",
    label: "Psychic",
    value: "psychic",
    color: "bg-pink-500",
  },
  legendary: {
    id: "legendary",
    type: "special",
    label: "Legendary",
    value: "legendary",
    color: "bg-amber-500",
  },
};

const PUZZLES = [
  {
    id: "1",
    rows: [CATEGORIES.kanto, CATEGORIES.johto, CATEGORIES.hoenn],
    cols: [CATEGORIES.fire, CATEGORIES.water, CATEGORIES.grass],
  },
  {
    id: "2",
    rows: [CATEGORIES.sinnoh, CATEGORIES.unova, CATEGORIES.legendary],
    cols: [CATEGORIES.electric, CATEGORIES.poison, CATEGORIES.flying],
  },
  {
    id: "3",
    rows: [CATEGORIES.kanto, CATEGORIES.johto, CATEGORIES.legendary],
    cols: [CATEGORIES.water, CATEGORIES.grass, CATEGORIES.psychic],
  },
];

function getDailyPuzzleIndex() {
  const dateStr = new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % PUZZLES.length;
}

export function DailyGridScreen() {
  const { goTo, addCoins } = useGame();

  // Game states
  const [puzzle, setPuzzle] = useState(null);
  const [speciesList, setSpeciesList] = useState([]);
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [guessesLeft, setGuessesLeft] = useState(9);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search autocomplete states
  const [activeCell, setActiveCell] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpecs, setFilteredSpecs] = useState([]);
  const [wrongCell, setWrongCell] = useState(null);
  const [surrendered, setSurrendered] = useState(false);

  // 1. Initial Load: Load puzzle configuration & species index
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getStarters();
        setSpeciesList(data.starters || []);

        // Select daily puzzle
        const pIdx = getDailyPuzzleIndex();
        setPuzzle(PUZZLES[pIdx]);

        // Restore daily state from localStorage if available
        const utcDateStr = new Date().toISOString().split("T")[0];
        const saved = localStorage.getItem(`pixelmon-grid:${utcDateStr}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setGrid(parsed.grid || Array(9).fill(null));
          setGuessesLeft(parsed.guessesLeft ?? 9);
          setGameOver(parsed.gameOver || false);
          setWon(parsed.won || false);
          setSurrendered(parsed.surrendered || false);
        }
      } catch (err) {
        console.error("Failed to load grid metadata", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save session state to localStorage
  const saveSessionState = (
    updatedGrid,
    updatedGuesses,
    isOver,
    isWon,
    isSurrendered
  ) => {
    const utcDateStr = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      `pixelmon-grid:${utcDateStr}`,
      JSON.stringify({
        grid: updatedGrid,
        guessesLeft: updatedGuesses,
        gameOver: isOver,
        won: isWon,
        surrendered: isSurrendered,
      })
    );
  };

  // Search filter
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredSpecs([]);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = speciesList.filter(
        (p) =>
          p.name.includes(query) || p.displayName.toLowerCase().includes(query)
      );
      setFilteredSpecs(filtered.slice(0, 8)); // Limit suggestion list
    }
  }, [searchQuery, speciesList]);

  const matchesCategory = (poke, cat) => {
    if (cat.type === "region") {
      return poke.region === cat.value;
    }
    if (cat.type === "type") {
      return poke.types.includes(cat.value);
    }
    if (cat.type === "special" && cat.value === "legendary") {
      return poke.isLegendary === true;
    }
    return false;
  };

  const handleSelectPokemon = (selectedPoke) => {
    if (activeCell === null || !puzzle) return;

    const rowIdx = Math.floor(activeCell / 3);
    const colIdx = activeCell % 3;
    const rowCat = puzzle.rows[rowIdx];
    const colCat = puzzle.cols[colIdx];

    // Check duplicate placement
    const alreadyPlaced = grid.some(
      (p) => p && p.speciesId === selectedPoke.speciesId
    );
    if (alreadyPlaced) {
      alert(
        `You already placed ${selectedPoke.displayName} elsewhere on the grid!`
      );
      setActiveCell(null);
      setSearchQuery("");
      return;
    }

    const isRowOk = matchesCategory(selectedPoke, rowCat);
    const isColOk = matchesCategory(selectedPoke, colCat);

    const nextGrid = [...grid];
    const nextGuesses = guessesLeft - 1;
    setGuessesLeft(nextGuesses);

    if (isRowOk && isColOk) {
      // Correct!
      nextGrid[activeCell] = {
        speciesId: selectedPoke.speciesId,
        name: selectedPoke.name,
        displayName: selectedPoke.displayName,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPoke.speciesId}.png`,
        types: selectedPoke.types,
      };
      setGrid(nextGrid);
      addCoins(10); // Reward 10 coins

      // Check win condition
      const perfect = nextGrid.every((cell) => cell !== null);
      if (perfect) {
        setWon(true);
        setGameOver(true);
        addCoins(50); // Bonus 50 coins payout
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        saveSessionState(nextGrid, nextGuesses, true, true, surrendered);
      } else if (nextGuesses <= 0) {
        setGameOver(true);
        saveSessionState(nextGrid, 0, true, false, surrendered);
      } else {
        saveSessionState(nextGrid, nextGuesses, gameOver, won, surrendered);
      }
    } else {
      // Wrong!
      setWrongCell(activeCell);
      setTimeout(() => setWrongCell(null), 800);

      if (nextGuesses <= 0) {
        setGameOver(true);
        saveSessionState(nextGrid, 0, true, false, surrendered);
      } else {
        saveSessionState(nextGrid, nextGuesses, gameOver, won, surrendered);
      }
    }

    setActiveCell(null);
    setSearchQuery("");
  };

  const handleSurrender = () => {
    if (
      window.confirm(
        "Are you sure you want to surrender? This will reveal potential solutions."
      )
    ) {
      setSurrendered(true);
      setGameOver(true);
      saveSessionState(grid, guessesLeft, true, won, true);
    }
  };

  const getCellCandidateNames = (cellIdx) => {
    if (!puzzle) return "";
    const r = Math.floor(cellIdx / 3);
    const c = cellIdx % 3;
    const row = puzzle.rows[r];
    const col = puzzle.cols[c];
    const matches = speciesList.filter(
      (p) => matchesCategory(p, row) && matchesCategory(p, col)
    );
    return matches
      .slice(0, 3)
      .map((m) => m.displayName)
      .join(", ");
  };

  return (
    <div className="minigames-screen">
      <header className="minigames-header">
        <div className="minigames-title-group">
          <p className="minigames-eyebrow">Trivia Puzzle</p>
          <h1 className="minigames-title">Daily 3x3 PokéGrid</h1>
        </div>
        <div className="minigames-header-stats">
          <button
            className="btn-back"
            onClick={() => goTo(SCREENS.minigameHub)}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      {loading || !puzzle ? (
        <div
          className="minigame-inner-header"
          style={{
            border: "none",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          <p className="minigames-eyebrow animate-pulse">
            Constructing daily Rotom grid intersections...
          </p>
        </div>
      ) : (
        <div className="minigame-container">
          <div className="minigame-content">
            <div className="grid-status-alert">
              <div className="grid-status-info">
                <span>🎯</span>
                <div>
                  <h3>Guesses Remaining: {guessesLeft}</h3>
                  <p>
                    Solve all 9 cells matching Row and Column parameters without
                    running out of tries!
                  </p>
                </div>
              </div>
              {!gameOver && (
                <button className="btn-surrender" onClick={handleSurrender}>
                  🏳️ Give Up / Surrender
                </button>
              )}
            </div>

            <div style={{ margin: "24px 0" }}>
              <div className="daily-grid-matrix">
                {/* Cell 0,0 - Origin info */}
                <div className="grid-cell origin-cell">
                  <span>REGION</span>
                  <span style={{ color: "var(--px-accent)" }}>×</span>
                  <span>TYPES</span>
                </div>

                {/* Col Headers */}
                {puzzle.cols.map((col, idx) => (
                  <div key={idx} className="grid-cell header-cell">
                    <span
                      className="header-tag"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--px-text)",
                      }}
                    >
                      {col.label}
                    </span>
                  </div>
                ))}

                {/* Rows Grid */}
                {[0, 1, 2].map((rIdx) => (
                  <React.Fragment key={rIdx}>
                    {/* Row Header */}
                    <div className="grid-cell header-cell">
                      <span
                        className="header-tag"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "var(--px-text)",
                        }}
                      >
                        {puzzle.rows[rIdx].label}
                      </span>
                    </div>

                    {/* 3 Cells */}
                    {[0, 1, 2].map((cIdx) => {
                      const cellIdx = rIdx * 3 + cIdx;
                      const cellPoke = grid[cellIdx];
                      const isWrong = wrongCell === cellIdx;
                      const isActive = activeCell === cellIdx;

                      return (
                        <div
                          key={cIdx}
                          className={`grid-cell input-cell ${cellPoke ? "occupied" : ""} ${isWrong ? "wrong-cell" : ""} ${isActive ? "active-cell" : ""}`}
                          onClick={() => {
                            if (cellPoke || gameOver) return;
                            setActiveCell(cellIdx);
                          }}
                        >
                          {cellPoke ? (
                            <div className="w-full h-full flex flex-col justify-between items-center relative">
                              <span className="occupied-check">✓</span>
                              <div className="sprite-container">
                                <img
                                  src={cellPoke.sprite}
                                  alt={cellPoke.displayName}
                                  className="sprite-img"
                                />
                              </div>
                              <span className="species-label">
                                {cellPoke.displayName}
                              </span>
                            </div>
                          ) : gameOver && surrendered ? (
                            <div
                              style={{
                                fontSize: "9px",
                                opacity: 0.7,
                                padding: "4px",
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: "var(--px-accent-warm)",
                                  fontWeight: 800,
                                }}
                              >
                                Answers:
                              </span>
                              <p
                                style={{ margin: "4px 0 0 0", lineHeight: 1.2 }}
                              >
                                {getCellCandidateNames(cellIdx) || "None"}
                              </p>
                            </div>
                          ) : (
                            <span style={{ fontSize: "16px", opacity: 0.3 }}>
                              ?
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {gameOver && (
              <div
                className="grid-status-alert"
                style={{
                  background: won
                    ? "rgba(28,212,93,0.08)"
                    : "rgba(248,79,79,0.08)",
                  borderColor: won
                    ? "rgba(28,212,93,0.2)"
                    : "rgba(248,79,79,0.2)",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <h3
                    style={{
                      color: won ? "var(--px-success)" : "var(--px-danger)",
                    }}
                  >
                    {won ? "🏆 Perfect Grid Cleared!" : "💀 Guesses Expired!"}
                  </h3>
                  <p>
                    {won
                      ? "Congratulations! You solved all 9 coordinates of today's PokéGrid!"
                      : "Try again tomorrow to solve the coordinates!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Autocomplete Search Modal */}
      {activeCell !== null && (
        <div
          className="search-modal-backdrop"
          onClick={() => setActiveCell(null)}
        >
          <div
            className="search-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal-header">
              <h3 className="minigame-inner-title">Identify Pokémon</h3>
              <button
                className="btn-back"
                style={{ padding: "4px 8px" }}
                onClick={() => setActiveCell(null)}
              >
                X
              </button>
            </div>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input-field"
                placeholder="Type name (e.g. Charmander)..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ul className="search-results-list">
              {filteredSpecs.map((p) => (
                <li
                  key={p.entryId}
                  className="search-result-item"
                  onClick={() => handleSelectPokemon(p)}
                >
                  <span>{p.displayName}</span>
                  <span style={{ fontSize: "10px", opacity: 0.5 }}>
                    {p.types.join(" / ")}
                  </span>
                </li>
              ))}
              {searchQuery.trim().length > 0 && filteredSpecs.length === 0 && (
                <li
                  className="search-result-item"
                  style={{ cursor: "default", opacity: 0.5 }}
                >
                  No matching species found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
export default DailyGridScreen;
