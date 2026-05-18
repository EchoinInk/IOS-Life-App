import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Surface({ children, style, ...props }: any) {
  return <View style={[styles.surface, style]} {...props}>{children}</View>;
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
});
