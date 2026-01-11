import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform
} from 'react-native';

const NuevaTareaScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    materia: '',
    tipo: 'Tarea',
    fechaEntrega: '',
    puntos: '',
  });

  const materias = ['Matemáticas', 'Física', 'Programación', 'Química'];
  const tipos = ['Tarea', 'Examen', 'Proyecto', 'Investigación', 'Práctica'];

  const [showMateriasPicker, setShowMateriasPicker] = useState(false);
  const [showTiposPicker, setShowTiposPicker] = useState(false);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const crearTarea = () => {
    // Validaciones
    if (!formData.titulo.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }
    if (!formData.materia) {
      Alert.alert('Error', 'Selecciona una materia');
      return;
    }
    if (!formData.fechaEntrega) {
      Alert.alert('Error', 'La fecha de entrega es requerida');
      return;
    }
    if (!formData.puntos || isNaN(formData.puntos)) {
      Alert.alert('Error', 'Los puntos deben ser un número válido');
      return;
    }

    Alert.alert(
      'Tarea Creada',
      `"${formData.titulo}" ha sido creada exitosamente`,
      [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Tarea</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Título */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Tarea de Álgebra Lineal"
            value={formData.titulo}
            onChangeText={(text) => updateField('titulo', text)}
          />
        </View>

        {/* Materia */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Materia *</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowMateriasPicker(!showMateriasPicker)}
          >
            <Text style={formData.materia ? styles.pickerText : styles.pickerPlaceholder}>
              {formData.materia || 'Selecciona una materia'}
            </Text>
            <Text style={styles.pickerIcon}>▼</Text>
          </TouchableOpacity>
          
          {showMateriasPicker && (
            <View style={styles.pickerOptions}>
              {materias.map((materia, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateField('materia', materia);
                    setShowMateriasPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{materia}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tipo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowTiposPicker(!showTiposPicker)}
          >
            <Text style={styles.pickerText}>{formData.tipo}</Text>
            <Text style={styles.pickerIcon}>▼</Text>
          </TouchableOpacity>
          
          {showTiposPicker && (
            <View style={styles.pickerOptions}>
              {tipos.map((tipo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateField('tipo', tipo);
                    setShowTiposPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Descripción */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe las instrucciones y requisitos de la tarea..."
            value={formData.descripcion}
            onChangeText={(text) => updateField('descripcion', text)}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Fecha de Entrega */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de Entrega *</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            value={formData.fechaEntrega}
            onChangeText={(text) => updateField('fechaEntrega', text)}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>Formato: día/mes/año</Text>
        </View>

        {/* Puntos */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Puntos *</Text>
          <TextInput
            style={styles.input}
            placeholder="100"
            value={formData.puntos}
            onChangeText={(text) => updateField('puntos', text)}
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>Valor máximo de la tarea</Text>
        </View>

        {/* Información adicional */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Los alumnos recibirán una notificación cuando crees esta tarea
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botón Crear */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.crearButton} onPress={crearTarea}>
          <Text style={styles.crearButtonText}>✓ Crear Tarea</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSpacer: {
    width: 80,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    color: '#212121',
  },
  textArea: {
    height: 120,
    paddingTop: 15,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
  },
  pickerText: {
    fontSize: 15,
    color: '#212121',
  },
  pickerPlaceholder: {
    fontSize: 15,
    color: '#999',
  },
  pickerIcon: {
    fontSize: 12,
    color: '#999',
  },
  pickerOptions: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#212121',
  },
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 6,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  crearButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  crearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NuevaTareaScreen;
