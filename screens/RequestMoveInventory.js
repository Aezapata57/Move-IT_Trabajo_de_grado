import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useFonts, LexendGiga_400Regular } from '@expo-google-fonts/lexend-giga';

const itemsList = [
  { name: 'Aparador', value: 40, size: '90x40x180 cm' },
  { name: 'Armario', value: 80, size: '200x60x200 cm' },
  { name: 'Caja de cartón', value: 30, size: '50x30x30 cm' },
  { name: 'Sofá', value: 70, size: '200x90x90 cm' },
  { name: 'Silla', value: 15, size: '45x45x90 cm' },
  { name: 'Mesa de comedor', value: 50, size: '180x90x75 cm' },
  { name: 'Cama individual', value: 60, size: '90x190 cm' },
  { name: 'Cama matrimonial', value: 80, size: '150x190 cm' },
  { name: 'Cama King Size', value: 100, size: '200x200 cm' },
  { name: 'Colchón individual', value: 30, size: '90x190 cm' },
  { name: 'Colchón matrimonial', value: 40, size: '150x190 cm' },
  { name: 'Colchón King Size', value: 50, size: '200x200 cm' },
  { name: 'Lavadora', value: 60, size: '60x60x85 cm' },
  { name: 'Secadora', value: 60, size: '60x60x85 cm' },
  { name: 'Frigorífico', value: 70, size: '70x60x190 cm' },
  { name: 'Horno', value: 30, size: '60x60x60 cm' },
  { name: 'Microondas', value: 20, size: '45x30x30 cm' },
  { name: 'Cafetera', value: 10, size: '20x15x30 cm' },
  { name: 'Tostadora', value: 10, size: '20x15x15 cm' },
  { name: 'Plancha', value: 10, size: '30x12x15 cm' },
  { name: 'Aspiradora', value: 25, size: '30x30x50 cm' },
  { name: 'Televisor', value: 80, size: '110x10x70 cm' },
  { name: 'Estante', value: 40, size: '80x30x180 cm' },
  { name: 'Espejo', value: 30, size: '60x90 cm' },
  { name: 'Lámpara de pie', value: 15, size: '30x30x150 cm' },
  { name: 'Lámpara de mesa', value: 15, size: '20x20x50 cm' },
  { name: 'Caja de herramientas', value: 25, size: '40x30x20 cm' },
  { name: 'Despensero', value: 50, size: '90x40x180 cm' },
  { name: 'Mesa auxiliar', value: 20, size: '50x50x50 cm' },
  { name: 'Cuna', value: 40, size: '70x140 cm' },
  { name: 'Cortinas', value: 15, size: '200x250 cm' },
  { name: 'Tapete', value: 25, size: '160x230 cm' },
  { name: 'Ventilador', value: 20, size: '40x40x100 cm' },
  { name: 'Estufa', value: 40, size: '60x40x80 cm' },
  { name: 'Sillón reclinable', value: 70, size: '100x90x100 cm' },
  { name: 'Mueble para TV', value: 30, size: '120x40x60 cm' },
  { name: 'Ropa', value: 10, size: 'varios tamaños' },
  { name: 'Libros', value: 10, size: 'varios tamaños' },
  { name: 'Documentos', value: 5, size: 'varios tamaños' },
  { name: 'Utensilios de cocina', value: 15, size: 'varios tamaños' },
  { name: 'Electrodomésticos', value: 50, size: 'varios tamaños' },
  { name: 'Decoración', value: 20, size: 'varios tamaños' },
  { name: 'Juguetes', value: 15, size: 'varios tamaños' },
  { name: 'Herramientas', value: 30, size: 'varios tamaños' },
  { name: 'Ropa de cama', value: 20, size: 'varios tamaños' },
  { name: 'Ropa de cocina', value: 15, size: 'varios tamaños' },
  { name: 'Electrodomésticos pequeños', value: 20, size: 'varios tamaños' },
  { name: 'Aparatos electrónicos', value: 40, size: 'varios tamaños' },
  { name: 'Herramientas de jardinería', value: 30, size: 'varios tamaños' },
  { name: 'Silla de oficina', value: 30, size: '60x60x110 cm' },
  { name: 'Mesa de oficina', value: 50, size: '120x60x75 cm' },
  { name: 'Lámpara de escritorio', value: 15, size: '20x20x30 cm' },
  { name: 'Cesta de ropa sucia', value: 15, size: '40x30x60 cm' },
  { name: 'Zapatero', value: 25, size: '60x30x90 cm' },
  { name: 'Silla de comedor', value: 20, size: '45x45x90 cm' },
  { name: 'Espejo grande', value: 40, size: '100x200 cm' },
  { name: 'Mesa de centro', value: 30, size: '80x80x45 cm' },
  { name: 'Vitrina', value: 50, size: '80x40x180 cm' },
  { name: 'Cajonera', value: 40, size: '60x40x120 cm' },
  { name: 'Cuna de viaje', value: 30, size: '70x120 cm' },
  { name: 'Mesa plegable', value: 25, size: '80x60x75 cm' },
  { name: 'Silla plegable', value: 15, size: '40x40x90 cm' },
  { name: 'Mueble de almacenaje', value: 50, size: '120x40x180 cm' },
  { name: 'Sillón', value: 40, size: '80x80x80 cm' },
  { name: 'Cama nido', value: 50, size: '90x200 cm' },
  { name: 'Cama doble', value: 60, size: '135x190 cm' },
  { name: 'Cama ajustable', value: 80, size: '150x200 cm' },
  { name: 'Cama con almacenaje', value: 90, size: '160x200 cm' },
  { name: 'Frigorífico pequeño', value: 30, size: '50x50x90 cm' },
  { name: 'Frigorífico grande', value: 70, size: '70x70x190 cm' },
  { name: 'Horno microondas', value: 25, size: '45x30x30 cm' },
  { name: 'Placa de inducción', value: 30, size: '30x30x10 cm' },
  { name: 'Batidora', value: 15, size: '25x25x35 cm' },
  { name: 'Tetera', value: 10, size: '15x15x20 cm' },
  { name: 'Aspiradora robot', value: 30, size: '35x35x10 cm' },
  { name: 'Cafetera espresso', value: 20, size: '20x20x30 cm' },
  { name: 'Cubo de basura', value: 10, size: '30x30x50 cm' },
  { name: 'Cepillo de barrer', value: 10, size: '20x5x150 cm' },
  { name: 'Escoba', value: 15, size: '25x5x150 cm' },
  { name: 'Rastrillo', value: 10, size: '30x5x150 cm' },
  { name: 'Pala de nieve', value: 15, size: '35x10x150 cm' },
];

