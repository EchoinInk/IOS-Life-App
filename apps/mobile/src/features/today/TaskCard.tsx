import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Task } from '../../state/task-store';
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
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleComplete = () => {
    triggerHaptic('completion');
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        onComplete(task);
      });
    });
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

  const getPriorityDotColor = () => {
    switch (task.priority) {
      case 'high': return baseTokens.color.error;
      case 'medium': return baseTokens.color.warning;
      case 'low': return baseTokens.color.success;
      default: return baseTokens.color.border.subtle;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handleComplete}
        onLongPress={handleDefer}
        activeOpacity={energyMode === 'overwhelmed' ? 1 : 0.9}
      >
        <Surface
          variant={task.priority === 'high' ? 'elevated' : 'card'}
          shadow={task.priority === 'high' ? 'sm' : 'none'}
          radius="lg"
          padding="xl"
          energyMode={energyMode}
          style={styles.surface}
        >
          <Row spacing="lg" align="center">
            <View style={[styles.checkbox, { borderColor: getPriorityColor() }]}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityDotColor() }]} />
            </View>
            <Text variant="body" style={styles.taskTitle}>
              {task.title}
            </Text>
          </Row>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  surface: {
    minHeight: baseTokens.touchTarget.comfortable,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: baseTokens.radii.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskTitle: {
    flex: 1,
    lineHeight: baseTokens.typography.body.lineHeight,
  },
});
