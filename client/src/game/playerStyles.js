export const DEFAULT_PLAYER_STYLE_ID = 'player-21';

export const PLAYER_STYLES = [
  { id: 'player-21', label: 'Arc Runner', modelUrl: '/assets/players/player%20(21).glb', motion: 'Idle, run, jump clips' },
  { id: 'player-15', label: 'Street Trainer', modelUrl: '/assets/players/player%20(15).glb', motion: 'Walk clip, procedural jump' },
  { id: 'player-5', label: 'Explorer', modelUrl: '/assets/players/player%20(5).glb', motion: 'Rigged procedural' },
  { id: 'player-6', label: 'Field Scout', modelUrl: '/assets/players/player%20(6).glb', motion: 'Rigged procedural' },
  { id: 'player-11', label: 'Trail Hero', modelUrl: '/assets/players/player%20(11).glb', motion: 'Procedural rig' },
  { id: 'player-12', label: 'Summit Hero', modelUrl: '/assets/players/player%20(12).glb', motion: 'Procedural rig' },
  { id: 'player-13', label: 'Forest Hero', modelUrl: '/assets/players/player%20(13).glb', motion: 'Procedural rig' },
  { id: 'player-14', label: 'Storm Hero', modelUrl: '/assets/players/player%20(14).glb', motion: 'Procedural rig' },
  { id: 'player-1', label: 'Style 01', modelUrl: '/assets/players/player%20(1).glb', motion: 'Responsive model motion' },
  { id: 'player-2', label: 'Style 02', modelUrl: '/assets/players/player%20(2).glb', motion: 'Responsive model motion' },
  { id: 'player-3', label: 'Style 03', modelUrl: '/assets/players/player%20(3).glb', motion: 'Responsive model motion' },
  { id: 'player-4', label: 'Style 04', modelUrl: '/assets/players/player%20(4).glb', motion: 'Responsive model motion' },
  { id: 'player-7', label: 'Style 07', modelUrl: '/assets/players/player%20(7).glb', motion: 'Responsive model motion' },
  { id: 'player-8', label: 'Style 08', modelUrl: '/assets/players/player%20(8).glb', motion: 'Responsive model motion' },
  { id: 'player-9', label: 'Style 09', modelUrl: '/assets/players/player%20(9).glb', motion: 'Responsive model motion' },
  { id: 'player-10', label: 'Style 10', modelUrl: '/assets/players/player%20(10).glb', motion: 'Responsive model motion' },
  { id: 'player-16', label: 'Style 16', modelUrl: '/assets/players/player%20(16).glb', motion: 'Responsive model motion' },
  { id: 'player-17', label: 'Style 17', modelUrl: '/assets/players/player%20(17).glb', motion: 'Responsive model motion' },
  { id: 'player-18', label: 'Style 18', modelUrl: '/assets/players/player%20(18).glb', motion: 'Responsive model motion' },
  { id: 'player-19', label: 'Style 19', modelUrl: '/assets/players/player%20(19).glb', motion: 'Responsive model motion' },
  { id: 'player-20', label: 'Style 20', modelUrl: '/assets/players/player%20(20).glb', motion: 'Responsive model motion' },
  { id: 'player-22', label: 'Style 22', modelUrl: '/assets/players/player%20(22).glb', motion: 'Responsive model motion' },
  { id: 'player-23', label: 'Style 23', modelUrl: '/assets/players/player%20(23).glb', motion: 'Responsive model motion' },
].map((style) => ({
  fitHeight: 0.92,
  modelScale: 1,
  ...style,
}));

export function getPlayerStyle(styleId) {
  return (
    PLAYER_STYLES.find((style) => style.id === styleId) ||
    PLAYER_STYLES.find((style) => style.id === DEFAULT_PLAYER_STYLE_ID) ||
    PLAYER_STYLES[0]
  );
}

export function normalizePlayerStyle(style) {
  if (!style) {
    return getPlayerStyle(DEFAULT_PLAYER_STYLE_ID);
  }

  return getPlayerStyle(style.id);
}
