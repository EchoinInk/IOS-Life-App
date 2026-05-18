import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Row } from '../../primitives/Row';
import { Text } from '../../primitives/Text';
import { HapticPressable } from '../../primitives/behavioral/HapticPressable';
import { Surface } from '../../primitives/Surface';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';

export interface FocusModeToggleProps {
  energyMode: EnergyMode;
  onEnergyModeChange: (mode: EnergyMode) => void;
}

export function FocusModeToggle({ energyMode, onEnergyModeChange }: FocusModeToggleProps) {
  const modes: { key: EnergyMode; label: string }[] = [
    { key: 'normal', label: 'Normal' },
    { key: 'low', label: 'Low' },
    { key: 'overwhelmed', label: 'Calm' },
  ];

  return (
    <View style={styles.container}>
      <Row spacing="sm">
        {modes.map((mode) => (
          <HapticPressable
            key={mode.key}
            onPress={() => onEnergyModeChange(mode.key)}
          >
            <Surface
              variant={energyMode === mode.key ? 'elevated' : 'flat'}
              shadow={energyMode === mode.key ? 'sm' : 'none'}
              radius="md"
              padding="md"
            >
              <Text
                variant="caption"
                color={energyMode === mode.key ? 'primary' : 'secondary'}
              >
                {mode.label}
              </Text>
            </Surface>
          </HapticPressable>
        ))}
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: baseTokens.spacing.md,
  },
});
