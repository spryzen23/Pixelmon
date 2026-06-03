import { Suspense, useMemo } from 'react';
import { BALL_TYPES } from '../game/balls';
import { getEntityY } from '../game/world';
import BallModel from './BallModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';

const SHOWCASE_SPACING = 1.15;
const SHOWCASE_OFFSET_X = 3;
const SHOWCASE_DIAMETER = 0.42;

export default function PokeballShowcase({ currentBiome = 0, spawnPosition = [0, 0, 0] }) {
  const placements = useMemo(() => {
    const [spawnX, , spawnZ] = spawnPosition;

    return BALL_TYPES.map((ball, index) => {
      const x = spawnX + SHOWCASE_OFFSET_X + index * SHOWCASE_SPACING;
      const z = spawnZ;
      const y = getEntityY(x, z, SHOWCASE_DIAMETER / 2, undefined, currentBiome);

      return {
        ball,
        position: [x, y + SHOWCASE_DIAMETER / 2, z],
      };
    });
  }, [currentBiome, spawnPosition]);

  return (
    <group>
      {placements.map(({ ball, position }) => (
        <ModelErrorBoundary
          key={ball.id}
          resetKey={`${currentBiome}-${ball.id}`}
          fallback={
            <VoxelFallback
              color={ball.color}
              height={SHOWCASE_DIAMETER}
              width={SHOWCASE_DIAMETER}
              depth={SHOWCASE_DIAMETER}
              position={position}
            />
          }
        >
          <Suspense fallback={null}>
            <BallModel
              url={ball.modelUrl}
              modelScale={ball.modelScale}
              targetDiameter={SHOWCASE_DIAMETER}
              position={position}
            />
          </Suspense>
        </ModelErrorBoundary>
      ))}
    </group>
  );
}
