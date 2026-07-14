import React from "react";
import { findRequestPokemonForTeamIndex } from "./BattleUtils";

export function TrainerColumn({
  winner,
  bagOpen,
  setBagOpen,
  items,
  handleUseItem,
  playerTeam,
  activeRequest,
  playerSlots,
  currentFormat,
  setShowCalc,
}) {
  return (
    <div className="bl-trainer-col" id="trainer-col">
      {winner === null ? (
        bagOpen ? (
          <div
            className="bl-bag-ui"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span
                style={{ fontSize: "48px", display: "block", margin: "10px 0" }}
              >
                🎒
              </span>
              <h3
                style={{ margin: 0, color: "var(--px-text)", fontSize: "18px" }}
              >
                Items Bag
              </h3>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "var(--px-text-muted)",
                  fontSize: "12px",
                }}
              >
                Select an item to use.
              </p>
            </div>
            <div
              className="bl-items-panel"
              id="items-panel"
              style={{ background: "transparent", border: "none", padding: 0 }}
            >
              <button
                className="bl-item-btn"
                id="potion-item-btn"
                disabled={items.potions <= 0}
                onClick={() => handleUseItem("potion")}
                style={{ marginBottom: "8px" }}
              >
                🧪 Potion ×{items.potions}{" "}
                <span className="bl-item-hint">+50 HP</span>
              </button>
              <button
                className="bl-item-btn"
                id="fullrestore-item-btn"
                disabled={items.fullRestores <= 0}
                onClick={() => handleUseItem("fullRestore")}
                style={{ marginBottom: "16px" }}
              >
                ✨ Full Restore ×{items.fullRestores}{" "}
                <span className="bl-item-hint">Full HP</span>
              </button>
            </div>
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="btn-back"
                onClick={() => setBagOpen(false)}
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Trainer image */}
            <div className="bl-trainer-card">
              <img
                src="/assets/battleassets/red.png"
                alt="Trainer Red"
                className="bl-trainer-img"
              />

              {/* Pokéball row — one per team member */}
              <div className="bl-pokeball-row">
                {playerTeam.map((p, i) => {
                  const reqMon = findRequestPokemonForTeamIndex(
                    activeRequest,
                    playerTeam,
                    i
                  );
                  const isFainted = reqMon
                    ? reqMon.condition.includes("fnt") ||
                      reqMon.condition.startsWith("0")
                    : false;
                  const isActive = playerSlots.includes(i);
                  return (
                    <div
                      key={i}
                      className={`bl-pokeball-icon ${isFainted ? "fainted" : isActive ? "active" : "benched"}`}
                      title={`${p.displayName}${isFainted ? " (Fainted)" : isActive ? " (Active)" : ""}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Format guide for doubles/triples */}
            {currentFormat?.guide && (
              <div className="bl-format-guide">
                <span className="bl-format-guide-title">
                  {currentFormat.icon} {currentFormat.guide.title}
                </span>
                <ul className="bl-format-guide-tips">
                  {currentFormat.guide.tips.slice(0, 3).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="bl-action-buttons">
              <button
                className="bl-action-btn calc"
                id="dmg-calc-toggle"
                onClick={() => setShowCalc(true)}
              >
                📊 Damage Calculator
              </button>
              <button
                className="bl-action-btn items"
                id="items-action-btn"
                onClick={() => setBagOpen(true)}
              >
                🎒 Items ({items.potions + items.fullRestores} left)
              </button>
            </div>
          </>
        )
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "16px",
            alignItems: "center",
          }}
        >
          <img
            src="/assets/battleassets/red.png"
            alt="Trainer Red"
            className="bl-trainer-img"
            style={{ opacity: winner === "player" ? 1 : 0.35 }}
          />
          <p
            style={{
              fontSize: "11px",
              color: "var(--px-text-muted)",
              textAlign: "center",
            }}
          >
            {winner === "player" ? "🏆 You won!" : "💀 You lost..."}
          </p>
        </div>
      )}
    </div>
  );
}
