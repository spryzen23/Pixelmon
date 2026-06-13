import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import SafePointerLockControls from '../systems/SafePointerLockControls';
import ObsidianFieldlands from './ObsidianFieldlands';
import CustomImportRegion from './CustomImportRegion';
import Hotbar from '../ui/Hotbar';

export default function StaticRegionLoader({ activeRegion = 'ObsidianFieldlands', customMapUrl, onBackToMenu }) {

  return (
    <main className="game-shell">
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <color attach="background" args={['#87ceeb']} />
        <fog attach="fog" args={['#d8eefb', 60, 320]} />
        <ambientLight intensity={0.72} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={1.35}
          position={[50, 100, 50]}
        />
        
        <SafePointerLockControls pointerSpeed={0.65} />

        {activeRegion === 'ObsidianFieldlands' && <ObsidianFieldlands />}
        {activeRegion === 'Custom' && customMapUrl && <CustomImportRegion url={customMapUrl} />}
      </Canvas>

      {/* Left HUD */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        background: 'var(--px-panel, rgba(13, 22, 38, 0.65))',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid var(--px-border, rgba(255, 255, 255, 0.1))',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <strong style={{ color: 'var(--px-accent, #ffd43f)', fontSize: '1.1rem', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {activeRegion === 'ObsidianFieldlands' ? 'Hisui Prototype' : 'Custom Region'}
        </strong>
        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Click game window to lock mouse</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Move with WASD or Arrow Keys</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Press ESC to unlock</span>
      </div>

      {/* Crosshair */}
      <div className="crosshair" aria-hidden="true" style={{ pointerEvents: 'none', zIndex: 10 }}>
        <span className="crosshair-line crosshair-line-horizontal" />
        <span className="crosshair-line crosshair-line-vertical" />
        <span className="crosshair-dot" />
      </div>

      {/* Right HUD: Exit Button */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <button 
          type="button" 
          onClick={onBackToMenu}
          style={{
             padding: '10px 20px',
             background: 'var(--px-danger, #f84f4f)',
             color: 'white',
             border: 'none',
             borderRadius: '8px',
             cursor: 'pointer',
             fontWeight: 'bold',
             boxShadow: '0 4px 12px rgba(248, 79, 79, 0.3)',
             transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Exit Region
        </button>
      </div>
    </main>
  );
}
