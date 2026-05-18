import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CalmButton } from '../../primitives/behavioral/CalmButton';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';

export interface CaptureTriggerProps {
  onPress: () => void;
  energyMode?: EnergyMode;
}

export function CaptureTrigger({ onPress, energyMode = 'normal' }: CaptureTriggerProps) {
  return (
    <View style={styles.container}>
      <CalmButton
        title="+"
        onPress={onPress}
        size="lg"
        energyMode={energyMode}
        style={styles.triggerButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: baseTokens.spacing.xxl,
    right: baseTokens.spacing.xl,
    zIndex: baseTokens.zIndex.modal,
  },
  triggerButton: {
    width: baseTokens.touchTarget.generous,
    height: baseTokens.touchTarget.generous,
    borderRadius: baseTokens.touchTarget.generous / 2,
    paddingHorizontal: 0,
  },
});
