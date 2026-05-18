import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TodayScreen } from '../features/today/TodayScreen';
import { CaptureSheet } from '../features/capture/CaptureSheet';
import { SettingsScreen } from '../features/settings/SettingsScreen';

const Stack = createNativeStackNavigator();

export function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Today" component={TodayScreen} />
        <Stack.Screen name="Capture" component={CaptureSheet} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
