import React from 'react';
import { Platform, Text } from 'react-native';

// En web, usar letras/símbolos ASCII simples
const iconMap = {
  'arrow-left': '<',
  'arrow-right': '>',
  'menu': '≡',
  'close': 'x',
  'plus': '+',
  'minus': '-',
  'delete': 'x',
  'play': '▶',
  'account-school': '👤',
  'account': '👤',
  'account-group': '👥',
  'teach': '👨',
  'school': '🎓',
  'book': '📖',
  'book-open': '📖',
  'calculator': '#',
  'atom': 'o',
  'code-braces': '<>',
  'pencil': '✎',
  'check': '✓',
  'logout': '→',
  'download': '↓',
  'filter': '⚑',
  'camera': '📷',
  'cog': '⚙',
  'chart-line': '↗',
  'chart-box': '▢',
  'trending-up': '↗',
  'trending-down': '↘',
  'calendar': '📅',
  'clock-outline': '⏰',
  'file-document': '📄',
  'bell-outline': '🔔',
  'bell': '🔔',
  'alert-circle': '!',
  'information': 'i',
  'lock': '🔒',
  'email': '✉',
  'phone': '☎',
  'map-marker': '📍',
  'identifier': '#',
};

export default function WebIcon({ name, size = 24, color = '#000', style }) {
  const symbol = iconMap[name] || '•';
  
  return (
    <Text
      style={[
        {
          fontSize: size * 0.7,
          color: color,
          lineHeight: size,
          textAlign: 'center',
          width: size,
          fontWeight: 'bold',
        },
        style
      ]}
    >
      {symbol}
    </Text>
  );
}
