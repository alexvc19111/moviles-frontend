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
  Modal
} from 'react-native';

const CalificarTareasScreen = ({ navigation, route }) => {
  const tarea = route?.params?.tarea || {
    titulo: 'Examen Parcial',
    materia: 'Matemáticas',
    fecha: '25 Mar',
    entregas: 38,
    total: 45
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [calificacionTemp, setCalificacionTemp] = useState('');
  const [comentarioTemp, setComentarioTemp] = useState('');

  const [entregas, setEntregas] = useState([
    { id: 1, nombre: 'Juan Pérez', matricula: 'EST-2023-001', calificacion: 95, comentario: 'Excelente trabajo', estado: 'calificado', fechaEntrega: '24 Mar 18:30' },
    { id: 2, nombre: 'María González', matricula: 'EST-2023-002', calificacion: 88, comentario: 'Buen desarrollo', estado: 'calificado', fechaEntrega: '24 Mar 19:15' },
    { id: 3, nombre: 'Carlos Rodríguez', matricula: 'EST-2023-003', calificacion: null, comentario: '', estado: 'pendiente', fechaEntrega: '25 Mar 08:00' },
    { id: 4, nombre: 'Ana Martínez', matricula: 'EST-2023-004', calificacion: 92, comentario: 'Muy bien', estado: 'calificado', fechaEntrega: '24 Mar 20:00' },
    { id: 5, nombre: 'Luis Hernández', matricula: 'EST-2023-005', calificacion: null, comentario: '', estado: 'pendiente', fechaEntrega: '25 Mar 09:30' },
    { id: 6, nombre: 'Laura Sánchez', matricula: 'EST-2023-006', calificacion: null, comentario: '', estado: 'pendiente', fechaEntrega: '25 Mar 10:15' },
    { id: 7, nombre: 'Pedro López', matricula: 'EST-2023-007', calificacion: 85, comentario: 'Correcto', estado: 'calificado', fechaEntrega: '24 Mar 21:00' },
  ]);

  const [filtro, setFiltro] = useState('todos'); // todos, pendiente, calificado

  const abrirModal = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setCalificacionTemp(alumno.calificacion?.toString() || '');
    setComentarioTemp(alumno.comentario || '');
    setModalVisible(true);
  };

  const guardarCalificacion = () => {
    if (!calificacionTemp || isNaN(calificacionTemp)) {
      Alert.alert('Error', 'Ingresa una calificación válida');
      return;
    }

    const calif = parseFloat(calificacionTemp);
    if (calif < 0 || calif > 100) {
      Alert.alert('Error', 'La calificación debe estar entre 0 y 100');
      return;
    }

    setEntregas(entregas.map(e => 
      e.id === alumnoSeleccionado.id 
        ? { ...e, calificacion: calif, comentario: comentarioTemp, estado: 'calificado' }
        : e
    ));

    setModalVisible(false);
    Alert.alert('Guardado', 'Calificación guardada correctamente');
  };

  const getEntregasFiltradas = () => {
    if (filtro === 'todos') return entregas;
    return entregas.filter(e => e.estado === filtro);
  };

  const entregasFiltradas = getEntregasFiltradas();
  const pendientes = entregas.filter(e => e.estado === 'pendiente').length;
  const calificados = entregas.filter(e => e.estado === 'calificado').length;
  const promedio = entregas.filter(e => e.calificacion !== null)
    .reduce((sum, e) => sum + e.calificacion, 0) / (calificados || 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Calificar Tareas</Text>
          <Text style={styles.headerSubtitle}>{tarea.titulo}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Información de la tarea */}
      <View style={styles.tareaInfo}>
        <Text style={styles.tareaMateria}>📚 {tarea.materia}</Text>
        <Text style={styles.tareaFecha}>📅 Fecha límite: {tarea.fecha}</Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{calificados}</Text>
          <Text style={styles.statLabel}>Calificados</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statNumber, { color: '#FF9800' }]}>{pendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.statNumber, { color: '#2196F3' }]}>{promedio.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Promedio</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[styles.filtroButton, filtro === 'todos' && styles.filtroButtonActive]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={[styles.filtroText, filtro === 'todos' && styles.filtroTextActive]}>
            Todos ({entregas.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroButton, filtro === 'pendiente' && styles.filtroButtonActive]}
          onPress={() => setFiltro('pendiente')}
        >
          <Text style={[styles.filtroText, filtro === 'pendiente' && styles.filtroTextActive]}>
            Pendientes ({pendientes})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroButton, filtro === 'calificado' && styles.filtroButtonActive]}
          onPress={() => setFiltro('calificado')}
        >
          <Text style={[styles.filtroText, filtro === 'calificado' && styles.filtroTextActive]}>
            Calificados ({calificados})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de entregas */}
      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        {entregasFiltradas.map((entrega) => (
          <TouchableOpacity
            key={entrega.id}
            style={styles.entregaCard}
            onPress={() => abrirModal(entrega)}
          >
            <View style={styles.entregaHeader}>
              <View style={styles.entregaInfo}>
                <Text style={styles.entregaNombre}>{entrega.nombre}</Text>
                <Text style={styles.entregaMatricula}>{entrega.matricula}</Text>
                <Text style={styles.entregaFecha}>📅 {entrega.fechaEntrega}</Text>
              </View>
              
              {entrega.estado === 'calificado' ? (
                <View style={styles.calificacionBadge}>
                  <Text style={styles.calificacionNumber}>{entrega.calificacion}</Text>
                  <Text style={styles.calificacionMax}>/100</Text>
                </View>
              ) : (
                <View style={styles.pendienteBadge}>
                  <Text style={styles.pendienteText}>Sin calificar</Text>
                </View>
              )}
            </View>

            {entrega.comentario && (
              <View style={styles.comentarioBox}>
                <Text style={styles.comentarioLabel}>💬 Comentario:</Text>
                <Text style={styles.comentarioText}>{entrega.comentario}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.calificarButton}>
              <Text style={styles.calificarButtonText}>
                {entrega.estado === 'calificado' ? '✏️ Editar calificación' : '📝 Calificar'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal de calificación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calificar Tarea</Text>
            <Text style={styles.modalAlumno}>{alumnoSeleccionado?.nombre}</Text>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalLabel}>Calificación (0-100)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: 95"
                value={calificacionTemp}
                onChangeText={setCalificacionTemp}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalFormGroup}>
              <Text style={styles.modalLabel}>Comentarios (opcional)</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Agrega comentarios sobre el trabajo..."
                value={comentarioTemp}
                onChangeText={setComentarioTemp}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={guardarCalificacion}
              >
                <Text style={styles.modalButtonTextSave}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: '#2196F3',
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  headerSpacer: {
    width: 50,
  },
  tareaInfo: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tareaMateria: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '600',
    marginBottom: 5,
  },
  tareaFecha: {
    fontSize: 13,
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 15,
  },
  filtroButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  filtroButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filtroText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filtroTextActive: {
    color: '#FFFFFF',
  },
  lista: {
    flex: 1,
    paddingHorizontal: 20,
  },
  entregaCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  entregaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  entregaInfo: {
    flex: 1,
  },
  entregaNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  entregaMatricula: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  entregaFecha: {
    fontSize: 11,
    color: '#999',
  },
  calificacionBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calificacionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  calificacionMax: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  pendienteBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pendienteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  comentarioBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  comentarioLabel: {
    fontSize: 11,
    color: '#757575',
    marginBottom: 4,
  },
  comentarioText: {
    fontSize: 13,
    color: '#212121',
    lineHeight: 18,
  },
  calificarButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  calificarButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalAlumno: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalFormGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#212121',
  },
  modalTextArea: {
    height: 100,
    paddingTop: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F5F5F5',
  },
  modalButtonSave: {
    backgroundColor: '#4CAF50',
  },
  modalButtonTextCancel: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CalificarTareasScreen;
