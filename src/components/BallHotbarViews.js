import { View } from '@react-three/drei';
import { Suspense } from 'react';
import { BALL_TYPES } from '../game/balls';
import BallModel from './BallModel';

const HOTBAR_PREVIEW_DIAMETER = 0.34;

export default function BallHotbarViews({ ballSlotRefs = [] }) {
  return (
    <>
      {BALL_TYPES.map((ball, index) => {
        const track = ballSlotRefs[index];

        if (!track) {
          return null;
        }

        return (
          <View key={ball.id} track={track} index={index + 2}>
            <ambientLight intensity={0.9} />
            <directionalLight intensity={1.15} position={[2, 4, 3]} />
            <Suspense fallback={null}>
              <BallModel
                url={ball.modelUrl}
                modelScale={ball.modelScale}
                targetDiameter={HOTBAR_PREVIEW_DIAMETER}
                spin
              />
            </Suspense>
          </View>
        );
      })}
    </>
  );
}
