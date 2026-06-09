import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { Box3, LoopRepeat, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useFrame } from '@react-three/fiber';
import {
  isLeftSide,
  isPrimaryCrouching,
  isPrimaryIdle,
  isPrimaryJumping,
  isPrimaryWalking,
  isStrafeLeanPart,
  matchesCategory,
  resolveAnimationClip,
  shouldUseNativeAnimationClip,
} from '../game/animationUtils';
import { getTypeAnimProfileForTypes } from '../game/typeAnims';

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
  animProfile = null,
  primaryType = 'normal',
  fitToHeight = null,
}) {
  const modelRef = useRef();
  const rootRef = useRef();
  const gltf = useGLTF(url);
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, rootRef);
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

  const profile = animProfile || getTypeAnimProfileForTypes([primaryType]);
  const isFloatingLoco = profile?.locomotion === 'float' || profile?.locomotion === 'aerial';
  const procWeights = profile?.procedural || {};
  const swingTime = useRef(0);
  const resolvedClipName = resolveAnimationClip(names, actionName, fallbackActionName);
  const isNativeJumpAction = isPrimaryJumping(actionName);
  const isNativeCrouchAction = isPrimaryCrouching(actionName);
  const wantsNativeAction =
    isPrimaryWalking(actionName) ||
    isPrimaryIdle(actionName) ||
    isNativeJumpAction ||
    isNativeCrouchAction;
  const locomotionClipReady = Boolean(
    resolvedClipName &&
    actions[resolvedClipName] &&
    shouldUseNativeAnimationClip(resolvedClipName)
  );
  const useNativeMixer = locomotionClipReady && wantsNativeAction;
  const isIdleLocomotion =
    useNativeMixer &&
    isPrimaryIdle(actionName) &&
    !isPrimaryWalking(actionName);
  const fitTransform = useMemo(() => {
    const baseScale = Array.isArray(scale) ? scale : [scale, scale, scale];

    if (!fitToHeight) {
      return {
        offset: [0, 0, 0],
        scale: baseScale,
      };
    }

    // Force update matrix world of the cloned hierarchy to ensure correct bounds calculation
    scene.updateMatrixWorld(true);

    const box = new Box3().setFromObject(scene);

    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    const fitScale = size.y > 0 ? fitToHeight / size.y : 1;

    return {
      offset: [-center.x, -box.min.y + (isFloatingLoco ? 0.25 : 0), -center.z],
      scale: baseScale.map((value) => value * fitScale),
    };
  }, [fitToHeight, scale, scene, isFloatingLoco]);

  useFrame((state, delta) => {
    const liveInput = inputRef?.current;
    const liveForward = liveInput?.forwardInput ?? forwardInput;
    const liveStrafe = liveInput?.strafeInput ?? strafeInput;
    const liveJumping = liveInput?.isJumping ?? isJumping;
    const liveCrouching = liveInput?.isCrouching ?? isCrouching;
    const liveSpeed = liveInput?.moveSpeedFactor ?? moveSpeedFactor;
    const liveLookAngle = liveInput?.lookAngle ?? 0;
    const liveLookPitch = liveInput?.lookPitch ?? 0;
    const liveVy = liveInput?.vy ?? 0;

    if (useNativeMixer && activeAction.current) {
      const timeScale = isIdleLocomotion
        ? 0.42
        : Math.max(0.25, Math.min(2.5, liveSpeed));
      activeAction.current.setEffectiveTimeScale(timeScale);

      if (
        (liveJumping && !isNativeJumpAction) ||
        (liveCrouching && !isNativeCrouchAction)
      ) {
        activeAction.current.paused = true;
      } else {
        activeAction.current.paused = false;
        if (!activeAction.current.isRunning()) {
          activeAction.current.play();
        }
      }
    }

    const skipFullProcedural =
      useNativeMixer &&
      (!liveCrouching || isNativeCrouchAction) &&
      (!liveJumping || isNativeJumpAction);

    const hasLocomotionInput =
      Math.abs(liveForward) > 0.01 || Math.abs(liveStrafe) > 0.01;
    const isWalking = isPrimaryWalking(actionName) || hasLocomotionInput;
    const speed = Math.max(0.25, Math.min(2.5, liveSpeed));
    // Speed increases swing rate; crouch reduces swing rate
    const swingRate = (10 + 8 * speed) * (liveCrouching ? 0.62 : 1);

    if (!skipFullProcedural) {
      if (isWalking && !liveJumping) {
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

    const isSprinting = speed > 1.2;
    // Exaggerate stride and knee swing when running procedurally
    const stride = Math.sin(swingTime.current) * (isSprinting ? 0.88 : 0.62);
    const knee = Math.sin(swingTime.current + 0.35) * (isSprinting ? 0.45 : 0.28);
    const idleSway = Math.sin(idleTime.current * 1.6) * 0.018;
    const idleWeightShift = Math.sin(idleTime.current * 1.1) * 0.012;
    const group = modelRef.current;

    if (group) {
      const bob =
        isWalking && !liveJumping && !liveCrouching
          ? Math.abs(Math.sin(swingTime.current)) * (isSprinting ? 0.055 : 0.035)
          : isFloatingLoco
            ? Math.sin(idleTime.current * 1.8) * 0.07
            : Math.sin(idleTime.current * 1.4) * 0.01;
      const jumpLift = liveJumping ? 0.08 : 0;
      const crouchSink = liveCrouching ? -0.05 : 0;
      const forwardLean = isWalking
        ? Math.max(-1, Math.min(1, liveForward)) * (isSprinting ? -0.095 : -0.045)
        : 0;
      const strafeLean = Math.max(-1, Math.min(1, liveStrafe)) * -0.08;
      const crouchScaleY = liveCrouching ? 0.82 : 1;

      group.position.set(
        position[0],
        position[1] + bob + jumpLift + crouchSink,
        position[2]
      );
      group.rotation.set(
        rotation[0] + forwardLean,
        rotation[1],
        rotation[2] + strafeLean
      );
      group.scale.set(
        fitTransform.scale[0],
        fitTransform.scale[1] * crouchScaleY,
        fitTransform.scale[2]
      );
    }

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
        // Let the head track camera direction even when playing native clips
        if (matchesCategory(name, 'head') || lower.includes('head')) {
          node.rotation.y = origRot.y + Math.max(-0.85, Math.min(0.85, liveLookAngle));
          node.rotation.x = origRot.x - Math.max(-0.45, Math.min(0.45, liveLookPitch));
        }
        return;
      }

      const isSerpent = profile?.locomotion === 'serpent';
      const legSign = left ? 1 : -1;
      const armSign = left ? -1 : 1;

      if (isSerpent) {
        // Procedural serpent movement
        const lowerName = name.toLowerCase();
        const isSpineJoint = lowerName.includes('spine');
        const isTailJoint = lowerName.includes('tail');

        if (isSpineJoint || isTailJoint) {
          // Extract joint index from name if present (e.g. Spine3 -> 3, Tail2 -> 2)
          const match = name.match(/\d+/);
          const jointIdx = match ? parseInt(match[0], 10) : 1;

          if (isWalking) {
            // Slithering wave animation: sine wave propagation along the body
            const phaseShift = jointIdx * 0.45;
            const wave = Math.sin(swingTime.current * 1.5 - phaseShift) * 0.28;
            node.rotation.y = origRot.y + wave;
          } else {
            // Idle coiling animation: bend the spine/tail to rest flatly/coiled on the ground
            // Gently coil the body using a progressive bias
            const coilVal = Math.sin(idleTime.current * 1.1 + jointIdx * 0.35) * 0.05;
            const staticCoil = 0.18; // Constant bending to form a curled shape
            node.rotation.y = origRot.y + staticCoil + coilVal;
            // Ensure the body stays flat/level on the ground
            node.rotation.x = origRot.x;
            node.rotation.z = origRot.z;
          }
          return;
        }
      }

      if (liveCrouching) {
        // Crouch movement animation! Creep procedurally if moving, otherwise stay static crouch.
        const crouchStride = isWalking ? Math.sin(swingTime.current) * 0.22 : 0;
        const crouchKnee = isWalking ? Math.sin(swingTime.current + 0.35) * 0.12 : 0;
        const legSwing = matchesCategory(name, 'upperLeg') ? crouchStride * legSign : crouchKnee * legSign;

        if (matchesCategory(name, 'upperLeg') || matchesCategory(name, 'lowerLeg')) {
          node.rotation.x = origRot.x - 0.65 + legSwing;
          node.rotation.z = origRot.z + (left ? 0.14 : -0.14);
        } else if (matchesCategory(name, 'foot')) {
          node.rotation.x = origRot.x + 0.42 - (isWalking ? crouchStride * legSign * 0.1 : 0);
        } else if (matchesCategory(name, 'spine')) {
          node.rotation.x = origRot.x - 0.28 + (isWalking ? Math.sin(swingTime.current * 2) * 0.02 : 0);
        } else if (matchesCategory(name, 'head')) {
          node.rotation.x = origRot.x + 0.16 + (isWalking ? Math.sin(swingTime.current * 2) * 0.03 : 0);
          node.rotation.y = origRot.y + Math.max(-0.85, Math.min(0.85, liveLookAngle));
          node.rotation.x -= Math.max(-0.45, Math.min(0.45, liveLookPitch));
        } else if (
          matchesCategory(name, 'upperArm') ||
          matchesCategory(name, 'lowerArm') ||
          matchesCategory(name, 'hand') ||
          matchesCategory(name, 'vine')
        ) {
          const armSwing = isWalking ? Math.sin(swingTime.current) * 0.15 * armSign : 0;
          node.rotation.x = origRot.x - 0.22 + armSwing;
        } else if (lower.includes('leg') || lower.includes('shoe')) {
          node.rotation.x = origRot.x - 0.42 + crouchStride * legSign;
          node.rotation.z = origRot.z + (left ? 0.08 : -0.08);
        } else if (
          lower.includes('torso') ||
          lower.includes('coat_back') ||
          lower.includes('shirt') ||
          lower.includes('vest')
        ) {
          node.rotation.x = origRot.x - 0.15 + (isWalking ? Math.sin(swingTime.current * 2) * 0.02 : 0);
        } else if (lower.includes('arm') || lower.includes('hand') || lower.includes('sleeve')) {
          const armSwing = isWalking ? Math.sin(swingTime.current) * 0.12 * armSign : 0;
          node.rotation.x = origRot.x - 0.2 + armSwing;
        }
      } else if (liveJumping) {
        // Dynamic procedural jump adjustments based on vertical velocity
        const riseFactor = Math.max(0, liveVy / 5.2);
        const fallFactor = Math.max(0, -liveVy / 8.0);
        const hipFlex = -0.5 - (riseFactor * 0.4) + (fallFactor * 0.25);
        const kneeFlex = -0.4 - (riseFactor * 0.5) + (fallFactor * 0.35);
        const footFlex = 0.35 + (riseFactor * 0.2) - (fallFactor * 0.25);

        if (matchesCategory(name, 'upperLeg') || matchesCategory(name, 'lowerLeg')) {
          node.rotation.x = origRot.x + (matchesCategory(name, 'upperLeg') ? hipFlex : kneeFlex);
        } else if (matchesCategory(name, 'foot')) {
          node.rotation.x = origRot.x + footFlex;
        } else if (
          matchesCategory(name, 'upperArm') ||
          matchesCategory(name, 'lowerArm') ||
          matchesCategory(name, 'hand') ||
          matchesCategory(name, 'vine')
        ) {
          const armRise = riseFactor * -0.65 - fallFactor * 0.25;
          node.rotation.x = origRot.x - 0.45 + armRise;
          node.rotation.z = origRot.z + (left ? 0.35 : -0.35);
        } else if (matchesCategory(name, 'spine')) {
          node.rotation.x = origRot.x - 0.12 - (riseFactor * 0.1) + (fallFactor * 0.05);
        } else if (matchesCategory(name, 'head')) {
          node.rotation.x = origRot.x + 0.1 - (fallFactor * 0.1);
          node.rotation.y = origRot.y + Math.max(-0.85, Math.min(0.85, liveLookAngle));
          node.rotation.x -= Math.max(-0.45, Math.min(0.45, liveLookPitch));
        } else if (lower.includes('leg')) {
          node.rotation.x = origRot.x + hipFlex;
        } else if (lower.includes('shoe')) {
          node.rotation.x = origRot.x + footFlex;
        } else if (lower.includes('arm') || lower.includes('hand') || lower.includes('sleeve')) {
          node.rotation.x = origRot.x - 0.65 + (riseFactor * -0.5);
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
          // Sprinting arms swing wider and lean forward more
          const armAngle = isSprinting ? stride * 1.15 * armSign - 0.3 : stride * 0.65 * armSign;
          node.rotation.x = origRot.x + armAngle;
        } else if (matchesCategory(name, 'lowerArm') || matchesCategory(name, 'hand')) {
          const lowerArmAngle = isSprinting ? stride * 0.75 * armSign : stride * 0.42 * armSign;
          node.rotation.x = origRot.x + lowerArmAngle;
        } else if (matchesCategory(name, 'wing') && (procWeights.wing || 0) > 0) {
          const w = procWeights.wing || 0.5;
          node.rotation.x = origRot.x + Math.sin(swingTime.current * 1.4) * 0.35 * w;
          node.rotation.z = origRot.z + Math.cos(swingTime.current * 1.2) * 0.2 * w * (left ? 1 : -1);
        } else if (matchesCategory(name, 'fin') && (procWeights.fin || 0) > 0) {
          const w = procWeights.fin || 0.4;
          node.rotation.y = origRot.y + Math.sin(swingTime.current) * 0.25 * w;
        } else if (matchesCategory(name, 'antenna') && (procWeights.antenna || 0) > 0) {
          const w = procWeights.antenna || 0.4;
          node.rotation.x = origRot.x + Math.sin(swingTime.current * 2) * 0.15 * w;
        } else if (matchesCategory(name, 'tail')) {
          const tailW = procWeights.tail || 0.3;
          node.rotation.z = origRot.z + Math.sin(swingTime.current * 0.7) * 0.12 * tailW;
          node.rotation.y = origRot.y + Math.sin(swingTime.current * 0.5) * 0.06 * tailW;
        } else if (matchesCategory(name, 'head')) {
          node.rotation.x =
            origRot.x + Math.sin(swingTime.current * 2) * 0.05;
          node.rotation.y = origRot.y + Math.max(-0.85, Math.min(0.85, liveLookAngle));
          node.rotation.x -= Math.max(-0.45, Math.min(0.45, liveLookPitch));
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
          node.rotation.y = origRot.y + Math.max(-0.85, Math.min(0.85, liveLookAngle));
          node.rotation.x -= Math.max(-0.45, Math.min(0.45, liveLookPitch));
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
        if (matchesCategory(name, 'float') && (procWeights.float || 0) > 0) {
          const w = procWeights.float || 0.5;
          node.rotation.y = origRot.y + Math.sin(idleTime.current * 1.3) * 0.08 * w;
        } else if (matchesCategory(name, 'spine') || matchesCategory(name, 'head')) {
          node.rotation.x = origRot.x + idleSway;
          node.rotation.z = origRot.z + idleWeightShift;
          if (matchesCategory(name, 'head')) {
            node.rotation.y = origRot.y + Math.max(-0.85, Math.min(0.85, liveLookAngle));
            node.rotation.x -= Math.max(-0.45, Math.min(0.45, liveLookPitch));
          }
        } else if (matchesCategory(name, 'tail')) {
          const tailW = procWeights.tail || 0.3;
          node.rotation.z = origRot.z + idleSway * 0.6 * tailW;
          node.rotation.y = origRot.y + Math.sin(idleTime.current * 0.8) * 0.08 * tailW;
        } else if (matchesCategory(name, 'wing') && (procWeights.wing || 0) > 0) {
          const w = procWeights.wing || 0.5;
          const idleFlap = Math.sin(idleTime.current * 1.8) * 0.12 * w;
          node.rotation.z = origRot.z + idleFlap * (left ? 1 : -1);
        } else if (matchesCategory(name, 'vine') && (procWeights.vine || 0) > 0) {
          const w = procWeights.vine || 0.5;
          node.rotation.x = origRot.x + Math.sin(idleTime.current * 1.2) * 0.08 * w;
          node.rotation.z = origRot.z + Math.cos(idleTime.current * 1.0) * 0.04 * w * (left ? 1 : -1);
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

      if (
        !clipName ||
        !actions[clipName] ||
        !shouldUseNativeAnimationClip(clipName) ||
        (!isPrimaryWalking(actionName) &&
          !isPrimaryIdle(actionName) &&
          !isPrimaryJumping(actionName) &&
          !isPrimaryCrouching(actionName))
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

      // #region agent log
      fetch('http://127.0.0.1:7494/ingest/f6ae2fc6-304a-4fe4-bc2e-1432ec00b765', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4125de' },
        body: JSON.stringify({
          sessionId: '4125de',
          runId: 'anim-verify',
          hypothesisId: 'H2',
          location: 'AnimatedModel.jsx:clipSwitch',
          message: 'native clip activated',
          data: { actionName, clipName, availableClips: names.slice(0, 8) },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion

      return undefined;
    } catch {
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
    isNativeJumpAction,
  ]);

  return (
    <group
      ref={modelRef}
      position={position}
      rotation={rotation}
      scale={fitTransform.scale}
    >
      <primitive ref={rootRef} object={scene} position={fitTransform.offset} />
    </group>
  );
}

useGLTF.preload('/assets/player.glb');
useGLTF.preload('/assets/companion.glb');
useGLTF.preload('/assets/wild_creature.glb');
