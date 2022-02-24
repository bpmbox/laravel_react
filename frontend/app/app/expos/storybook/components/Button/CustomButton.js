import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default ({ onPress, children, backgroundColor = 'aquamarine' }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, { backgroundColor }]}>
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
});
