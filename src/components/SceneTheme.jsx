import { SUN_POSITION } from './Atmosphere';

export function SceneTheme({ theme, children }) {
  if (!theme) {
    return children;
  }

  return (
    <>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.fog, theme.fogNear, theme.fogFar]} />
      <ambientLight intensity={theme.ambient} />
      <directionalLight
        castShadow={false}
        color="#ffffff"
        intensity={theme.sun}
        position={SUN_POSITION}
      />
      {children}
    </>
  );
}
