import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import WebIcon from './WebIcon';

export default function ScreenHeader({ 
  title, 
  onBack, 
  rightIcon = null, 
  onRightPress = null,
  backgroundColor = '#2196F3'
}) {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      {onBack && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <WebIcon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
      )}
      
      {!onBack && <View style={styles.placeholder} />}
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      {rightIcon && onRightPress ? (
        <TouchableOpacity 
          style={styles.rightButton}
          onPress={onRightPress}
          activeOpacity={0.7}
        >
          <WebIcon name={rightIcon} size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  rightButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  placeholder: {
    width: 48,
    height: 48,
  },
});
