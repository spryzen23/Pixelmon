import { useEffect, useState } from 'react';
import { api } from '../api';
import { typeIconUrl } from '../game/assets';
import { DEFAULT_PLAYER_STYLE_ID, PLAYER_STYLES, getPlayerStyle } from '../game/playerStyles';
import { useGame, SCREENS } from '../context/GameContext';
import { useWizard } from '../hooks/useWizard';
import { usePagination } from '../hooks/usePagination';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { RadioGroup } from '../components/ui/RadioGroup';
import { WizardStepper } from '../components/ui/WizardStepper';
import { Pagination } from '../components/ui/Pagination';
import { ScreenFrame, ScreenFooter } from '../components/ui/layout/ScreenFrame';
import CompanionPreview from '../components/CompanionPreview';
import PlayerStylePreview from '../components/PlayerStylePreview';
import { getFitToHeightForPokemon, isPokemonFloating, getRotationForPokemon } from '../game/pokemonData';

const WIZARD_LABELS = ['Name', 'Companions', 'Style', 'Review'];
const COMPANION_PAGE_SIZE = 6;
const STYLE_PAGE_SIZE = 6;

export function ProfileSetupScreen() {
  const { user, setUser, goTo, setPlayer } = useGame();
  const wizard = useWizard(4);
  const [name, setName] = useState('');
  const [starters, setStarters] = useState([]);
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [styleId, setStyleId] = useState(DEFAULT_PLAYER_STYLE_ID);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [previewCompanion, setPreviewCompanion] = useState(null);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      goTo(SCREENS.welcome);
      return;
    }
    api.getStarters()
      .then((d) => {
        const list = d.starters || [];
        setStarters(list);
        if (list.length > 0) setPreviewCompanion(list[0]);
      })
      .catch(() => setStarters([]));
  }, [userId, goTo]);

  const selectedStyle = getPlayerStyle(styleId);

  const filteredStarters = starters.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.displayName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    const matchesRegion = selectedRegion === 'all' || s.region === selectedRegion;
    const matchesType = selectedType === 'all' || s.types?.includes(selectedType);
    return matchesSearch && matchesRegion && matchesType;
  });

  const companionPager = usePagination(filteredStarters, COMPANION_PAGE_SIZE);
  const stylePager = usePagination(PLAYER_STYLES, STYLE_PAGE_SIZE);

  const toggleCompanion = (pokemon) => {
    const isSelected = selectedCompanions.some((c) => c.entryId === pokemon.entryId);
    if (isSelected) {
      setSelectedCompanions(selectedCompanions.filter((c) => c.entryId !== pokemon.entryId));
    } else if (selectedCompanions.length < 5) {
      setSelectedCompanions([...selectedCompanions, pokemon]);
    }
    setPreviewCompanion(pokemon);
  };

  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = selectedCompanions.length === 5;

  const submit = async () => {
    if (!name.trim() || selectedCompanions.length !== 5 || !user) return;
    setSaving(true);
    try {
      const trainerId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'trainer-' + Math.random().toString(36).substring(2, 11);

      const newTrainer = {
        id: trainerId,
        displayName: name.trim(),
        characterStyle: selectedStyle,
        companions: selectedCompanions,
        companion: selectedCompanions[0],
        unlockedPathIds: [0],
        completedPathIds: [],
        perPathProgress: {},
        inventory: { balls: { standard: 999, great: 5, ultra: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const nextTrainers = [...(user.trainers || []), newTrainer];
      const updatedUser = await api.patchPlayer(user.id, { trainers: nextTrainers });

      setUser(updatedUser);
      setPlayer({ ...newTrainer, coins: updatedUser.pokecoins ?? 500, userId: user.id });
      localStorage.setItem('pixelmon-lastPlayerId', trainerId);
      goTo(SCREENS.dashboard);
    } catch (err) {
      console.error('Failed to create trainer profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <div>
      <h2 className="screen-title">Create Trainer Profile</h2>
      <p className="screen-subtitle">For {user?.displayName}</p>
      <WizardStepper currentStep={wizard.step} totalSteps={wizard.totalSteps} labels={WIZARD_LABELS} />
    </div>
  );

  const footer = (
    <ScreenFooter>
      <Button onClick={() => (wizard.isFirst ? goTo(SCREENS.dashboard) : wizard.back())}>
        {wizard.isFirst ? 'Cancel' : 'Back'}
      </Button>
      {!wizard.isLast ? (
        <Button
          variant="primary"
          disabled={
            (wizard.step === 1 && !canProceedStep1) ||
            (wizard.step === 2 && !canProceedStep2)
          }
          onClick={wizard.next}
        >
          Next
        </Button>
      ) : (
        <Button variant="primary" disabled={saving} onClick={submit}>
          {saving ? 'Creating...' : 'Create Trainer'}
        </Button>
      )}
    </ScreenFooter>
  );

  return (
    <ScreenFrame className="profile-setup-frame" header={header} footer={footer}>
      <div className="profile-wizard-body">
        {wizard.step === 1 && (
          <TextField
            label="Trainer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="Trainer Name"
          />
        )}

        {wizard.step === 2 && (
          <div className="profile-step-companions">
            <p className="profile-step-hint">Selected ({selectedCompanions.length}/5)</p>
            <div className="profile-slot-row">
              {[0, 1, 2, 3, 4].map((i) => {
                const c = selectedCompanions[i];
                return (
                  <button
                    key={i}
                    type="button"
                    className={`profile-slot ${c ? 'filled' : ''} ${previewCompanion?.entryId === c?.entryId ? 'active' : ''}`}
                    onClick={() => c && setPreviewCompanion(c)}
                  >
                    {c ? c.displayName.slice(0, 2) : '+'}
                  </button>
                );
              })}
            </div>
            <div className="companion-filters">
              <input
                type="text"
                className="filter-search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  companionPager.reset();
                }}
              />
              <select className="filter-select" value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); companionPager.reset(); }}>
                <option value="all">All Regions</option>
                {['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select className="filter-select" value={selectedType} onChange={(e) => { setSelectedType(e.target.value); companionPager.reset(); }}>
                <option value="all">All Types</option>
                {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'fairy'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="profile-picker-grid">
              {companionPager.pageItems.map((s) => {
                const isSelected = selectedCompanions.some((c) => c.entryId === s.entryId);
                const full = !isSelected && selectedCompanions.length >= 5;
                return (
                  <button
                    key={s.entryId}
                    type="button"
                    className={`profile-picker-item ${isSelected ? 'selected' : ''} ${full ? 'disabled' : ''}`}
                    onClick={() => !full && toggleCompanion(s)}
                  >
                    <span>{s.displayName}</span>
                    <img src={typeIconUrl(s.types?.[0])} alt="" width={16} height={16} />
                  </button>
                );
              })}
            </div>
            <Pagination page={companionPager.page} totalPages={companionPager.totalPages} onPageChange={companionPager.setPage} />
            {previewCompanion && (
              <div className={`preview-canvas-container compact ${previewCompanion.types?.[0] || 'normal'}`}>
                <CompanionPreview
                  modelUrl={previewCompanion.modelUrl}
                  primaryType={previewCompanion.types?.[0] || 'normal'}
                  fitToHeight={getFitToHeightForPokemon(previewCompanion)}
                  isFloating={isPokemonFloating(previewCompanion)}
                  rotation={getRotationForPokemon(previewCompanion)}
                />
              </div>
            )}
          </div>
        )}

        {wizard.step === 3 && (
          <div className="profile-step-style">
            <RadioGroup
              name="trainer-style"
              className="profile-style-grid"
              value={styleId}
              onChange={setStyleId}
              options={stylePager.pageItems.map((style) => ({
                value: style.id,
                label: style.label,
                data: style,
              }))}
              renderOption={(option) => {
                const style = option.data;
                return (
                  <span className="player-style-option">
                    <span className="player-style-token">{style.id.replace('player-', '')}</span>
                    <span className="player-style-copy">
                      <span>{style.label}</span>
                      <small>{style.motion}</small>
                    </span>
                  </span>
                );
              }}
            />
            <Pagination page={stylePager.page} totalPages={stylePager.totalPages} onPageChange={stylePager.setPage} />
            <div className="preview-canvas-container compact normal">
              <PlayerStylePreview characterStyle={selectedStyle} fitToHeight={1.1} />
            </div>
          </div>
        )}

        {wizard.step === 4 && (
          <div className="profile-step-review">
            <div className="preview-details-card">
              <h4>{name}</h4>
              <p>Style: {selectedStyle.label}</p>
              <p>Companions: {selectedCompanions.map((c) => c.displayName).join(', ')}</p>
            </div>
            <div className={`preview-canvas-container compact ${previewCompanion?.types?.[0] || 'normal'}`}>
              {previewCompanion && (
                <CompanionPreview
                  modelUrl={previewCompanion.modelUrl}
                  primaryType={previewCompanion.types?.[0] || 'normal'}
                  fitToHeight={getFitToHeightForPokemon(previewCompanion)}
                  isFloating={isPokemonFloating(previewCompanion)}
                  rotation={getRotationForPokemon(previewCompanion)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </ScreenFrame>
  );
}
