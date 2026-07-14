import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Vector3, Raycaster } from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import useKeyboardControls from '../hooks/useKeyboardControls';
import ThirdPersonCamera from '../systems/ThirdPersonCamera';

const MOVE_SPEED = 15.0; // Increased speed for the larger scale
const GRAVITY = 40.0;
const JUMP_FORCE = 18.0;
const PLAYER_HEIGHT = 4.5;
const MODEL_SCALE = 3.0;
const MODEL_FOOT_OFFSET_Y = -PLAYER_HEIGHT / 2;
const MODEL_URL = '/assets/shared/player.glb';

const StaticRegionPlayer = forwardRef(function StaticRegionPlayer({ spawnPosition = [0, 50, 0] }, ref) {
  const playerRef = useRef();
  const modelRef = useRef();
  const { scene, camera } = useThree();
  const keys = useKeyboardControls();
  const raycaster = useMemo(() => new Raycaster(), []);
  const downVector = new Vector3(0, -1, 0);
  
  const velocity = useRef(new Vector3());
  const isGrounded = useRef(false);
  const [isMoving, setIsMoving] = useState(false);
  
  const gltf = useGLTF(MODEL_URL);
  const gltfScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, modelRef);
  const activeAction = useRef(null);

  useImperativeHandle(ref, () => playerRef.current, []);

  // Set initial position
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(...spawnPosition);
    }
  }, [spawnPosition]);

  // Handle Animations
  useEffect(() => {
    const preferredNames = isMoving ? ['Walk', 'Run', 'Idle'] : ['Idle', 'Walk'];
    const clipName = preferredNames
      .map(p => names.find(n => n.toLowerCase() === p.toLowerCase()))
      .find(Boolean) || names[0];

    if (!clipName || !actions[clipName]) return;
    const nextAction = actions[clipName];
    if (activeAction.current === nextAction) return;

    nextAction.reset().fadeIn(0.2).play();
    if (activeAction.current) {
      activeAction.current.crossFadeTo(nextAction, 0.25, false);
    }
    activeAction.current = nextAction;
  }, [actions, isMoving, names]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;
    
    const player = playerRef.current;
    
    // Raycast down to find ground
    const origin = player.position.clone();
    origin.y += 2.0; // Cast from slightly above to allow stepping up
    raycaster.set(origin, downVector);
    
    // Gather all meshes in the scene except the player's own meshes
    const collidableObjects = [];
    scene.traverse((obj) => {
      if (obj.isMesh) {
        // Skip the player's own meshes to prevent self-collision
        let isPlayerMesh = false;
        let curr = obj;
        while (curr) {
          if (curr === player) {
            isPlayerMesh = true;
            break;
          }
          curr = curr.parent;
        }
        
        if (!isPlayerMesh) {
          collidableObjects.push(obj);
        }
      }
    });
    
    const intersects = raycaster.intersectObjects(collidableObjects, false);
    let groundY = -100;
    if (intersects.length > 0) {
      groundY = intersects[0].point.y;
    }

    // Apply Gravity
    if (player.position.y > groundY + 0.1) {
      velocity.current.y -= GRAVITY * delta;
      isGrounded.current = false;
    } else {
      // Snap to ground
      player.position.y = groundY;
      velocity.current.y = Math.max(0, velocity.current.y);
      isGrounded.current = true;
      
      // We don't have jump in useKeyboardControls natively if it doesn't support 'jump' key,
      // but let's just leave it if it does
      if (keys.current.jump) {
        velocity.current.y = JUMP_FORCE;
        isGrounded.current = false;
      }
    }
    
    // Movement
    const pressed = keys.current;
    const forwardInput = Number(pressed.forward) - Number(pressed.backward);
    const strafeInput = Number(pressed.right) - Number(pressed.left);
    
    const cameraForward = new Vector3();
    const cameraRight = new Vector3();
    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;
    if (cameraForward.lengthSq() < 0.0001) {
      cameraForward.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
    }
    cameraForward.normalize();
    
    const cameraYaw = Math.atan2(cameraForward.x, cameraForward.z);
    player.rotation.y = cameraYaw;

    cameraRight.set(cameraForward.z, 0, -cameraForward.x).normalize();

    const movement = new Vector3()
      .copy(cameraForward).multiplyScalar(forwardInput)
      .addScaledVector(cameraRight, strafeInput);
      
    if (movement.lengthSq() > 1) movement.normalize();

    if (movement.lengthSq() > 0.01) {
      setIsMoving(true);
      
      // Horizontal raycast to prevent walking into walls (simple version)
      const moveVec = movement.clone().multiplyScalar(MOVE_SPEED * delta);
      
      // Raycast slightly forward to check for walls
      const wallRaycaster = new Raycaster(
        new Vector3(player.position.x, player.position.y + 1.0, player.position.z),
        movement.clone().normalize(),
        0,
        1.0
      );
      
      const wallIntersects = wallRaycaster.intersectObjects(collidableObjects, false);
      if (wallIntersects.length === 0) {
         player.position.add(moveVec);
      }
      
    } else {
      setIsMoving(false);
    }
    
    // Apply vertical velocity
    player.position.y += velocity.current.y * delta;
    
    // Keep above absolute death plane
    if (player.position.y < -50) {
       player.position.set(spawnPosition[0], spawnPosition[1] + 10, spawnPosition[2]);
       velocity.current.set(0, 0, 0);
    }
  });

  return (
    <>
      <ThirdPersonCamera targetRef={playerRef} />
      <group ref={playerRef}>
        <mesh>
           <boxGeometry args={[PLAYER_HEIGHT * 0.5, PLAYER_HEIGHT * 0.5, PLAYER_HEIGHT * 0.5]} />
           <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <group ref={modelRef} position={[0, MODEL_FOOT_OFFSET_Y, 0]} scale={MODEL_SCALE}>
          <primitive object={gltfScene} />
        </group>
      </group>
    </>
  );
});

export default StaticRegionPlayer;

useGLTF.preload(MODEL_URL);
