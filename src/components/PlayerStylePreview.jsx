import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import GlbCharacter from './GlbCharacter';
import { getPlayerActionFallbacks, resolvePlayerAction } from '../game/playerAnimation';
import { normalizePlayerStyle } from '../game/playerStyles';

const DEMO_CYCLE_MS = 2800;

export default function PlayerStylePreview({
  characterStyle,
  demoMode = 'cycle',
  fitToHeight = 1.1,
}) {
  const style = normalizePlayerStyle(characterStyle);
  const [previewAction, setPreviewAction] = useState('Idle');
  const inputRef = useRef({
    forwardInput: 0,
    strafeInput: 0,
    isJumping: false,
    isCrouching: false,
    moveSpeedFactor: 1,
    lookAngle: 0,
    lookPitch: 0,
    vy: 0,
    actionName: 'Idle',
  });

  useEffect(() => {
    if (demoMode !== 'cycle') {
      return undefined;
    }

    const started = performance.now();
    let frame = 0;

    const tick = () => {
      const elapsed = (performance.now() - started) % (DEMO_CYCLE_MS * 4);
      const phase = Math.floor(elapsed / DEMO_CYCLE_MS);

      let flags;
      if (phase === 0) {
        flags = { jumping: false, crouching: false, moving: false, hasMoveInput: false, sprinting: false };
        inputRef.current.forwardInput = 0;
        inputRef.current.strafeInput = 0;
        inputRef.current.moveSpeedFactor = 1;
      } else if (phase === 1) {
        flags = { jumping: false, crouching: false, moving: true, hasMoveInput: true, sprinting: false };
        inputRef.current.forwardInput = 1;
        inputRef.current.strafeInput = 0;
        inputRef.current.moveSpeedFactor = 1;
      } else if (phase === 2) {
        flags = { jumping: false, crouching: false, moving: true, hasMoveInput: true, sprinting: true };
        inputRef.current.forwardInput = 1;
        inputRef.current.moveSpeedFactor = 2;
      } else {
        flags = { jumping: false, crouching: true, moving: true, hasMoveInput: true, sprinting: false };
        inputRef.current.forwardInput = 0.6;
        inputRef.current.moveSpeedFactor = 0.45;
      }

      inputRef.current.isJumping = flags.jumping;
      inputRef.current.isCrouching = flags.crouching;

      const nextAction = resolvePlayerAction(flags);
      inputRef.current.actionName = nextAction;
      setPreviewAction(nextAction);

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [demoMode, style.modelUrl]);

  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 1.1, 2.4], fov: 42 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 6, 2]} intensity={1.8} />
      <Suspense fallback={null}>
        <GlbCharacter
          key={style.modelUrl}
          url={style.modelUrl}
          actionName={previewAction}
          fallbackActionName={getPlayerActionFallbacks(previewAction)}
          fitToHeight={fitToHeight}
          position={[0, 0, 0]}
          rotation={[0, Math.PI, 0]}
          inputRef={inputRef}
          primaryType="normal"
          fallbackColor="#2364ff"
          fallbackHeight={fitToHeight}
        />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}
