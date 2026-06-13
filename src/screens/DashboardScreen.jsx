import { useEffect, useState } from 'react';
import { api } from '../api';
import { useGame, SCREENS, GAME_MODES } from '../context/GameContext';
import { Button } from '../components/ui/Button';
import { TabBar } from '../components/ui/TabBar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { purchaseBall } from '../services/shopService';
import { loadBiomeMap } from '../services/campaignService';
import { getBiomeDisplayInfo } from '../game/biomeDisplay';
import CompanionPreview from '../components/CompanionPreview';
import { getFitToHeightForPokemon, isPokemonFloating, getRotationForPokemon } from '../game/pokemonData';

import { typeIconUrl } from '../game/assets';

export function DashboardScreen() {
  const {
    user,
    setUser,
    player,
    setPlayer,
    goTo,
    setSession,
    setGameMode,
    biomeMap,
    setBiomeMap,
  } = useGame();

  const [leftTab, setLeftTab] = useState('trainer');
  const [previewType, setPreviewType] = useState('companion');
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [showV2Features, setShowV2Features] = useState(false);

  // Sync biomes
  useEffect(() => {
    if (!biomeMap) {
      loadBiomeMap().then(setBiomeMap).catch(console.error);
    }
  }, [biomeMap, setBiomeMap]);

  // Auto-select or refresh active trainer on mount
  useEffect(() => {
    if (!user) {
      goTo(SCREENS.welcome);
      return;
    }

    if (!player && user.trainers && user.trainers.length > 0) {
      const lastId = localStorage.getItem('pixelmon-lastPlayerId');
      const activeTrainer = user.trainers.find((t) => t.id === lastId) || user.trainers[0];
      if (activeTrainer) {
        api.getPlayer(activeTrainer.id)
          .then((t) => setPlayer(t))
          .catch(console.error);
      }
    }
  }, [user, player, setPlayer, goTo]);

  // Set default selected region once map is loaded
  useEffect(() => {
    if (biomeMap?.regions && biomeMap.regions.length > 0 && !selectedRegion) {
      // Find first playable region or default to first
      const firstPlayable = biomeMap.regions.find((r) => r.playable) || biomeMap.regions[0];
      setSelectedRegion(firstPlayable);
    }
  }, [biomeMap, selectedRegion]);

  if (!user) return null;

  const trainers = user.trainers || [];
  const coins = user.pokecoins ?? 500;

  const handleLogout = () => {
    setUser(null);
    setPlayer(null);
    localStorage.removeItem('pixelmon-auth-token');
    localStorage.removeItem('pixelmon-lastPlayerId');
    goTo(SCREENS.welcome);
  };

  const selectTrainer = async (trainerId) => {
    try {
      const trainer = await api.getPlayer(trainerId);
      setPlayer(trainer);
      localStorage.setItem('pixelmon-lastPlayerId', trainerId);
    } catch (err) {
      console.error('Failed to select trainer', err);
    }
  };

  // PokéShop Buy handler
  const handleBuyBall = async (ballId, cost) => {
    if (!player || purchaseLoading || coins < cost) return;

    setPurchaseLoading(true);
    setPurchaseSuccess(null);

    try {
      const { result, newCoins } = await purchaseBall(player, user, ballId, cost);
      setPlayer(result);
      setUser((prev) => ({
        ...prev,
        pokecoins: newCoins,
        trainers: prev.trainers.map((t) =>
          t.id === player.id ? { ...t, inventory: result.inventory } : t
        )
      }));

      setPurchaseSuccess(ballId);
      setTimeout(() => setPurchaseSuccess(null), 1500);
    } catch (err) {
      console.error('Failed to purchase ball', err);
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Launch handlers
  const handleStartCampaign = () => {
    if (!player || !selectedRegion || !selectedRegion.playable) return;

    const display = getBiomeDisplayInfo(selectedRegion.pathId);
    setSession({
      pathId: selectedRegion.pathId,
      regionId: selectedRegion.regionId,
      terrainName: display.terrainName || selectedRegion.terrainName,
    });
    setGameMode(GAME_MODES.campaign);
    goTo(SCREENS.loading);
  };

  const handleStartSandbox = () => {
    setGameMode(GAME_MODES.sandbox);
    goTo(SCREENS.inGame);
  };

  const handleStartRoyale = () => {
    setGameMode(GAME_MODES.battleRoyale);
    goTo(SCREENS.battleRoyale);
  };

  const handleStartCampaignV2 = () => {
    setGameMode(GAME_MODES.campaignV2);
    goTo(SCREENS.campaignV2);
  };

  const handleStartRoyaleV2 = () => {
    setGameMode(GAME_MODES.battleRoyaleV2);
    goTo(SCREENS.battleRoyaleV2);
  };

  const handleStartMinigames = () => {
    setGameMode(GAME_MODES.minigameHub);
    goTo(SCREENS.minigameHub);
  };

  // Campaign progress utilities
  const unlockedPaths = new Set(player?.unlockedPathIds || [0]);
  const completedPaths = new Set(player?.completedPathIds || []);
  const totalMaps = biomeMap?.regions?.length || 8;
  const completionPct = totalMaps > 0 ? Math.round((completedPaths.size / totalMaps) * 100) : 0;

  // Shop configurations
  const shopItems = [
    { id: 'great', name: 'Great Ball', cost: 50, color: '#2468ff', accentColor: '#e61f2c' },
    { id: 'ultra', name: 'Ultra Ball', cost: 100, color: '#171717', accentColor: '#ffd928' },
  ];

  // User initial for avatar
  const userInitial = (user.username || user.email || 'P')[0].toUpperCase();

  return (
    <div className="dashboard-screen">
      {/* ── Header Panel ───────────────────────────────── */}
      <header className="dashboard-header">
        <div className="db-title-area">
          <h1>PIXELMON</h1>
          <p>Voxel Legends Hub</p>
          <button 
            type="button"
            className={`db-toggle-btn ${showV2Features ? 'active' : ''}`}
            onClick={() => setShowV2Features(!showV2Features)}
          >
            {showV2Features ? 'V2 Enabled' : 'Enable V2'}
          </button>
        </div>
        <div className="db-user-area">
          <div className="db-coin-badge" title="PokéCoins balance">
            <span className="db-coin-icon">🪙</span>
            <span>{coins.toLocaleString()}</span>
          </div>
          <div className="db-user-avatar" title={user.username || 'Trainer'}>
            {userInitial}
          </div>
          <button className="db-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Grid Layout ───────────────────────────── */}
      <div className="dashboard-grid">

        {/* ─── Left Column: Trainer & Items ──────────── */}
        <div className="db-left-column">
          <TabBar
            tabs={[
              { id: 'trainer', label: 'Trainer' },
              { id: 'team', label: 'Team' },
              { id: 'shop', label: 'Shop' },
            ]}
            activeId={leftTab}
            onChange={setLeftTab}
          />

          {leftTab === 'trainer' && (
            <div className="db-panel db-tab-panel">
              <h2 className="db-panel-title">Trainer Profile</h2>

              {!player ? (
                <div className="onboarding-trainer-panel">
                  <span className="onboarding-icon">🎒</span>
                  <p>Welcome! Create a Trainer profile to start catching voxel creatures in the wild.</p>
                  <Button variant="primary" onClick={() => goTo(SCREENS.profileSetup)}>
                    Create Trainer Profile
                  </Button>
                </div>
              ) : (
                <>
                  {/* Trainer info card */}
                  <div className="trainer-info-card">
                    <div className="trainer-avatar-circle">
                      {player.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="trainer-meta-details">
                      <h3>{player.displayName}</h3>
                      <p>{player.characterStyle?.label || 'Arc Runner'}</p>
                    </div>
                    <div className="trainer-stat-badge">
                      <span className="trainer-stat-label">Completed</span>
                      <span className="trainer-stat-value">
                        🏆 {completedPaths.size}
                      </span>
                    </div>
                  </div>

                  {/* 3D Preview Frame */}
                  <div className="db-preview-container">
                    <button
                      className="preview-toggle-btn"
                      onClick={() => setPreviewType((t) => (t === 'companion' ? 'trainer' : 'companion'))}
                    >
                      View {previewType === 'companion' ? 'Trainer' : 'Companion'}
                    </button>

                    {previewType === 'companion' && player.companion ? (
                      <CompanionPreview
                        modelUrl={player.companion.modelUrl}
                        primaryType={player.companion.types?.[0] || 'normal'}
                        fitToHeight={getFitToHeightForPokemon(player.companion)}
                        isFloating={isPokemonFloating(player.companion)}
                        rotation={getRotationForPokemon(player.companion)}
                      />
                    ) : (
                      <CompanionPreview
                        modelUrl={player.characterStyle?.modelUrl || '/assets/players/player%20(21).glb'}
                        primaryType="normal"
                        fitToHeight={1.25}
                        isFloating={false}
                      />
                    )}

                    <span className="preview-label">
                      {previewType === 'companion'
                        ? (player.companion?.displayName || 'Companion')
                        : 'Trainer Model'}
                    </span>
                  </div>

                  {/* Switch Trainer Selector */}
                  {trainers.length > 1 && (
                    <button
                      type="button"
                      className="switch-trainer-trigger"
                      onClick={() => setTrainerModalOpen(true)}
                    >
                      Switch Trainer Profile
                    </button>
                  )}
                  {trainerModalOpen && (
                    <div className="trainer-modal-list">
                      {trainers
                        .filter((t) => t.id !== player.id)
                        .slice(0, 3)
                        .map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className="trainer-select-btn"
                            onClick={() => {
                              selectTrainer(t.id);
                              setTrainerModalOpen(false);
                            }}
                          >
                            {t.displayName} ({t.completedPathIds?.length ?? 0} clears)
                          </button>
                        ))}
                    </div>
                  )}

                  {trainers.length <= 1 && (
                    <button
                      className="db-create-trainer-btn"
                      onClick={() => goTo(SCREENS.profileSetup)}
                    >
                      ＋ Create Another Trainer
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {leftTab === 'team' && player && player.companions && (
            <div className="db-panel db-tab-panel">
              <h2 className="db-panel-title">Companion Team</h2>
              <p className="db-companion-subtitle">
                Tap a companion to set as active preview
              </p>

              <div className="db-companions-grid">
                {player.companions.slice(0, 5).map((comp, idx) => {
                  const isActive = player.companion?.entryId === comp.entryId;
                  const type = comp.types?.[0] || 'normal';
                  return (
                    <div
                      key={idx}
                      className={`db-companion-slot ${type} ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setPlayer({ ...player, companion: comp });
                        setPreviewType('companion');
                      }}
                      title={comp.displayName}
                    >
                      <div className="slot-initial">{comp.displayName.slice(0, 2).toUpperCase()}</div>
                      <div className="slot-name">{comp.displayName}</div>
                      <div className="type-icons">
                        {comp.types?.slice(0, 2).map((t) => (
                          <img key={t} src={typeIconUrl(t)} alt={t} width={12} height={12} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {leftTab === 'shop' && player && (
            <div className="db-panel db-tab-panel">
              <h2 className="db-panel-title">PokéShop & Bag</h2>

              <div className="shop-grid">
                {/* Standard Ball (Unlimited) */}
                <div className="shop-card">
                  <div className="shop-card-badge">BAG</div>
                  <div
                    className="shop-card-preview"
                    style={{ background: 'radial-gradient(circle at 32% 28%, #ffffff 0 30%, #e61f2c 30% 100%)' }}
                  />
                  <div className="shop-card-name">Standard</div>
                  <div className="shop-card-qty">Qty: ∞</div>
                  <button className="shop-buy-btn" disabled>FREE</button>
                </div>

                {/* Purchasable Great and Ultra Balls */}
                {shopItems.map((item) => {
                  const owned = player.inventory?.balls?.[item.id] ?? (item.id === 'great' ? 5 : 1);
                  const canAfford = coins >= item.cost;
                  const isBought = purchaseSuccess === item.id;

                  return (
                    <div className="shop-card" key={item.id}>
                      <div className="shop-card-badge">BAG</div>
                      <div
                        className="shop-card-preview"
                        style={{ background: `radial-gradient(circle at 32% 28%, ${item.accentColor} 0 30%, ${item.color} 30% 100%)` }}
                      />
                      <div className="shop-card-name">{item.name}</div>
                      <div className="shop-card-qty">Qty: {owned}</div>

                      <button
                        className={`shop-buy-btn ${isBought ? 'purchased' : ''}`}
                        disabled={!canAfford || purchaseLoading}
                        onClick={() => handleBuyBall(item.id, item.cost)}
                      >
                        {isBought ? '✓ Bought!' : `🪙 ${item.cost}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Right Column: Game Modes ──────────────── */}
        <div className="db-right-column">
          <div className="modes-grid">

            {/* 1. Campaign Mode Card */}
            <div className="mode-hub-card mode-campaign">
              <div className="mode-card-header">
                <span className="mode-card-icon">🗺️</span>
                <div className="mode-card-title-group">
                  <h3>Campaign Adventure</h3>
                  <p>Catch voxel creatures & unlock maps</p>
                </div>
              </div>
              <div className="mode-card-content">
                <p className="mode-card-desc">
                  Progress biome-by-biome to complete your Dex. Catch all spawns in a region to unlock and advance to the next element region!
                </p>

                {/* Campaign progress bar */}
                {player && (
                  <ProgressBar
                    label="Progress"
                    sublabel={`${completedPaths.size}/${totalMaps} Maps`}
                    value={completionPct}
                    variant="neon"
                  />
                )}

                {player && biomeMap?.regions && (
                  <div className="inline-map-selector">
                    <span className="inline-map-selector-title">Select Region Map</span>

                    <div className="db-map-grid-inline">
                      {biomeMap.regions.map((region) => {
                        const isUnlocked = region.playable && unlockedPaths.has(region.pathId);
                        const isDone = completedPaths.has(region.pathId);
                        const isSelected = selectedRegion?.regionId === region.regionId;
                        const display = getBiomeDisplayInfo(region.pathId);

                        return (
                          <button
                            key={region.regionId}
                            type="button"
                            className={`db-map-btn-inline ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                            disabled={!isUnlocked}
                            onClick={() => setSelectedRegion(region)}
                          >
                            <span className="db-map-name-inline">{display.terrainName}</span>
                            <span className="db-map-meta-inline">
                              {isDone ? '🏆 Cleared' : `Lvl ${region.minDex}–${region.maxDex}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  className="launch-mode-btn"
                  disabled={!player || !selectedRegion || !unlockedPaths.has(selectedRegion?.pathId)}
                  onClick={handleStartCampaign}
                >
                  {!player ? 'Trainer Required' : 'Launch Campaign'}
                </button>
              </div>
            </div>

            {/* 1.5. Campaign Mode V2 Card */}
            {showV2Features && (
              <div className="mode-hub-card mode-campaign" style={{ borderTop: '2px solid #7cb342' }}>
                <div className="mode-card-header">
                  <span className="mode-card-icon">🗺️</span>
                  <div className="mode-card-title-group">
                    <h3>Campaign Adventure V2</h3>
                    <p>Chunk-based rendering engine</p>
                  </div>
                  <div className="mode-status-tag" style={{ background: 'rgba(124, 179, 66, 0.2)', color: '#7cb342' }}>
                    <span className="status-dot" style={{ background: '#7cb342' }}></span>
                    BETA
                  </div>
                </div>
                <div className="mode-card-content">
                  <p className="mode-card-desc">
                    Experience the newly optimized, chunk-based biome map loading logic.
                  </p>
                  <button
                    className="launch-mode-btn"
                    onClick={handleStartCampaignV2}
                  >
                    Launch Campaign V2
                  </button>
                </div>
              </div>
            )}

            {/* 2. Sandbox Mode Card */}
            <div className="mode-hub-card mode-sandbox">
              <div className="mode-card-header">
                <span className="mode-card-icon">🧭</span>
                <div className="mode-card-title-group">
                  <h3>Sandbox Explorer</h3>
                  <p>Free exploration & spawn testing</p>
                </div>
              </div>
              <div className="mode-card-content">
                <p className="mode-card-desc">
                  Explore all voxel biomes freely with advanced spawns, real-time biome metrics export, and developer spawn tracking. No level limits or locks!
                </p>
                <button className="launch-mode-btn" onClick={handleStartSandbox}>
                  Launch Sandbox
                </button>
              </div>
            </div>

            {/* 3. Battle Royale Mode Card */}
            <div className="mode-hub-card mode-royale">
              <div className="mode-card-header">
                <span className="mode-card-icon">⚔️</span>
                <div className="mode-card-title-group">
                  <h3>Battle Royale</h3>
                  <p>Multiplayer catching lobbies</p>
                </div>
                <div className="mode-status-tag online">
                  <span className="status-dot"></span>
                  Live
                </div>
              </div>
              <div className="mode-card-content">
                <p className="mode-card-desc">
                  Join dynamic online lobbies and catch as many voxel creatures as possible within a tight timer. Compete live with other trainers!
                </p>
                <button className="launch-mode-btn" disabled={!player} onClick={handleStartRoyale}>
                  {!player ? 'Trainer Required' : 'Join Royale Lobby'}
                </button>
              </div>
            </div>

            {/* 3.5. Battle Royale Mode V2 Card */}
            {showV2Features && (
              <div className="mode-hub-card mode-royale" style={{ borderTop: '2px solid #7cb342' }}>
                <div className="mode-card-header">
                  <span className="mode-card-icon">⚔️</span>
                  <div className="mode-card-title-group">
                    <h3>Battle Royale V2</h3>
                    <p>Next-gen multiplayer lobbys</p>
                  </div>
                  <div className="mode-status-tag" style={{ background: 'rgba(124, 179, 66, 0.2)', color: '#7cb342' }}>
                    <span className="status-dot" style={{ background: '#7cb342' }}></span>
                    BETA
                  </div>
                </div>
                <div className="mode-card-content">
                  <p className="mode-card-desc">
                    Join dynamic online lobbies and catch as many voxel creatures as possible within a tight timer. Built on the V2 engine!
                  </p>
                  <button className="launch-mode-btn" onClick={handleStartRoyaleV2}>
                    Join Royale Lobby V2
                  </button>
                </div>
              </div>
            )}

            {/* 4. Minigame Hub Card */}
            <div className="mode-hub-card mode-minigames">
              <div className="mode-card-header">
                <span className="mode-card-icon">🎓</span>
                <div className="mode-card-title-group">
                  <h3>Trivia & Arena</h3>
                  <p>Turn combat & quizzes for PokéCoins</p>
                </div>
              </div>
              <div className="mode-card-content">
                <p className="mode-card-desc">
                  Take on the 3v3 Battle Arena, answer daily PokéGrids, test your knowledge in trivia, or play clue guesser. Earn massive PokéCoins payouts!
                </p>
                <button className="launch-mode-btn" onClick={handleStartMinigames}>
                  Enter Arcade Hub
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
