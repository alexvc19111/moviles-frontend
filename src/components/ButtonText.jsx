import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Componente simple de texto para botones
export default function ButtonText({ children, style, color = '#fff' }) {
  return (
    <Text style={[styles.text, { color }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
