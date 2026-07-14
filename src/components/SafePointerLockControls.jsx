import { PointerLockControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

const RELOCK_COOLDOWN_MS = 850;
const POINTER_LOCK_COOLDOWN_ERROR =
  "Pointer lock cannot be acquired immediately after the user has exited the lock";

export default function SafePointerLockControls(props) {
  const controlsRef = useRef(null);
  const lastUnlockTimeRef = useRef(0);

  useEffect(() => {
    const controls = controlsRef.current;

    if (!controls) {
      return undefined;
    }

    const originalLock = controls.lock.bind(controls);
    const handleUnlock = () => {
      lastUnlockTimeRef.current = performance.now();
    };
    const handlePointerLockError = (event) => {
      const elapsedSinceUnlock = performance.now() - lastUnlockTimeRef.current;

      if (elapsedSinceUnlock < RELOCK_COOLDOWN_MS) {
        event.stopImmediatePropagation();
      }
    };
    const handleUnhandledRejection = (event) => {
      const message = String(event.reason?.message || event.reason || "");

      if (message.includes(POINTER_LOCK_COOLDOWN_ERROR)) {
        event.preventDefault();
      }
    };

    controls.lock = (...args) => {
      const elapsedSinceUnlock = performance.now() - lastUnlockTimeRef.current;
      const domElement = controls.domElement;

      if (
        document.pointerLockElement ||
        elapsedSinceUnlock < RELOCK_COOLDOWN_MS ||
        !domElement?.requestPointerLock
      ) {
        return Promise.resolve();
      }

      const originalRequestPointerLock =
        domElement.requestPointerLock.bind(domElement);

      domElement.requestPointerLock = (...requestArgs) => {
        const result = originalRequestPointerLock(...requestArgs);

        if (result && typeof result.catch === "function") {
          return result.catch(() => {});
        }

        return result;
      };

      try {
        originalLock(...args);
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      } finally {
        domElement.requestPointerLock = originalRequestPointerLock;
      }
    };

    controls.addEventListener("unlock", handleUnlock);
    document.addEventListener("pointerlockerror", handlePointerLockError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      controls.removeEventListener("unlock", handleUnlock);
      document.removeEventListener(
        "pointerlockerror",
        handlePointerLockError,
        true
      );
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      controls.lock = originalLock;
    };
  }, []);

  return <PointerLockControls ref={controlsRef} {...props} />;
}
