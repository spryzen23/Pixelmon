import { Suspense } from 'react';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';

export default function GlbCharacter({
  url,
  actionName = 'Idle',
  fallbackActionName = 'Walk',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  inputRef = null,
  animProfile = null,
  primaryType = 'normal',
  fallbackColor = '#888888',
  fallbackHeight = 1,
  fallbackWidth = 0.75,
  fitToHeight = null,
}) {
  const fallback = (
    <VoxelFallback
      color={fallbackColor}
      height={fallbackHeight}
      width={fallbackWidth}
      depth={fallbackWidth}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );

  return (
    <ModelErrorBoundary resetKey={url} fallback={fallback}>
      <Suspense fallback={fallback}>
        <AnimatedModel
          url={url}
          actionName={actionName}
          fallbackActionName={fallbackActionName}
          position={position}
          rotation={rotation}
          scale={scale}
          inputRef={inputRef}
          animProfile={animProfile}
          primaryType={primaryType}
          fitToHeight={fitToHeight}
        />
      </Suspense>
    </ModelErrorBoundary>
  );
}
