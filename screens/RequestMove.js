// screens/RequestMove.js
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import RequestMoveInventory from './RequestMoveInventory';
import RequestMoveAddress from './RequestMoveAddress';
import RequestMoveConfirmation from './RequestMoveConfirmation';

export default function RequestMove() {
  const [currentStep, setCurrentStep] = useState(1);
  const [inventory, setInventory] = useState([]);
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInventoryUpdate = (newInventory) => {
    setInventory(newInventory);
  };

  const handleAddressUpdate = (newAddress, newTime) => {
    setAddress(newAddress);
    setTime(newTime);
  };

  return (
    <View style={styles.container}>
      {currentStep === 1 && (
        <RequestMoveInventory 
          inventory={inventory} 
          onInventoryUpdate={handleInventoryUpdate} 
          onNext={handleNextStep} 
          onPrevious={handlePreviousStep} 
        />
      )}
      {currentStep === 2 && (
        <RequestMoveAddress 
          address={address} 
          time={time} 
          onAddressUpdate={handleAddressUpdate} 
          onNext={handleNextStep} 
          onPrevious={handlePreviousStep} 
        />
      )}
      {currentStep === 3 && (
        <RequestMoveConfirmation 
          inventory={inventory} 
          address={address} 
          time={time} 
          onPrevious={handlePreviousStep} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});