import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RequestHistory() {
  // Aquí puedes cargar y mostrar el historial de solicitudes del cliente
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Solicitudes</Text>
      {/* Aquí iría la lógica para mostrar el historial */}
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
