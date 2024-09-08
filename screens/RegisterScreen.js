// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import appFirebase from '../firebase';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('cliente'); // Tipo de usuario por defecto
  const [error, setError] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        console.log('Usuario registrado:', user.email);

        // Guardar el tipo de usuario en Firestore
        const db = getFirestore(appFirebase);
        await setDoc(doc(db, 'users', user.uid), {
          email: email,
          userType: userType, // Aquí se guarda el tipo de usuario
        });

        navigation.navigate('Login'); // Redirigir al usuario al Login
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
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
      
      {/* Picker para seleccionar el tipo de usuario */}
      <Picker
        selectedValue={userType}
        style={styles.picker}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Cliente" value="cliente" />
        <Picker.Item label="Conductor" value="conductor" />
      </Picker>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Register" onPress={handleRegister} />
      <View style={styles.switchContainer}>
        <Text>¿Ya tienes una cuenta?</Text>
        <Button
          title="Inicia sesión"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 16 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  input: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    marginBottom: 12, 
    paddingHorizontal: 8 
  },
  picker: { 
    height: 50, 
    marginBottom: 12 
  },
  error: { 
    color: 'red', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  switchContainer: { 
    marginTop: 16, 
    alignItems: 'center' 
  },
});
