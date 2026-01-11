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

const SubirCalificacionesScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    materia: '',
    periodo: 'Parcial 1',
    tipoEvaluacion: 'Examen',
  });

  const [showMateriasPicker, setShowMateriasPicker] = useState(false);
  const [showPeriodosPicker, setShowPeriodosPicker] = useState(false);
  const [showTiposPicker, setShowTiposPicker] = useState(false);

  const materias = ['Matemáticas', 'Física', 'Programación', 'Química'];
  const periodos = ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Final'];
  const tiposEvaluacion = ['Examen', 'Tarea', 'Proyecto', 'Participación', 'Otro'];

  const [calificaciones, setCalificaciones] = useState([
    { id: 1, nombre: 'Juan Pérez', matricula: 'EST-2023-001', calificacion: '' },
    { id: 2, nombre: 'María González', matricula: 'EST-2023-002', calificacion: '' },
    { id: 3, nombre: 'Carlos Rodríguez', matricula: 'EST-2023-003', calificacion: '' },
    { id: 4, nombre: 'Ana Martínez', matricula: 'EST-2023-004', calificacion: '' },
    { id: 5, nombre: 'Luis Hernández', matricula: 'EST-2023-005', calificacion: '' },
    { id: 6, nombre: 'Laura Sánchez', matricula: 'EST-2023-006', calificacion: '' },
    { id: 7, nombre: 'Pedro López', matricula: 'EST-2023-007', calificacion: '' },
    { id: 8, nombre: 'Sofia Ramírez', matricula: 'EST-2023-008', calificacion: '' },
  ]);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateCalificacion = (id, value) => {
    setCalificaciones(calificaciones.map(c => 
      c.id === id ? { ...c, calificacion: value } : c
    ));
  };

  const aplicarATodos = () => {
    Alert.prompt(
      'Aplicar calificación',
      'Ingresa la calificación para todos los alumnos:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aplicar',
          onPress: (value) => {
            if (value && !isNaN(value)) {
              setCalificaciones(calificaciones.map(c => ({ ...c, calificacion: value })));
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const limpiarTodo = () => {
    Alert.alert(
      'Limpiar Todo',
      '¿Estás seguro de que quieres borrar todas las calificaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => setCalificaciones(calificaciones.map(c => ({ ...c, calificacion: '' })))
        }
      ]
    );
  };

  const guardarCalificaciones = () => {
    if (!formData.materia) {
      Alert.alert('Error', 'Selecciona una materia');
      return;
    }

    const sinCalificar = calificaciones.filter(c => !c.calificacion).length;
    if (sinCalificar > 0) {
      Alert.alert(
        'Calificaciones incompletas',
        `Hay ${sinCalificar} alumnos sin calificación. ¿Deseas continuar?`,
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
    const calificadas = calificaciones.filter(c => c.calificacion).length;
    const promedio = calificaciones
      .filter(c => c.calificacion)
      .reduce((sum, c) => sum + parseFloat(c.calificacion), 0) / (calificadas || 1);

    Alert.alert(
      'Calificaciones Guardadas',
      `✓ Total: ${calificadas} alumnos\n📊 Promedio: ${promedio.toFixed(1)}`,
      [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
    );
  };

  const getEstadisticas = () => {
    const calificadas = calificaciones.filter(c => c.calificacion && !isNaN(c.calificacion));
    if (calificadas.length === 0) return { promedio: 0, aprobados: 0, reprobados: 0 };

    const promedio = calificadas.reduce((sum, c) => sum + parseFloat(c.calificacion), 0) / calificadas.length;
    const aprobados = calificadas.filter(c => parseFloat(c.calificacion) >= 60).length;
    const reprobados = calificadas.filter(c => parseFloat(c.calificacion) < 60).length;

    return { promedio, aprobados, reprobados };
  };

  const stats = getEstadisticas();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subir Calificaciones</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Formulario de información */}
        <View style={styles.formSection}>
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

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Periodo</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowPeriodosPicker(!showPeriodosPicker)}
              >
                <Text style={styles.pickerText}>{formData.periodo}</Text>
                <Text style={styles.pickerIcon}>▼</Text>
              </TouchableOpacity>
              
              {showPeriodosPicker && (
                <View style={styles.pickerOptions}>
                  {periodos.map((periodo, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.pickerOption}
                      onPress={() => {
                        updateField('periodo', periodo);
                        setShowPeriodosPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{periodo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Tipo</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowTiposPicker(!showTiposPicker)}
              >
                <Text style={styles.pickerText}>{formData.tipoEvaluacion}</Text>
                <Text style={styles.pickerIcon}>▼</Text>
              </TouchableOpacity>
              
              {showTiposPicker && (
                <View style={styles.pickerOptions}>
                  {tiposEvaluacion.map((tipo, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.pickerOption}
                      onPress={() => {
                        updateField('tipoEvaluacion', tipo);
                        setShowTiposPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{tipo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: '#E3F2FD' }]}>
            <Text style={[styles.statNumber, { color: '#2196F3' }]}>{stats.promedio.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Promedio</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.aprobados}</Text>
            <Text style={styles.statLabel}>Aprobados</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FFEBEE' }]}>
            <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.reprobados}</Text>
            <Text style={styles.statLabel}>Reprobados</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.actionButton} onPress={aplicarATodos}>
            <Text style={styles.actionButtonText}>📋 Aplicar a todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={limpiarTodo}>
            <Text style={styles.actionButtonText}>🗑️ Limpiar todo</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de alumnos */}
        <View style={styles.listaSection}>
          <Text style={styles.listaTitle}>Calificaciones ({calificaciones.length} alumnos)</Text>
          
          {calificaciones.map((alumno) => (
            <View key={alumno.id} style={styles.alumnoRow}>
              <View style={styles.alumnoInfo}>
                <Text style={styles.alumnoNombre}>{alumno.nombre}</Text>
                <Text style={styles.alumnoMatricula}>{alumno.matricula}</Text>
              </View>
              <TextInput
                style={styles.calificacionInput}
                placeholder="0-100"
                value={alumno.calificacion}
                onChangeText={(text) => updateCalificacion(alumno.id, text)}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botón guardar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.guardarButton} onPress={guardarCalificaciones}>
          <Text style={styles.guardarButtonText}>💾 Guardar Calificaciones</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSpacer: {
    width: 50,
  },
  container: {
    flex: 1,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pickerOptionText: {
    fontSize: 15,
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
  actionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
  },
  listaSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  listaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  alumnoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  alumnoInfo: {
    flex: 1,
  },
  alumnoNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 3,
  },
  alumnoMatricula: {
    fontSize: 12,
    color: '#757575',
  },
  calificacionInput: {
    width: 80,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#212121',
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
    backgroundColor: '#4CAF50',
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

export default SubirCalificacionesScreen;
