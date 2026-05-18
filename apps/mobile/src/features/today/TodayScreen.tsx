import React, { useState } from 'react';
import { View, FlexAlignType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTaskStore } from '../../state/task-store';
import { useUiStore } from '../../state/ui-store';
import { Screen } from '../../primitives/Screen';
import { Stack } from '../../primitives/Stack';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { CalmButton } from '../../primitives/behavioral/CalmButton';
import { EnergyAwareStack } from '../../primitives/behavioral/EnergyAwareStack';
import { HapticPressable } from '../../primitives/behavioral/HapticPressable';
import { Surface } from '../../primitives/Surface';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';
import { Task } from '../../state/task-store';

export function TodayScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const lowEnergy = useUiStore((state) => state.lowEnergy);
  const navigation = useNavigation();
  const [energyMode, setEnergyMode] = useState<EnergyMode>(lowEnergy ? 'low' : 'normal');
  const [showCapture, setShowCapture] = useState(false);

  const activeTasks = tasks.filter((task) => !task.completed);
  const todayTasks = activeTasks.filter(task => {
    if (!task.dueDate) return true;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  });

  const handleCapturePress = () => {
    setShowCapture(true);
  };

  const handleTaskComplete = (task: Task) => {
    // Will be handled by completion flow
  };

  const getEnergyMode = (): EnergyMode => {
    if (lowEnergy) return 'low';
    return energyMode;
  };

  const currentEnergyMode = getEnergyMode();

  return (
    <Screen energyMode={currentEnergyMode}>
      <Stack spacing="lg" padding="lg">
        {currentEnergyMode !== 'overwhelmed' && (
          <Row justify="space-between" align="center">
            <Text variant="heading">Today</Text>
            <Text variant="caption" color="secondary">
              {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}
            </Text>
          </Row>
        )}

        {todayTasks.length === 0 ? (
          <Stack spacing="md" align="center" style={styles.emptyContainer}>
            <Text variant="body" color="secondary">
              No tasks for today
            </Text>
            <Text variant="caption" color="tertiary">
              Capture something to get started
            </Text>
          </Stack>
        ) : (
          <EnergyAwareStack spacing="md" energyMode={currentEnergyMode}>
            {todayTasks.slice(0, currentEnergyMode === 'overwhelmed' ? 3 : currentEnergyMode === 'low' ? 5 : undefined).map((task) => (
              <TaskCard key={task.id} task={task} energyMode={currentEnergyMode} onComplete={handleTaskComplete} />
            ))}
          </EnergyAwareStack>
        )}

        {currentEnergyMode !== 'overwhelmed' && todayTasks.length > (currentEnergyMode === 'low' ? 5 : todayTasks.length) && (
          <Text variant="caption" color="tertiary" style={styles.remainingText}>
            +{todayTasks.length - (currentEnergyMode === 'low' ? 5 : todayTasks.length)} more tasks
          </Text>
        )}
      </Stack>

      <CalmButton
        title="+"
        onPress={handleCapturePress}
        size="lg"
        energyMode={currentEnergyMode}
        style={styles.fab}
      />
    </Screen>
  );
}

interface TaskCardProps {
  task: Task;
  energyMode: EnergyMode;
  onComplete: (task: Task) => void;
}

function TaskCard({ task, energyMode, onComplete }: TaskCardProps) {
  const { completeTask } = useTaskStore();

  const handleComplete = () => {
    completeTask(task.id);
    onComplete(task);
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
    <HapticPressable onPress={handleComplete} energyMode={energyMode}>
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
    </HapticPressable>
  );
}

const styles = {
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as FlexAlignType,
    padding: baseTokens.spacing.xxl,
  },
  remainingText: {
    textAlign: 'center' as const,
  },
  fab: {
    position: 'absolute' as const,
    bottom: baseTokens.spacing.xxl,
    right: baseTokens.spacing.xxl,
    width: baseTokens.touchTarget.generous,
    height: baseTokens.touchTarget.generous,
    borderRadius: baseTokens.touchTarget.generous / 2,
    paddingHorizontal: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: baseTokens.radii.sm,
    borderWidth: 2,
  },
  taskTitle: {
    flex: 1,
  },
};
