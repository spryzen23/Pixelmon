import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useFrame } from '@react-three/fiber';
import {
  isLeftSide,
  isPrimaryWalking,
  isStrafeLeanPart,
  matchesCategory,
  resolveAnimationClip,
  shouldUseNativeLocomotionClip,
} from '../game/animationUtils';
import { PILOT_POKE_MODELS } from '../game/pokeModels';

function isPoseNode(node) {
  return node.isMesh || node.isBone;
}

export default function AnimatedModel({
  url,
  actionName = 'Idle',
  fallbackActionName = 'Walk',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isJumping = false,
  isCrouching = false,
  forwardInput = 0,
  strafeInput = 0,
  moveSpeedFactor = 1,
  inputRef = null,
}) {
  const modelRef = useRef();
  const gltf = useGLTF(url);
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, scene);
  const activeAction = useRef(null);
  const idleTime = useRef(0);

  const originalRotations = useMemo(() => {
    const rotations = {};

    scene.traverse((node) => {
      if (isPoseNode(node) && node.name) {
        rotations[node.name] = node.rotation.clone();
      }
    });

    return rotations;
  }, [scene]);

  const swingTime = useRef(0);
  const resolvedClipName = resolveAnimationClip(names, actionName, fallbackActionName);
  const useNativeMixer = Boolean(
    resolvedClipName &&
    actions[resolvedClipName] &&
    shouldUseNativeLocomotionClip(resolvedClipName)
  );

  useFrame((state, delta) => {
    const liveInput = inputRef?.current;
    const liveForward = liveInput?.forwardInput ?? forwardInput;
    const liveStrafe = liveInput?.strafeInput ?? strafeInput;
    const liveJumping = liveInput?.isJumping ?? isJumping;
    const liveCrouching = liveInput?.isCrouching ?? isCrouching;
    const liveSpeed = liveInput?.moveSpeedFactor ?? moveSpeedFactor;

    if (useNativeMixer && activeAction.current) {
      const timeScale = Math.max(0.25, Math.min(2.5, liveSpeed));
      activeAction.current.setEffectiveTimeScale(timeScale);

      if (liveJumping || liveCrouching) {
        activeAction.current.paused = true;
      } else {
        activeAction.current.paused = false;
        if (!activeAction.current.isRunning()) {
          activeAction.current.play();
        }
      }
    }

    const skipFullProcedural =
      useNativeMixer && !liveJumping && !liveCrouching;

    const isWalking = isPrimaryWalking(actionName);
    const speed = Math.max(0.25, Math.min(2.5, liveSpeed));
    const swingRate = 10 + 8 * speed;

    if (!skipFullProcedural) {
      if (isWalking && !liveJumping && !liveCrouching) {
        swingTime.current += delta * swingRate;
      } else if (swingTime.current > 0) {
        swingTime.current = Math.max(0, swingTime.current - delta * 15);
      }

      if (!isWalking && swingTime.current <= 0) {
        idleTime.current += delta;
      } else {
        idleTime.current = 0;
      }
    } else if (!isWalking) {
      idleTime.current += delta;
    } else {
      idleTime.current = 0;
    }

    const stride = Math.sin(swingTime.current) * 0.62;
    const knee = Math.sin(swingTime.current + 0.35) * 0.28;
    const idleSway = Math.sin(idleTime.current * 1.6) * 0.018;
    const idleWeightShift = Math.sin(idleTime.current * 1.1) * 0.012;

    scene.traverse((node) => {
      if (!isPoseNode(node) || !node.name) {
        return;
      }

      const name = node.name;
      const lower = name.toLowerCase();
      const origRot = originalRotations[name];

      if (!origRot) {
        return;
      }

      if (!skipFullProcedural) {
        node.rotation.copy(origRot);
      } else if (liveStrafe !== 0 && isStrafeLeanPart(name)) {
        const rollAngle = -liveStrafe * 0.14;
        node.rotation.z += rollAngle;
        return;
      } else if (!isWalking && idleTime.current > 0) {
        if (matchesCategory(name, 'spine') || matchesCategory(name, 'head')) {
          node.rotation.x += idleSway;
          node.rotation.z += idleWeightShift;
        } else if (matchesCategory(name, 'tail')) {
          node.rotation.z += idleSway * 0.6;
        }
        return;
      } else {
        return;
      }

      const left = isLeftSide(name);
      const legSign = left ? 1 : -1;
      const armSign = left ? -1 : 1;

      if (liveCrouching) {
        if (matchesCategory(name, 'upperLeg') || matchesCategory(name, 'lowerLeg')) {
          node.rotation.x = origRot.x - 0.65;
          node.rotation.z = origRot.z + (left ? 0.14 : -0.14);
        } else if (matchesCategory(name, 'foot')) {
          node.rotation.x = origRot.x + 0.42;
        } else if (matchesCategory(name, 'spine')) {
          node.rotation.x = origRot.x - 0.28;
        } else if (matchesCategory(name, 'head')) {
          node.rotation.x = origRot.x + 0.16;
        } else if (
          matchesCategory(name, 'upperArm') ||
          matchesCategory(name, 'lowerArm') ||
          matchesCategory(name, 'hand') ||
          matchesCategory(name, 'vine')
        ) {
          node.rotation.x = origRot.x - 0.22;
        } else if (lower.includes('leg') || lower.includes('shoe')) {
          node.rotation.x = origRot.x - 0.42;
          node.rotation.z = origRot.z + (left ? 0.08 : -0.08);
        } else if (
          lower.includes('torso') ||
          lower.includes('coat_back') ||
          lower.includes('shirt') ||
          lower.includes('vest')
        ) {
          node.rotation.x = origRot.x - 0.15;
        } else if (lower.includes('arm') || lower.includes('hand') || lower.includes('sleeve')) {
          node.rotation.x = origRot.x - 0.2;
        }
      } else if (liveJumping) {
        if (matchesCategory(name, 'upperLeg') || matchesCategory(name, 'lowerLeg')) {
          node.rotation.x = origRot.x - 0.9;
        } else if (matchesCategory(name, 'foot')) {
          node.rotation.x = origRot.x + 0.55;
        } else if (
          matchesCategory(name, 'upperArm') ||
          matchesCategory(name, 'lowerArm') ||
          matchesCategory(name, 'hand') ||
          matchesCategory(name, 'vine')
        ) {
          node.rotation.x = origRot.x - 0.75;
          node.rotation.z = origRot.z + (left ? 0.35 : -0.35);
        } else if (matchesCategory(name, 'spine')) {
          node.rotation.x = origRot.x - 0.16;
        } else if (lower.includes('leg')) {
          node.rotation.x = origRot.x - 0.65;
        } else if (lower.includes('shoe')) {
          node.rotation.x = origRot.x + 0.65;
        } else if (lower.includes('arm') || lower.includes('hand') || lower.includes('sleeve')) {
          node.rotation.x = origRot.x - 0.85;
        }
      } else if (isWalking || swingTime.current > 0) {
        if (matchesCategory(name, 'upperLeg')) {
          node.rotation.x = origRot.x + stride * legSign * 0.75;
        } else if (matchesCategory(name, 'lowerLeg')) {
          node.rotation.x = origRot.x + knee * legSign * 1.15;
        } else if (matchesCategory(name, 'foot')) {
          node.rotation.x = origRot.x - stride * legSign * 0.25;
        } else if (
          matchesCategory(name, 'upperArm') ||
          matchesCategory(name, 'vine')
        ) {
          node.rotation.x = origRot.x + stride * 0.65 * armSign;
        } else if (matchesCategory(name, 'lowerArm') || matchesCategory(name, 'hand')) {
          node.rotation.x = origRot.x + stride * 0.42 * armSign;
        } else if (matchesCategory(name, 'tail')) {
          node.rotation.z = origRot.z + Math.sin(swingTime.current * 0.7) * 0.12;
          node.rotation.y = origRot.y + Math.sin(swingTime.current * 0.5) * 0.06;
        } else if (matchesCategory(name, 'head')) {
          node.rotation.x =
            origRot.x + Math.sin(swingTime.current * 2) * 0.05;
        } else if (matchesCategory(name, 'spine')) {
          node.rotation.x =
            origRot.x + Math.sin(swingTime.current * 2) * 0.025;
        } else if (matchesCategory(name, 'rigid')) {
          node.rotation.x = origRot.x + stride * 0.15;
          node.rotation.z = origRot.z + Math.sin(swingTime.current * 2) * 0.04;
        } else if (lower.includes('leg') || lower.includes('shoe')) {
          node.rotation.x = origRot.x + stride * legSign;
        } else if (
          lower.includes('arm') ||
          lower.includes('hand') ||
          lower.includes('sleeve') ||
          lower.includes('coat_panel') ||
          lower.includes('coat_tail')
        ) {
          node.rotation.x = origRot.x + stride * 0.25 * armSign;
        } else if (lower.includes('head')) {
          node.rotation.x =
            origRot.x + Math.sin(swingTime.current * 2) * 0.05;
        } else if (
          lower.includes('torso') ||
          lower.includes('coat_back') ||
          lower.includes('shirt') ||
          lower.includes('vest')
        ) {
          node.rotation.x =
            origRot.x + Math.sin(swingTime.current * 2) * 0.02;
        }
      } else if (idleTime.current > 0) {
        if (matchesCategory(name, 'spine') || matchesCategory(name, 'head')) {
          node.rotation.x = origRot.x + idleSway;
          node.rotation.z = origRot.z + idleWeightShift;
        } else if (matchesCategory(name, 'tail')) {
          node.rotation.z = origRot.z + idleSway * 0.6;
        }
      }

      if (liveStrafe !== 0 && isStrafeLeanPart(name)) {
        const rollAngle = -liveStrafe * 0.14;
        node.rotation.z = origRot.z + rollAngle;
      }
    });
  });

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    try {
      const clipName = resolveAnimationClip(names, actionName, fallbackActionName);

      if (!clipName || !actions[clipName] || !shouldUseNativeLocomotionClip(clipName)) {
        if (activeAction.current) {
          activeAction.current.stop();
          activeAction.current = null;
        }
        return undefined;
      }

      const nextAction = actions[clipName];

      if (activeAction.current === nextAction) {
        return undefined;
      }

      nextAction.reset().fadeIn(0.2).play();

      if (activeAction.current) {
        activeAction.current.crossFadeTo(nextAction, 0.25, false);
      }

      activeAction.current = nextAction;

      return undefined;
    } catch (error) {
      return undefined;
    }
  }, [actionName, actions, fallbackActionName, names]);

  return (
    <group ref={modelRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/player.glb');
useGLTF.preload('/companion.glb');
useGLTF.preload('/wild_creature.glb');
PILOT_POKE_MODELS.forEach((url) => useGLTF.preload(url));
