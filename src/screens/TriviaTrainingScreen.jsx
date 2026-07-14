import { useEffect, useState, useRef, useCallback } from "react";
import { useGame, SCREENS } from "../context/GameContext";
import { api } from "../api";
import { ArrowLeft, Timer, TrendingUp, Brain, Zap, Swords } from "lucide-react";
import confetti from "canvas-confetti";
import "../styles/minigames.css";

const TYPE_LIST = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const MULTIPLIERS = {
  normal: {
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    normal: 1,
    rock: 0.5,
    steel: 0.5,
    ghost: 0,
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    electric: 1,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    electric: 1,
    ground: 2,
    rock: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  electric: {
    water: 2,
    grass: 0.5,
    electric: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    flying: 0.5,
    poison: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    grass: 0.5,
    electric: 2,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    grass: 2,
    electric: 0.5,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5,
  },
};

function getDmgMultiplier(atkType, defType) {
  return MULTIPLIERS[atkType]?.[defType] ?? 1;
}

export function TriviaTrainingScreen() {
  const { goTo, addCoins } = useGame();

  // Setup state
  const [mode, setMode] = useState("menu"); // 'menu' | 'speedrun' | 'typeexpert' | 'silhouette' | 'typefocus'
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active quiz states
  const [score, setScore] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [quizOver, setQuizOver] = useState(false);

  // Silhouette extra states
  const [showSilhouetteName, setShowSilhouetteName] = useState(false);
  const [silhouetteGuess, setSilhouetteGuess] = useState("");
  const [silhouetteSprite, setSilhouetteSprite] = useState("");

  const timerRef = useRef(null);

  // Load database list
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getStarters();
        setSpeciesList(data.starters || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Global Timer Hook
  useEffect(() => {
    if (
      (mode === "speedrun" || mode === "silhouette") &&
      timeLeft > 0 &&
      !quizOver
    ) {
      timerRef.current = setTimeout(
        () => setTimeLeft((prev) => prev - 1),
        1000
      );
    } else if (timeLeft === 0 && !quizOver) {
      endQuiz();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, mode, quizOver, endQuiz]);

  const endQuiz = useCallback(() => {
    setQuizOver(true);
    clearTimeout(timerRef.current);
    // Reward coins
    const coinsReward = Math.floor(score * 2);
    if (coinsReward > 0) addCoins(coinsReward);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  }, [score, addCoins]);

  const startSpeedRun = () => {
    setScore(0);
    setQuestionIdx(0);
    setTimeLeft(60);
    setQuizOver(false);
    setMode("speedrun");
    generateSpeedRunQuestion();
  };

  const generateSpeedRunQuestion = () => {
    if (speciesList.length === 0) return;
    const poke = speciesList[Math.floor(Math.random() * speciesList.length)];
    const randType = TYPE_LIST[Math.floor(Math.random() * TYPE_LIST.length)];

    // Check if yes
    const isYes = poke.types.includes(randType);

    setActiveQuestion({
      text: `Is **${poke.displayName}** a **${randType.toUpperCase()}**-type Pokémon?`,
      answer: isYes,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.speciesId}.png`,
    });
  };

  const handleSpeedRunAnswer = (ans) => {
    if (ans === activeQuestion.answer) {
      setScore((prev) => prev + 5);
      playAudioToneSuccess(true);
    } else {
      setScore((prev) => Math.max(0, prev - 2));
      playAudioToneSuccess(false);
    }
    setQuestionIdx((prev) => prev + 1);
    generateSpeedRunQuestion();
  };

  // Sound tone generators
  const playAudioToneSuccess = (success) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      if (success) {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else {
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio context might be blocked or unsupported; ignore silently
    }
  };

  const startTypeExpert = () => {
    setScore(0);
    setQuestionIdx(0);
    setQuizOver(false);
    setMode("typeexpert");
    generateTypeExpertQuestion();
  };

  const generateTypeExpertQuestion = () => {
    const atk = TYPE_LIST[Math.floor(Math.random() * TYPE_LIST.length)];
    const def = TYPE_LIST[Math.floor(Math.random() * TYPE_LIST.length)];
    const mult = getDmgMultiplier(atk, def);

    setActiveQuestion({
      text: `What is the damage multiplier when a **${atk.toUpperCase()}** move hits a **${def.toUpperCase()}** Pokémon?`,
      answer: mult,
      options: [0, 0.5, 1, 2],
    });
  };

  const handleTypeExpertAnswer = (ans) => {
    if (ans === activeQuestion.answer) {
      setScore((prev) => prev + 10);
      playAudioToneSuccess(true);
    } else {
      playAudioToneSuccess(false);
      alert(`Wrong! The correct multiplier is ${activeQuestion.answer}x.`);
    }

    if (questionIdx >= 9) {
      endQuiz();
    } else {
      setQuestionIdx((prev) => prev + 1);
      generateTypeExpertQuestion();
    }
  };

  const startSilhouette = () => {
    setScore(0);
    setQuestionIdx(0);
    setTimeLeft(60);
    setQuizOver(false);
    setShowSilhouetteName(false);
    setSilhouetteGuess("");
    setMode("silhouette");
    generateSilhouetteQuestion();
  };

  const generateSilhouetteQuestion = async () => {
    if (speciesList.length === 0) return;
    const poke = speciesList[Math.floor(Math.random() * speciesList.length)];
    setShowSilhouetteName(false);
    setSilhouetteGuess("");
    setSilhouetteSprite(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.speciesId}.png`
    );

    setActiveQuestion({
      name: poke.name,
      displayName: poke.displayName,
    });
  };

  const handleSilhouetteSubmit = (e) => {
    e.preventDefault();
    if (silhouetteGuess.trim().toLowerCase() === activeQuestion.name) {
      setScore((prev) => prev + 15);
      playAudioToneSuccess(true);
      setShowSilhouetteName(true);
      setTimeout(() => {
        setQuestionIdx((prev) => prev + 1);
        generateSilhouetteQuestion();
      }, 1200);
    } else {
      playAudioToneSuccess(false);
      alert("Incorrect guess! Try again or wait for time.");
    }
  };

  const startTypeFocus = () => {
    setScore(0);
    setQuestionIdx(0);
    setQuizOver(false);
    setMode("typefocus");
    generateTypeFocusQuestion();
  };

  const generateTypeFocusQuestion = () => {
    if (speciesList.length === 0) return;

    // Choose a target dual-type pokemon
    const duals = speciesList.filter((p) => p.types.length === 2);
    const target =
      duals[Math.floor(Math.random() * duals.length)] || speciesList[0];

    // Pick 3 wrong options
    const wrongs = speciesList
      .filter((p) => p.entryId !== target.entryId)
      .slice(0, 3);
    const options = [target, ...wrongs].sort(() => 0.5 - Math.random());

    setActiveQuestion({
      text: `Which of these Pokémon is a **${target.types[0].toUpperCase()} / ${target.types[1].toUpperCase()}** type?`,
      answer: target.displayName,
      options: options.map((o) => o.displayName),
    });
  };

  const handleTypeFocusAnswer = (ans) => {
    if (ans === activeQuestion.answer) {
      setScore((prev) => prev + 10);
      playAudioToneSuccess(true);
    } else {
      playAudioToneSuccess(false);
      alert(`Wrong! The correct answer was ${activeQuestion.answer}.`);
    }

    if (questionIdx >= 9) {
      endQuiz();
    } else {
      setQuestionIdx((prev) => prev + 1);
      generateTypeFocusQuestion();
    }
  };

  return (
    <div className="minigames-screen">
      <header className="minigames-header">
        <div className="minigames-title-group">
          <p className="minigames-eyebrow">Training Labs</p>
          <h1 className="minigames-title">Academy Quizzes</h1>
        </div>
        <div className="minigames-header-stats">
          {mode !== "menu" && (
            <>
              <div className="minigames-stat-badge accent">
                <span>Score: {score}</span>
              </div>
              {(mode === "speedrun" || mode === "silhouette") && (
                <div className="minigames-stat-badge streak">
                  <Timer size={14} />
                  <span>{timeLeft}s</span>
                </div>
              )}
            </>
          )}
          <button
            className="btn-back"
            onClick={() => {
              if (mode !== "menu") {
                setMode("menu");
                clearTimeout(timerRef.current);
              } else goTo(SCREENS.minigameHub);
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      {loading ? (
        <div
          className="minigame-inner-header"
          style={{
            border: "none",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          <p className="minigames-eyebrow animate-pulse">
            Preloading stats sheets...
          </p>
        </div>
      ) : mode === "menu" ? (
        <div className="minigames-dashboard">
          <div
            className="minigames-bento-grid"
            style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
          >
            {/* Speed Run */}
            <div
              className="bento-card featured"
              onClick={startSpeedRun}
              style={{ minHeight: "160px" }}
            >
              <div className="bento-icon-wrapper">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="bento-title">Speed Run</h3>
                <p className="bento-desc">
                  Answer YES/NO typing questions against a strict 60-second
                  lightning timer!
                </p>
              </div>
            </div>

            {/* Type Expert */}
            <div
              className="bento-card featured"
              onClick={startTypeExpert}
              style={{ minHeight: "160px" }}
            >
              <div className="bento-icon-wrapper">
                <Swords size={20} />
              </div>
              <div>
                <h3 className="bento-title">Type Expert Matchups</h3>
                <p className="bento-desc">
                  Test your knowledge of damage multipliers between elemental
                  typings (10 Questions).
                </p>
              </div>
            </div>

            {/* Timed Recall (Silhouette) */}
            <div
              className="bento-card"
              onClick={startSilhouette}
              style={{ minHeight: "160px" }}
            >
              <div className="bento-icon-wrapper">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="bento-title">Timed Recall (Silhouette)</h3>
                <p className="bento-desc">
                  Type names of Pokémon matching their pitch-black silhouette
                  outline within 60 seconds.
                </p>
              </div>
            </div>

            {/* Type Focus */}
            <div
              className="bento-card"
              onClick={startTypeFocus}
              style={{ minHeight: "160px" }}
            >
              <div className="bento-icon-wrapper">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="bento-title">Type Focus MCQs</h3>
                <p className="bento-desc">
                  Identify dual-type Pokémon from multiple-choice lists (10
                  Questions).
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : quizOver ? (
        <div
          className="minigame-container"
          style={{ maxWidth: "480px", margin: "0 auto" }}
        >
          <div
            className="minigame-content"
            style={{ textAlign: "center", padding: "40px 24px" }}
          >
            <span style={{ fontSize: "48px" }}>🏆</span>
            <h2 className="minigame-inner-title" style={{ marginTop: "16px" }}>
              Lab Session Concluded
            </h2>
            <p className="minigame-inner-subtitle">
              You scored **{score}** points!
            </p>

            <div
              style={{
                margin: "24px 0",
                padding: "14px",
                background: "rgba(255, 212, 63, 0.04)",
                borderRadius: "12px",
                border: "1px solid var(--px-accent)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12.5px",
                  color: "var(--px-accent)",
                }}
              >
                Earned PokéCoins: **+{Math.floor(score * 2)}** Coins payout
                synced!
              </p>
            </div>

            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button className="btn-back" onClick={() => setMode("menu")}>
                Choose Lab
              </button>
              <button
                className="btn-back"
                style={{
                  background: "var(--px-sky)",
                  borderColor: "var(--px-sky)",
                }}
                onClick={() => {
                  if (mode === "speedrun") startSpeedRun();
                  else if (mode === "typeexpert") startTypeExpert();
                  else if (mode === "silhouette") startSilhouette();
                  else if (mode === "typefocus") startTypeFocus();
                }}
              >
                Replay Lab
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="minigame-container"
          style={{ maxWidth: "540px", margin: "0 auto" }}
        >
          <div className="minigame-inner-header">
            <div>
              <span className="minigames-eyebrow">Lab Active</span>
              <h2
                className="minigame-inner-title"
                style={{ textTransform: "capitalize" }}
              >
                {mode.replace("expert", " Expert").replace("run", " Run")}
              </h2>
            </div>
            {mode === "typeexpert" || mode === "typefocus" ? (
              <span style={{ fontSize: "12px", fontWeight: 700 }}>
                Q: {questionIdx + 1} / 10
              </span>
            ) : null}
          </div>

          <div className="minigame-content" style={{ padding: "30px 24px" }}>
            {/* Speed Run Active */}
            {mode === "speedrun" && activeQuestion && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <img
                  src={activeQuestion.sprite}
                  alt=""
                  style={{ height: "96px", objectFit: "contain" }}
                />
                <p
                  style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}
                  dangerouslySetInnerHTML={{
                    __html: activeQuestion.text.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    width: "100%",
                    maxWidth: "280px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    className="btn-menu-action w-full"
                    style={{
                      background: "var(--px-success)",
                      borderColor: "var(--px-success)",
                    }}
                    onClick={() => handleSpeedRunAnswer(true)}
                  >
                    YES
                  </button>
                  <button
                    className="btn-menu-action w-full"
                    style={{
                      background: "var(--px-danger)",
                      borderColor: "var(--px-danger)",
                    }}
                    onClick={() => handleSpeedRunAnswer(false)}
                  >
                    NO
                  </button>
                </div>
              </div>
            )}

            {/* Type Expert Active */}
            {mode === "typeexpert" && activeQuestion && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 650,
                    margin: 0,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: activeQuestion.text.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "320px",
                    marginTop: "10px",
                  }}
                >
                  {activeQuestion.options.map((o) => (
                    <button
                      key={o}
                      className="btn-menu-action"
                      onClick={() => handleTypeExpertAnswer(o)}
                    >
                      {o}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Timed Recall Silhouette Active */}
            {mode === "silhouette" && activeQuestion && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    height: "140px",
                    aspectRatio: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={silhouetteSprite}
                    alt=""
                    className="sprite-img"
                    style={{
                      filter: showSilhouetteName
                        ? "none"
                        : "brightness(0) contrast(1.5)",
                      transition: "all 0.4s",
                    }}
                  />
                </div>

                {showSilhouetteName ? (
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--px-success)",
                      textTransform: "capitalize",
                      margin: 0,
                    }}
                  >
                    Correct! It&apos;s {activeQuestion.displayName}
                  </p>
                ) : (
                  <form
                    onSubmit={handleSilhouetteSubmit}
                    style={{
                      display: "flex",
                      gap: "8px",
                      width: "100%",
                      maxWidth: "340px",
                    }}
                  >
                    <input
                      type="text"
                      className="dmg-calc-input"
                      placeholder="Guess Pokémon name..."
                      value={silhouetteGuess}
                      onChange={(e) => setSilhouetteGuess(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="btn-back"
                      style={{
                        background: "var(--px-sky)",
                        borderColor: "var(--px-sky)",
                      }}
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Type Focus Active */}
            {mode === "typefocus" && activeQuestion && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 650,
                    margin: 0,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: activeQuestion.text.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                    maxWidth: "320px",
                    marginTop: "10px",
                  }}
                >
                  {activeQuestion.options.map((o) => (
                    <button
                      key={o}
                      className="btn-menu-action"
                      onClick={() => handleTypeFocusAnswer(o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default TriviaTrainingScreen;
