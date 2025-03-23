// VRControls.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'react-native-sensors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VRControls = ({ 
  onMoveForward, 
  onMoveBackward, 
  onTurnLeft, 
  onTurnRight,
  isVRMode 
}) => {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    if (isVRMode) {
      const gyroscope = new Gyroscope({ updateInterval: 100 });
      const subscription = gyroscope.subscribe(({ x, y, z }) => {
        setGyroData({ x, y, z });
        // Handle VR movement based on gyroscope data
        if (Math.abs(y) > 1.5) onTurnRight();
        if (Math.abs(y) < -1.5) onTurnLeft();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isVRMode]);

  const calibrateGyroscope = () => {
    setIsCalibrating(true);
    setTimeout(() => setIsCalibrating(false), 3000);
  };

  return (
    <View style={styles.controlsContainer}>
      {isVRMode ? (
        // VR Mode Controls
        <View style={styles.vrControls}>
          <TouchableOpacity 
            style={styles.calibrateButton}
            onPress={calibrateGyroscope}
          >
            <Icon name="screen-rotation" size={24} color="#fff" />
            {isCalibrating && <View style={styles.calibrating} />}
          </TouchableOpacity>
        </View>
      ) : (
        // Standard Controls
        <View style={styles.standardControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onMoveForward}
          >
            <Icon name="arrow-upward" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.horizontalControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={onTurnLeft}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={onMoveBackward}
            >
              <Icon name="arrow-downward" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={onTurnRight}
            >
              <Icon name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  standardControls: {
    alignItems: 'center',
  },
  vrControls: {
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 25,
    margin: 5,
  },
  calibrateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
  },
  calibrating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'dashed',
  }
});

export default VRControls;