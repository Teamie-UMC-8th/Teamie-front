import { useState } from 'react';

interface UseFunnelProps {
  maxSteps?: number;
}

export function useFunnel({ maxSteps = 3 }: UseFunnelProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<number, unknown>>({});

  const nextStep = () => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < maxSteps) {
      setCurrentStep(step);
    }
  };

  const setStepDataByIndex = (step: number, data: unknown) => {
    setStepData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const getStepData = (step: number) => {
    return stepData[step];
  };

  const reset = () => {
    setCurrentStep(0);
    setStepData({});
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    setStepDataByIndex,
    getStepData,
    reset,
    maxSteps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === maxSteps - 1,
  };
}
