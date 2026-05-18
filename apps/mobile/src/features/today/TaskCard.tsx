import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Task } from '../../state/task-store';
import { GestureTaskCard } from '../../primitives/behavioral/GestureTaskCard';
import { Surface } from '../../primitives/Surface';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

interface TaskCardProps {
  task: Task;
  energyMode: EnergyMode;
  onComplete: (task: Task) => void;
  onSnooze?: (task: Task) => void;
  onDefer?: (task: Task) => void;
  onReduceScope?: (task: Task) => void;
}

export function TaskCard({ task, energyMode, onComplete, onSnooze, onDefer, onReduceScope }: TaskCardProps) {
  const { triggerHaptic } = useHapticFeedback();

  const handleComplete = () => {
    triggerHaptic('completion');
    onComplete(task);
  };

  const handleSnooze = () => {
    triggerHaptic('confirmation');
    onSnooze?.(task);
  };

  const handleDefer = () => {
    triggerHaptic('confirmation');
    onDefer?.(task);
  };

  const handleReduceScope = () => {
    triggerHaptic('confirmation');
    onReduceScope?.(task);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return baseTokens.color.error;
      case 'medium': return baseTokens.color.warning;
      case 'low': return baseTokens.color.success;
      default: return baseTokens.color.border.subtle;
    }
  };

  return (
    <GestureTaskCard
      energyMode={energyMode}
      onComplete={handleComplete}
      onSnooze={handleSnooze}
      onDefer={handleDefer}
      onReduceScope={handleReduceScope}
    >
      <Surface
        variant={task.priority === 'high' ? 'elevated' : 'card'}
        shadow={task.priority === 'high' ? 'sm' : 'none'}
        radius="md"
        padding="lg"
        energyMode={energyMode}
      >
        <Row spacing="md" align="center">
          <View style={[styles.checkbox, { borderColor: getPriorityColor() }]} />
          <Text variant="body" style={styles.taskTitle}>
            {task.title}
          </Text>
        </Row>
      </Surface>
    </GestureTaskCard>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: baseTokens.radii.sm,
    borderWidth: 2,
  },
  taskTitle: {
    flex: 1,
  },
});
