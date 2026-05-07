/**
 * Main onboarding flow container
 * Handles step navigation and progress
 */

import { ReactNode, useEffect } from 'react';
import { useOnboardingProgress, useOnboardingActions } from '../store/useOnboardingStore';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface OnboardingFlowProps {
  children: ReactNode;
  onComplete: () => void;
}

export const OnboardingFlow = ({ children, onComplete }: OnboardingFlowProps) => {
  const { currentStep, progress, canProceed, canGoBack, isCompleted } = useOnboardingProgress();
  const { nextStep, previousStep, completeOnboarding } = useOnboardingActions();

  useEffect(() => {
    if (isCompleted) {
      completeOnboarding();
      onComplete();
    }
  }, [isCompleted, completeOnboarding, onComplete]);

  const handleNext = () => {
    if (currentStep === 5) { // Last step
      completeOnboarding();
      onComplete();
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      previousStep();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress indicator */}
      <div className="w-full max-w-[430px] mx-auto px-4 pt-6 pb-4">
        <div className="space-y-3">
          <ProgressBar value={progress} />
          <div className="flex justify-between text-xs text-text-muted">
            <span>Step {currentStep + 1} of 6</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-[430px] mx-auto px-4 pb-6">
        {children}
      </div>

      {/* Navigation */}
      <div className="w-full max-w-[430px] mx-auto px-4 pb-[calc(80px+env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          {canGoBack && (
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1"
            disabled={!canProceed}
            onClick={handleNext}
          >
            {currentStep === 5 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
