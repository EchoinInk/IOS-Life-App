import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CaptureSheet } from '../../primitives/behavioral/CaptureSheet';
import { CalmButton } from '../../primitives/behavioral/CalmButton';
import { EnergyAwareStack } from '../../primitives/behavioral/EnergyAwareStack';
import { Stack } from '../../primitives/Stack';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { Surface } from '../../primitives/Surface';
import { baseTokens } from '../../theme';
import { useTaskStore, TaskPriority } from '../../state/task-store';
import { EnergyMode } from '../../theme/types';

export interface QuickCaptureFlowProps {
  visible: boolean;
  onClose: () => void;
  energyMode?: EnergyMode;
}

export function QuickCaptureFlow({ visible, onClose, energyMode = 'normal' }: QuickCaptureFlowProps) {
  const [title, setTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | undefined>();
  const [dueDate, setDueDate] = useState<string>('');
  const { draftTask, updateDraft, clearDraft, addTask } = useTaskStore();

  useEffect(() => {
    if (visible && draftTask) {
      setTitle(draftTask.title || '');
      setSelectedPriority(draftTask.priority);
      setDueDate(draftTask.dueDate ? new Date(draftTask.dueDate).toISOString().split('T')[0] : '');
    } else if (!visible) {
      setTitle('');
      setSelectedPriority(undefined);
      setDueDate('');
    }
  }, [visible, draftTask]);

  useEffect(() => {
    if (title || selectedPriority || dueDate) {
      updateDraft({
        title,
        priority: selectedPriority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      });
    }
  }, [title, selectedPriority, dueDate, updateDraft]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    addTask({
      title: title.trim(),
      priority: selectedPriority,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
    });
    
    setTitle('');
    setSelectedPriority(undefined);
    setDueDate('');
    clearDraft();
    onClose();
  };

  const handleCancel = () => {
    if (title || selectedPriority || dueDate) {
      updateDraft({ title, priority: selectedPriority, dueDate: dueDate ? new Date(dueDate).getTime() : undefined });
    }
    onClose();
  };

  return (
    <CaptureSheet
      visible={visible}
      onClose={handleCancel}
      title="Capture"
      energyMode={energyMode}
    >
      <EnergyAwareStack spacing="lg" energyMode={energyMode}>
        <Stack spacing="md">
          <Text variant="caption" color="secondary">
            What needs your attention?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task..."
            placeholderTextColor={baseTokens.color.text.tertiary}
            value={title}
            onChangeText={setTitle}
            autoFocus={visible}
            multiline={false}
            maxLength={100}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </Stack>

        {energyMode !== 'overwhelmed' && (
          <Stack spacing="md">
            <Text variant="caption" color="secondary">
              Priority (optional)
            </Text>
            <Row spacing="sm" justify="flex-start">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    selectedPriority === priority && styles.priorityButtonActive,
                  ]}
                  onPress={() => setSelectedPriority(selectedPriority === priority ? undefined : priority)}
                >
                  <Text
                    variant="label"
                    color={selectedPriority === priority ? 'inverse' : 'primary'}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </Row>
          </Stack>
        )}

        {energyMode !== 'overwhelmed' && (
          <Stack spacing="md">
            <Text variant="caption" color="secondary">
              Due date (optional)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={baseTokens.color.text.tertiary}
              value={dueDate}
              onChangeText={setDueDate}
              maxLength={10}
            />
          </Stack>
        )}

        <CalmButton
          title="Capture"
          onPress={handleSave}
          disabled={!title.trim()}
          energyMode={energyMode}
        />
      </EnergyAwareStack>
    </CaptureSheet>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: baseTokens.surface.card,
    borderRadius: baseTokens.radii.md,
    padding: baseTokens.spacing.lg,
    fontSize: baseTokens.typography.body.fontSize,
    color: baseTokens.color.text.primary,
    borderWidth: 1,
    borderColor: baseTokens.color.border.subtle,
    minHeight: baseTokens.touchTarget.comfortable,
  },
  priorityButton: {
    paddingHorizontal: baseTokens.spacing.lg,
    paddingVertical: baseTokens.spacing.md,
    borderRadius: baseTokens.radii.md,
    backgroundColor: baseTokens.color.border.subtle,
    minHeight: baseTokens.touchTarget.min,
  },
  priorityButtonActive: {
    backgroundColor: baseTokens.color.primary,
  },
});
