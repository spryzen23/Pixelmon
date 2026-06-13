import React from 'react';
import { NormalGame } from '../../v2/biome/src/app/App';
import { useGame, SCREENS } from '../context/GameContext';

export function CampaignV2Screen() {
  const { goTo } = useGame();

  return (
    <div className="v2-screen-wrapper" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button 
        onClick={() => goTo(SCREENS.dashboard)}
        style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          zIndex: 9999, 
          padding: '10px 20px', 
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          border: '1px solid white', 
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        ← Back to Dashboard
      </button>
      <NormalGame />
    </div>
  );
}
