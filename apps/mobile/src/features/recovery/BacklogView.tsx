import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from '../../primitives/Stack';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { Surface } from '../../primitives/Surface';
import { HapticPressable } from '../../primitives/behavioral/HapticPressable';
import { useTaskStore, Task, TaskPriority } from '../../state/task-store';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';

export interface BacklogViewProps {
  energyMode?: EnergyMode;
  onTaskSelect?: (task: Task) => void;
  maxTasks?: number;
}

export function BacklogView({ energyMode = 'normal', onTaskSelect, maxTasks }: BacklogViewProps) {
  const { tasks } = useTaskStore();
  
  const backlogTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = priorityOrder[a.priority || 'low'];
      const bPriority = priorityOrder[b.priority || 'low'];
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // Then by due date
      if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Finally by creation date
      return a.createdAt - b.createdAt;
    });

  const visibleTasks = maxTasks ? backlogTasks.slice(0, maxTasks) : backlogTasks;

  const getPriorityColor = (priority?: TaskPriority) => {
    switch (priority) {
      case 'high': return baseTokens.color.error;
      case 'medium': return baseTokens.color.warning;
      case 'low': return baseTokens.color.success;
      default: return baseTokens.color.border.subtle;
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Stack spacing="sm">
        {visibleTasks.map((task, index) => (
          <HapticPressable
            key={task.id}
            onPress={() => onTaskSelect?.(task)}
            energyMode={energyMode}
          >
            <Surface
              variant={task.priority === 'high' ? 'elevated' : 'card'}
              shadow="none"
              radius="md"
              padding="md"
              energyMode={energyMode}
            >
              <Row spacing="sm" align="center">
                <View style={[
                  styles.priorityIndicator,
                  { backgroundColor: getPriorityColor(task.priority) }
                ]} />
                <Stack spacing="xs" style={styles.taskContent}>
                  <Text variant="body" style={styles.taskTitle}>
                    {task.title}
                  </Text>
                  <Row spacing="sm">
                    {isOverdue(task) && (
                      <Text variant="caption" color="primary">
                        Overdue
                      </Text>
                    )}
                    {task.dueDate && !isOverdue(task) && (
                      <Text variant="caption" color="secondary">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </Text>
                    )}
                    {task.priority && (
                      <Text variant="caption" color="tertiary">
                        {task.priority}
                      </Text>
                    )}
                  </Row>
                </Stack>
              </Row>
            </Surface>
          </HapticPressable>
        ))}
      </Stack>
      
      {maxTasks && backlogTasks.length > maxTasks && (
        <Text variant="caption" color="tertiary" style={styles.remainingText}>
          +{backlogTasks.length - maxTasks} more in backlog
        </Text>
      )}
    </ScrollView>
  );
}

const styles = {
  scrollView: {
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    flex: 1,
  },
  remainingText: {
    textAlign: 'center' as const,
    marginTop: baseTokens.spacing.md,
  },
};
