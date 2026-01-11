import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

const HorarioProfesorScreen = ({ navigation }) => {
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes');

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const horario = {
    Lunes: [
      { hora: '08:00 - 09:30', materia: 'Matemáticas', grupo: 'A-201', alumnos: 35, color: '#4CAF50' },
      { hora: '09:45 - 11:15', materia: 'Física', grupo: 'Lab-3', alumnos: 28, color: '#2196F3' },
      { hora: '11:30 - 13:00', materia: 'Programación', grupo: 'Comp-5', alumnos: 32, color: '#FF9800' },
    ],
    Martes: [
      { hora: '08:00 - 09:30', materia: 'Programación', grupo: 'Comp-5', alumnos: 32, color: '#FF9800' },
      { hora: '10:00 - 11:30', materia: 'Matemáticas', grupo: 'A-202', alumnos: 30, color: '#4CAF50' },
      { hora: '14:00 - 15:30', materia: 'Física', grupo: 'Lab-2', alumnos: 25, color: '#2196F3' },
    ],
    Miércoles: [
      { hora: '08:00 - 09:30', materia: 'Matemáticas', grupo: 'A-201', alumnos: 35, color: '#4CAF50' },
      { hora: '11:00 - 12:30', materia: 'Programación', grupo: 'Comp-4', alumnos: 28, color: '#FF9800' },
    ],
    Jueves: [
      { hora: '09:00 - 10:30', materia: 'Física', grupo: 'Lab-3', alumnos: 28, color: '#2196F3' },
      { hora: '10:45 - 12:15', materia: 'Matemáticas', grupo: 'A-203', alumnos: 33, color: '#4CAF50' },
      { hora: '14:00 - 15:30', materia: 'Programación', grupo: 'Comp-5', alumnos: 32, color: '#FF9800' },
    ],
    Viernes: [
      { hora: '08:00 - 09:30', materia: 'Matemáticas', grupo: 'A-201', alumnos: 35, color: '#4CAF50' },
      { hora: '10:00 - 11:30', materia: 'Física', grupo: 'Lab-3', alumnos: 28, color: '#2196F3' },
    ],
    Sábado: [
      { hora: '09:00 - 11:00', materia: 'Asesorías', grupo: 'A-101', alumnos: 15, color: '#9C27B0' },
    ],
  };

  const clasesDelDia = horario[diaSeleccionado] || [];

  const getTotalHorasSemanales = () => {
    let total = 0;
    Object.values(horario).forEach(clases => {
      total += clases.length * 1.5; // Aproximadamente 1.5 horas por clase
    });
    return total.toFixed(0);
  };

  const getTotalClasesSemanales = () => {
    let total = 0;
    Object.values(horario).forEach(clases => {
      total += clases.length;
    });
    return total;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Horario</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Resumen semanal */}
      <View style={styles.resumenContainer}>
        <View style={[styles.resumenCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.resumenNumber, { color: '#2196F3' }]}>{getTotalClasesSemanales()}</Text>
          <Text style={styles.resumenLabel}>Clases/Semana</Text>
        </View>
        <View style={[styles.resumenCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.resumenNumber, { color: '#4CAF50' }]}>{getTotalHorasSemanales()}</Text>
          <Text style={styles.resumenLabel}>Horas/Semana</Text>
        </View>
        <View style={[styles.resumenCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.resumenNumber, { color: '#FF9800' }]}>{clasesDelDia.length}</Text>
          <Text style={styles.resumenLabel}>Hoy</Text>
        </View>
      </View>

      {/* Selector de días */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.diasContainer}
        contentContainerStyle={styles.diasContent}
      >
        {dias.map((dia) => (
          <TouchableOpacity
            key={dia}
            style={[
              styles.diaButton,
              diaSeleccionado === dia && styles.diaButtonActive
            ]}
            onPress={() => setDiaSeleccionado(dia)}
          >
            <Text style={[
              styles.diaText,
              diaSeleccionado === dia && styles.diaTextActive
            ]}>
              {dia}
            </Text>
            <View style={[
              styles.diaBadge,
              diaSeleccionado === dia && styles.diaBadgeActive
            ]}>
              <Text style={[
                styles.diaBadgeText,
                diaSeleccionado === dia && styles.diaBadgeTextActive
              ]}>
                {horario[dia]?.length || 0}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de clases */}
      <ScrollView style={styles.clasesContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.clasesTitle}>
          Clases del {diaSeleccionado} ({clasesDelDia.length})
        </Text>

        {clasesDelDia.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No hay clases programadas</Text>
            <Text style={styles.emptySubtext}>para este día</Text>
          </View>
        ) : (
          clasesDelDia.map((clase, index) => (
            <View key={index} style={styles.claseCard}>
              <View style={[styles.claseColorBar, { backgroundColor: clase.color }]} />
              
              <View style={styles.claseContent}>
                <View style={styles.claseHeader}>
                  <View style={styles.claseInfo}>
                    <Text style={styles.claseMateria}>{clase.materia}</Text>
                    <View style={styles.claseDetalles}>
                      <Text style={styles.claseHora}>🕐 {clase.hora}</Text>
                      <Text style={styles.claseGrupo}>📍 {clase.grupo}</Text>
                      <Text style={styles.claseAlumnos}>👥 {clase.alumnos} alumnos</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.claseActions}>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={styles.actionBtnText}>✓ Asistencia</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E3F2FD' }]}>
                    <Text style={styles.actionBtnText}>📝 Material</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Vista semanal completa */}
        <View style={styles.vistaSemanalSection}>
          <Text style={styles.vistaSemanalTitle}>📅 Vista Semanal Completa</Text>
          
          {dias.map((dia) => (
            <View key={dia} style={styles.diaRow}>
              <View style={styles.diaHeader}>
                <Text style={styles.diaNombre}>{dia}</Text>
                <Text style={styles.diaClasesCount}>
                  {horario[dia]?.length || 0} {horario[dia]?.length === 1 ? 'clase' : 'clases'}
                </Text>
              </View>
              
              {horario[dia]?.map((clase, index) => (
                <View key={index} style={styles.miniClaseCard}>
                  <View style={[styles.miniClaseColor, { backgroundColor: clase.color }]} />
                  <View style={styles.miniClaseInfo}>
                    <Text style={styles.miniClaseHora}>{clase.hora.split(' - ')[0]}</Text>
                    <Text style={styles.miniClaseMateria}>{clase.materia}</Text>
                    <Text style={styles.miniClaseGrupo}>{clase.grupo}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  resumenContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  resumenCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  resumenNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resumenLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  diasContainer: {
    maxHeight: 70,
  },
  diasContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  diaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    minWidth: 100,
  },
  diaButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  diaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  diaTextActive: {
    color: '#FFFFFF',
  },
  diaBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  diaBadgeActive: {
    backgroundColor: '#FFFFFF',
  },
  diaBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
  },
  diaBadgeTextActive: {
    color: '#2196F3',
  },
  clasesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  clasesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
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
  claseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  claseColorBar: {
    width: 6,
  },
  claseContent: {
    flex: 1,
    padding: 15,
  },
  claseHeader: {
    marginBottom: 12,
  },
  claseInfo: {
    flex: 1,
  },
  claseMateria: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  claseDetalles: {
    gap: 4,
  },
  claseHora: {
    fontSize: 13,
    color: '#666',
  },
  claseGrupo: {
    fontSize: 13,
    color: '#666',
  },
  claseAlumnos: {
    fontSize: 13,
    color: '#666',
  },
  claseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  vistaSemanalSection: {
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
  },
  vistaSemanalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  diaRow: {
    marginBottom: 20,
  },
  diaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  diaNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  diaClasesCount: {
    fontSize: 12,
    color: '#757575',
  },
  miniClaseCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  miniClaseColor: {
    width: 4,
  },
  miniClaseInfo: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniClaseHora: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 50,
  },
  miniClaseMateria: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#212121',
  },
  miniClaseGrupo: {
    fontSize: 11,
    color: '#757575',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default HorarioProfesorScreen;
