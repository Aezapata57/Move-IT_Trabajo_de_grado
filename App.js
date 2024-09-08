import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

const Stack = createNativeStackNavigator();

const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [userType, setUserType] = useState(null);

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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {usuario ? (
          <>
            {userType === 'conductor' ? (
              <Stack.Screen name="DriverHome" component={DriverHome} />
            ) : (
              <>
                <Stack.Screen name="CustomerHome" component={CustomerHome} />
                <Stack.Screen name="RequestMove" component={RequestMove} />
                <Stack.Screen name="RequestHistory" component={RequestHistory} />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
