import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Screen({ children, style, ...props }: any) {
  return <View style={[styles.screen, style]} {...props}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
