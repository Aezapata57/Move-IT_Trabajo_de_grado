import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, TouchableWithoutFeedback } from 'react-native';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, LexendGiga_400Regular } from '@expo-google-fonts/lexend-giga';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomerHome({ navigation }) {
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(-300));

  let [fontsLoaded] = useFonts({
    LexendGiga_400Regular,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setHasActiveRequest(userData.hasActiveRequest || false);
        }
      } catch (error) {
        console.log('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData();
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
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      if (!hasActiveRequest) {
        await updateDoc(userDocRef, {
          hasActiveRequest: true,
        });
        setHasActiveRequest(true);
        console.log('Solicitud de mudanza iniciada');
      }

      navigation.navigate('RequestMove');
    } catch (error) {
      console.log('Error al actualizar la solicitud de mudanza:', error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(modalAnimation, {
      toValue: 0,
      useNativeDriver: true,
      speed: 5,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(modalAnimation, {
      toValue: -300,
      useNativeDriver: true,
      speed: 300,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={openModal}>
        <Ionicons name="menu" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Bienvenido, Cliente!</Text>
      <TouchableOpacity 
        style={[styles.button, hasActiveRequest ? styles.activeButton : styles.requestButton]}
        onPress={handleRequestMove}
      >
        <Text style={styles.buttonText}>
          {hasActiveRequest ? "Continuar solicitud" : "Solicitar mudanza"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('RequestHistory')}
      >
        <Text style={styles.buttonText}>Ver historial de solicitudes</Text>
      </TouchableOpacity>

      {/* Modal para opciones adicionales */}
      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <Animated.View style={[styles.modalContainer, { transform: [{ translateX: modalAnimation }] }]}>
              <View style={styles.modalOptionsContainer}>
                <LinearGradient
                  colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
                  start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
                  end={{ x: 1.8, y: 0 }} // Termina en la esquina derecha
                  style={styles.modalOption}
                >
                  <TouchableOpacity style={styles.modalOptionButton} onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.modalOptionText}>Ver Perfil</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
                  start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
                  end={{ x: 1.8, y: 0 }} // Termina en la esquina derecha
                  style={styles.modalOption}
                >
                  <TouchableOpacity style={styles.modalOptionButton} onPress={() => navigation.navigate('Help')}>
                    <Text style={styles.modalOptionText}>Soporte</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
                  start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
                  end={{ x: 1.8, y: 0 }} // Termina en la esquina derecha
                  style={styles.modalOption}
                >
                  <TouchableOpacity style={styles.modalOptionButton} onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.modalOptionText}>Configuración</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
                  start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
                  end={{ x: 1.8, y: 0 }} // Termina en la esquina derecha
                  style={styles.modalOption}
                >
                  <TouchableOpacity style={styles.modalOptionButton} onPress={() => navigation.navigate('Ratings')}>
                    <Text style={styles.modalOptionText}>Calificaciones</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
                  start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
                  end={{ x: 1.8, y: 0 }} // Termina en la esquina derecha
                  style={styles.modalOption}
                >
                  <TouchableOpacity style={styles.modalOptionButton} onPress={() => navigation.navigate('PaymentHistory')}>
                    <Text style={styles.modalOptionText}>Historial de Pagos</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
                  start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
                  end={{ x: 1.8, y: 0 }} // Termina en la esquina derecha
                  style={styles.modalOption}
                >
                  <TouchableOpacity style={styles.modalOptionButton} onPress={() => shareApp()}>
                    <Text style={styles.modalOptionText}>Compartir App</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
                  start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
                  end={{ x: 1.8, y: 0 }} // Termina en la esquina derecha
                  style={styles.modalOption}
                >
                  <TouchableOpacity style={styles.modalOptionButton} onPress={handleLogout}>
                    <Text style={styles.modalOptionText}>Cerrar sesión</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontFamily: 'LexendGiga_400Regular',
    color: '#333',
  },
  button: {
    backgroundColor: '#A76DFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: '#2196F3',
  },
  activeButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'LexendGiga_400Regular',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalContainer: {
    flex: 1,
    width: '50%',
    backgroundColor: '#EFE7FF',
    padding: 20,
    elevation: 5,
    position: 'relative', // Para posicionar la X
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  modalOptionsContainer: {
    flex: 1,
    justifyContent: 'center', // Centrar verticalmente las opciones
    alignItems: 'center',
  },
  modalOption: {
    backgroundColor: '#DDCEFF',
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalOptionButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'LexendGiga_400Regular',
  },
});