import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function CustomerHome({ navigation }) {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('Usuario deslogueado');
        navigation.replace('Login');
      })
      .catch(error => {
        console.log('Error al desloguear:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Cliente!</Text>
      <Button
        title="Solicitar mudanza"
        onPress={() => navigation.navigate('RequestMove')}
      />
      <Button
        title="Ver historial de solicitudes"
        onPress={() => navigation.navigate('RequestHistory')}
      />
      <Button
        title="Cerrar sesión"
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});