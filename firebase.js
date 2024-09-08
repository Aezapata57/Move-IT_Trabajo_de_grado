import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAwOxMMBeIznUxIxT943zqSb4TGMg_Btp8",
    authDomain: "move-it-b87c1.firebaseapp.com",
    projectId: "move-it-b87c1",
    storageBucket: "move-it-b87c1.appspot.com",
    messagingSenderId: "275871833090",
    appId: "1:275871833090:android:8ab445d4b486248b2d9b1b"
};

// Verifica si Firebase ya ha sido inicializado
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Inicializa o usa la instancia de Auth existente
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (e) {
    if (e.code === 'auth/already-initialized') {
        auth = getAuth(app);
    } else {
        throw e;
    }
}

// Inicializa Firestore
const db = getFirestore(app);

export { auth, db };