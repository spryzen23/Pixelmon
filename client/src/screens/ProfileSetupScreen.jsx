import { useEffect, useState } from 'react';
import { api } from '../api';
import { typeIconUrl } from '../game/assets';
import { DEFAULT_PLAYER_STYLE_ID, PLAYER_STYLES, getPlayerStyle } from '../game/playerStyles';
import { useGame, SCREENS } from '../context/GameContext';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { RadioGroup } from '../components/ui/RadioGroup';
import CompanionPreview from '../components/CompanionPreview';
import { getFitToHeightForPokemon, isPokemonFloating, getRotationForPokemon } from '../game/pokemonData';

export function ProfileSetupScreen() {
  const { goTo, setPlayer } = useGame();
  const [name, setName] = useState('');
  const [starters, setStarters] = useState([]);
  const [companionId, setCompanionId] = useState('');
  const [styleId, setStyleId] = useState(DEFAULT_PLAYER_STYLE_ID);
  const [saving, setSaving] = useState(false);

  // Tab & Filter State
  const [activeTab, setActiveTab] = useState('companion');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    api.getStarters()
      .then((d) => {
        const list = d.starters || [];
        setStarters(list);
        if (list.length > 0) {
          setCompanionId(list[0].entryId);
        }
      })
      .catch(() => setStarters([]));
  }, []);

  const companion = starters.find((s) => s.entryId === companionId);
  const selectedStyle = getPlayerStyle(styleId);

  // Filter the list of 1350 starters based on user selections
  const filteredStarters = starters.filter((s) => {
    const matchesSearch =
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || s.region === selectedRegion;
    const matchesType = selectedType === 'all' || s.types?.includes(selectedType);
    return matchesSearch && matchesRegion && matchesType;
  });

  const handleCompanionSelect = (id) => {
    setCompanionId(id);
    setActiveTab('companion');
  };

  const handleStyleSelect = (id) => {
    setStyleId(id);
    setActiveTab('trainer');
  };

  const submit = async () => {
    if (!name.trim() || !companion) return;
    setSaving(true);
    try {
      const p = await api.createPlayer({
        displayName: name.trim(),
        companion,
        characterStyle: selectedStyle,
      });
      setPlayer(p);
      localStorage.setItem('pixelmon-lastPlayerId', p.id);
      goTo(SCREENS.mapSelect);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen screen-shell">
      <h2 className="screen-title">New trainer</h2>
      
      <div className="profile-setup-layout">
        {/* Form Controls Column */}
        <div className="profile-setup-form">
          <TextField
            label="Trainer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="Your name"
          />

          <h3>Choose companion</h3>

          {/* Dynamic Search & Category Filters */}
          <div className="companion-filters">
            <input
              type="text"
              className="filter-search-input"
              placeholder="Search 1,350+ Pokémon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="filter-dropdowns">
              <select
                className="filter-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="all">All Regions</option>
                <option value="kanto">Kanto</option>
                <option value="johto">Johto</option>
                <option value="hoenn">Hoenn</option>
                <option value="sinnoh">Sinnoh</option>
                <option value="unova">Unova</option>
                <option value="kalos">Kalos</option>
                <option value="alola">Alola</option>
                <option value="galar">Galar</option>
                <option value="paldea">Paldea</option>
              </select>

              <select
                className="filter-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="normal">Normal</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="electric">Electric</option>
                <option value="grass">Grass</option>
                <option value="ice">Ice</option>
                <option value="fighting">Fighting</option>
                <option value="poison">Poison</option>
                <option value="ground">Ground</option>
                <option value="flying">Flying</option>
                <option value="psychic">Psychic</option>
                <option value="bug">Bug</option>
                <option value="rock">Rock</option>
                <option value="ghost">Ghost</option>
                <option value="dragon">Dragon</option>
                <option value="steel">Steel</option>
                <option value="fairy">Fairy</option>
              </select>
            </div>
          </div>

          {filteredStarters.length > 0 ? (
            <RadioGroup
              name="companion"
              className="companion-grid"
              value={companionId}
              onChange={handleCompanionSelect}
              options={filteredStarters.map((s) => ({ value: s.entryId, label: s.displayName, data: s }))}
              renderOption={(option) => {
                const s = option.data;
                const primaryType = s.types?.[0] || 'normal';
                return (
                  <div className={`companion-inner ${primaryType}`}>
                    <div className="type-icons">
                      {s.types?.map((t) => (
                        <img key={t} src={typeIconUrl(t)} alt={t} width={24} height={24} />
                      ))}
                    </div>
                    <span className="companion-name">{s.displayName}</span>
                  </div>
                );
              }}
            />
          ) : (
            <div className="no-companions-msg">
              No companions found matching your criteria.
            </div>
          )}

          <h3>Choose trainer style</h3>
          <RadioGroup
            name="trainer-style"
            className="trainer-style-grid"
            value={styleId}
            onChange={handleStyleSelect}
            options={PLAYER_STYLES.map((style) => ({
              value: style.id,
              label: style.label,
              data: style,
            }))}
            renderOption={(option) => {
              const style = option.data;
              return (
                <span className="player-style-option">
                  <span className="player-style-token">
                    {style.id.replace('player-', '')}
                  </span>
                  <span className="player-style-copy">
                    <span>{style.label}</span>
                    <small>{style.motion}</small>
                  </span>
                </span>
              );
            }}
          />

          <div className="btn-row">
            <Button onClick={() => goTo(SCREENS.welcome)}>Back</Button>
            <Button variant="primary" disabled={!name.trim() || !companion || saving} onClick={submit}>
              {saving ? 'Saving...' : 'Next'}
            </Button>
          </div>
        </div>

        {/* 3D Animated Preview Column */}
        <div className="profile-setup-preview">
          {/* Tabs for switching between Pokemon and Trainer Model Previews */}
          <div className="preview-tabs">
            <button
              type="button"
              className={`preview-tab-btn ${activeTab === 'companion' ? 'active' : ''}`}
              onClick={() => setActiveTab('companion')}
            >
              Companion
            </button>
            <button
              type="button"
              className={`preview-tab-btn ${activeTab === 'trainer' ? 'active' : ''}`}
              onClick={() => setActiveTab('trainer')}
            >
              Trainer Style
            </button>
          </div>

          {activeTab === 'companion' ? (
            <>
              <div className={`preview-canvas-container ${companion ? companion.types?.[0] || 'normal' : 'normal'}`}>
                {companion ? (
                  <CompanionPreview
                    modelUrl={companion.modelUrl}
                    primaryType={companion.types?.[0] || 'normal'}
                    fitToHeight={getFitToHeightForPokemon(companion)}
                    isFloating={isPokemonFloating(companion)}
                    rotation={getRotationForPokemon(companion)}
                  />
                ) : (
                  <div className="preview-canvas-placeholder">
                    <span>Select a companion to preview in 3D</span>
                  </div>
                )}
              </div>

              {companion && (
                <div className="preview-details-card">
                  <div className="preview-details-header">
                    <h4>{companion.displayName}</h4>
                    <span className="preview-region-badge">{companion.region.toUpperCase()}</span>
                  </div>
                  
                  <div className="preview-types-row">
                    {companion.types?.map((t) => (
                      <span key={t} className={`type-badge ${t}`}>
                        <img src={typeIconUrl(t)} alt={t} width={16} height={16} />
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="preview-info-grid">
                    <div className="info-item">
                      <span className="info-label">National Dex</span>
                      <span className="info-value">#{companion.speciesId}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Form Tier</span>
                      <span className="info-value">{companion.formTier}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Egg Groups</span>
                      <span className="info-value">{companion.eggGroups?.join(', ') || 'None'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Spawn Level</span>
                      <span className="info-value">Lvl {companion.spawnLevel}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="preview-canvas-container normal">
                {selectedStyle ? (
                  <CompanionPreview
                    modelUrl={selectedStyle.modelUrl}
                    primaryType="normal"
                    fitToHeight={1.25}
                    isFloating={false}
                  />
                ) : (
                  <div className="preview-canvas-placeholder">
                    <span>Select a trainer style to preview in 3D</span>
                  </div>
                )}
              </div>

              {selectedStyle && (
                <div className="preview-details-card">
                  <div className="preview-details-header">
                    <h4>{selectedStyle.label}</h4>
                    <span className="preview-region-badge">STYLE {selectedStyle.id.replace('player-', '')}</span>
                  </div>
                  
                  <div className="preview-info-grid" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <div className="info-item" style={{ gridColumn: 'span 2' }}>
                      <span className="info-label">Motion Rigging</span>
                      <span className="info-value">{selectedStyle.motion}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Visual Standard</span>
                      <span className="info-value">Premium 3D Model</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Camera Scaling</span>
                      <span className="info-value">Fit-To-Frame</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
