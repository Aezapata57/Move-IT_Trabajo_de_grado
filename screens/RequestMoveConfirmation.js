// screens/RequestMoveConfirmation.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { auth } from '../firebase';

export default function RequestMoveConfirmation({ onPrevious }) {
  const handleConfirm = async () => {
    const userId = auth.currentUser.uid;
    // Aquí puedes hacer una solicitud adicional si es necesario, o simplemente confirmar la solicitud.
    await firestore().collection('moves').doc(userId).update({
      status: 'confirmed',
    });
    console.log('Solicitud confirmada');
    // Navegar a otra pantalla si es necesario
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Solicitud</Text>
      <Text>Revisa los detalles de tu solicitud y confirma.</Text>
      <Button title="Anterior" onPress={onPrevious} />
      <Button title="Confirmar" onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
});