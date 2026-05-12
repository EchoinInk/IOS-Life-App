import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTaskStore } from '../../state/task-store';
import { useUiStore } from '../../state/ui-store';
import { emit } from '../../orchestration/events';
import { Button } from '../../primitives/Button';
import { Screen } from '../../primitives/Screen';

export function CaptureSheet({ navigation }: any) {
  const [text, setText] = useState('');
  const addTask = useTaskStore((state) => state.addTask);
  const lowEnergy = useUiStore((state) => state.lowEnergy);

  const handleSubmit = () => {
    if (text.trim()) {
      addTask(text);
      emit({ type: 'TASK_CAPTURED' });
      setText('');
      navigation.goBack();
    }
  };

  return (
    <Screen>
      <View style={[styles.container, lowEnergy && styles.containerCompact]}>
        <TextInput
          style={[styles.input, lowEnergy && styles.inputCompact]}
          value={text}
          onChangeText={setText}
          placeholder="Enter task..."
          placeholderTextColor={lowEnergy ? '#999' : '#CCC'}
        />
        <Button title="Add Task" onPress={handleSubmit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  containerCompact: {
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputCompact: {
    padding: 16,
    marginBottom: 12,
    fontSize: 18,
  },
});
