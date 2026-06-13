import { useEffect, useState } from 'react';
import { useGame, SCREENS } from '../context/GameContext';
import { login, register, verifySession, getStoredToken, setStoredToken, clearStoredToken } from '../services/authService';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { PasswordField } from '../components/ui/PasswordField';
import { TabBar } from '../components/ui/TabBar';
import { Modal } from '../components/ui/Modal';
import { ScreenFrame } from '../components/ui/layout/ScreenFrame';

export function WelcomeScreen() {
  const { goTo, setUser } = useGame();
  const [authTab, setAuthTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [controlsOpen, setControlsOpen] = useState(false);

  const isLoginTab = authTab === 'login';

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      verifySession(token)
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
            goTo(SCREENS.dashboard);
          } else {
            clearStoredToken();
            setLoading(false);
          }
        })
        .catch(() => {
          clearStoredToken();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [setUser, goTo]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    if (!isLoginTab && !displayName.trim()) return;

    setError('');
    setSubmitting(true);

    try {
      const res = isLoginTab
        ? await login({ username: username.trim(), password: password.trim() })
        : await register({
          username: username.trim(),
          password: password.trim(),
          displayName: displayName.trim(),
        });

      if (res.success && res.token && res.user) {
        setStoredToken(res.token);
        setUser(res.user);
        goTo(SCREENS.dashboard);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setSubmitting(false);
    }
  };

  const header = (
    <div className="welcome-brand">
      <h1 className="title">Pixelmon</h1>
      <p className="subtitle">Voxel Legends</p>
    </div>
  );

  const footer = (
    <div className="welcome-footer">
      <Button variant="ghost" sm onClick={() => setControlsOpen(true)}>
        View Controls
      </Button>
    </div>
  );

  if (loading) {
    return (
      <ScreenFrame className="welcome-screen" header={header} footer={footer}>
        <div className="welcome-content glass-panel welcome-loading">
          <p>Authenticating...</p>
        </div>
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame className="welcome-screen" header={header} footer={footer}>
      <div className="welcome-content glass-panel">
        <TabBar
          variant="underline"
          tabs={[
            { id: 'login', label: 'Login' },
            { id: 'register', label: 'Register' },
          ]}
          activeId={authTab}
          onChange={(id) => {
            setAuthTab(id);
            setError('');
          }}
        />

        <form className="welcome-form" onSubmit={handleAuth}>
          {!isLoginTab && (
            <TextField
              label="Profile Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Trainer Ash"
              maxLength={16}
            />
          )}
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            maxLength={20}
          />
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

          {error && <p className="error-text">{error}</p>}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Please wait...' : isLoginTab ? 'Login' : 'Create Account'}
          </Button>
        </form>
      </div>

      <Modal open={controlsOpen} title="Game Controls" onClose={() => setControlsOpen(false)}>
        <p>WASD — Move · F — Throw ball · E — Companion</p>
        <p>1 / 2 / 3 — Ball type · Q / R — Throw power</p>
        <p>6-0 / [ ] — Switch companion · Escape — Pause</p>
      </Modal>
    </ScreenFrame>
  );
}
