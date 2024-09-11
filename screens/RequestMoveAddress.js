import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Location from 'expo-location';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RequestMoveAddress({ address, onAddressUpdate, onNext, onPrevious }) {
  const [pickupLocation, setPickupLocation] = useState(address.pickupLocation || null);
  const [dropoffLocation, setDropoffLocation] = useState(address.dropoffLocation || null);
  const [date, setDate] = useState(address.date || new Date());
  const [time, setTime] = useState(address.time || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 4.611, // Bogotá latitude
    longitude: -74.0817, // Bogotá longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      const fitBounds = {
        latitude: (pickupLocation.coordinates.lat + dropoffLocation.coordinates.lat) / 2,
        longitude: (pickupLocation.coordinates.lng + dropoffLocation.coordinates.lng) / 2,
        latitudeDelta: Math.abs(pickupLocation.coordinates.lat - dropoffLocation.coordinates.lat) * 1.5,
        longitudeDelta: Math.abs(pickupLocation.coordinates.lng - dropoffLocation.coordinates.lng) * 1.5,
      };
      setMapRegion(fitBounds);
    }
  }, [pickupLocation, dropoffLocation]);

  const handleNext = async () => {
    try {
      const userId = auth.currentUser.uid;
      if (!userId) {
        console.error('No authenticated user found');
        return;
      }

      const moveRef = doc(db, 'moves', userId);

      await setDoc(moveRef, {
        pickupLocation: pickupLocation ? {
          address: pickupLocation.address,
          coordinates: pickupLocation.coordinates
        } : null,
        dropoffLocation: dropoffLocation ? {
          address: dropoffLocation.address,
          coordinates: dropoffLocation.coordinates
        } : null,
        date: date,
        time: time,
      }, { merge: true });

      onNext();
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const today = new Date();
    if (currentDate < today.setHours(0, 0, 0, 0)) {
      alert('No se puede seleccionar una fecha anterior a la actual.');
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
      setDate(currentDate);
      onAddressUpdate({
        pickupLocation,
        dropoffLocation,
        date: currentDate,
        time
      });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    const selectedHour = currentTime.getHours();
    if (selectedHour < 6 || selectedHour > 20) {
      alert('La hora debe estar entre las 6 AM y las 8 PM.');
      setShowTimePicker(false);
    } else {
      setShowTimePicker(false);
      setTime(currentTime);
      onAddressUpdate({
        pickupLocation,
        dropoffLocation,
        date,
        time: currentTime
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'
        extraScrollHeight={20}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Nombre de la Página</Text>
        </View>

        <View style={styles.innerContainer}>
          <GooglePlacesAutocomplete
            placeholder="Ingresa la dirección de recogida"
            onPress={(data, details = null) => {
              const newPickupLocation = {
                address: data.description,
                coordinates: details.geometry.location
              };
              setPickupLocation(newPickupLocation);
              onAddressUpdate({
                pickupLocation: newPickupLocation,
                dropoffLocation,
                date,
                time
              });
            }}
            query={{
              key: 'AIzaSyDYl1UOXedon5rpWbXbSbQI1YDO81eJtLU',
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
              const newDropoffLocation = {
                address: data.description,
                coordinates: details.geometry.location
              };
              setDropoffLocation(newDropoffLocation);
              onAddressUpdate({
                pickupLocation,
                dropoffLocation: newDropoffLocation,
                date,
                time
              });
            }}
            query={{
              key: 'AIzaSyDYl1UOXedon5rpWbXbSbQI1YDO81eJtLU',
              language: 'es',
            }}
            styles={{
              textInput: styles.input,
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
          />

          <View>
            <Button title="Seleccionar fecha" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <Text>Fecha seleccionada: {date.toLocaleDateString()}</Text>
          </View>

          <View>
            <Button title="Seleccionar hora" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
            <Text>Hora seleccionada: {time.toLocaleTimeString()}</Text>
          </View>

          <MapView
            style={styles.map}
            region={mapRegion}
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
          </MapView>

          <View style={styles.selectedTextContainer}>
            <Text>Dirección de recogida: {pickupLocation?.address || 'No seleccionada'}</Text>
            <Text>Dirección de entrega: {dropoffLocation?.address || 'No seleccionada'}</Text>
          </View>

          <Button title="Anterior" onPress={onPrevious} />
          <Button title="Siguiente" onPress={handleNext} disabled={!pickupLocation || !dropoffLocation} />
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  map: {
    height: 200,
    marginBottom: 16,
  },
  selectedTextContainer: {
    marginBottom: 16,
  },
});