import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, LexendGiga_400Regular } from '@expo-google-fonts/lexend-giga';
import { Text, View, Image } from 'react-native'; // Añadido para el logo

// Importar Firebase y autenticación
import appFirebase from './firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

// Importar componentes de pantallas
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CustomerHome from "./screens/CustomerHome";
import DriverHome from "./screens/DriverHome";
import RequestMove from "./screens/RequestMove";
import RequestHistory from "./screens/RequestHistory";
import AvailableRequests from "./screens/AvailableRequests";

const Stack = createNativeStackNavigator();

const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [userType, setUserType] = useState(null);

  // Cargar las fuentes
  let [fontsLoaded] = useFonts({
    LexendGiga_400Regular,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);

        // Obtener el userType desde Firestore
        const userDoc = await getDoc(doc(db, 'users', usuarioFirebase.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        }
      } else {
        setUsuario(null);
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Retornar null si las fuentes aún no están cargadas
  if (!fontsLoaded) {
    return null;  // Retorna null hasta que las fuentes se carguen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#DBC8FF',
          },
          headerTintColor: '#fff',
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'LexendGiga_400Regular', fontSize: 20, color: '#000000', marginRight: 10 }}>
                MOVE-IT
              </Text>
              <Image
                source={require('./assets/Logo.png')} // Ruta al archivo de logo
                style={{ width: 70, height: 40 }}
              />
            </View>
          ),
          headerTitleAlign: 'center', // Centrar el título y el logo
        }}>
        {usuario ? (
          <>
            {userType === 'conductor' ? (
              <>
                <Stack.Screen name='DriverHome' component={DriverHome} />
                <Stack.Screen name='AvailableRequests' component={AvailableRequests} />
              </>
            ) : (
              <>
                <Stack.Screen name='CustomerHome' component={CustomerHome} />
                <Stack.Screen name='RequestMove' component={RequestMove} />
                <Stack.Screen name='RequestHistory' component={RequestHistory} />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;