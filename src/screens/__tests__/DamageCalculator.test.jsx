import React from 'react';
import { render } from '@testing-library/react';
import { DamageCalculator } from '../battle/DamageCalculator';
import { expect, test, describe, vi } from 'vitest';

describe('DamageCalculator UI Guardrails', () => {
  test('Damage Calculator must maintain the two-column grid layout and Chaos Variance chart', () => {
    const calcInputs = {
      level: 50, power: 80, atk: 120, def: 100, stab: 1.5, type: 1.0, weather: 1.0, burn: 1.0, crit: 1.0
    };
    
    const { container } = render(
      <DamageCalculator 
        showCalc={true}
        setShowCalc={vi.fn()}
        calcInputs={calcInputs}
        setCalcInputs={vi.fn()}
        getDmgRolls={(_val) => [85, 90, 100]}
        calcOutput={() => 100}
      />
    );

    // Guardrail: Verify two column layout is intact (prevents accidentally reverting to a single column list)
    const leftCol = container.querySelector('.dmg-calc-left-col');
    const rightCol = container.querySelector('.dmg-calc-right-col');
    expect(leftCol).not.toBeNull();
    expect(rightCol).not.toBeNull();

    // Guardrail: Verify Chaos Variance chart is rendered (prevents accidentally removing the visual chart)
    const chartRows = container.querySelectorAll('.chart-roll-row');
    expect(chartRows.length).toBeGreaterThan(0);
    
    // Guardrail: Verify the component binds to the correct variable names (atk, def, type)
    // rather than incorrectly trying to bind to non-existent variables like 'attackStat'.
    // If the mapping is broken, inputs might not render or will have undefined values.
    const inputs = container.querySelectorAll('input[type="number"]');
    expect(inputs.length).toBe(4); // level, power, atk, def
  });
});
