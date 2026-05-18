import React, { useState, useCallback } from 'react';
import { useTaskStore, Task } from '../../state/task-store';
import { UndoToast } from '../../primitives/behavioral/UndoToast';
import { EnergyMode } from '../../theme/types';

export interface CompletionFlowProps {
  energyMode?: EnergyMode;
}

export function CompletionFlow({ energyMode = 'normal' }: CompletionFlowProps) {
  const { completeTask, undoCompleteTask } = useTaskStore();
  const [lastCompletedTask, setLastCompletedTask] = useState<Task | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  const handleComplete = useCallback((task: Task) => {
    completeTask(task.id);
    setLastCompletedTask(task);
    if (energyMode !== 'overwhelmed') {
      setShowUndo(true);
    }
  }, [completeTask, energyMode]);

  const handleUndo = useCallback(() => {
    if (lastCompletedTask) {
      undoCompleteTask(lastCompletedTask);
      setLastCompletedTask(null);
      setShowUndo(false);
    }
  }, [lastCompletedTask, undoCompleteTask]);

  const handleDismiss = useCallback(() => {
    setLastCompletedTask(null);
    setShowUndo(false);
  }, []);

  return (
    <>
      <UndoToast
        visible={showUndo}
        message="Task completed"
        onUndo={handleUndo}
        onDismiss={handleDismiss}
        energyMode={energyMode}
        autoHideDuration={energyMode === 'overwhelmed' ? 0 : 4000}
      />
    </>
  );
}

export function useCompletionFlow(energyMode: EnergyMode = 'normal') {
  const { completeTask } = useTaskStore();
  const [lastCompletedTask, setLastCompletedTask] = useState<Task | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  const completeTaskWithUndo = useCallback((task: Task) => {
    completeTask(task.id);
    setLastCompletedTask(task);
    if (energyMode !== 'overwhelmed') {
      setShowUndo(true);
    }
  }, [completeTask, energyMode]);

  const undo = useCallback(() => {
    if (lastCompletedTask) {
      completeTask(lastCompletedTask.id);
      setLastCompletedTask(null);
      setShowUndo(false);
    }
  }, [lastCompletedTask, completeTask]);

  const dismiss = useCallback(() => {
    setLastCompletedTask(null);
    setShowUndo(false);
  }, []);

  return {
    completeTask: completeTaskWithUndo,
    undo,
    dismiss,
    lastCompletedTask,
    showUndo,
  };
}
