import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Platform, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Location from 'expo-location';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts, LexendGiga_400Regular } from '@expo-google-fonts/lexend-giga';

export default function RequestMoveAddress({ address = {}, onAddressUpdate, onNext, onPrevious }) {
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

  let [fontsLoaded] = useFonts({
    LexendGiga_400Regular,
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
    const fetchData = async () => {
      try {
        const userId = auth.currentUser.uid;
        if (!userId) {
          console.error('No authenticated user found');
          return;
        }
  
        const moveRef = doc(db, 'moves', userId);
        const moveDoc = await getDoc(moveRef);
  
        if (moveDoc.exists()) {
          const moveData = moveDoc.data();
          const fetchedPickupLocation = moveData.pickupLocation || null;
          const fetchedDropoffLocation = moveData.dropoffLocation || null;
  
          setPickupLocation(fetchedPickupLocation);
          setDropoffLocation(fetchedDropoffLocation);
          setDate(moveData.date ? new Date(moveData.date.seconds * 1000) : new Date());
          setTime(moveData.time ? new Date(moveData.time.seconds * 1000) : new Date());
  
          // Actualiza el mapa si ambas ubicaciones están disponibles
          if (fetchedPickupLocation && fetchedDropoffLocation) {
            const fitBounds = {
              latitude: (fetchedPickupLocation.coordinates.lat + fetchedDropoffLocation.coordinates.lat) / 2,
              longitude: (fetchedPickupLocation.coordinates.lng + fetchedDropoffLocation.coordinates.lng) / 2,
              latitudeDelta: Math.abs(fetchedPickupLocation.coordinates.lat - fetchedDropoffLocation.coordinates.lat) * 1.5,
              longitudeDelta: Math.abs(fetchedPickupLocation.coordinates.lng - fetchedDropoffLocation.coordinates.lng) * 1.5,
            };
            setMapRegion(fitBounds);
          }
        } else {
          console.log('No move data found for this user');
        }
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };
  
    fetchData();
  }, []);  // Solo se ejecutará una vez cuando el componente se monte. 
  
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
          address: pickupLocation.address || '', // Maneja casos donde no hay dirección
          coordinates: pickupLocation.coordinates || null
        } : null,
        dropoffLocation: dropoffLocation ? {
          address: dropoffLocation.address || '', // Maneja casos donde no hay dirección
          coordinates: dropoffLocation.coordinates || null
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
      <Text style={styles.headerText}>DIRECCIÓN Y HORA</Text>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'
        extraScrollHeight={20}
      >

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

          <View style={styles.rowContainer}>
            <View style={styles.column}>
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

            <View style={styles.column}>
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
    padding: 16,
    backgroundColor: '#F6F1FF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#EFE7FF',
  },
  headerText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'LexendGiga_400Regular',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Para que se distribuyan con espacio entre las columnas
    marginBottom: 16,
  },
  column: {
    flex: 1,  // Ocupa la mitad del espacio disponible
    paddingHorizontal: 8,  // Espaciado entre columnas
  },  
  map: {
    height: 200,
    marginBottom: 16,
  },
  selectedTextContainer: {
    marginBottom: 16,
  },
});