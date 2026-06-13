import React from 'react';
import BattleRoyaleShell from '../../v2/biome/src/scenes/battleRoyale/BattleRoyaleShell';
import { useGame, SCREENS } from '../context/GameContext';

export function BattleRoyaleV2Screen() {
  const { goTo } = useGame();

  return (
    <div className="v2-screen-wrapper" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <BattleRoyaleShell onBackToMenu={() => goTo(SCREENS.dashboard)} />
    </div>
  );
}
