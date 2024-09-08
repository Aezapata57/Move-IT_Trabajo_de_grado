// screens/RequestMoveAddress.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { auth } from '../firebase';

export default function RequestMoveAddress({ onNext, onPrevious }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleNext = async () => {
    const userId = auth.currentUser.uid;
    await firestore().collection('moves').doc(userId).set({
      pickupLocation: pickupLocation,
      dropoffLocation: dropoffLocation,
      date: date,
      time: time,
    }, { merge: true });
    onNext();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Ubicación de Recogida"
        value={pickupLocation}
        onChangeText={setPickupLocation}
        style={styles.input}
      />
      <TextInput
        placeholder="Ubicación de Entrega"
        value={dropoffLocation}
        onChangeText={setDropoffLocation}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Hora"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />
      <Button title="Anterior" onPress={onPrevious} />
      <Button title="Siguiente" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});