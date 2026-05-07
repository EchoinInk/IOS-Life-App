/**
 * Main onboarding screen - Orchestrates the entire onboarding flow
 * Handles step rendering and navigation
 */

import { useNavigate } from 'react-router-dom';
import { useOnboardingProgress, useOnboardingActions, useOnboardingData } from './store/useOnboardingStore';
import { OnboardingFlow } from './components/OnboardingFlow';
import { WelcomeStep } from './components/steps/WelcomeStep';
import { FocusStep } from './components/steps/FocusStep';
import { GoalsStep } from './components/steps/GoalsStep';
import { ModulesStep } from './components/steps/ModulesStep';
import { RhythmStep } from './components/steps/RhythmStep';
import { CompletionStep } from './components/steps/CompletionStep';

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const { currentStep, canProceed } = useOnboardingProgress();
  const { updateData, nextStep, previousStep } = useOnboardingActions();
  const data = useOnboardingData();

  const handleComplete = () => {
    // Navigate to home screen after onboarding completion
    navigate('/');
  };

  const stepProps = {
    data,
    updateData,
    onNext: nextStep,
    onBack: previousStep,
    canProceed
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep {...stepProps} />;
      case 1:
        return <FocusStep {...stepProps} />;
      case 2:
        return <GoalsStep {...stepProps} />;
      case 3:
        return <ModulesStep {...stepProps} />;
      case 4:
        return <RhythmStep {...stepProps} />;
      case 5:
        return <CompletionStep {...stepProps} />;
      default:
        return <WelcomeStep {...stepProps} />;
    }
  };

  return (
    <OnboardingFlow onComplete={handleComplete}>
      {renderCurrentStep()}
    </OnboardingFlow>
  );
};

export default OnboardingScreen;
