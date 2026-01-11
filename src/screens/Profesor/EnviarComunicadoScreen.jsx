import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

const EnviarComunicadoScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    destinatarios: 'todos',
    asunto: '',
    mensaje: '',
    prioridad: 'normal',
  });

  const [showDestinatariosPicker, setShowDestinatariosPicker] = useState(false);
  const [showPrioridadPicker, setShowPrioridadPicker] = useState(false);

  const destinatariosOptions = [
    { value: 'todos', label: 'Todos los Alumnos', icon: '👥' },
    { value: 'matematicas', label: 'Alumnos de Matemáticas', icon: '📐' },
    { value: 'fisica', label: 'Alumnos de Física', icon: '⚛️' },
    { value: 'programacion', label: 'Alumnos de Programación', icon: '💻' },
  ];

  const prioridades = [
    { value: 'baja', label: 'Baja', color: '#2196F3', icon: 'ℹ️' },
    { value: 'normal', label: 'Normal', color: '#4CAF50', icon: '📋' },
    { value: 'alta', label: 'Alta', color: '#FF9800', icon: '⚠️' },
    { value: 'urgente', label: 'Urgente', color: '#F44336', icon: '🚨' },
  ];

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const enviarComunicado = () => {
    if (!formData.asunto.trim()) {
      Alert.alert('Error', 'El asunto es requerido');
      return;
    }
    if (!formData.mensaje.trim()) {
      Alert.alert('Error', 'El mensaje es requerido');
      return;
    }

    const destinatario = destinatariosOptions.find(d => d.value === formData.destinatarios);
    const prioridad = prioridades.find(p => p.value === formData.prioridad);

    Alert.alert(
      'Confirmar Envío',
      `¿Enviar comunicado a "${destinatario.label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            Alert.alert(
              'Comunicado Enviado',
              'El comunicado ha sido enviado exitosamente',
              [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  const getPrioridadActual = () => {
    return prioridades.find(p => p.value === formData.prioridad);
  };

  const getDestinatarioActual = () => {
    return destinatariosOptions.find(d => d.value === formData.destinatarios);
  };

  const prioridadActual = getPrioridadActual();
  const destinatarioActual = getDestinatarioActual();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enviar Comunicado</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Destinatarios */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Destinatarios *</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowDestinatariosPicker(!showDestinatariosPicker)}
          >
            <View style={styles.pickerContent}>
              <Text style={styles.pickerIcon}>{destinatarioActual.icon}</Text>
              <Text style={styles.pickerText}>{destinatarioActual.label}</Text>
            </View>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          
          {showDestinatariosPicker && (
            <View style={styles.pickerOptions}>
              {destinatariosOptions.map((opcion) => (
                <TouchableOpacity
                  key={opcion.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateField('destinatarios', opcion.value);
                    setShowDestinatariosPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionIcon}>{opcion.icon}</Text>
                  <Text style={styles.pickerOptionText}>{opcion.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Prioridad */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Prioridad</Text>
          <TouchableOpacity
            style={[styles.picker, { borderColor: prioridadActual.color }]}
            onPress={() => setShowPrioridadPicker(!showPrioridadPicker)}
          >
            <View style={styles.pickerContent}>
              <Text style={styles.pickerIcon}>{prioridadActual.icon}</Text>
              <Text style={[styles.pickerText, { color: prioridadActual.color }]}>
                {prioridadActual.label}
              </Text>
            </View>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          
          {showPrioridadPicker && (
            <View style={styles.pickerOptions}>
              {prioridades.map((prioridad) => (
                <TouchableOpacity
                  key={prioridad.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    updateField('prioridad', prioridad.value);
                    setShowPrioridadPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionIcon}>{prioridad.icon}</Text>
                  <Text style={[styles.pickerOptionText, { color: prioridad.color }]}>
                    {prioridad.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Asunto */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Asunto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Recordatorio de examen"
            value={formData.asunto}
            onChangeText={(text) => updateField('asunto', text)}
          />
        </View>

        {/* Mensaje */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mensaje *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe tu mensaje aquí..."
            value={formData.mensaje}
            onChangeText={(text) => updateField('mensaje', text)}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <Text style={styles.caracteresCount}>
            {formData.mensaje.length} caracteres
          </Text>
        </View>

        {/* Plantillas sugeridas */}
        <View style={styles.plantillasSection}>
          <Text style={styles.plantillasTitle}>📝 Plantillas Sugeridas</Text>
          
          <TouchableOpacity
            style={styles.plantillaCard}
            onPress={() => {
              updateField('asunto', 'Recordatorio de Examen');
              updateField('mensaje', 'Estimados alumnos,\n\nLes recuerdo que el examen de [materia] será el día [fecha] a las [hora].\n\nTemas a repasar:\n- Tema 1\n- Tema 2\n- Tema 3\n\nSaludos cordiales.');
            }}
          >
            <Text style={styles.plantillaIcon}>📝</Text>
            <Text style={styles.plantillaText}>Recordatorio de Examen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plantillaCard}
            onPress={() => {
              updateField('asunto', 'Tarea Pendiente');
              updateField('mensaje', 'Estimados alumnos,\n\nLes recuerdo que tienen una tarea pendiente de entregar.\n\nFecha límite: [fecha]\n\nPor favor, asegúrense de cumplir con los requisitos establecidos.\n\nSaludos.');
            }}
          >
            <Text style={styles.plantillaIcon}>📚</Text>
            <Text style={styles.plantillaText}>Tarea Pendiente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.plantillaCard}
            onPress={() => {
              updateField('asunto', 'Cambio de Horario');
              updateField('mensaje', 'Estimados alumnos,\n\nLes informo que la clase del día [fecha] tendrá un cambio de horario.\n\nNuevo horario: [hora]\nAula: [aula]\n\nGracias por su atención.');
            }}
          >
            <Text style={styles.plantillaIcon}>📅</Text>
            <Text style={styles.plantillaText}>Cambio de Horario</Text>
          </TouchableOpacity>
        </View>

        {/* Información */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Los alumnos recibirán una notificación en su dispositivo y podrán ver el comunicado en su bandeja de mensajes
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botón enviar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.enviarButton} onPress={enviarComunicado}>
          <Text style={styles.enviarButtonText}>📤 Enviar Comunicado</Text>
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
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  pickerText: {
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
  },
  pickerArrow: {
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pickerOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#212121',
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
    height: 150,
    paddingTop: 15,
  },
  caracteresCount: {
    fontSize: 12,
    color: '#757575',
    marginTop: 6,
    textAlign: 'right',
  },
  plantillasSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  plantillasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  plantillaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  plantillaIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  plantillaText: {
    fontSize: 15,
    color: '#2196F3',
    fontWeight: '500',
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
  enviarButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  enviarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnviarComunicadoScreen;
