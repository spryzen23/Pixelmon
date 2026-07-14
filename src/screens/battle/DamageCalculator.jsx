import React from "react";

export function DamageCalculator({
  showCalc,
  setShowCalc,
  calcInputs,
  setCalcInputs,
  getDmgRolls,
  calcOutput,
}) {
  if (!showCalc) return null;

  const calculatedBase = calcOutput();
  const calculatedRolls = getDmgRolls(calculatedBase);

  return (
    <>
      <div
        className="dmg-calc-drawer-backdrop"
        onClick={() => setShowCalc(false)}
      />
      <div className="dmg-calc-drawer" id="damage-analyzer-drawer">
        <div className="dmg-calc-header">
          <h3 className="minigame-inner-title">Damage Lab Analyzer</h3>
          <button className="btn-back" onClick={() => setShowCalc(false)}>
            Close
          </button>
        </div>

        <div className="dmg-calc-body">
          <div
            className="dmg-calc-left-col"
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="dmg-calc-panel">
              <span className="config-section-title">
                Core Engine Variables
              </span>
              <div className="dmg-calc-grid-2">
                <div>
                  <label className="dmg-calc-label">Attacker Lvl</label>
                  <input
                    type="number"
                    className="dmg-calc-input"
                    value={calcInputs.level}
                    onChange={(e) =>
                      setCalcInputs({
                        ...calcInputs,
                        level: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="dmg-calc-label">Move Power</label>
                  <input
                    type="number"
                    className="dmg-calc-input"
                    value={calcInputs.power}
                    onChange={(e) =>
                      setCalcInputs({
                        ...calcInputs,
                        power: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="dmg-calc-label">Attack Stat (A)</label>
                  <input
                    type="number"
                    className="dmg-calc-input"
                    value={calcInputs.atk}
                    onChange={(e) =>
                      setCalcInputs({
                        ...calcInputs,
                        atk: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="dmg-calc-label">Defense Stat (D)</label>
                  <input
                    type="number"
                    className="dmg-calc-input"
                    value={calcInputs.def}
                    onChange={(e) =>
                      setCalcInputs({
                        ...calcInputs,
                        def: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="dmg-calc-panel">
              <span className="config-section-title">Modifier Sliders</span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "6px",
                }}
              >
                <div>
                  <label className="dmg-calc-label">
                    Type Advantage Effectiveness
                  </label>
                  <select
                    className="dmg-calc-input"
                    value={calcInputs.type}
                    onChange={(e) =>
                      setCalcInputs({
                        ...calcInputs,
                        type: Number(e.target.value),
                      })
                    }
                  >
                    <option value="0.0">0x (Immune)</option>
                    <option value="0.25">0.25x (Double Resisted)</option>
                    <option value="0.5">0.5x (Resisted)</option>
                    <option value="1.0">1x (Neutral)</option>
                    <option value="2.0">2x (Super Effective)</option>
                    <option value="4.0">4x (Ultra Effective)</option>
                  </select>
                </div>

                <div>
                  <label className="dmg-calc-label">STAB Modifier</label>
                  <select
                    className="dmg-calc-input"
                    value={calcInputs.stab}
                    onChange={(e) =>
                      setCalcInputs({
                        ...calcInputs,
                        stab: Number(e.target.value),
                      })
                    }
                  >
                    <option value="1.0">1x (None)</option>
                    <option value="1.5">1.5x (STAB Bonus)</option>
                    <option value="2.0">2x (Adaptability)</option>
                  </select>
                </div>

                <div>
                  <label className="dmg-calc-label">
                    Field Weather Modifier
                  </label>
                  <select
                    className="dmg-calc-input"
                    value={calcInputs.weather}
                    onChange={(e) =>
                      setCalcInputs({
                        ...calcInputs,
                        weather: Number(e.target.value),
                      })
                    }
                  >
                    <option value="1.0">1x (Neutral)</option>
                    <option value="1.5">1.5x (Boosted)</option>
                    <option value="0.5">0.5x (Reduced)</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className={`config-btn w-full ${calcInputs.burn === 0.5 ? "active" : ""}`}
                    onClick={() =>
                      setCalcInputs((p) => ({
                        ...p,
                        burn: p.burn === 0.5 ? 1.0 : 0.5,
                      }))
                    }
                  >
                    Burned (0.5x)
                  </button>
                  <button
                    className={`config-btn w-full ${calcInputs.crit === 1.5 ? "active" : ""}`}
                    onClick={() =>
                      setCalcInputs((p) => ({
                        ...p,
                        crit: p.crit === 1.5 ? 1.0 : 1.5,
                      }))
                    }
                  >
                    Critical (1.5x)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="dmg-calc-right-col"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Damage roll outputs */}
            <div
              className="dmg-calc-panel"
              style={{
                background: "rgba(255, 212, 63, 0.03)",
                borderColor: "rgba(255, 212, 63, 0.2)",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                className="config-section-title"
                style={{ color: "var(--px-accent)" }}
              >
                Roll Outputs (Chaos Variance)
              </span>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <div>
                  <span className="dmg-calc-label">Min Damage (85%)</span>
                  <strong
                    style={{ fontSize: "18px", color: "var(--px-accent-warm)" }}
                  >
                    {calculatedRolls[0]}
                  </strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="dmg-calc-label">Max Damage (100%)</span>
                  <strong
                    style={{ fontSize: "18px", color: "var(--px-accent)" }}
                  >
                    {calculatedBase}
                  </strong>
                </div>
              </div>

              <div
                className="chart-rolls-container"
                style={{ marginTop: "16px" }}
              >
                {calculatedRolls.map((roll, idx) => (
                  <div key={idx} className="chart-roll-row">
                    <span className="chart-roll-percentage">{85 + idx}%</span>
                    <div className="chart-roll-bar-outer">
                      <div
                        className="chart-roll-bar-inner"
                        style={{ width: `${(roll / calculatedBase) * 100}%` }}
                      />
                    </div>
                    <span className="chart-roll-value">{roll}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
