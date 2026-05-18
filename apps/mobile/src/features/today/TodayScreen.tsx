import React, { useState } from 'react';
import { View, FlexAlignType } from 'react-native';
import { useTaskStore } from '../../state/task-store';
import { useUiStore } from '../../state/ui-store';
import { Screen } from '../../primitives/Screen';
import { Stack } from '../../primitives/Stack';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { CalmButton } from '../../primitives/behavioral/CalmButton';
import { EnergyAwareStack } from '../../primitives/behavioral/EnergyAwareStack';
import { CaptureTrigger } from '../capture/CaptureTrigger';
import { QuickCaptureFlow } from '../capture/QuickCaptureFlow';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';
import { Task } from '../../state/task-store';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { TaskCard } from './TaskCard';

export function TodayScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const completeTask = useTaskStore((state) => state.completeTask);
  const snoozeTask = useTaskStore((state) => state.snoozeTask);
  const deferTask = useTaskStore((state) => state.deferTask);
  const reduceScope = useTaskStore((state) => state.reduceScope);
  const lowEnergy = useUiStore((state) => state.lowEnergy);
  const [energyMode, setEnergyMode] = useState<EnergyMode>(lowEnergy ? 'low' : 'normal');
  const [showCapture, setShowCapture] = useState(false);
  const { triggerHaptic } = useHapticFeedback();

  const activeTasks = tasks.filter((task) => !task.completed);
  const todayTasks = activeTasks.filter(task => {
    if (!task.dueDate) return true;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  });

  const handleCapturePress = () => {
    triggerHaptic('capture', energyMode);
    setShowCapture(true);
  };

  const handleTaskComplete = (task: Task) => {
    completeTask(task.id);
  };

  const handleTaskSnooze = (task: Task) => {
    snoozeTask(task.id, 24);
  };

  const handleTaskDefer = (task: Task) => {
    deferTask(task.id);
  };

  const handleTaskReduceScope = (task: Task) => {
    reduceScope(task.id);
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
              <TaskCard
                key={task.id}
                task={task}
                energyMode={currentEnergyMode}
                onComplete={handleTaskComplete}
                onSnooze={handleTaskSnooze}
                onDefer={handleTaskDefer}
                onReduceScope={handleTaskReduceScope}
              />
            ))}
          </EnergyAwareStack>
        )}

        {currentEnergyMode !== 'overwhelmed' && todayTasks.length > (currentEnergyMode === 'low' ? 5 : todayTasks.length) && (
          <Text variant="caption" color="tertiary" style={styles.remainingText}>
            +{todayTasks.length - (currentEnergyMode === 'low' ? 5 : todayTasks.length)} more tasks
          </Text>
        )}
      </Stack>

      <CaptureTrigger onPress={handleCapturePress} energyMode={currentEnergyMode} />

      <QuickCaptureFlow
        visible={showCapture}
        onClose={() => setShowCapture(false)}
        energyMode={currentEnergyMode}
      />
    </Screen>
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
