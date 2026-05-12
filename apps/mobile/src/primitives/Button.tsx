import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function Button({ title, onPress, style, ...props }: any) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...props}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
});
