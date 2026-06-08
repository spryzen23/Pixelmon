export function WizardStepper({ currentStep, totalSteps, labels }) {
  return (
    <div>
      <p className="px-wizard-label">
        Step {currentStep} of {totalSteps}
        {labels?.[currentStep - 1] ? ` — ${labels[currentStep - 1]}` : ''}
      </p>
      <div className="px-wizard-stepper" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`px-wizard-step ${i + 1 < currentStep ? 'done' : ''} ${i + 1 === currentStep ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
