import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useUiStore } from '../../state/ui-store';
import { useSessionStore } from '../../state/session-store';
import { emit } from '../../orchestration/events';
import { Screen } from '../../primitives/Screen';

export function SettingsScreen() {
  const { lowEnergy, toggleLowEnergy } = useUiStore();
  const { lastOpened } = useSessionStore();

  const handleToggle = () => {
    toggleLowEnergy();
    if (!lowEnergy) {
      emit({ type: 'LOW_ENERGY_ENABLED' });
    } else {
      emit({ type: 'LOW_ENERGY_DISABLED' });
    }
  };

  return (
    <Screen>
      <View style={[styles.container, lowEnergy && styles.containerCompact]}>
        <View style={[styles.row, lowEnergy && styles.rowCompact]}>
          <Text style={[styles.label, lowEnergy && styles.labelCompact]}>Low Energy Mode</Text>
          <Switch value={lowEnergy} onValueChange={handleToggle} />
        </View>
        <Text style={[styles.info, lowEnergy && styles.infoCompact]}>Last Opened: {lastOpened || 'Never'}</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowCompact: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
  },
  labelCompact: {
    fontSize: 18,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  infoCompact: {
    fontSize: 16,
    color: '#666',
  },
});
