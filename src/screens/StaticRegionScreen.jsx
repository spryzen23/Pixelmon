import React, { useState, useEffect } from 'react';
import StaticRegionLoader from '../../v2/biome/src/regions/StaticRegionLoader';
import { useGame, SCREENS } from '../context/GameContext';
import { getMaps, getMapBlob, deleteMap } from '../utils/MapStorage';

export function StaticRegionScreen() {
  const { goTo } = useGame();
  const [mapState, setMapState] = useState(null); // 'obsidian' | { url: 'blob:...' }
  const [savedMaps, setSavedMaps] = useState([]);
  const [isLoadingMaps, setIsLoadingMaps] = useState(true);

  useEffect(() => {
    loadSavedMaps();
  }, []);

  const loadSavedMaps = async () => {
    setIsLoadingMaps(true);
    try {
      const maps = await getMaps();
      setSavedMaps(maps);
    } catch (e) {
      console.error('Failed to load maps', e);
    } finally {
      setIsLoadingMaps(false);
    }
  };

  const handlePlaySavedMap = async (id) => {
    try {
      const blob = await getMapBlob(id);
      const url = URL.createObjectURL(blob);
      setMapState({ url });
    } catch (e) {
      alert('Failed to load saved map.');
    }
  };

  const handleDeleteSavedMap = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this map?')) return;
    try {
      await deleteMap(id);
      loadSavedMaps();
    } catch (e) {
      alert('Failed to delete map.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMapState({ url });
  };

  if (!mapState) {
    return (
      <div className="dashboard-screen" style={{ overflowY: 'auto' }}>
        <header className="dashboard-header">
          <div className="db-title-area">
            <h1>PIXELMON</h1>
            <p>Region Select</p>
          </div>
          <div className="db-user-area">
            <button 
              className="db-toggle-btn active"
              onClick={() => goTo(SCREENS.dashboard)}
            >
              ← Back to Dashboard
            </button>
          </div>
        </header>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '40px auto' }}>
          
          <div className="mode-hub-card mode-campaign" style={{ borderTop: '2px solid #8e24aa' }}>
            <div className="mode-card-header">
              <span className="mode-card-icon">🏔️</span>
              <div className="mode-card-title-group">
                <h3>Obsidian Fieldlands</h3>
                <p>Play the default developer prototype map</p>
              </div>
            </div>
            <div className="mode-card-content">
               <button 
                className="launch-mode-btn"
                style={{ background: '#8e24aa', color: 'white' }}
                onClick={() => setMapState('obsidian')}
              >
                Play Default Map
              </button>
            </div>
          </div>

          <div className="mode-hub-card mode-campaign" style={{ borderTop: '2px solid #4CAF50' }}>
            <div className="mode-card-header">
              <span className="mode-card-icon">📁</span>
              <div className="mode-card-title-group">
                <h3>Import External Map (.GLB)</h3>
                <p>Upload a custom chunk from your computer</p>
              </div>
            </div>
            <div className="mode-card-content">
              <label className="launch-mode-btn" style={{ background: '#333', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 0 }}>
                Upload .GLB & Play
                <input type="file" accept=".glb,.gltf" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* Saved Maps Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#ff9800', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Your Saved Maps</h2>
          
          {isLoadingMaps ? (
            <p style={{ color: '#aaa' }}>Loading saved maps...</p>
          ) : savedMaps.length === 0 ? (
            <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#aaa' }}>
              <p>No saved maps found.</p>
              <p style={{ fontSize: '0.9rem' }}>Open the Map Baker to create and save custom maps directly to your browser!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {savedMaps.map(map => (
                <div key={map.id} style={{ background: '#1e1e1e', borderLeft: '4px solid #ff9800', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{map.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                      {(map.sizeBytes / 1024 / 1024).toFixed(2)} MB • {new Date(map.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handlePlaySavedMap(map.id)}
                      style={{ padding: '8px 15px', background: '#ff9800', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Play
                    </button>
                    <button 
                      onClick={(e) => handleDeleteSavedMap(map.id, e)}
                      style={{ padding: '8px 10px', background: 'transparent', color: '#f44336', border: '1px solid #f44336', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="v2-screen-wrapper" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <StaticRegionLoader 
        activeRegion={mapState === 'obsidian' ? 'ObsidianFieldlands' : 'Custom'}
        customMapUrl={typeof mapState === 'object' ? mapState.url : null}
        onBackToMenu={() => {
          if (typeof mapState === 'object' && mapState.url) {
            URL.revokeObjectURL(mapState.url);
          }
          setMapState(null);
        }} 
      />
    </div>
  );
}
