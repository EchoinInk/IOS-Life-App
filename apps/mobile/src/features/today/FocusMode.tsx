import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Screen } from '../../primitives/Screen';
import { Stack } from '../../primitives/Stack';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { CalmButton } from '../../primitives/behavioral/CalmButton';
import { Surface } from '../../primitives/Surface';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';
import { Task } from '../../state/task-store';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useInterruptionSafeAnimation } from '../../motion/interruption-safe';
import { springPresets, getSpringPreset } from '../../motion/spring-presets';

export interface FocusModeProps {
  visible: boolean;
  tasks: Task[];
  energyMode: EnergyMode;
  onClose: () => void;
  onCompleteTask: (task: Task) => void;
  onSnoozeTask: (task: Task) => void;
}

export function FocusMode({
  visible,
  tasks,
  energyMode,
  onClose,
  onCompleteTask,
  onSnoozeTask,
}: FocusModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { triggerHaptic } = useHapticFeedback();
  
  const { value: opacity, animateTo: animateOpacity } = useInterruptionSafeAnimation(visible ? 1 : 0);
  const { value: scale, animateTo: animateScale } = useInterruptionSafeAnimation(visible ? 1 : 0.95);

  const activeTasks = tasks.filter((task) => !task.completed && task.status === 'today');
  const currentTask = activeTasks[currentIndex];

  useEffect(() => {
    if (visible) {
      triggerHaptic('focus', energyMode);
      animateOpacity(1, { springPreset: 'calm', energyMode });
      animateScale(1, { springPreset: 'calm', energyMode });
    } else if (isExiting) {
      animateOpacity(0, { springPreset: 'gentle', energyMode });
      animateScale(0.95, { springPreset: 'gentle', energyMode });
    }
  }, [visible, energyMode]);

  const handleComplete = () => {
    if (currentTask) {
      triggerHaptic('completion', energyMode);
      onCompleteTask(currentTask);
      
      // Move to next task or exit
      if (currentIndex < activeTasks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleExit();
      }
    }
  };

  const handleSnooze = () => {
    if (currentTask) {
      triggerHaptic('confirmation', energyMode);
      onSnoozeTask(currentTask);
      
      // Move to next task or exit
      if (currentIndex < activeTasks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleExit();
      }
    }
  };

  const handleExit = () => {
    setIsExiting(true);
    triggerHaptic('undo', energyMode);
    
    setTimeout(() => {
      setIsExiting(false);
      setCurrentIndex(0);
      onClose();
    }, 300);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      triggerHaptic('confirmation', energyMode);
    }
  };

  const handleSkip = () => {
    if (currentIndex < activeTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      triggerHaptic('confirmation', energyMode);
    }
  };

  if (!visible || !currentTask) {
    return null;
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      <Screen energyMode={energyMode} style={styles.screen}>
        <Stack spacing="xl" padding="lg" style={styles.content}>
          {/* Header with progress indicator */}
          <Row justify="space-between" align="center">
            <CalmButton
              title="Exit"
              onPress={handleExit}
              variant="secondary"
              energyMode={energyMode}
            />
            <Text variant="caption" color="secondary">
              {currentIndex + 1} / {activeTasks.length}
            </Text>
          </Row>

          {/* Task display */}
          <Stack spacing="lg" style={styles.taskContainer}>
            <Surface
              variant="elevated"
              shadow="md"
              radius="lg"
              padding="xl"
              energyMode={energyMode}
              style={styles.taskSurface}
            >
              <Text variant="heading" style={styles.taskTitle}>
                {currentTask.title}
              </Text>
              
              {currentTask.priority && (
                <Text variant="caption" color="secondary" style={styles.priorityLabel}>
                  Priority: {currentTask.priority}
                </Text>
              )}
            </Surface>

            {/* Calm focus prompt */}
            {energyMode !== 'overwhelmed' && (
              <Text variant="body" color="secondary" style={styles.prompt}>
                Take your time. There's no rush.
              </Text>
            )}
          </Stack>

          {/* Action buttons */}
          <Stack spacing="md" style={styles.actions}>
            {energyMode !== 'overwhelmed' && (
              <Row spacing="md" justify="center">
                {currentIndex > 0 && (
                  <CalmButton
                    title="Previous"
                    onPress={handlePrevious}
                    variant="secondary"
                    energyMode={energyMode}
                    style={styles.secondaryButton}
                  />
                )}
                {currentIndex < activeTasks.length - 1 && (
                  <CalmButton
                    title="Skip"
                    onPress={handleSkip}
                    variant="secondary"
                    energyMode={energyMode}
                    style={styles.secondaryButton}
                  />
                )}
              </Row>
            )}

            <Row spacing="md">
              <CalmButton
                title="Snooze"
                onPress={handleSnooze}
                variant="secondary"
                energyMode={energyMode}
                style={styles.actionButton}
              />
              <CalmButton
                title="Complete"
                onPress={handleComplete}
                energyMode={energyMode}
                style={styles.primaryButton}
              />
            </Row>
          </Stack>
        </Stack>
      </Screen>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: baseTokens.surface.background,
    zIndex: baseTokens.zIndex.modal + 10,
  },
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  taskContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 200,
  },
  taskSurface: {
    minHeight: 120,
    justifyContent: 'center',
  },
  taskTitle: {
    textAlign: 'center',
    marginBottom: baseTokens.spacing.md,
  },
  priorityLabel: {
    textAlign: 'center',
  },
  prompt: {
    textAlign: 'center',
    marginTop: baseTokens.spacing.lg,
  },
  actions: {
    paddingBottom: baseTokens.spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
});
