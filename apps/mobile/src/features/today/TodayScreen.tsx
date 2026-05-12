import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTaskStore } from '../../state/task-store';
import { useUiStore } from '../../state/ui-store';
import { TaskCard } from './TaskCard';
import { Screen } from '../../primitives/Screen';
import { useNavigation } from '@react-navigation/native';

export function TodayScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const lowEnergy = useUiStore((state) => state.lowEnergy);
  const navigation = useNavigation();

  const activeTasks = tasks.filter((task) => !task.completed);

  const handleCapturePress = () => {
    navigation.navigate('Capture' as never);
  };

  return (
    <Screen>
      <View style={styles.container}>
        {activeTasks.length === 0 ? (
          <View style={[styles.empty, lowEnergy && styles.emptyCompact]}>
            <Text style={[styles.emptyText, lowEnergy && styles.emptyTextCompact]}>
              No tasks yet
            </Text>
          </View>
        ) : (
          activeTasks.map((task) => (
            <TaskCard key={task.id} task={task} lowEnergy={lowEnergy} />
          ))
        )}
      </View>
      <TouchableOpacity
        style={[styles.fab, lowEnergy && styles.fabCompact]}
        onPress={handleCapturePress}
      >
        <Text style={[styles.fabText, lowEnergy && styles.fabTextCompact]}>+</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCompact: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  emptyTextCompact: {
    fontSize: 18,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabCompact: {
    width: 64,
    height: 64,
    borderRadius: 32,
    bottom: 32,
    right: 32,
  },
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  fabTextCompact: {
    fontSize: 32,
    color: '#FFFFFF',
  },
});
