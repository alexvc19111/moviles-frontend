import React, { useState } from 'react';
import {SafeAreaView, View, Text, StyleSheet,
  ScrollView, TouchableOpacity, Alert} from 'react-native';
import WebIcon from "../../components/WebIcon";

export default function AsistenciasScreen({ navigation, route }) {
  // Manejo SEGURO de parámetros - NO USAR destructuring directamente
  const params = route?.params || {};
  const user = params.user || { name: "Alumno", role: "alumno" };

  // Datos de ejemplo de asistencias
  const [asistenciasData] = useState({
    promedioAsistencia: 92,
    totalClases: 60,
    asistencias: 55,
    faltas: 3,
    retardos: 2,
    materias: [
      {
        id: 1,
        nombre: "Matemáticas",
        profesor: "Dr. García",
        color: "#FF6B6B",
        totalClases: 15,
        asistencias: 14,
        faltas: 1,
        retardos: 0,
        estado: "Excelente"
      },
      {
        id: 2,
        nombre: "Programación",
        profesor: "Ing. Rodríguez",
        color: "#4ECDC4",
        totalClases: 15,
        asistencias: 15,
        faltas: 0,
        retardos: 0,
        estado: "Perfecto"
      },
      {
        id: 3,
        nombre: "Física",
        profesor: "Dra. Martínez",
        color: "#45B7D1",
        totalClases: 15,
        asistencias: 13,
        faltas: 1,
        retardos: 1,
        estado: "Bueno"
      },
      {
        id: 4,
        nombre: "Historia",
        profesor: "Mtro. López",
        color: "#96CEB4",
        totalClases: 15,
        asistencias: 13,
        faltas: 2,
        retardos: 0,
        estado: "Bueno"
      },
    ],
    historial: [
      { fecha: "Lun 25 Mar", materia: "Matemáticas", estado: "Asistió", hora: "8:00 AM" },
      { fecha: "Lun 25 Mar", materia: "Física", estado: "Retardo", hora: "11:05 AM" },
      { fecha: "Mar 26 Mar", materia: "Programación", estado: "Asistió", hora: "10:00 AM" },
      { fecha: "Mar 26 Mar", materia: "Historia", estado: "Asistió", hora: "2:00 PM" },
      { fecha: "Mié 27 Mar", materia: "Matemáticas", estado: "Asistió", hora: "9:00 AM" },
      { fecha: "Mié 27 Mar", materia: "Física", estado: "Falta", hora: "11:00 AM" },
      { fecha: "Jue 28 Mar", materia: "Programación", estado: "Asistió", hora: "2:00 PM" },
      { fecha: "Jue 28 Mar", materia: "Historia", estado: "Asistió", hora: "10:00 AM" },
    ]
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <WebIcon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Asistencias</Text>
      
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => Alert.alert("Descargar", "Descargando reporte de asistencias...")}
      >
        <WebIcon name="download" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderResumen = () => (
    <View style={styles.resumenCard}>
      <Text style={styles.resumenTitle}>Resumen General</Text>
      
      <View style={styles.resumenStats}>
        <View style={styles.statItem}>
          <WebIcon name="check-circle" size={28} color="#4CAF50" />
          <Text style={styles.statValue}>{asistenciasData.promedioAsistencia}%</Text>
          <Text style={styles.statLabel}>Promedio</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <WebIcon name="calendar-check" size={28} color="#2196F3" />
          <Text style={styles.statValue}>{asistenciasData.asistencias}</Text>
          <Text style={styles.statLabel}>Asistencias</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <WebIcon name="calendar-remove" size={28} color="#F44336" />
          <Text style={styles.statValue}>{asistenciasData.faltas}</Text>
          <Text style={styles.statLabel}>Faltas</Text>
        </View>
      </View>
    </View>
  );

  const renderMaterias = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Asistencia por Materia</Text>
      
      {asistenciasData.materias.map((materia) => (
        <TouchableOpacity 
          key={materia.id}
          style={styles.materiaCard}
          activeOpacity={0.7}
        >
          <View style={[styles.materiaIcon, { backgroundColor: materia.color }]}>
            <Text style={styles.materiaPorcentaje}>
              {Math.round((materia.asistencias / materia.totalClases) * 100)}%
            </Text>
          </View>
          
          <View style={styles.materiaInfo}>
            <Text style={styles.materiaNombre}>{materia.nombre}</Text>
            <Text style={styles.materiaProfesor}>{materia.profesor}</Text>
            <View style={styles.materiaStats}>
              <View style={styles.miniStat}>
                <WebIcon name="check" size={12} color="#4CAF50" />
                <Text style={styles.miniStatText}>{materia.asistencias}</Text>
              </View>
              <View style={styles.miniStat}>
                <WebIcon name="close" size={12} color="#F44336" />
                <Text style={styles.miniStatText}>{materia.faltas}</Text>
              </View>
              <View style={styles.miniStat}>
                <WebIcon name="clock-alert" size={12} color="#FF9800" />
                <Text style={styles.miniStatText}>{materia.retardos}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.materiaEstado}>
            <Text style={[
              styles.estadoText,
              { color: materia.estado === "Perfecto" ? "#4CAF50" : 
                       materia.estado === "Excelente" ? "#2196F3" : "#FF9800" }
            ]}>
              {materia.estado}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHistorial = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Historial Reciente</Text>
        <TouchableOpacity onPress={() => Alert.alert("Historial", "Historial completo")}>
          <Text style={styles.seeAll}>Ver todo</Text>
        </TouchableOpacity>
      </View>
      
      {asistenciasData.historial.map((item, index) => (
        <View key={index} style={styles.historialItem}>
          <View style={styles.historialLeft}>
            <View style={[
              styles.estadoIcon,
              { backgroundColor: item.estado === "Asistió" ? "#E8F5E9" : 
                                 item.estado === "Retardo" ? "#FFF3E0" : "#FFEBEE" }
            ]}>
              <WebIcon 
                name={item.estado === "Asistió" ? "check" : 
                      item.estado === "Retardo" ? "clock" : "close"} 
                size={16} 
                color={item.estado === "Asistió" ? "#4CAF50" : 
                       item.estado === "Retardo" ? "#FF9800" : "#F44336"} 
              />
            </View>
            <View>
              <Text style={styles.historialMateria}>{item.materia}</Text>
              <Text style={styles.historialFecha}>{item.fecha} • {item.hora}</Text>
            </View>
          </View>
          <Text style={[
            styles.historialEstado,
            { color: item.estado === "Asistió" ? "#4CAF50" : 
                     item.estado === "Retardo" ? "#FF9800" : "#F44336" }
          ]}>
            {item.estado}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderResumen()}
        {renderMaterias()}
        {renderHistorial()}
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
  downloadButton: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  seeAll: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  materiaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  materiaPorcentaje: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  materiaInfo: {
    flex: 1,
  },
  materiaNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  materiaProfesor: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 6,
  },
  materiaStats: {
    flexDirection: 'row',
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  miniStatText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  materiaEstado: {
    marginLeft: 10,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  historialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estadoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historialMateria: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  historialFecha: {
    fontSize: 12,
    color: '#757575',
  },
  historialEstado: {
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 30,
  },
  backToHomeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});
