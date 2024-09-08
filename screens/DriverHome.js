// HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Redirigir al usuario al Login después de cerrar sesión
        navigation.replace('Login');
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido a MoveIT, Conductor!</Text>
      <Button title="Cerrar Sesión" onPress={handleSignOut} />
    </View>
  );
}
