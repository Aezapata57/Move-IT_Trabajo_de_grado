import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity  } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import appFirebase from '../firebase';
import { useFonts, LexendGiga_400Regular } from '@expo-google-fonts/lexend-giga';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Cargar las fuentes
  let [fontsLoaded] = useFonts({
    LexendGiga_400Regular,
  });

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuario logueado:', user.email);

      // Consultar Firestore para obtener el tipo de usuario
      const db = getFirestore(appFirebase);
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const userType = docSnap.data().userType;

        // Navegar a la pantalla correspondiente según el tipo de usuario
        if (userType === 'conductor') {
          navigation.navigate('DriverHome'); // Pantalla del conductor
        } else {
          navigation.navigate('CustomerHome'); // Pantalla del cliente
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <Text style={styles.title}>BIENVENIDO</Text>
        <View style={styles.innerContainer}>
          <Text style={styles.slogan}>NOS MOVEMOS POR TI</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {/* Botón con LinearGradient */}
          <LinearGradient
            colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
            start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
            end={{ x: 1.5, y: 0 }} // Termina en la esquina derecha
            style={styles.loginButton}
          >
            <TouchableOpacity onPress={handleLogin} style={styles.buttonContent}>
              <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.switchContainer}>
            <Text style={styles.account}>¿No tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
    padding: 16,
  },
  outerContainer: {
    backgroundColor: '#F6F1FF', // Morado claro
    padding: 16,
  },
  innerContainer: {
    backgroundColor: '#EFE7FF', // Morado oscuro
    padding: 20,
    width: '100%', // Ajusta el ancho según sea necesario
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000', // Color de texto blanco
    fontFamily: 'LexendGiga_400Regular',
  },
  slogan: {
    fontSize: 28,
    padding: 10,
    marginBottom: 16,
    color: '#000000', // Color de texto blanco
    fontFamily: 'LexendGiga_400Regular',
  },
  input: {
    backgroundColor:'#D9D9D9',
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 20,
    color: '#8E8E8E',
    fontFamily: 'LexendGiga_400Regular',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#DBC8FF', // Color del botón
    padding: 10,
    alignItems: 'center', // Centra el texto del botón
    marginBottom: 12, // Espacio debajo del botón
  },
  loginButtonText: {
    color: '#000000', // Color del texto del botón
    fontSize: 13,
    fontFamily: 'LexendGiga_400Regular',
  },
  switchContainer: {
    marginTop: 16,
    alignItems: 'center',
    fontFamily: 'LexendGiga_400Regular',
  },
  account:{
    fontFamily: 'LexendGiga_400Regular',
  },
  link: {
    color: '#6918B4', // Color del texto de enlace
    fontFamily: 'LexendGiga_400Regular',
  },
});