export default function InventoryScreen({ inventory, onInventoryUpdate, onNext }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [inputHeight, setInputHeight] = useState(40);

  let [fontsLoaded] = useFonts({
    LexendGiga_400Regular,
  });

  const handleAddItem = async () => {
    if (selectedItem && quantity && !isNaN(quantity) && parseInt(quantity, 10) > 0) {
      const item = itemsList.find(item => item.name === selectedItem);
      if (item) {
        const newItem = {
          name: item.name,
          value: item.value,
          quantity: parseInt(quantity, 10),
          description: description ? description : '', // Asegúrate de que no sea undefined
        };
  
        console.log("Nuevo ítem a agregar:", newItem); // Verifica el objeto
  
        // Aquí llama a la función que guarda en Firestore
        try {
          await onInventoryUpdate([...inventory, newItem]);
          setSelectedItem('');
          setQuantity('');
          setDescription('');
        } catch (error) {
          console.error("Error al guardar el inventario:", error);
        }
      }
    } else {
      console.log("Por favor, selecciona un ítem y una cantidad válida.");
    }
  };  

  const handleRemoveItem = (index) => {
    const newInventory = inventory.filter((_, i) => i !== index);
    onInventoryUpdate(newInventory);
  };

  const handleNext = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDoc = doc(db, 'moves', userId);
      await setDoc(userDoc, {
        inventory: inventory,
      }, { merge: true });
      onNext();
    } catch (error) {
      console.error('Error al guardar el inventario:', error);
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>INVENTARIO</Text>
      <View style={styles.outerContainer}>
        {/* Botón que abre el modal */}
        <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.picker}>
          <Text style={styles.pickerText}>
            {selectedItem ? `${selectedItem}` : 'Selecciona un ítem'}
          </Text>
        </TouchableOpacity>

        <Modal visible={isVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Contenedor desplazable para las opciones */}
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {itemsList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedItem(item.name);
                      setIsVisible(false);
                    }}
                    style={styles.option}
                  >
                    <Text style={styles.optionText}>{`${item.name} (${item.size})`}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Botón para cerrar el modal sin seleccionar */}
              <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <TextInput
          placeholder="Cantidad"
          placeholderTextColor="#8E8E8E"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          style={styles.input}
        />

        <TextInput
          placeholder="Descripción"
          placeholderTextColor="#8E8E8E"
          value={description}
          onChangeText={setDescription}
          style={styles.inputDescription}
          multiline={true} // Permite que el texto sea multilinea
          onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)} // Ajusta la altura según el contenido
          maxLength={250} // Límite de caracteres
        />
        
        <TouchableOpacity
          onPress={handleAddItem}
          style={[styles.addButton, (!selectedItem || !quantity) && styles.disabledButton]} // Añadir estilo deshabilitado
          disabled={!selectedItem || !quantity} // Deshabilitar si no hay ítem o cantidad
        >
          <Text style={styles.addButtonText}>Añadir al inventario</Text>
        </TouchableOpacity>
        
        <FlatList
          data={inventory}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
                <Text style={styles.itemQuantity}>Descripción:</Text>
                <Text style={styles.itemQuantity}>{item.description}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveItem(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <TouchableOpacity style={[styles.nextButton, inventory.length === 0 && styles.disabledButton]} onPress={handleNext} disabled={inventory.length === 0}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F6F1FF',
  },
  outerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EFE7FF',
  },
  headerText: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'LexendGiga_400Regular',
  },
  picker: {
    backgroundColor:'#D9D9D9',
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 20,
    fontFamily: 'LexendGiga_400Regular',
    justifyContent: 'center',
  },
  pickerText: {
    fontFamily: 'LexendGiga_400Regular',
    color: '#8E8E8E',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxHeight: '60%', // Limitar la altura del modal
  },
  scrollViewContent: {
    paddingBottom: 20, // Espacio adicional para el contenido desplazable
  },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff5252',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
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
  inputDescription:{
    backgroundColor:'#D9D9D9',
    fontSize: 12,
    marginBottom: 12,
    paddingHorizontal: 20,
    color: '#8E8E8E',
    fontFamily: 'LexendGiga_400Regular',
    minHeight: 40, // Altura mínima del input
    maxHeight: 150, // Altura máxima
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: 'LexendGiga_400Regular',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  itemInfo: {
    flexDirection: 'column',
  },
  itemName: {
    marginBottom: 4,
    fontFamily: 'LexendGiga_400Regular',
  },
  itemQuantity: {
    color: '#6c757d',
    fontFamily: 'LexendGiga_400Regular',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    marginVertical: 20,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'LexendGiga_400Regular',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontFamily: 'LexendGiga_400Regular',
  },
  disabledButton:{
    backgroundColor: '#A9A9A9',
  },
});