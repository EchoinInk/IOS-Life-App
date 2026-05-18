import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { baseTokens } from '../../theme';
import { EnergyMode } from '../../theme/types';

export interface CaptureTriggerProps {
  onPress: () => void;
  energyMode?: EnergyMode;
}

export function CaptureTrigger({ onPress, energyMode = 'normal' }: CaptureTriggerProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (energyMode === 'overwhelmed') return;
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (energyMode === 'overwhelmed') return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={energyMode === 'overwhelmed' ? 1 : 0.9}
          style={[
            styles.fab,
            energyMode === 'overwhelmed' && styles.fabOverwhelmed,
          ]}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: baseTokens.spacing.xxl + baseTokens.spacing.xs,
    right: baseTokens.spacing.xl,
    zIndex: baseTokens.zIndex.modal,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: baseTokens.color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabOverwhelmed: {
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plus: {
    fontSize: 32,
    fontWeight: '300',
    color: baseTokens.color.text.inverse,
    lineHeight: 36,
    textAlign: 'center',
  },
});
