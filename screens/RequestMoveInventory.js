import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Lista de artículos con valores y tamaños asociados
const itemsList = [
  { name: 'Aparador', value: 40, size: '90x40x180 cm' },
  { name: 'Armario', value: 80, size: '200x60x200 cm' },
  { name: 'Caja de cartón', value: 2, size: '50x30x30 cm' },
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

export default function InventoryScreen({ inventory, onInventoryUpdate, onNext, onPrevious }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddItem = () => {
    if (selectedItem && quantity) {
      const item = itemsList.find(item => item.name === selectedItem);
      if (item) {
        onInventoryUpdate([...inventory, { name: item.name, value: item.value, quantity: parseInt(quantity, 10) }]);
        setSelectedItem('');
        setQuantity('');
      }
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
      <Picker
        selectedValue={selectedItem}
        onValueChange={(itemValue) => setSelectedItem(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona un ítem" value="" />
        {itemsList.map((item, index) => (
          <Picker.Item key={index} label={`${item.name} (${item.size})`} value={item.name} />
        ))}
      </Picker>
      <TextInput
        placeholder="Cantidad"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
      />
      <Button title="Añadir al inventario" onPress={handleAddItem} />
      
      <FlatList
        data={inventory}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Text>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button title="Siguiente" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});