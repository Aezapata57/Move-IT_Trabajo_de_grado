// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import appFirebase from '../firebase';
import { useFonts, LexendGiga_400Regular } from '@expo-google-fonts/lexend-giga';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(''); // Tipo de usuario por defecto
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false); // Estado del modal
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Cargar las fuentes
  let [fontsLoaded] = useFonts({
    LexendGiga_400Regular,
  });

  const handleRegister = () => {
    if (!acceptedTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones para continuar');
      return;
    }


    createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        console.log('Usuario registrado:', user.email);

        // Guardar el tipo de usuario en Firestore
        const db = getFirestore(appFirebase);
        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          lastname: lastname,
          email: email,
          phone: phone,
          userType: userType, // Aquí se guarda el tipo de usuario
        });

        navigation.navigate('Login'); // Redirigir al usuario al Login
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const userTypeOptions = [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Conductor', value: 'conductor' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <Text style={styles.title}>REGISTRO</Text>
        <View style={styles.innerContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Lastname"
            value={lastname}
            onChangeText={setLastname}
            style={styles.input}
            autoCapitalize="none"
          />
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
          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />

          {/* Picker personalizado */}
          <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.picker}>
            <Text style={styles.pickerText}>
              {userType ? userTypeOptions.find(option => option.value === userType).label : 'Selecciona una opción'}
            </Text>
          </TouchableOpacity>

          {/* Modal para seleccionar el tipo de usuario */}
          <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              {userTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setUserType(option.value);
                    setIsVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              {/* Botón para cerrar el modal sin seleccionar */}
              <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Checkbox para aceptar términos y condiciones */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={acceptedTerms}
              onValueChange={setAcceptedTerms}
              color={acceptedTerms ? '#A76DFF' : undefined}
              tintColors={{ true: '#A76DFF', false: '#8E8E8E' }} // Personalización de colores
            />
            <Text style={styles.checkboxLabel}>Aceptar términos y condiciones</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <LinearGradient
            colors={['#DBC8FF', '#A76DFF']} // Colores del gradiente para el botón
            start={{ x: 0, y: 0 }} // Comienza en la esquina izquierda
            end={{ x: 1.5, y: 0 }} // Termina en la esquina derecha
            style={styles.registerButton}
          >
            <TouchableOpacity onPress={handleRegister} style={styles.buttonContent}>
              <Text style={styles.registerButtonText}>REGISTRARSE</Text>
            </TouchableOpacity>
          </LinearGradient>
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
    width: 320, // Ajusta el ancho según sea necesario
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
    fontSize: 12,
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
  registerButton: {
    backgroundColor: '#DBC8FF', // Color del botón
    alignItems: 'center', // Centra el texto del botón
    marginBottom: 12, // Espacio debajo del botón
  },
  buttonContent: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#000000', // Color del texto del botón
    fontSize: 13,
    fontFamily: 'LexendGiga_400Regular',
  },
  picker: {
    backgroundColor:'#D9D9D9',
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 20,
    color: '#8E8E8E',
    fontFamily: 'LexendGiga_400Regular',
    justifyContent: 'center',
  },
  pickerText: {
    fontFamily: 'LexendGiga_400Regular',
    color: 'black',
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 8,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'LexendGiga_400Regular',
    textAlign: 'center',
  },
  closeButton: {
    padding: 16,
    backgroundColor: '#A76DFF',
    borderRadius: 10,
    marginTop: 16,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'LexendGiga_400Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Alinea verticalmente el checkbox y el texto
    marginBottom: 12, // Espacio debajo del checkbox
  },
  checkboxLabel: {
    fontSize: 11,
    marginLeft: 10,
    fontFamily: 'LexendGiga_400Regular',
  },
});