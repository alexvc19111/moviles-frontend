import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';

const TomarAsistenciaScreen = ({ navigation, route }) => {
  const clase = route?.params?.clase || { 
    materia: 'Matemáticas', 
    hora: '08:00 - 09:30', 
    aula: 'A-201' 
  };

  const [fecha] = useState(new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: 'Juan Pérez', matricula: 'EST-2023-001', estado: null },
    { id: 2, nombre: 'María González', matricula: 'EST-2023-002', estado: null },
    { id: 3, nombre: 'Carlos Rodríguez', matricula: 'EST-2023-003', estado: null },
    { id: 4, nombre: 'Ana Martínez', matricula: 'EST-2023-004', estado: null },
    { id: 5, nombre: 'Luis Hernández', matricula: 'EST-2023-005', estado: null },
    { id: 6, nombre: 'Laura Sánchez', matricula: 'EST-2023-006', estado: null },
    { id: 7, nombre: 'Pedro López', matricula: 'EST-2023-007', estado: null },
    { id: 8, nombre: 'Sofia Ramírez', matricula: 'EST-2023-008', estado: null },
    { id: 9, nombre: 'Diego Torres', matricula: 'EST-2023-009', estado: null },
    { id: 10, nombre: 'Valentina Cruz', matricula: 'EST-2023-010', estado: null },
  ]);

  const toggleAsistencia = (id, estado) => {
    setAlumnos(alumnos.map(alumno => 
      alumno.id === id ? { ...alumno, estado } : alumno
    ));
  };

  const marcarTodos = (estado) => {
    setAlumnos(alumnos.map(alumno => ({ ...alumno, estado })));
  };

  const guardarAsistencia = () => {
    const sinRegistrar = alumnos.filter(a => a.estado === null).length;
    
    if (sinRegistrar > 0) {
      Alert.alert(
        'Asistencia incompleta',
        `Hay ${sinRegistrar} alumnos sin registrar. ¿Deseas continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Guardar', onPress: () => confirmarGuardado() }
        ]
      );
    } else {
      confirmarGuardado();
    }
  };

  const confirmarGuardado = () => {
    const presentes = alumnos.filter(a => a.estado === 'presente').length;
    const ausentes = alumnos.filter(a => a.estado === 'ausente').length;
    const retardos = alumnos.filter(a => a.estado === 'retardo').length;

    Alert.alert(
      'Asistencia Guardada',
      `✓ Presentes: ${presentes}\n✗ Ausentes: ${ausentes}\n⏰ Retardos: ${retardos}`,
      [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
    );
  };

  const getEstadisticas = () => {
    const presentes = alumnos.filter(a => a.estado === 'presente').length;
    const ausentes = alumnos.filter(a => a.estado === 'ausente').length;
    const retardos = alumnos.filter(a => a.estado === 'retardo').length;
    const sinRegistrar = alumnos.filter(a => a.estado === null).length;

    return { presentes, ausentes, retardos, sinRegistrar };
  };

  const stats = getEstadisticas();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Tomar Asistencia</Text>
          <Text style={styles.headerSubtitle}>{clase.materia}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Información de la clase */}
      <View style={styles.claseInfo}>
        <Text style={styles.fecha}>{fecha}</Text>
        <View style={styles.claseDetails}>
          <View style={styles.claseDetail}>
            <Text style={styles.claseDetailLabel}>🕐 Horario:</Text>
            <Text style={styles.claseDetailValue}>{clase.hora}</Text>
          </View>
          <View style={styles.claseDetail}>
            <Text style={styles.claseDetailLabel}>📍 Aula:</Text>
            <Text style={styles.claseDetailValue}>{clase.aula}</Text>
          </View>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.presentes}</Text>
          <Text style={styles.statLabel}>Presentes</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FFEBEE' }]}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.ausentes}</Text>
          <Text style={styles.statLabel}>Ausentes</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statNumber, { color: '#FF9800' }]}>{stats.retardos}</Text>
          <Text style={styles.statLabel}>Retardos</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#F5F5F5' }]}>
          <Text style={[styles.statNumber, { color: '#757575' }]}>{stats.sinRegistrar}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
      </View>

      {/* Botones de acción rápida */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.quickButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => marcarTodos('presente')}
        >
          <Text style={styles.quickButtonText}>✓ Marcar Todos Presentes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.quickButton, { backgroundColor: '#F44336' }]}
          onPress={() => marcarTodos('ausente')}
        >
          <Text style={styles.quickButtonText}>✗ Marcar Todos Ausentes</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de alumnos */}
      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        <Text style={styles.listaTitle}>Lista de Alumnos ({alumnos.length})</Text>
        
        {alumnos.map((alumno) => (
          <View key={alumno.id} style={styles.alumnoCard}>
            <View style={styles.alumnoInfo}>
              <Text style={styles.alumnoNombre}>{alumno.nombre}</Text>
              <Text style={styles.alumnoMatricula}>{alumno.matricula}</Text>
            </View>
            
            <View style={styles.estadoButtons}>
              <TouchableOpacity
                style={[
                  styles.estadoButton,
                  alumno.estado === 'presente' && styles.estadoPresente
                ]}
                onPress={() => toggleAsistencia(alumno.id, 'presente')}
              >
                <Text style={[
                  styles.estadoButtonText,
                  alumno.estado === 'presente' && styles.estadoButtonTextActive
                ]}>✓</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.estadoButton,
                  alumno.estado === 'retardo' && styles.estadoRetardo
                ]}
                onPress={() => toggleAsistencia(alumno.id, 'retardo')}
              >
                <Text style={[
                  styles.estadoButtonText,
                  alumno.estado === 'retardo' && styles.estadoButtonTextActive
                ]}>⏰</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.estadoButton,
                  alumno.estado === 'ausente' && styles.estadoAusente
                ]}
                onPress={() => toggleAsistencia(alumno.id, 'ausente')}
              >
                <Text style={[
                  styles.estadoButtonText,
                  alumno.estado === 'ausente' && styles.estadoButtonTextActive
                ]}>✗</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botón guardar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.guardarButton} onPress={guardarAsistencia}>
          <Text style={styles.guardarButtonText}>💾 Guardar Asistencia</Text>
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
  claseInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fecha: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  claseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  claseDetail: {
    alignItems: 'center',
  },
  claseDetailLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  claseDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 12,
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 15,
  },
  quickButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  lista: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  alumnoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  alumnoInfo: {
    flex: 1,
  },
  alumnoNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  alumnoMatricula: {
    fontSize: 12,
    color: '#757575',
  },
  estadoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  estadoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  estadoPresente: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  estadoAusente: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  estadoRetardo: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  estadoButtonText: {
    fontSize: 18,
    color: '#999',
  },
  estadoButtonTextActive: {
    color: '#FFFFFF',
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
  guardarButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  guardarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TomarAsistenciaScreen;
