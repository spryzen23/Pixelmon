import React from 'react';

export function DamageCalculator({ showCalc, setShowCalc, calcInputs, setCalcInputs, getDmgRolls, calcOutput }) {
  if (!showCalc) return null;

  const calculatedBase = calcOutput();
  const calculatedRolls = getDmgRolls(calculatedBase);

  return (
    <>
      <div className="dmg-calc-drawer-backdrop" onClick={() => setShowCalc(false)} />
      <div className="dmg-calc-drawer" id="damage-analyzer-drawer">
        <div className="dmg-calc-header">
          <h3 className="minigame-inner-title">Damage Lab Analyzer</h3>
          <button className="btn-back" onClick={() => setShowCalc(false)}>Close</button>
        </div>

        <div className="dmg-calc-body">

          <div className="dmg-calc-panel">
            <span className="config-section-title">Core Engine Variables</span>
            <div className="dmg-calc-grid-2">
              <div>
                <label className="dmg-calc-label">Attacker Lvl</label>
                <input
                  type="number"
                  className="dmg-calc-input"
                  value={calcInputs.level}
                  onChange={e => setCalcInputs({ ...calcInputs, level: Math.max(1, Number(e.target.value)) })}
                />
              </div>
              <div>
                <label className="dmg-calc-label">Move Power</label>
                <input
                  type="number"
                  className="dmg-calc-input"
                  value={calcInputs.power}
                  onChange={e => setCalcInputs({ ...calcInputs, power: Math.max(1, Number(e.target.value)) })}
                />
              </div>
              <div>
                <label className="dmg-calc-label">Attack Stat (A)</label>
                <input
                  type="number"
                  className="dmg-calc-input"
                  value={calcInputs.attackStat}
                  onChange={e => setCalcInputs({ ...calcInputs, attackStat: Math.max(1, Number(e.target.value)) })}
                />
              </div>
              <div>
                <label className="dmg-calc-label">Defense Stat (D)</label>
                <input
                  type="number"
                  className="dmg-calc-input"
                  value={calcInputs.defenseStat}
                  onChange={e => setCalcInputs({ ...calcInputs, defenseStat: Math.max(1, Number(e.target.value)) })}
                />
              </div>
            </div>
          </div>

          <div className="dmg-calc-panel">
            <span className="config-section-title">Multipliers & Modifiers</span>
            <div className="dmg-calc-grid-2">
              <div>
                <label className="dmg-calc-label">STAB</label>
                <select
                  className="dmg-calc-input"
                  value={calcInputs.stab}
                  onChange={e => setCalcInputs({ ...calcInputs, stab: Number(e.target.value) })}
                >
                  <option value={1}>None (1x)</option>
                  <option value={1.5}>Standard STAB (1.5x)</option>
                  <option value={2}>Adaptability (2x)</option>
                </select>
              </div>
              <div>
                <label className="dmg-calc-label">Type Effectiveness</label>
                <select
                  className="dmg-calc-input"
                  value={calcInputs.typeEffectiveness}
                  onChange={e => setCalcInputs({ ...calcInputs, typeEffectiveness: Number(e.target.value) })}
                >
                  <option value={0}>Immune (0x)</option>
                  <option value={0.25}>1/4 Resist (0.25x)</option>
                  <option value={0.5}>1/2 Resist (0.5x)</option>
                  <option value={1}>Neutral (1x)</option>
                  <option value={2}>Super Effective (2x)</option>
                  <option value={4}>4x Weakness (4x)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dmg-calc-panel" style={{ background: 'var(--px-bg-darker)' }}>
            <span className="config-section-title">Projected Damage Output</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', color: 'var(--px-text-muted)' }}>Absolute Minimum (0.85)</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--px-sky)' }}>{calculatedRolls.min} HP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', color: 'var(--px-text-muted)' }}>Maximum Roll (1.00)</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--px-accent)' }}>{calculatedRolls.max} HP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--px-text-muted)' }}>Critical Hit Max (1.5x)</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--px-red)' }}>{calculatedRolls.critMax} HP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
