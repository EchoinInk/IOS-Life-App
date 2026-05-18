import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Row({ children, style, ...props }: any) {
  return <View style={[styles.row, style]} {...props}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
