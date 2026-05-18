import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from '../../primitives/Stack';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { Surface } from '../../primitives/Surface';
import { CalmButton } from '../../primitives/behavioral/CalmButton';
import { EnergyAwareStack } from '../../primitives/behavioral/EnergyAwareStack';
import { useTaskStore, Task } from '../../state/task-store';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';

export interface RecoveryFlowProps {
  energyMode?: EnergyMode;
  onStartSmall?: () => void;
  onReduceFocus?: () => void;
}

export function RecoveryFlow({ energyMode = 'normal', onStartSmall, onReduceFocus }: RecoveryFlowProps) {
  const { tasks } = useTaskStore();
  
  const recoveryState = useMemo(() => {
    const activeTasks = tasks.filter(t => !t.completed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = activeTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < today
    );
    
    const totalTasks = activeTasks.length;
    const overdueCount = overdueTasks.length;
    
    // Simple overwhelm detection based on task count and overdue items
    const isOverwhelmed = totalTasks > 10 || overdueCount > 3;
    const needsRecovery = overdueCount > 0 || totalTasks > 5;
    
    return {
      totalTasks,
      overdueCount,
      isOverwhelmed,
      needsRecovery,
    };
  }, [tasks]);

  if (!recoveryState.needsRecovery && energyMode !== 'overwhelmed') {
    return null;
  }

  return (
    <EnergyAwareStack spacing="lg" energyMode={energyMode} padding="lg">
      {recoveryState.overdueCount > 0 && energyMode !== 'overwhelmed' && (
        <Surface variant="elevated" shadow="sm" radius="md" padding="lg" energyMode={energyMode}>
          <Stack spacing="md">
            <Text variant="body" style={styles.recoveryTitle}>
              {recoveryState.overdueCount} {recoveryState.overdueCount === 1 ? 'task' : 'tasks'} overdue
            </Text>
            <Text variant="caption" color="secondary">
              That's okay. Let's focus on what matters most.
            </Text>
            <CalmButton
              title="Start with just one"
              onPress={onStartSmall}
              variant="secondary"
              size="sm"
              energyMode={energyMode}
            />
          </Stack>
        </Surface>
      )}

      {recoveryState.totalTasks > 5 && energyMode !== 'overwhelmed' && (
        <Surface variant="card" shadow="none" radius="md" padding="lg" energyMode={energyMode}>
          <Stack spacing="md">
            <Text variant="body" style={styles.recoveryTitle}>
              {recoveryState.totalTasks} tasks waiting
            </Text>
            <Text variant="caption" color="secondary">
              Consider focusing on fewer things today.
            </Text>
            <Row spacing="sm">
              <CalmButton
                title="Show 3"
                onPress={onReduceFocus}
                variant="gentle"
                size="sm"
                energyMode={energyMode}
              />
              <CalmButton
                title="Show 5"
                onPress={onReduceFocus}
                variant="gentle"
                size="sm"
                energyMode={energyMode}
              />
            </Row>
          </Stack>
        </Surface>
      )}

      {energyMode === 'overwhelmed' && (
        <Surface variant="card" shadow="none" radius="md" padding="lg" energyMode={energyMode}>
          <Stack spacing="md" align="center">
            <Text variant="body" color="secondary" style={styles.gentleMessage}>
              Take a breath.
            </Text>
            <Text variant="caption" color="tertiary" style={styles.gentleSubtext}>
              You don't have to do everything right now.
            </Text>
            {onStartSmall && (
              <CalmButton
                title="Start with one small thing"
                onPress={onStartSmall}
                variant="gentle"
                size="sm"
                energyMode={energyMode}
              />
            )}
          </Stack>
        </Surface>
      )}
    </EnergyAwareStack>
  );
}

export function useRecoveryState() {
  const { tasks } = useTaskStore();
  
  return useMemo(() => {
    const activeTasks = tasks.filter(t => !t.completed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = activeTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < today
    );
    
    return {
      totalTasks: activeTasks.length,
      overdueTasks: overdueTasks.length,
      backlogRatio: activeTasks.length > 0 ? overdueTasks.length / activeTasks.length : 0,
    };
  }, [tasks]);
}

const styles = StyleSheet.create({
  recoveryTitle: {
    fontWeight: '600',
  },
  gentleMessage: {
    textAlign: 'center',
  },
  gentleSubtext: {
    textAlign: 'center',
  },
});
