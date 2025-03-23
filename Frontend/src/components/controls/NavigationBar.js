// NavigationBar.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NavigationBar = ({ 
  onSave, 
  onLoad, 
  onToggleVR, 
  isVRMode,
  onAddFurniture 
}) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={onSave}
      >
        <Icon name="save" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton} 
        onPress={onLoad}
      >
        <Icon name="folder-open" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, styles.vrButton]} 
        onPress={onToggleVR}
      >
        <Icon 
          name={isVRMode ? "3d-rotation" : "view-in-ar"} 
          size={32} 
          color="#fff" 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton} 
        onPress={onAddFurniture}
      >
        <Icon name="add-circle" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => {}}
      >
        <Icon name="settings" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 10,
  },
  vrButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 15,
  }
});

export default NavigationBar;

