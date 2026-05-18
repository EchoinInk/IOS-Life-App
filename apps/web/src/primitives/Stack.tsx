import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Stack({ children, style, ...props }: any) {
  return <View style={[styles.stack, style]} {...props}>{children}</View>;
}

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'column',
  },
});
