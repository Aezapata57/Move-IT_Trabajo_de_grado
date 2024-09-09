import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { auth } from '../firebase';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios'; // Asegúrate de instalar axios con `expo install axios`

export default function RequestMoveAddress({ onNext, onPrevious }) {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      getRoute(pickupLocation.coordinates, dropoffLocation.coordinates);
    }
  }, [pickupLocation, dropoffLocation]);

  const getRoute = async (origin, destination) => {
    const API_KEY = 'AIzaSyDYl1UOXedon5rpWbXbSbQI1YDO81eJtLU'; // Reemplaza con tu API key de Google
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${API_KEY}`
    );

    const points = response.data.routes[0].overview_polyline.points;
    const decodedPoints = decodePolyline(points);
    setRouteCoordinates(decodedPoints);
  };

  const decodePolyline = (t) => {
    for (var n, r = [], a = 0, i = 0, o = 0; a < t.length;) {
      n = null;
      for (var u = 0, s = 0; ; ) {
        s = t.charCodeAt(a++) - 63;
        u |= (31 & s) << u;
        if (!(s >= 32)) {
          break;
        }
      }
      n = (u & 1) == 0 ? (u >> 1) : ~(u >> 1);
      u = 0;
      for (s = 0; ; ) {
        s = t.charCodeAt(a++) - 63;
        u |= (31 & s) << s;
        if (!(s >= 32)) {
          break;
        }
      }
      o += (u & 1) == 0 ? (u >> 1) : ~(u >> 1);
      r.push([o / 1e5, n / 1e5]);
    }
    return r;
  };

  const handleNext = async () => {
    const userId = auth.currentUser.uid;
    await firestore().collection('moves').doc(userId).set({
      pickupLocation: pickupLocation,
      dropoffLocation: dropoffLocation,
      date: date,
      time: time,
    }, { merge: true });
    onNext();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <GooglePlacesAutocomplete
          placeholder="Ingresa la dirección de recogida"
          onPress={(data, details = null) => {
            setPickupLocation({
              address: data.description,
              coordinates: details.geometry.location
            });
          }}
          query={{
            key: 'AIzaSyDYl1UOXedon5rpWbXbSbQI1YDO81eJtLU', // Reemplaza con tu API key de Google
            language: 'es',
          }}
          styles={{
            textInput: styles.input,
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
        />

        <GooglePlacesAutocomplete
          placeholder="Ingresa la dirección de entrega"
          onPress={(data, details = null) => {
            setDropoffLocation({
              address: data.description,
              coordinates: details.geometry.location
            });
          }}
          query={{
            key: 'AIzaSyDYl1UOXedon5rpWbXbSbQI1YDO81eJtLU', // Reemplaza con tu API key de Google
            language: 'es',
          }}
          styles={{
            textInput: styles.input,
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
        />

        <TextInput
          placeholder="Fecha"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Hora"
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />

        {/* Mapa con ruta */}
        <MapView
          style={styles.map}
          region={{
            latitude: currentLocation ? currentLocation.latitude : 37.78825,
            longitude: currentLocation ? currentLocation.longitude : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {pickupLocation && (
            <Marker
              coordinate={{
                latitude: pickupLocation.coordinates.lat,
                longitude: pickupLocation.coordinates.lng,
              }}
              title="Recogida"
            />
          )}
          {dropoffLocation && (
            <Marker
              coordinate={{
                latitude: dropoffLocation.coordinates.lat,
                longitude: dropoffLocation.coordinates.lng,
              }}
              title="Entrega"
            />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates.map(coord => ({
                latitude: coord[0],
                longitude: coord[1]
              }))}
              strokeColor="#000" // Color de la ruta
              strokeWidth={3} // Grosor de la línea
            />
          )}
        </MapView>

        <Button title="Anterior" onPress={onPrevious} />
        <Button title="Siguiente" onPress={handleNext} disabled={!pickupLocation || !dropoffLocation} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 20,
  },
});