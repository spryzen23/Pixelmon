import { useEffect, useState } from 'react';
import { api } from '../api';
import { typeIconUrl } from '../game/assets';
import { DEFAULT_PLAYER_STYLE_ID, PLAYER_STYLES, getPlayerStyle } from '../game/playerStyles';
import { useGame, SCREENS } from '../context/GameContext';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { RadioGroup } from '../components/ui/RadioGroup';

export function ProfileSetupScreen() {
  const { goTo, setPlayer } = useGame();
  const [name, setName] = useState('');
  const [starters, setStarters] = useState([]);
  const [companionId, setCompanionId] = useState('');
  const [styleId, setStyleId] = useState(DEFAULT_PLAYER_STYLE_ID);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getStarters().then((d) => setStarters(d.starters || [])).catch(() => setStarters([]));
  }, []);

  const companion = starters.find((s) => s.entryId === companionId);

  const submit = async () => {
    if (!name.trim() || !companion) return;
    setSaving(true);
    try {
      const p = await api.createPlayer({
        displayName: name.trim(),
        companion,
        characterStyle: getPlayerStyle(styleId),
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
      <TextField
        label="Trainer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={16}
        placeholder="Your name"
      />
      <h3>Choose companion</h3>
      <RadioGroup
        name="companion"
        value={companionId}
        onChange={setCompanionId}
        options={starters.map((s) => ({ value: s.entryId, label: s.displayName, data: s }))}
        renderOption={(option) => {
          const s = option.data;
          return (
            <>
              <div className="type-icons">
                {s.types?.map((t) => (
                  <img key={t} src={typeIconUrl(t)} alt={t} width={24} height={24} />
                ))}
              </div>
              <span>{s.displayName}</span>
            </>
          );
        }}
      />
      <h3>Choose trainer style</h3>
      <RadioGroup
        name="trainer-style"
        value={styleId}
        onChange={setStyleId}
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
  );
}
