import { useCallback, useState } from 'react';

export function useWizard(totalSteps = 4) {
  const [step, setStep] = useState(1);

  const next = useCallback(() => {
    setStep((s) => Math.min(totalSteps, s + 1));
  }, [totalSteps]);

  const back = useCallback(() => {
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const goTo = useCallback(
    (n) => {
      setStep(Math.max(1, Math.min(totalSteps, n)));
    },
    [totalSteps]
  );

  const reset = useCallback(() => setStep(1), []);

  return {
    step,
    totalSteps,
    isFirst: step === 1,
    isLast: step === totalSteps,
    next,
    back,
    goTo,
    reset,
  };
}
