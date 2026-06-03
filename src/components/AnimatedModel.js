import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { Box3, LoopRepeat, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useFrame } from '@react-three/fiber';
import {
  isLeftSide,
  isPrimaryIdle,
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
  const rootRef = useRef();
  const gltf = useGLTF(url);
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, rootRef);
  const activeAction = useRef(null);
  const idleTime = useRef(0);
  const mixerLogged = useRef(false);

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
  const locomotionClipReady = Boolean(
    resolvedClipName &&
    actions[resolvedClipName] &&
    shouldUseNativeLocomotionClip(resolvedClipName)
  );
  const useNativeMixer =
    locomotionClipReady &&
    (isPrimaryWalking(actionName) || isPrimaryIdle(actionName));
  const isIdleLocomotion =
    useNativeMixer &&
    isPrimaryIdle(actionName) &&
    !isPrimaryWalking(actionName);

  useEffect(() => {
    if (!url.includes('player.glb')) {
      return;
    }
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/f6ae2fc6-304a-4fe4-bc2e-1432ec00b765', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'efcfd8' }, body: JSON.stringify({ sessionId: 'efcfd8', runId: 'pre-fix', hypothesisId: 'H2', location: 'AnimatedModel.js:scene-bbox', message: 'player glb bind-pose AABB (local, before group rotation)', data: { url, rotation, rotationDeg: rotation.map((r) => +(r * 180 / Math.PI).toFixed(1)), bboxSize: { x: +size.x.toFixed(3), y: +size.y.toFixed(3), z: +size.z.toFixed(3) }, tallestAxis: size.y >= size.x && size.y >= size.z ? 'y' : size.z >= size.x ? 'z' : 'x' }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
  }, [url, scene, rotation]);

  useFrame((state, delta) => {
    const liveInput = inputRef?.current;
    const liveForward = liveInput?.forwardInput ?? forwardInput;
    const liveStrafe = liveInput?.strafeInput ?? strafeInput;
    const liveJumping = liveInput?.isJumping ?? isJumping;
    const liveCrouching = liveInput?.isCrouching ?? isCrouching;
    const liveSpeed = liveInput?.moveSpeedFactor ?? moveSpeedFactor;

    if (useNativeMixer && activeAction.current) {
      const timeScale = isIdleLocomotion
        ? 0.42
        : Math.max(0.25, Math.min(2.5, liveSpeed));
      activeAction.current.setEffectiveTimeScale(timeScale);

      if (liveJumping || liveCrouching) {
        activeAction.current.paused = true;
      } else {
        activeAction.current.paused = false;
        if (!activeAction.current.isRunning()) {
          activeAction.current.play();
        }
      }

      if (url.includes('player.glb') && !mixerLogged.current) {
        mixerLogged.current = true;
        // #region agent log
        fetch('http://127.0.0.1:7494/ingest/f6ae2fc6-304a-4fe4-bc2e-1432ec00b765', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'efcfd8' }, body: JSON.stringify({ sessionId: 'efcfd8', runId: 'tpose-fix-v4', hypothesisId: 'H4', location: 'AnimatedModel.js:mixer', message: 'native mixer state', data: { clipName: resolvedClipName, isRunning: activeAction.current.isRunning(), paused: activeAction.current.paused, timeScale, actionName, useNativeMixer, isIdleLocomotion }, timestamp: Date.now() }) }).catch(() => { });
        // #endregion
      }
    }

    const skipFullProcedural =
      useNativeMixer && !liveJumping && !liveCrouching;

    const hasLocomotionInput =
      Math.abs(liveForward) > 0.01 || Math.abs(liveStrafe) > 0.01;
    const isWalking = isPrimaryWalking(actionName) || hasLocomotionInput;
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
      const left = isLeftSide(name);

      if (!origRot) {
        return;
      }

      if (!skipFullProcedural) {
        node.rotation.copy(origRot);
      } else if (skipFullProcedural) {
        if (liveStrafe !== 0 && isStrafeLeanPart(name)) {
          const rollAngle = -liveStrafe * 0.14;
          node.rotation.z += rollAngle;
        }
        return;
      }

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

      if (url.includes('player.glb')) {
        // #region agent log
        fetch('http://127.0.0.1:7494/ingest/f6ae2fc6-304a-4fe4-bc2e-1432ec00b765', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'efcfd8' }, body: JSON.stringify({ sessionId: 'efcfd8', runId: 'tpose-fix-v4', hypothesisId: 'H3', location: 'AnimatedModel.js:clip-resolve', message: 'player animation clip resolution', data: { actionName, clipName, nativeOk: locomotionClipReady, useNativeMixer, isIdleLocomotion, clipNames: names?.slice(0, 12) }, timestamp: Date.now() }) }).catch(() => { });
        // #endregion
      }

      if (
        !clipName ||
        !actions[clipName] ||
        !shouldUseNativeLocomotionClip(clipName) ||
        (!isPrimaryWalking(actionName) && !isPrimaryIdle(actionName))
      ) {
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

      nextAction.reset().setLoop(LoopRepeat, Infinity).fadeIn(0.2).play();

      if (activeAction.current) {
        activeAction.current.crossFadeTo(nextAction, 0.25, false);
      }

      activeAction.current = nextAction;

      return undefined;
    } catch (error) {
      return undefined;
    }
  }, [
    actionName,
    actions,
    fallbackActionName,
    names,
    url,
    locomotionClipReady,
    useNativeMixer,
    isIdleLocomotion,
  ]);

  return (
    <group ref={modelRef} position={position} rotation={rotation} scale={scale}>
      <primitive ref={rootRef} object={scene} />
    </group>
  );
}

useGLTF.preload('/player.glb');
useGLTF.preload('/companion.glb');
useGLTF.preload('/wild_creature.glb');
PILOT_POKE_MODELS.forEach((url) => useGLTF.preload(url));
