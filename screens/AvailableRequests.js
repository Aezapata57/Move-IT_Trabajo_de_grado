import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AvailableRequest() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetching data from Firestore (assuming 'moves' is the collection)
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'moves'));
        const fetchedRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity style={styles.requestItem} onPress={() => handleRequestClick(item)}>
      <Text style={styles.requestText}>Mudanza {item.date?.toDate().toLocaleDateString()}</Text>
      <Text style={styles.requestText}>Recogida: {item.pickupLocation?.address || 'No disponible'}</Text>
      <Text style={styles.requestText}>Entrega: {item.dropoffLocation?.address || 'No disponible'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Solicitudes de Mudanza Disponibles</Text>

      {/* Lista de solicitudes en dos columnas */}
      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Dos columnas
        columnWrapperStyle={styles.columnWrapper}
        style={styles.list}
      />

      {/* Modal para mostrar detalles de la mudanza seleccionada */}
      {selectedRequest && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.detailsHeader}>Detalles de la Mudanza</Text>
              <Text>Fecha: {selectedRequest.date?.toDate().toLocaleDateString()}</Text>
              <Text>Hora: {selectedRequest.time?.toDate().toLocaleTimeString()}</Text>
              <Text>Recogida: {selectedRequest.pickupLocation?.address || 'No disponible'}</Text>
              <Text>Entrega: {selectedRequest.dropoffLocation?.address || 'No disponible'}</Text>

              {/* Mostrar inventario */}
              <Text>Inventario:</Text>
              {selectedRequest.inventory?.length > 0 ? (
                selectedRequest.inventory.map((item, index) => (
                  <Text key={index}>
                    {item.name} - Cantidad: {item.quantity}
                  </Text>
                ))
              ) : (
                <Text>No hay inventario disponible</Text>
              )}

              {/* Botones de acción */}
              <View style={styles.buttonContainer}>
                <Button title="Aceptar Mudanza" onPress={() => {/* Lógica para aceptar la mudanza */}} />
                <Button title="Cerrar" onPress={closeModal} color="red" />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  requestItem: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5, // Espacio entre columnas
    elevation: 2,
  },
  requestText: {
    fontSize: 14,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para el modal
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  detailsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});