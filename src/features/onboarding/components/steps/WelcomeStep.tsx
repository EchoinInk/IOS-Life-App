/**
 * Welcome step - First screen of onboarding
 * Collects user name and provides introduction
 */

import { useState } from 'react';
import { OnboardingStepProps } from '../../types/onboarding.types';
import { Heading, Body, Caption, Label } from '@/components/ui/Text';
import { Surface } from '@/components/ui/Surface';

export const WelcomeStep = ({ data, updateData, onNext }: OnboardingStepProps) => {
  const [name, setName] = useState(data.userName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({ userName: name.trim() });
    onNext();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    updateData({ userName: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <Heading className="text-center">
          Welcome to Lumo
        </Heading>
        <Body className="text-center text-text-secondary">
          Your personal companion for building better habits and achieving your goals. Let's get you set up in under 90 seconds.
        </Body>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Surface className="p-4 space-y-3">
          <Label className="text-text-primary">
            What should we call you?
          </Label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            autoFocus
          />
          {name.trim() && (
            <Caption className="text-text-muted">
              Nice to meet you, {name.trim()}! 👋
            </Caption>
          )}
        </Surface>

        <div className="space-y-3">
          <Body className="text-text-secondary">
            We'll personalize your experience based on your goals and preferences.
          </Body>
          <div className="flex items-center gap-2 text-text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <Caption>Your data stays private and secure</Caption>
          </div>
        </div>
      </form>
    </div>
  );
};
