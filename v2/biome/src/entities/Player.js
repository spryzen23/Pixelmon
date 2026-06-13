import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { MathUtils, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import useKeyboardControls from '../hooks/useKeyboardControls';
import {
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  PLAYER_START,
  VOXEL_SIZE,
  WATER_LEVEL,
  getBiomeBoundary,
  getEntityY,
  getTerrainSurfaceY,
  isLegendaryCollision,
  isWaterTile,
  isWalkablePosition,
} from '../world';

const MOVE_SPEED = 4.5;
const WATER_MOVE_MULTIPLIER = 0.72;
const WATER_BUOYANCY_SPEED = 5.5;
const HEIGHT_LERP_FACTOR = 0.18;
const STEP_SAFETY_OFFSET = 0.05;
const MODEL_SCALE = 1.1;
const MODEL_FOOT_OFFSET_Y = -PLAYER_HEIGHT / 2;
const MODEL_URL = '/assets/shared/player.glb';
const movement = new Vector3();
const cameraForward = new Vector3();
const cameraRight = new Vector3();

const Player = forwardRef(function Player(
  {
    currentPathId = 0,
    caveZone,
    modelRotation = [0, 0, 0],
    spawnPosition = PLAYER_START,
  },
  ref
) {
  const playerRef = useRef();
  const modelRef = useRef();
  const movingRef = useRef(false);
  const activeAction = useRef(null);
  const previousY = useRef(PLAYER_START[1]);
  const [isMoving, setIsMoving] = useState(false);
  const keys = useKeyboardControls();
  const gltf = useGLTF(MODEL_URL);
  const gltfScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, modelRef);

  useImperativeHandle(ref, () => playerRef.current, []);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.position.set(
      spawnPosition[0],
      spawnPosition[1],
      spawnPosition[2]
    );
    previousY.current = spawnPosition[1];
  }, [spawnPosition]);

  useEffect(() => {
    gltfScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [gltfScene]);

  useEffect(() => {
    const preferredNames = isMoving
      ? ['Walk', 'Run', 'Idle']
      : ['Idle', 'Walk'];
    const clipName =
      preferredNames
        .map((preferredName) =>
          names.find((name) => name.toLowerCase() === preferredName.toLowerCase())
        )
        .find(Boolean) || names[0];

    if (!clipName || !actions[clipName]) {
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
  }, [actions, isMoving, names]);

  useFrame(({ camera }, delta) => {
    if (!playerRef.current) {
      return;
    }

    const surfaceY = getTerrainSurfaceY(
      playerRef.current.position.x,
      playerRef.current.position.z,
      currentPathId,
      caveZone
    );
    const isInWater = isWaterTile(
      playerRef.current.position.x,
      playerRef.current.position.z,
      currentPathId,
      caveZone
    );
    const isSubmerged = playerRef.current.position.y < WATER_LEVEL;
    const targetY = getEntityY(
      playerRef.current.position.x,
      playerRef.current.position.z,
      PLAYER_HEIGHT,
      previousY.current,
      currentPathId,
      caveZone
    );

    if (isInWater || isSubmerged || surfaceY <= WATER_LEVEL) {
      const buoyantY = WATER_LEVEL + PLAYER_HEIGHT / 2;
      playerRef.current.position.y = MathUtils.lerp(
        playerRef.current.position.y,
        Math.max(targetY, buoyantY),
        Math.min(1, WATER_BUOYANCY_SPEED * delta)
      );
    } else {
      playerRef.current.position.y = MathUtils.lerp(
        playerRef.current.position.y,
        targetY,
        HEIGHT_LERP_FACTOR
      );
    }

    previousY.current = targetY;

    const player = playerRef.current;
    const biomeBoundary = getBiomeBoundary(currentPathId);
    player.position.x = MathUtils.clamp(
      player.position.x,
      -biomeBoundary,
      biomeBoundary
    );
    player.position.z = MathUtils.clamp(
      player.position.z,
      -biomeBoundary,
      biomeBoundary
    );

    const pressed = keys.current;
    const forwardInput = Number(pressed.forward) - Number(pressed.backward);
    const strafeInput = Number(pressed.right) - Number(pressed.left);

    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;

    if (cameraForward.lengthSq() < 0.0001) {
      cameraForward.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
    }

    cameraForward.normalize();
    const cameraYaw = Math.atan2(cameraForward.x, cameraForward.z);
    player.rotation.y = cameraYaw;

    if (forwardInput === 0 && strafeInput === 0) {
      if (movingRef.current) {
        movingRef.current = false;
        setIsMoving(false);
      }
      return;
    }

    if (!movingRef.current) {
      movingRef.current = true;
      setIsMoving(true);
    }

    cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
    cameraRight.y = 0;

    if (cameraRight.lengthSq() < 0.0001) {
      cameraRight.set(cameraForward.z, 0, -cameraForward.x);
    }

    cameraRight.normalize();

    movement
      .copy(cameraForward)
      .multiplyScalar(forwardInput)
      .addScaledVector(cameraRight, strafeInput);

    if (movement.lengthSq() > 1) {
      movement.normalize();
    }

    movement.multiplyScalar(
      MOVE_SPEED * (isInWater || isSubmerged ? WATER_MOVE_MULTIPLIER : 1) * delta
    );

    const nextX = MathUtils.clamp(
      player.position.x + movement.x,
      -biomeBoundary,
      biomeBoundary
    );
    const nextZ = MathUtils.clamp(
      player.position.z + movement.z,
      -biomeBoundary,
      biomeBoundary
    );

    const currentGroundHeight = getTerrainSurfaceY(
      player.position.x,
      player.position.z,
      currentPathId,
      caveZone
    );
    const nextGroundHeight = getTerrainSurfaceY(
      nextX,
      nextZ,
      currentPathId,
      caveZone
    );
    const stepDelta = nextGroundHeight - currentGroundHeight;
    const stepLimit = currentPathId === 2
      ? VOXEL_SIZE * 1.75
      : VOXEL_SIZE;
    const canStepUp = stepDelta <= stepLimit + STEP_SAFETY_OFFSET;
    const canEscapeWater =
      (isInWater || isSubmerged) &&
      nextGroundHeight <= currentGroundHeight + VOXEL_SIZE * 1.5 &&
      !isLegendaryCollision(nextX, nextZ, PLAYER_RADIUS, currentPathId);

    if (
      canStepUp &&
      (isWalkablePosition(nextX, nextZ, PLAYER_RADIUS, currentPathId, caveZone) ||
        canEscapeWater)
    ) {
      player.position.x = nextX;
      player.position.z = nextZ;
    }

    const nextTargetY = getEntityY(
      player.position.x,
      player.position.z,
      PLAYER_HEIGHT,
      previousY.current,
      currentPathId,
      caveZone
    );
    if (isWaterTile(player.position.x, player.position.z, currentPathId, caveZone)) {
      player.position.y = MathUtils.lerp(
        player.position.y,
        Math.max(nextTargetY, WATER_LEVEL + PLAYER_HEIGHT / 2 + VOXEL_SIZE),
        Math.min(1, WATER_BUOYANCY_SPEED * delta)
      );
    } else {
      player.position.y = MathUtils.lerp(
        player.position.y,
        nextTargetY,
        HEIGHT_LERP_FACTOR
      );
    }

    previousY.current = nextTargetY;
  });

  return (
    <group
      ref={playerRef}
      position={spawnPosition}
    >
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>

      <group
        ref={modelRef}
        position={[0, MODEL_FOOT_OFFSET_Y, 0]}
        scale={MODEL_SCALE}
      >
        <group rotation={modelRotation}>
          <primitive object={gltfScene} />
        </group>
      </group>
    </group>
  );
});

export default Player;

useGLTF.preload(MODEL_URL);
