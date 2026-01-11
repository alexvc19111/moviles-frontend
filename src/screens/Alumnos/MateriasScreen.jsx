import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import WebIcon from "../../components/WebIcon";

export default function MateriasScreen({ navigation, route }) {
  // Manejo SEGURO de parámetros - SIN destructuring directo
  const params = route?.params || {};
  
  // Datos de ejemplo (con valores por defecto si no vienen parámetros)
  const materias = params.materias || [
    {
      id: 1,
      nombre: "Matemáticas",
      profesor: "Dr. García",
      icon: "calculator",
      color: "#FF6B6B",
      codigo: "MAT101",
      horario: "Lunes 8:00-10:00, Miércoles 9:00-11:00",
      aula: "Aula 301",
      creditos: 4,
      semestre: "4to",
      estado: "En curso",
      promedio: 9.0
    },
    {
      id: 2,
      nombre: "Programación",
      profesor: "Ing. Rodríguez",
      icon: "code-braces",
      color: "#4ECDC4",
      codigo: "PROG201",
      horario: "Martes 10:00-12:00, Jueves 14:00-16:00",
      aula: "Laboratorio 105",
      creditos: 5,
      semestre: "4to",
      estado: "En curso",
      promedio: 8.5
    },
    {
      id: 3,
      nombre: "Física",
      profesor: "Dra. Martínez",
      icon: "atom",
      color: "#45B7D1",
      codigo: "FIS101",
      horario: "Lunes 11:00-13:00, Viernes 8:00-10:00",
      aula: "Aula 204",
      creditos: 4,
      semestre: "4to",
      estado: "En curso",
      promedio: 7.8
    },
    {
      id: 4,
      nombre: "Historia",
      profesor: "Mtro. López",
      icon: "book-open",
      color: "#96CEB4",
      codigo: "HIS201",
      horario: "Miércoles 14:00-16:00, Jueves 10:00-12:00",
      aula: "Aula 102",
      creditos: 3,
      semestre: "4to",
      estado: "En curso",
      promedio: 9.2
    },
  ];

  // Calcular promedio general
  const calcularPromedioGeneral = () => {
    if (materias.length === 0) return "0.0";
    const suma = materias.reduce((total, materia) => total + materia.promedio, 0);
    return (suma / materias.length).toFixed(1);
  };

  // Calcular créditos totales
  const calcularCreditosTotales = () => {
    return materias.reduce((total, materia) => total + materia.creditos, 0);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <WebIcon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Mis Materias</Text>
      
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => Alert.alert("Filtrar", "Filtrar materias por semestre")}
      >
        <WebIcon name="filter" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderResumen = () => (
    <View style={styles.resumenCard}>
      <Text style={styles.resumenTitle}>Resumen Académico</Text>
      
      <View style={styles.resumenStats}>
        <View style={styles.statItem}>
          <WebIcon name="book-open-variant" size={24} color="#2196F3" />
          <Text style={styles.statValue}>{materias.length}</Text>
          <Text style={styles.statLabel}>Materias</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <WebIcon name="weight" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{calcularCreditosTotales()}</Text>
          <Text style={styles.statLabel}>Créditos</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <WebIcon name="chart-line" size={24} color="#FF9800" />
          <Text style={styles.statValue}>{calcularPromedioGeneral()}</Text>
          <Text style={styles.statLabel}>Promedio</Text>
        </View>
      </View>
    </View>
  );

  const renderMaterias = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Todas las Materias ({materias.length})</Text>
      
      {materias.map((materia) => (
        <TouchableOpacity 
          key={materia.id}
          style={styles.materiaCard}
          activeOpacity={0.7}
          onPress={() => Alert.alert(
            materia.nombre, 
            `Profesor: ${materia.profesor}\nAula: ${materia.aula}\nHorario: ${materia.horario}\nCréditos: ${materia.creditos}`
          )}
        >
          <View style={[styles.materiaIcon, { backgroundColor: materia.color }]}>
            <WebIcon name={materia.icon || "book"} size={24} color="#fff" />
          </View>
          
          <View style={styles.materiaInfo}>
            <View style={styles.materiaHeader}>
              <Text style={styles.materiaNombre}>{materia.nombre}</Text>
              <View style={styles.creditoBadge}>
                <Text style={styles.creditoText}>{materia.creditos} CR</Text>
              </View>
            </View>
            
            <Text style={styles.materiaProfesor}>
              <WebIcon name="teach" size={12} color="#666" /> {materia.profesor}
            </Text>
            
            <View style={styles.materiaDetails}>
              <View style={styles.detailItem}>
                <WebIcon name="identifier" size={12} color="#666" />
                <Text style={styles.detailText}>{materia.codigo}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <WebIcon name="map-marker" size={12} color="#666" />
                <Text style={styles.detailText}>{materia.aula}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.materiaRight}>
            <View style={[
              styles.estadoBadge,
              { backgroundColor: materia.estado === "En curso" ? "#E8F5E9" : "#FFF3E0" }
            ]}>
              <Text style={[
                styles.estadoText,
                { color: materia.estado === "En curso" ? "#4CAF50" : "#FF9800" }
              ]}>
                {materia.estado || "En curso"}
              </Text>
            </View>
            
            <Text style={styles.materiaPromedio}>{materia.promedio?.toFixed(1) || "0.0"}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAcciones = () => (
    <View style={styles.accionesSection}>
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      
      <View style={styles.accionesGrid}>
        <TouchableOpacity 
          style={styles.accionButton}
          onPress={() => navigation.navigate('Horario')}
        >
          <View style={[styles.accionIcon, { backgroundColor: "#FFE0B2" }]}>
            <WebIcon name="calendar-clock" size={24} color="#FF9800" />
          </View>
          <Text style={styles.accionText}>Horario</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.accionButton}
          onPress={() => navigation.navigate('Calificaciones')}
        >
          <View style={[styles.accionIcon, { backgroundColor: "#C8E6C9" }]}>
            <WebIcon name="chart-box" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.accionText}>Calificaciones</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.accionButton}
          onPress={() => Alert.alert("Kardex", "Consultar kardex académico")}
        >
          <View style={[styles.accionIcon, { backgroundColor: "#BBDEFB" }]}>
            <WebIcon name="file-document" size={24} color="#2196F3" />
          </View>
          <Text style={styles.accionText}>Kardex</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.accionButton}
          onPress={() => Alert.alert("Descargar", "Descargar lista de materias")}
        >
          <View style={[styles.accionIcon, { backgroundColor: "#E1BEE7" }]}>
            <WebIcon name="download" size={24} color="#9C27B0" />
          </View>
          <Text style={styles.accionText}>Descargar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {renderResumen()}
        {renderMaterias()}
        {renderAcciones()}
        
        {/* Botón para volver al inicio */}
        <TouchableOpacity 
          style={styles.backToHomeButton}
          onPress={() => navigation.navigate('HomeAlumno')}
        >
          <WebIcon name="home" size={20} color="#fff" />
          <Text style={styles.backToHomeText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#2196F3',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumenCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resumenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
  },
  resumenStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  materiaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  materiaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materiaInfo: {
    flex: 1,
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  materiaNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  creditoBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  creditoText: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  materiaProfesor: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  materiaDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  materiaRight: {
    alignItems: 'flex-end',
    marginLeft: 10,
    minWidth: 60,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: '600',
  },
  materiaPromedio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  accionesSection: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  accionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  accionButton: {
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  accionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  accionText: {
    fontSize: 12,
    color: '#616161',
    textAlign: 'center',
  },
  backToHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  backToHomeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});
