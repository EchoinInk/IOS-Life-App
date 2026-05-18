import React from 'react';
import { Text as RNText } from 'react-native';

export function Text({ children, style, ...props }: any) {
  return <RNText style={style} {...props}>{children}</RNText>;
}
