import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth, db } from '../firebase'; // Asegúrate de tener configurado Firebase Firestore
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Para leer y actualizar el documento en Firestore

export default function CustomerHome({ navigation }) {
  const [hasActiveRequest, setHasActiveRequest] = useState(false); // Estado para controlar si ya hay una solicitud

  // Función para obtener el estado de hasActiveRequest del usuario en Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener la referencia del documento del usuario actual
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        
        // Obtener el documento del usuario
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // Actualizar el estado de hasActiveRequest según el valor en Firestore
          const userData = userDoc.data();
          setHasActiveRequest(userData.hasActiveRequest || false); // Si no existe, se asume que es false
        }
      } catch (error) {
        console.log('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData(); // Llamar a la función al montar el componente
  }, []);

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

  const handleRequestMove = async () => {
    try {
      // Obtener la referencia del documento del usuario actual en Firestore
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      // Actualizar el campo 'hasActiveRequest' a true si no lo tiene ya
      if (!hasActiveRequest) {
        await updateDoc(userDocRef, {
          hasActiveRequest: true,
        });
        setHasActiveRequest(true); // Actualizar el estado local
        console.log('Solicitud de mudanza iniciada');
      }

      // Navegar a la pantalla RequestMove
      navigation.navigate('RequestMove');
    } catch (error) {
      console.log('Error al actualizar la solicitud de mudanza:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Cliente!</Text>
      <View style={[styles.buttonContainer, hasActiveRequest && styles.activeRequestButton]}>
        <Button
          title={hasActiveRequest ? "Continuar solicitud" : "Solicitar mudanza"} // Cambiar texto dinámicamente
          onPress={handleRequestMove}
          color={hasActiveRequest ? 'green' : 'blue'} // Cambiar el color del botón
        />
      </View>
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
  buttonContainer: {
    marginBottom: 20, // Agregar margen entre los botones
    width: 200,
  },
  activeRequestButton: {
    backgroundColor: 'green', // O cualquier otro color si decides estilizar el View del botón
  },
});