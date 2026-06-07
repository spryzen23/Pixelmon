import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { getTerrainSurfaceY } from '../world';
import {
  MAX_PROJECTILE_DISTANCE,
  PROJECTILE_GRAVITY,
  PROJECTILE_LIFETIME,
  PROJECTILE_RADIUS,
  PROJECTILE_SPEED,
  PROJECTILE_UPWARD_BOOST,
} from '../game/projectilePhysics';

const BOUNCE_DAMPING = 0.48;
const MAX_BOUNCES = 2;
const HIT_RADIUS = 1.5;
const SHAKE_DURATION = 2;
const SHAKE_COUNT = 3;
const SHAKE_AMOUNT = 0.13;
const SUCCESS_CHANCE = 0.8;
const SUCCESS_BURST_DURATION = 0.45;
const ballWorldPos = new Vector3();
const creatureWorldPos = new Vector3();

export default function Projectile({
  ball,
  caveZone,
  currentBiome,
  id,
  initialPosition,
  direction,
  onCaptureFail,
  onCaptureStart,
  onCaptureSuccess,
  onExpire,
  registerRef,
  throwPower,
  wildRefs,
  wildStatusRef,
}) {
  const projectileRef = useRef();
  const age = useRef(0);
  const flightTime = useRef(0);
  const traveled = useRef(0);
  const bounces = useRef(0);
  const expired = useRef(false);
  const mode = useRef('flying');
  const capturedWildId = useRef(null);
  const baseShakePosition = useRef(new Vector3());
  const shakeTimer = useRef(0);
  const burstTimer = useRef(0);
  const resolved = useRef(false);
  const velocity = useMemo(() => {
    const lookDirection = new Vector3(...direction).normalize();
    const initialVelocity = lookDirection.multiplyScalar(
      throwPower || PROJECTILE_SPEED
    );
    initialVelocity.y += PROJECTILE_UPWARD_BOOST;

    return initialVelocity;
  }, [direction, throwPower]);

  useEffect(() => {
    registerRef(id, projectileRef.current);

    return () => registerRef(id, null);
  }, [id, registerRef]);

  const expire = () => {
    if (expired.current) {
      return;
    }

    expired.current = true;
    onExpire(id);
  };

  const startCapture = (wildId, wildWorldPosition) => {
    capturedWildId.current = wildId;
    mode.current = 'shaking';
    shakeTimer.current = 0;

    const groundY =
      getTerrainSurfaceY(
        wildWorldPosition.x,
        wildWorldPosition.z,
        currentBiome,
        caveZone
      ) +
      PROJECTILE_RADIUS;
    baseShakePosition.current.set(
      wildWorldPosition.x,
      groundY,
      wildWorldPosition.z
    );
    projectileRef.current.position.copy(baseShakePosition.current);
    onCaptureStart(wildId);
  };

  const checkWildCollision = () => {
    const projectile = projectileRef.current;

    wildRefs.current.forEach((wild, wildId) => {
      if (
        mode.current !== 'flying' ||
        wildStatusRef.current.get(wildId) !== 'active'
      ) {
        return;
      }

      projectile.getWorldPosition(ballWorldPos);
      wild.getWorldPosition(creatureWorldPos);

      if (ballWorldPos.distanceTo(creatureWorldPos) <= HIT_RADIUS) {
        startCapture(wildId, creatureWorldPos);
      }
    });
  };

  const updateFlying = (delta) => {
    const projectile = projectileRef.current;

    projectile.position.x += velocity.x * delta;
    projectile.position.z += velocity.z * delta;
    projectile.position.y +=
      (velocity.y - PROJECTILE_GRAVITY * flightTime.current) * delta;

    checkWildCollision();

    if (mode.current !== 'flying') {
      return;
    }

    const groundY =
      getTerrainSurfaceY(
        projectile.position.x,
        projectile.position.z,
        currentBiome,
        caveZone
      ) +
      PROJECTILE_RADIUS;

    const currentVerticalVelocity =
      velocity.y - PROJECTILE_GRAVITY * flightTime.current;

    if (projectile.position.y <= groundY && currentVerticalVelocity < 0) {
      projectile.position.y = groundY;

      if (bounces.current < MAX_BOUNCES) {
        velocity.y = Math.abs(currentVerticalVelocity) * BOUNCE_DAMPING;
        flightTime.current = 0;
        bounces.current += 1;
      } else {
        expire();
        return;
      }
    }

    const step = velocity.length() * delta;
    age.current += delta;
    flightTime.current += delta;
    traveled.current += step;

    if (
      age.current >= PROJECTILE_LIFETIME ||
      traveled.current >= MAX_PROJECTILE_DISTANCE
    ) {
      expire();
    }
  };

  const updateShaking = (delta) => {
    const projectile = projectileRef.current;
    shakeTimer.current += delta;

    const progress = Math.min(shakeTimer.current / SHAKE_DURATION, 1);
    const shake = Math.sin(progress * SHAKE_COUNT * Math.PI * 2) * SHAKE_AMOUNT;

    projectile.position.copy(baseShakePosition.current);
    projectile.position.x += shake;
    projectile.rotation.z = shake * 3;

    if (progress < 1 || resolved.current) {
      return;
    }

    resolved.current = true;

    if (Math.random() <= (ball?.captureChance ?? SUCCESS_CHANCE)) {
      mode.current = 'successBurst';
      burstTimer.current = 0;
      projectile.rotation.z = 0;
      projectile.position.copy(baseShakePosition.current);
      return;
    }

    onCaptureFail(capturedWildId.current);
    expire();
  };

  const updateSuccessBurst = (delta) => {
    const projectile = projectileRef.current;
    burstTimer.current += delta;

    const progress = Math.min(burstTimer.current / SUCCESS_BURST_DURATION, 1);
    projectile.scale.setScalar(1 + progress * 0.9);

    if (progress >= 1) {
      onCaptureSuccess(capturedWildId.current, [
        baseShakePosition.current.x,
        baseShakePosition.current.y,
        baseShakePosition.current.z,
      ]);
      expire();
    }
  };

  useFrame((_, delta) => {
    if (!projectileRef.current || expired.current) {
      return;
    }

    if (mode.current === 'flying') {
      updateFlying(delta);
      return;
    }

    if (mode.current === 'shaking') {
      updateShaking(delta);
      return;
    }

    if (mode.current === 'successBurst') {
      updateSuccessBurst(delta);
    }
  });

  return (
    <Sphere
      ref={projectileRef}
      args={[PROJECTILE_RADIUS, 16, 16]}
      castShadow
      position={initialPosition}
    >
      <meshStandardMaterial color={ball?.color || '#e61f2c'} roughness={0.42} />
    </Sphere>
  );
}
