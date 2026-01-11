import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView,  TouchableOpacity, Alert} from 'react-native';
import WebIcon from "../../components/WebIcon";

export default function CalificacionesScreen({ navigation, route }) {
  // Obtener parámetros si vienen del HomeAlumno
  const { 
    materia, 
    calificaciones: calificacionesParam, 
    promedioGeneral, 
    todasCalificaciones, 
    materias: materiasParam 
  } = route.params || {};
  
  // Estado para la materia seleccionada
  const [selectedSubject, setSelectedSubject] = useState(
    materia?.nombre || 'Matemáticas'
  );

  // Datos COMPLETOS de ejemplo para TODAS las materias
  const subjectsData = materiasParam || [
    { 
      id: 1, 
      name: 'Matemáticas', 
      nombre: 'Matemáticas',
      average: 9.0, 
      color: '#FF6B6B',
      icon: 'calculator',
      profesor: 'Dr. García',
      codigo: 'MAT101'
    },
    { 
      id: 2, 
      name: 'Programación', 
      nombre: 'Programación',
      average: 8.5, 
      color: '#4ECDC4',
      icon: 'code-braces',
      profesor: 'Ing. Rodríguez',
      codigo: 'PROG201'
    },
    { 
      id: 3, 
      name: 'Física', 
      nombre: 'Física',
      average: 7.8, 
      color: '#45B7D1',
      icon: 'atom',
      profesor: 'Dra. Martínez',
      codigo: 'FIS101'
    },
    { 
      id: 4, 
      name: 'Historia', 
      nombre: 'Historia',
      average: 9.2, 
      color: '#96CEB4',
      icon: 'book-open',
      profesor: 'Mtro. López',
      codigo: 'HIS201'
    },
  ];

  // Datos COMPLETOS de calificaciones para TODAS las materias
  const gradesData = {
    'Matemáticas': [
      { type: 'Parcial 1', grade: 9.0, date: '15/02/2024', weight: '30%' },
      { type: 'Parcial 2', grade: 8.5, date: '20/03/2024', weight: '30%' },
      { type: 'Tareas', grade: 9.5, date: 'Continuo', weight: '20%' },
      { type: 'Participación', grade: 9.0, date: 'Continuo', weight: '20%' },
    ],
    'Programación': [
      { type: 'Proyecto 1', grade: 8.0, date: '10/02/2024', weight: '25%' },
      { type: 'Proyecto 2', grade: 9.0, date: '15/03/2024', weight: '25%' },
      { type: 'Examen Final', grade: 8.5, date: '25/03/2024', weight: '50%' },
    ],
    'Física': [
      { type: 'Laboratorio 1', grade: 7.5, date: '12/02/2024', weight: '30%' },
      { type: 'Laboratorio 2', grade: 8.0, date: '18/03/2024', weight: '30%' },
      { type: 'Examen Parcial', grade: 8.0, date: '28/03/2024', weight: '40%' },
    ],
    'Historia': [
      { type: 'Examen Parcial', grade: 9.2, date: '22/03/2024', weight: '50%' },
      { type: 'Investigación', grade: 9.5, date: '25/03/2024', weight: '30%' },
      { type: 'Participación', grade: 8.8, date: 'Continuo', weight: '20%' },
    ],
  };

  // Función para obtener el color según la calificación
  const getGradeColor = (grade) => {
    if (grade >= 9) return '#4CAF50';  // Verde - Excelente
    if (grade >= 8) return '#FF9800';  // Naranja - Bueno
    if (grade >= 7) return '#2196F3';  // Azul - Regular
    return '#F44336';  // Rojo - Insuficiente
  };

  // Función para calcular el promedio de una materia
  const calculateSubjectAverage = (subjectName) => {
    const grades = gradesData[subjectName];
    if (!grades || grades.length === 0) return 0.0;
    
    const sum = grades.reduce((acc, grade) => acc + grade.grade, 0);
    return (sum / grades.length).toFixed(1);
  };

  // Calcular promedio general
  const calculateGeneralAverage = () => {
    if (promedioGeneral) return promedioGeneral;
    
    // Calcular a partir de los datos de ejemplo
    const subjectsWithGrades = subjectsData.filter(subject => 
      gradesData[subject.name] && gradesData[subject.name].length > 0
    );
    
    if (subjectsWithGrades.length === 0) return '0.0';
    
    const sum = subjectsWithGrades.reduce((acc, subject) => {
      return acc + parseFloat(calculateSubjectAverage(subject.name));
    }, 0);
    
    return (sum / subjectsWithGrades.length).toFixed(1);
  };

  // Obtener calificaciones para la materia seleccionada
  const getCurrentGrades = () => {
    // Si vienen calificaciones específicas del parámetro, usarlas
    if (calificacionesParam && calificacionesParam.length > 0) {
      return calificacionesParam.filter(cal => 
        cal.materia === selectedSubject || cal.materiaId === subjectsData.find(s => s.name === selectedSubject)?.id
      );
    }
    
    // Si no, usar los datos de ejemplo
    return gradesData[selectedSubject] || [];
  };

  // Calcular promedio de la materia seleccionada
  const getSelectedSubjectAverage = () => {
    const grades = getCurrentGrades();
    if (grades.length === 0) return '0.0';
    
    const sum = grades.reduce((acc, grade) => acc + (grade.grade || grade.calificacion || 0), 0);
    return (sum / grades.length).toFixed(1);
  };

  // Obtener el icono de la materia
  const getSubjectIcon = (subjectName) => {
    const subject = subjectsData.find(s => s.name === subjectName || s.nombre === subjectName);
    return subject?.icon || 'book';
  };

  // Obtener el color de la materia
  const getSubjectColor = (subjectName) => {
    const subject = subjectsData.find(s => s.name === subjectName || s.nombre === subjectName);
    return subject?.color || '#666';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header personalizado con botón de retroceso */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <WebIcon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Calificaciones</Text>
          <Text style={styles.subtitle}>Consulta tus calificaciones por materia</Text>
        </View>
        
        {/* Botón para volver al Home */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('HomeAlumno')}
        >
          <WebIcon name="home" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Promedio general */}
        <View style={styles.averageCard}>
          <Text style={styles.averageLabel}>Promedio General</Text>
          <Text style={styles.averageValue}>{calculateGeneralAverage()}</Text>
          <Text style={styles.averageText}>
            {parseFloat(calculateGeneralAverage()) >= 8 ? 'Sobresaliente' : 
             parseFloat(calculateGeneralAverage()) >= 7 ? 'Bueno' : 'Necesita mejorar'}
          </Text>
          
          {/* Botón para ver todo el historial */}
          <TouchableOpacity 
            style={styles.fullHistoryButton}
            onPress={() => {
              Alert.alert("Historial", "Historial completo de calificaciones");
            }}
          >
            <WebIcon name="history" size={18} color="#4CAF50" />
            <Text style={styles.fullHistoryText}>Ver historial completo</Text>
          </TouchableOpacity>
        </View>

        {/* Indicador si es una materia específica */}
        {materia && (
          <View style={styles.specificSubjectIndicator}>
            <WebIcon name="information" size={20} color="#2196F3" />
            <Text style={styles.specificSubjectText}>
              Mostrando calificaciones de: <Text style={styles.subjectHighlight}>{materia.nombre}</Text>
            </Text>
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => {
                setSelectedSubject('Matemáticas');
                // También podrías navegar de nuevo sin parámetros
                // navigation.replace('Calificaciones');
              }}
            >
              <Text style={styles.clearFilterText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de materias */}
        <View style={styles.subjectsSection}>
          <Text style={styles.sectionTitle}>Selecciona una materia</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.subjectsContainer}
            contentContainerStyle={styles.subjectsContent}
          >
            {subjectsData.map((subject) => (
              <TouchableOpacity
                key={subject.id || subject.name}
                style={[
                  styles.subjectCard,
                  { backgroundColor: getSubjectColor(subject.name || subject.nombre) },
                  selectedSubject === (subject.name || subject.nombre) && styles.subjectCardActive,
                ]}
                onPress={() => setSelectedSubject(subject.name || subject.nombre)}
              >
                <WebIcon 
                  name={getSubjectIcon(subject.name || subject.nombre)} 
                  size={24} 
                  color="#fff" 
                  style={styles.subjectIcon}
                />
                <Text style={styles.subjectName} numberOfLines={2}>
                  {subject.name || subject.nombre}
                </Text>
                <Text style={styles.subjectAverage}>
                  {calculateSubjectAverage(subject.name || subject.nombre)}
                </Text>
                <Text style={styles.subjectCode}>
                  {subject.codigo || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Detalles de calificaciones de la materia seleccionada */}
        <View style={styles.gradesContainer}>
          <View style={styles.gradesHeader}>
            <View style={styles.selectedSubjectHeader}>
              <View style={[styles.selectedSubjectIcon, { backgroundColor: getSubjectColor(selectedSubject) }]}>
                <WebIcon name={getSubjectIcon(selectedSubject)} size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.gradesTitle}>
                  {selectedSubject}
                </Text>
                <Text style={styles.selectedSubjectAverage}>
                  Promedio: {getSelectedSubjectAverage()}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => Alert.alert("Descargar", "Descargando calificaciones...")}
            >
              <WebIcon name="download" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>

          {getCurrentGrades().length > 0 ? (
            <View style={styles.gradesList}>
              {getCurrentGrades().map((grade, index) => (
                <View key={index} style={styles.gradeCard}>
                  <View style={styles.gradeHeader}>
                    <View>
                      <Text style={styles.gradeType}>{grade.type || 'Evaluación'}</Text>
                      <Text style={styles.gradeDate}>{grade.date || 'Sin fecha'}</Text>
                    </View>
                    <View style={[
                      styles.gradeBadge,
                      { backgroundColor: `${getGradeColor(grade.grade || grade.calificacion)}20` }
                    ]}>
                      <Text
                        style={[
                          styles.gradeValue,
                          { color: getGradeColor(grade.grade || grade.calificacion) },
                        ]}
                      >
                        {(grade.grade || grade.calificacion || 0).toFixed(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.gradeDetails}>
                    <View style={styles.gradeDetailItem}>
                      <WebIcon name="weight" size={16} color="#999" />
                      <Text style={styles.gradeDetailText}>
                        Peso: {grade.weight || 'No especificado'}
                      </Text>
                    </View>
                    <View style={styles.gradeDetailItem}>
                      <WebIcon name="calculator" size={16} color="#999" />
                      <Text style={styles.gradeDetailText}>
                        Estado: {(grade.grade || grade.calificacion || 0) >= 6 ? '✅ Aprobado' : '❌ Reprobado'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noGradesContainer}>
              <WebIcon name="file-document-outline" size={50} color="#ccc" />
              <Text style={styles.noGradesTitle}>Sin calificaciones</Text>
              <Text style={styles.noGradesText}>
                No hay calificaciones registradas para esta materia.
              </Text>
              <Text style={styles.noGradesAverage}>0.0</Text>
            </View>
          )}

          {/* Resumen de la materia */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de {selectedSubject}</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>{getCurrentGrades().length}</Text>
                <Text style={styles.summaryStatLabel}>Evaluaciones</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>{getSelectedSubjectAverage()}</Text>
                <Text style={styles.summaryStatLabel}>Promedio</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>
                  {getCurrentGrades().filter(g => (g.grade || g.calificacion || 0) >= 6).length}
                </Text>
                <Text style={styles.summaryStatLabel}>Aprobadas</Text>
              </View>
            </View>
          </View>

          {/* Gráfica de progreso */}
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Progreso en la materia</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(parseFloat(getSelectedSubjectAverage()) * 10, 100)}%`,
                    backgroundColor: getGradeColor(parseFloat(getSelectedSubjectAverage())),
                  },
                ]}
              />
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {getCurrentGrades().length > 0 ? 
                  `${Math.min(parseFloat(getSelectedSubjectAverage()) * 10, 100).toFixed(0)}% del curso completado` : 
                  'Sin progreso registrado'}
              </Text>
              <Text style={styles.progressGrade}>
                Calificación: {getSelectedSubjectAverage()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Header personalizado
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#4CAF50',
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
  },
  homeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e8f5e9',
    marginTop: 4,
  },
  // Promedio general
  averageCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: -10,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    zIndex: 1,
  },
  averageLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  averageValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  averageText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 5,
  },
  fullHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
  },
  fullHistoryText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
  // Sección de materias
  subjectsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  subjectsContainer: {
    marginBottom: 10,
  },
  subjectsContent: {
    paddingHorizontal: 15,
  },
  subjectCard: {
    width: 140,
    height: 160,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  subjectCardActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  subjectIcon: {
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subjectAverage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subjectCode: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  // Indicador de materia específica
  specificSubjectIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  specificSubjectText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 10,
    flex: 1,
  },
  subjectHighlight: {
    fontWeight: 'bold',
  },
  clearFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  clearFilterText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  // Contenedor de calificaciones
  gradesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  gradesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedSubjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedSubjectIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gradesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedSubjectAverage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  downloadButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  // Lista de calificaciones
  gradesList: {
    marginBottom: 20,
  },
  // Tarjetas de calificación
  gradeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gradeType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  gradeDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  gradeBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  gradeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  gradeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  // Sin calificaciones
  noGradesContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 20,
  },
  noGradesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 15,
    marginBottom: 8,
  },
  noGradesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  noGradesAverage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ccc',
  },
  // Resumen
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  // Progreso
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  progressGrade: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // Botón para volver al Home
  backToHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  backToHomeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});
