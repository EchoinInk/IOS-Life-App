import React, { useState, useEffect } from 'react';
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
import { FocusMode } from './FocusMode';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';
import { Task } from '../../state/task-store';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useInterruptionRecovery } from '../../hooks/useInterruptionRecovery';
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
  const [showFocusMode, setShowFocusMode] = useState(false);
  const { triggerHaptic } = useHapticFeedback();
  const { handleBeforeCapture, handleAfterCapture, isRecovering } = useInterruptionRecovery(energyMode);

  useEffect(() => {
    // Load tasks on mount
    useTaskStore.getState().loadTasksFromStorage().then(() => {
      // Seed demo data if empty
      useTaskStore.getState().seedDemoData();
    });
  }, []);

  const activeTasks = tasks.filter((task) => !task.completed);
  const todayTasks = activeTasks.filter(task => {
    if (!task.dueDate) return true;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  });

  const handleCapturePress = () => {
    handleBeforeCapture();
    triggerHaptic('capture', energyMode);
    setShowCapture(true);
  };

  const handleCaptureClose = () => {
    handleAfterCapture();
    setShowCapture(false);
  };

  const handleFocusModePress = () => {
    triggerHaptic('focus', energyMode);
    setShowFocusMode(true);
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
      <Stack spacing="xl" padding="xl" style={styles.container}>
        {currentEnergyMode !== 'overwhelmed' && (
          <Row justify="space-between" align="center" style={styles.header}>
            <Text variant="heading">Today</Text>
            <Row spacing="sm">
              {todayTasks.length > 1 && (
                <CalmButton
                  title="Focus"
                  onPress={handleFocusModePress}
                  size="sm"
                  variant="secondary"
                  energyMode={currentEnergyMode}
                />
              )}
              <Text variant="caption" color="secondary">
                {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}
              </Text>
            </Row>
          </Row>
        )}

        {todayTasks.length === 0 ? (
          <Stack spacing="lg" align="center" style={styles.emptyContainer}>
            <Text variant="body" color="secondary" style={styles.emptyTitle}>
              Space for what matters
            </Text>
            <Text variant="caption" color="tertiary" style={styles.emptySubtitle}>
              Capture something small to begin
            </Text>
          </Stack>
        ) : (
          <Stack spacing="md">
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
          </Stack>
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
        onClose={handleCaptureClose}
        energyMode={currentEnergyMode}
      />

      <FocusMode
        visible={showFocusMode}
        tasks={tasks}
        energyMode={currentEnergyMode}
        onClose={() => setShowFocusMode(false)}
        onCompleteTask={handleTaskComplete}
        onSnoozeTask={handleTaskSnooze}
      />
    </Screen>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: baseTokens.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as FlexAlignType,
    paddingVertical: baseTokens.spacing.xxl * 2,
  },
  emptyTitle: {
    textAlign: 'center' as const,
    marginBottom: baseTokens.spacing.sm,
  },
  emptySubtitle: {
    textAlign: 'center' as const,
  },
  remainingText: {
    textAlign: 'center' as const,
  },
};
