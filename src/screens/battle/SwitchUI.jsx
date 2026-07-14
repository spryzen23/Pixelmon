import React from "react";
import {
  findRequestPokemonForTeamIndex,
  getRequestSlotForTeamIndex,
} from "./BattleUtils";

export function SwitchUI({
  activeRequest,
  playerTeam,
  playerSlots,
  turnChoicesRef,
  setShowSwitch,
  proceedToNextSlot,
  handleSwapActive,
}) {
  const hasAvailableSwitch = playerTeam.some((p, i) => {
    const reqMon = findRequestPokemonForTeamIndex(activeRequest, playerTeam, i);
    const isFainted = p.currentHp <= 0;
    const isActive = reqMon ? reqMon.active : false;
    const requestSlotIndex = getRequestSlotForTeamIndex(
      activeRequest,
      playerTeam,
      i
    );
    const isAlreadyChosen = turnChoicesRef.current.includes(
      `switch ${requestSlotIndex + 1}`
    );
    return !isFainted && !isActive && !isAlreadyChosen;
  });

  return (
    <div
      className="bl-moves-panel"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="bl-moves-header" style={{ marginBottom: "12px" }}>
        <span className="bl-moves-label">🔄 SWAP POKÉMON</span>
        {activeRequest?.forceSwitch && (
          <span className="bl-timer-badge">Required</span>
        )}
      </div>
      <div className="bl-swap-list" style={{ overflowY: "auto" }}>
        {playerTeam.map((p, i) => {
          const reqMon = findRequestPokemonForTeamIndex(
            activeRequest,
            playerTeam,
            i
          );
          const isFainted = p.currentHp <= 0;
          const isActive = reqMon ? reqMon.active : false;
          const hpPct = p.maxHp > 0 ? Math.max(0, p.currentHp / p.maxHp) : 0;
          const requestSlotIndex = getRequestSlotForTeamIndex(
            activeRequest,
            playerTeam,
            i
          );
          const isAlreadyChosen = turnChoicesRef.current.includes(
            `switch ${requestSlotIndex + 1}`
          );

          return (
            <button
              key={p.name}
              id={`switch-poke-btn-${i}`}
              className={`bl-swap-btn ${playerSlots.includes(i) ? "active" : ""} ${isFainted ? "fainted" : ""}`}
              disabled={isFainted || isActive || isAlreadyChosen}
              onClick={() => handleSwapActive(i)}
            >
              <div
                className={`bl-swap-orb ${isFainted ? "fainted" : playerSlots.includes(i) ? "active" : ""}`}
              />
              <span className="bl-swap-info">
                <span className="bl-swap-name">{p.displayName}</span>
                <span className="bl-swap-bar-row">
                  <span className="bl-swap-bar-outer">
                    <span
                      className={`bl-swap-bar-inner ${hpPct > 0.5 ? "high" : hpPct > 0.2 ? "medium" : "low"}`}
                      style={{ width: `${hpPct * 100}%` }}
                    />
                  </span>
                  <span className="bl-swap-hp">{p.currentHp} HP</span>
                </span>
              </span>
            </button>
          );
        })}
        {!hasAvailableSwitch && activeRequest?.forceSwitch && (
          <button
            key="skip-switch"
            className="bl-swap-btn active"
            onClick={() => {
              setShowSwitch(false);
              proceedToNextSlot("pass");
            }}
          >
            <div className="bl-swap-orb active" />
            <span className="bl-swap-info">
              <span className="bl-swap-name" style={{ color: "var(--px-red)" }}>
                Skip Switch (No Pokémon)
              </span>
              <span className="bl-swap-bar-row">
                <span className="bl-swap-hp">Pass Turn</span>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
