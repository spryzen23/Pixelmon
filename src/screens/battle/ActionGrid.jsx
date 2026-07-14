import React from "react";

const TYPE_COLORS = {
  normal: "#9fa19f",
  fire: "#e62829",
  water: "#2980ef",
  grass: "#3fa129",
  electric: "#fac000",
  ice: "#3dcef3",
  fighting: "#ff8000",
  poison: "#9141cb",
  ground: "#915121",
  flying: "#81b9ef",
  psychic: "#ef4179",
  bug: "#91a119",
  rock: "#afa981",
  ghost: "#704170",
  dragon: "#5060e1",
  dark: "#624d4e",
  steel: "#60a1b8",
  fairy: "#ef70ef",
};

export function ActionGrid({
  targetSelection,
  showSwitch,
  playerTeam,
  playerSlots,
  choosingSlotIdx,
  getMappedMoves,
  playerTurn,
  isActing,
  handlePlayerAttack,
  battleFormat,
  proceedToNextSlot,
}) {
  return (
    <div className="bl-moves-panel" id="battle-controls-hub">
      <div className="bl-moves-header">
        {targetSelection ? (
          targetSelection.itemType ? (
            <span className="bl-target-prompt animate-pulse">
              🎒 Select an ally to use{" "}
              {targetSelection.itemType === "potion"
                ? "Potion"
                : "Full Restore"}{" "}
              on!
            </span>
          ) : targetSelection.isMultiTarget ? (
            <span className="bl-target-prompt animate-pulse">
              🎯 Target confirmed. Waiting for dispatch...
            </span>
          ) : (
            <span className="bl-target-prompt animate-pulse">
              🎯 Select a target on the field!
            </span>
          )
        ) : (
          <span className="bl-moves-label">
            {showSwitch ? "Choose replacement for " : "Choose move for "}
            <strong style={{ color: "var(--px-sky)" }}>
              {playerTeam[playerSlots[choosingSlotIdx]]?.displayName ||
                `Slot ${choosingSlotIdx + 1}`}
            </strong>
            <span style={{ opacity: 0.5, fontWeight: 400 }}>
              {" "}
              · Slot {choosingSlotIdx + 1}
            </span>
          </span>
        )}
      </div>
      {!targetSelection && (
        <div className="action-grid">
          {getMappedMoves().map((m, i) => (
            <button
              key={m.id}
              id={`move-btn-${m.id}`}
              className="btn-action-move"
              data-type={m.type}
              disabled={!playerTurn || isActing || m.disabled}
              onClick={() => handlePlayerAttack(i)}
              style={{
                backgroundColor:
                  (TYPE_COLORS[m.type?.toLowerCase()] || "#888888") + "1A",
                borderColor:
                  (TYPE_COLORS[m.type?.toLowerCase()] || "#888888") + "40",
              }}
            >
              <span className="move-btn-name">{m.move.replace(/-/g, " ")}</span>
              <span
                className="move-btn-type"
                style={{ color: TYPE_COLORS[m.type?.toLowerCase()] || "#888" }}
              >
                {m.type.toUpperCase()} • PWR {m.power}
              </span>
            </button>
          ))}
          {((battleFormat === "triples" &&
            (choosingSlotIdx === 0 || choosingSlotIdx === 2)) ||
            battleFormat === "doubles") &&
            !showSwitch && (
              <button
                id="move-btn-shift"
                className="btn-action-move"
                disabled={!playerTurn || isActing}
                onClick={() => proceedToNextSlot("shift")}
                style={{
                  backgroundColor: "rgba(56, 189, 248, 0.1)",
                  borderColor: "rgba(56, 189, 248, 0.25)",
                }}
              >
                <span className="move-btn-name">🏰 Castle</span>
                <span
                  className="move-btn-type"
                  style={{ color: "var(--px-sky)" }}
                >
                  POSITION SWAP
                </span>
              </button>
            )}
        </div>
      )}
    </div>
  );
}
