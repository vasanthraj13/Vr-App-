// PlacementControls.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlacementControls = ({
  selectedItem,
  onMove,
  onRotate,
  onScale,
  onDelete,
  onConfirm
}) => {
  if (!selectedItem) return null;

  return (
    <View style={styles.container}>
      {/* Movement Controls */}
      <View style={styles.controlGroup}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onMove('forward')}
        >
          <Icon name="arrow-upward" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.horizontalControls}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => onMove('left')}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => onMove('backward')}
          >
            <Icon name="arrow-downward" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => onMove('right')}
          >
            <Icon name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rotation and Scale Controls */}
      <View style={styles.transformControls}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onRotate('left')}
        >
          <Icon name="rotate-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onRotate('right')}
        >
          <Icon name="rotate-right" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onScale('up')}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onScale('down')}
        >
          <Icon name="remove" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Icon name="delete" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.confirmButton]}
          onPress={onConfirm}
        >
          <Icon name="check" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -100 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 10,
  },
  controlGroup: {
    alignItems: 'center',
    marginBottom: 20,
  },
  horizontalControls: {
    flexDirection: 'row',
    marginTop: 10,
  },
  transformControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  }
});

export default PlacementControls;