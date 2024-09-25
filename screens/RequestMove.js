import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import RequestMoveInventory from './RequestMoveInventory';
import RequestMoveAddress from './RequestMoveAddress';
import RequestMoveConfirmation from './RequestMoveConfirmation';

export default function RequestMove() {
  const [currentStep, setCurrentStep] = useState(1);
  const [inventory, setInventory] = useState([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoveData = async () => {
      try {
        const userDocRef = doc(db, 'moves', auth.currentUser.uid); // Acceder a la colección 'moves' con el uid del usuario
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const moveData = userDocSnap.data();

          // Verificar si el documento tiene las propiedades esperadas
          if (moveData) {
            setInventory(moveData.inventory || []);
            setPickupLocation(moveData.pickupLocation?.address || '');
            setDropoffLocation(moveData.dropoffLocation?.address || '');
            setTime(moveData.time?.toDate().toLocaleString() || '');
          } else {
            console.log('No se encontró una solicitud de mudanza activa');
          }
        } else {
          console.log('No se encontró una solicitud de mudanza');
        }
      } catch (error) {
        console.error('Error al obtener la solicitud de mudanza:', error);
        setError('No se pudo cargar la solicitud de mudanza');
      } finally {
        setLoading(false);
      }
    };

    fetchMoveData();
  }, []);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInventoryUpdate = (newInventory) => {
    setInventory(newInventory);
  };

  const handleAddressUpdate = (newPickupLocation, newDropoffLocation, newTime) => {
    setPickupLocation(newPickupLocation);
    setDropoffLocation(newDropoffLocation);
    setTime(newTime);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          time={time}
          onAddressUpdate={handleAddressUpdate}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
        />
      )}
      {currentStep === 3 && (
        <RequestMoveConfirmation
          inventory={inventory}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
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
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});