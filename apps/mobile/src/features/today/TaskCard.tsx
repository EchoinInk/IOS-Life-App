import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../../domains/tasks';
import { Pressable } from '../../primitives/Pressable';
import { useTaskStore } from '../../state/task-store';
import { emit } from '../../orchestration/events';

interface TaskCardProps {
  task: Task;
  lowEnergy: boolean;
}

export function TaskCard({ task, lowEnergy }: TaskCardProps) {
  const completeTask = useTaskStore((state) => state.completeTask);

  const handlePress = () => {
    completeTask(task.id);
    emit({ type: 'TASK_COMPLETED', payload: { taskId: task.id } });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.card, lowEnergy && styles.compressed]}>
        <Text style={[styles.title, lowEnergy && styles.titleCompact]}>{task.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
  },
  compressed: {
    padding: 12,
  },
  title: {
    fontSize: 16,
  },
  titleCompact: {
    fontSize: 18,
  },
});
