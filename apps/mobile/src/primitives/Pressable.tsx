import React from 'react';
import { TouchableOpacity } from 'react-native';

export function Pressable({ children, onPress, style, ...props }: any) {
  return (
    <TouchableOpacity style={style} onPress={onPress} {...props}>
      {children}
    </TouchableOpacity>
  );
}
