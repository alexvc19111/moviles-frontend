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

const ListaAlumnosScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('todas');
  const [showMateriasPicker, setShowMateriasPicker] = useState(false);

  const materias = ['Todas', 'Matemáticas', 'Física', 'Programación'];

  const [alumnos] = useState([
    { 
      id: 1, 
      nombre: 'Juan Pérez', 
      matricula: 'EST-2023-001', 
      materias: ['Matemáticas', 'Física'],
      promedio: 8.5,
      asistencia: 92,
      email: 'juan.perez@escuela.com',
      telefono: '555-0101'
    },
    { 
      id: 2, 
      nombre: 'María González', 
      matricula: 'EST-2023-002', 
      materias: ['Matemáticas', 'Programación'],
      promedio: 9.2,
      asistencia: 96,
      email: 'maria.gonzalez@escuela.com',
      telefono: '555-0102'
    },
    { 
      id: 3, 
      nombre: 'Carlos Rodríguez', 
      matricula: 'EST-2023-003', 
      materias: ['Física', 'Programación'],
      promedio: 7.8,
      asistencia: 88,
      email: 'carlos.rodriguez@escuela.com',
      telefono: '555-0103'
    },
    { 
      id: 4, 
      nombre: 'Ana Martínez', 
      matricula: 'EST-2023-004', 
      materias: ['Matemáticas', 'Física', 'Programación'],
      promedio: 9.5,
      asistencia: 98,
      email: 'ana.martinez@escuela.com',
      telefono: '555-0104'
    },
    { 
      id: 5, 
      nombre: 'Luis Hernández', 
      matricula: 'EST-2023-005', 
      materias: ['Matemáticas'],
      promedio: 8.0,
      asistencia: 90,
      email: 'luis.hernandez@escuela.com',
      telefono: '555-0105'
    },
    { 
      id: 6, 
      nombre: 'Laura Sánchez', 
      matricula: 'EST-2023-006', 
      materias: ['Física', 'Programación'],
      promedio: 8.7,
      asistencia: 94,
      email: 'laura.sanchez@escuela.com',
      telefono: '555-0106'
    },
    { 
      id: 7, 
      nombre: 'Pedro López', 
      matricula: 'EST-2023-007', 
      materias: ['Matemáticas', 'Física'],
      promedio: 7.5,
      asistencia: 85,
      email: 'pedro.lopez@escuela.com',
      telefono: '555-0107'
    },
    { 
      id: 8, 
      nombre: 'Sofia Ramírez', 
      matricula: 'EST-2023-008', 
      materias: ['Programación'],
      promedio: 9.0,
      asistencia: 95,
      email: 'sofia.ramirez@escuela.com',
      telefono: '555-0108'
    },
  ]);

  const getAlumnosFiltrados = () => {
    return alumnos.filter(alumno => {
      const matchSearch = alumno.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumno.matricula.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchMateria = filtroMateria === 'todas' || 
                          alumno.materias.includes(filtroMateria);
      
      return matchSearch && matchMateria;
    });
  };

  const alumnosFiltrados = getAlumnosFiltrados();

  const verDetalleAlumno = (alumno) => {
    Alert.alert(
      alumno.nombre,
      `Matrícula: ${alumno.matricula}\n\nMaterias:\n${alumno.materias.map(m => '• ' + m).join('\n')}\n\nPromedio: ${alumno.promedio}\nAsistencia: ${alumno.asistencia}%\n\nEmail: ${alumno.email}\nTeléfono: ${alumno.telefono}`,
      [
        { text: 'Cerrar' },
        { text: 'Enviar Mensaje', onPress: () => Alert.alert('Mensaje', 'Función de mensajería') }
      ]
    );
  };

  const getPromedioGeneral = () => {
    if (alumnosFiltrados.length === 0) return 0;
    const suma = alumnosFiltrados.reduce((acc, a) => acc + a.promedio, 0);
    return (suma / alumnosFiltrados.length).toFixed(1);
  };

  const getAsistenciaPromedio = () => {
    if (alumnosFiltrados.length === 0) return 0;
    const suma = alumnosFiltrados.reduce((acc, a) => acc + a.asistencia, 0);
    return (suma / alumnosFiltrados.length).toFixed(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Alumnos</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.statNumber, { color: '#2196F3' }]}>{alumnosFiltrados.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{getPromedioGeneral()}</Text>
          <Text style={styles.statLabel}>Promedio</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statNumber, { color: '#FF9800' }]}>{getAsistenciaPromedio()}%</Text>
          <Text style={styles.statLabel}>Asistencia</Text>
        </View>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o matrícula..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtro de materias */}
      <View style={styles.filtroContainer}>
        <Text style={styles.filtroLabel}>Filtrar por materia:</Text>
        <TouchableOpacity
          style={styles.filtroPicker}
          onPress={() => setShowMateriasPicker(!showMateriasPicker)}
        >
          <Text style={styles.filtroText}>
            {filtroMateria === 'todas' ? 'Todas las materias' : filtroMateria}
          </Text>
          <Text style={styles.filtroIcon}>▼</Text>
        </TouchableOpacity>
        
        {showMateriasPicker && (
          <View style={styles.pickerOptions}>
            {materias.map((materia, index) => (
              <TouchableOpacity
                key={index}
                style={styles.pickerOption}
                onPress={() => {
                  setFiltroMateria(materia === 'Todas' ? 'todas' : materia);
                  setShowMateriasPicker(false);
                }}
              >
                <Text style={styles.pickerOptionText}>{materia}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Lista de alumnos */}
      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        {alumnosFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No se encontraron alumnos</Text>
            <Text style={styles.emptySubtext}>Intenta con otros términos de búsqueda</Text>
          </View>
        ) : (
          alumnosFiltrados.map((alumno) => (
            <TouchableOpacity
              key={alumno.id}
              style={styles.alumnoCard}
              onPress={() => verDetalleAlumno(alumno)}
            >
              <View style={styles.alumnoAvatar}>
                <Text style={styles.alumnoAvatarText}>
                  {alumno.nombre.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>

              <View style={styles.alumnoInfo}>
                <Text style={styles.alumnoNombre}>{alumno.nombre}</Text>
                <Text style={styles.alumnoMatricula}>{alumno.matricula}</Text>
                <View style={styles.alumnoMaterias}>
                  {alumno.materias.slice(0, 2).map((materia, index) => (
                    <View key={index} style={styles.materiaTag}>
                      <Text style={styles.materiaTagText}>{materia}</Text>
                    </View>
                  ))}
                  {alumno.materias.length > 2 && (
                    <View style={styles.materiaTag}>
                      <Text style={styles.materiaTagText}>+{alumno.materias.length - 2}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.alumnoStats}>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeLabel}>📊</Text>
                  <Text style={styles.statBadgeValue}>{alumno.promedio}</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeLabel}>✓</Text>
                  <Text style={styles.statBadgeValue}>{alumno.asistencia}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botón flotante */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => Alert.alert('Exportar', 'Función de exportar lista')}
      >
        <Text style={styles.floatingButtonText}>📄</Text>
      </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
  },
  clearIcon: {
    fontSize: 18,
    color: '#999',
    padding: 5,
  },
  filtroContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filtroLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  filtroPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
  },
  filtroText: {
    fontSize: 14,
    color: '#212121',
  },
  filtroIcon: {
    fontSize: 10,
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
    fontSize: 14,
    color: '#212121',
  },
  lista: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  alumnoCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  alumnoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alumnoAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  alumnoInfo: {
    flex: 1,
  },
  alumnoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  alumnoMatricula: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 6,
  },
  alumnoMaterias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  materiaTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  materiaTagText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  alumnoStats: {
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statBadgeLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  statBadgeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
  },
  bottomSpacer: {
    height: 80,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default ListaAlumnosScreen;
