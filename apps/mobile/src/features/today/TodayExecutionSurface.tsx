import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from '../../primitives/Stack';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { Surface } from '../../primitives/Surface';
import { HapticPressable } from '../../primitives/behavioral/HapticPressable';
import { EnergyAwareStack } from '../../primitives/behavioral/EnergyAwareStack';
import { baseTokens } from '../../theme';
import { useTaskStore, Task, TaskPriority } from '../../state/task-store';
import { EnergyMode } from '../../theme/types';

export interface TodayExecutionSurfaceProps {
  energyMode?: EnergyMode;
  onTaskComplete?: (task: Task) => void;
}

export function TodayExecutionSurface({ energyMode = 'normal', onTaskComplete }: TodayExecutionSurfaceProps) {
  const { tasks, completeTask } = useTaskStore();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return true;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  });

  const handleTaskPress = (taskId: string) => {
    if (energyMode === 'overwhelmed') return;
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleComplete = (task: Task) => {
    completeTask(task.id);
    onTaskComplete?.(task);
    setExpandedTaskId(null);
  };

  const getPriorityColor = (priority?: TaskPriority) => {
    switch (priority) {
      case 'high': return baseTokens.color.error;
      case 'medium': return baseTokens.color.warning;
      case 'low': return baseTokens.color.success;
      default: return baseTokens.color.border.subtle;
    }
  };

  const getTaskCount = () => {
    if (energyMode === 'overwhelmed') return Math.min(todayTasks.length, 3);
    if (energyMode === 'low') return Math.min(todayTasks.length, 5);
    return todayTasks.length;
  };

  const visibleTasks = todayTasks.slice(0, getTaskCount());

  if (todayTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Stack spacing="md" align="center">
          <Text variant="body" color="secondary">
            No tasks for today
          </Text>
          <Text variant="caption" color="tertiary">
            Capture something to get started
          </Text>
        </Stack>
      </View>
    );
  }

  return (
    <EnergyAwareStack spacing="lg" energyMode={energyMode}>
      {energyMode !== 'overwhelmed' && (
        <Row justify="space-between" align="center">
          <Text variant="heading">Today</Text>
          <Text variant="caption" color="secondary">
            {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
          </Text>
        </Row>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <EnergyAwareStack spacing="md" energyMode={energyMode}>
          {visibleTasks.map((task) => (
            <HapticPressable
              key={task.id}
              onPress={() => handleTaskPress(task.id)}
              energyMode={energyMode}
            >
              <Surface
                variant={task.priority === 'high' ? 'elevated' : 'card'}
                shadow={task.priority === 'high' ? 'sm' : 'none'}
                radius="md"
                padding="lg"
                energyMode={energyMode}
              >
                <Row spacing="md" align="center">
                  <TouchableOpacity
                    style={[styles.checkbox, { borderColor: getPriorityColor(task.priority) }]}
                    onPress={() => handleComplete(task)}
                    hitSlop={baseTokens.touchTarget.comfortable}
                  >
                    <View style={styles.checkboxInner} />
                  </TouchableOpacity>
                  
                  <Stack spacing="xs" style={styles.taskContent}>
                    <Text variant="body" style={styles.taskTitle}>
                      {task.title}
                    </Text>
                    
                    {expandedTaskId === task.id && energyMode !== 'overwhelmed' && (
                      <Row spacing="sm">
                        {task.priority && (
                          <Surface
                            variant="flat"
                            shadow="none"
                            radius="sm"
                            padding="xs"
                          >
                            <Text variant="caption" color="secondary">
                              {task.priority}
                            </Text>
                          </Surface>
                        )}
                        {task.dueDate && (
                          <Surface
                            variant="flat"
                            shadow="none"
                            radius="sm"
                            padding="xs"
                          >
                            <Text variant="caption" color="secondary">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Text>
                          </Surface>
                        )}
                      </Row>
                    )}
                  </Stack>
                </Row>
              </Surface>
            </HapticPressable>
          ))}
        </EnergyAwareStack>
      </ScrollView>

      {energyMode !== 'overwhelmed' && todayTasks.length > visibleTasks.length && (
        <Text variant="caption" color="tertiary" style={styles.remainingText}>
          +{todayTasks.length - visibleTasks.length} more tasks
        </Text>
      )}
    </EnergyAwareStack>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: baseTokens.spacing.xxl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: baseTokens.radii.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    flex: 1,
  },
  remainingText: {
    textAlign: 'center',
  },
});
