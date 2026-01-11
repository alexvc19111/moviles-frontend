import React, { useState } from 'react';
import {SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions} from 'react-native';
import WebIcon from "../../components/WebIcon";

const { width } = Dimensions.get('window');

export default function HorarioScreen({ navigation, route }) {
  // Manejo seguro de parámetros
  const params = route?.params || {};
  const user = params.user || { name: "Alumno", role: "alumno" };
  const materias = params.todasMaterias || params.materias || [];
  const materiaEspecifica = params.materiaEspecifica;

  const [semanaActual, setSemanaActual] = useState(0); // 0 = semana actual
  const [vistaActual, setVistaActual] = useState('semana'); // 'semana' o 'dia'

  // Horario semanal de ejemplo
  const horarioSemanal = {
    lunes: [
      { hora: "8:00 - 10:00", materia: "Matemáticas", profesor: "Dr. García", aula: "Aula 301", color: "#FF6B6B" },
      { hora: "11:00 - 13:00", materia: "Física", profesor: "Dra. Martínez", aula: "Aula 204", color: "#45B7D1" },
    ],
    martes: [
      { hora: "10:00 - 12:00", materia: "Programación", profesor: "Ing. Rodríguez", aula: "Lab 105", color: "#4ECDC4" },
      { hora: "14:00 - 16:00", materia: "Programación", profesor: "Ing. Rodríguez", aula: "Lab 105", color: "#4ECDC4" },
    ],
    miércoles: [
      { hora: "9:00 - 11:00", materia: "Matemáticas", profesor: "Dr. García", aula: "Aula 301", color: "#FF6B6B" },
      { hora: "14:00 - 16:00", materia: "Historia", profesor: "Mtro. López", aula: "Aula 102", color: "#96CEB4" },
    ],
    jueves: [
      { hora: "10:00 - 12:00", materia: "Historia", profesor: "Mtro. López", aula: "Aula 102", color: "#96CEB4" },
      { hora: "14:00 - 16:00", materia: "Programación", profesor: "Ing. Rodríguez", aula: "Lab 105", color: "#4ECDC4" },
    ],
    viernes: [
      { hora: "8:00 - 10:00", materia: "Física", profesor: "Dra. Martínez", aula: "Aula 204", color: "#45B7D1" },
      { hora: "11:00 - 13:00", materia: "Taller", profesor: "Ing. Pérez", aula: "Taller 1", color: "#FF9800" },
    ],
    sábado: [],
    domingo: [],
  };

  // Días de la semana
  const diasSemana = [
    { key: 'lunes', nombre: 'Lunes', corto: 'LUN' },
    { key: 'martes', nombre: 'Martes', corto: 'MAR' },
    { key: 'miércoles', nombre: 'Miércoles', corto: 'MIE' },
    { key: 'jueves', nombre: 'Jueves', corto: 'JUE' },
    { key: 'viernes', nombre: 'Viernes', corto: 'VIE' },
    { key: 'sábado', nombre: 'Sábado', corto: 'SAB' },
    { key: 'domingo', nombre: 'Domingo', corto: 'DOM' },
  ];

  // Horas del día
  const horasDelDia = [
    "7:00", "8:00", "9:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];

  // Función para obtener clases de hoy
  const getClasesHoy = () => {
    const hoy = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaHoy = dias[hoy];
    return horarioSemanal[diaHoy] || [];
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <WebIcon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Horario de Clases</Text>
      
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => Alert.alert("Descargar", "Descargar horario en PDF")}
      >
        <WebIcon name="download" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderInfoHeader = () => (
    <View style={styles.infoHeader}>
      {materiaEspecifica ? (
        <View style={styles.materiaEspecificaInfo}>
          <View style={[styles.materiaIconSmall, { backgroundColor: materiaEspecifica.color || "#2196F3" }]}>
            <WebIcon name={materiaEspecifica.icon || "book"} size={20} color="#fff" />
          </View>
          <View style={styles.materiaInfoText}>
            <Text style={styles.materiaEspecificaTitle}>Horario de {materiaEspecifica.nombre}</Text>
            <Text style={styles.materiaEspecificaSub}>{materiaEspecifica.profesor}</Text>
          </View>
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={() => navigation.navigate('Horario')}
          >
            <Text style={styles.clearFilterText}>Ver todas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.semanaInfo}>
          <TouchableOpacity 
            style={styles.semanaButton}
            onPress={() => setSemanaActual(semanaActual - 1)}
          >
            <WebIcon name="chevron-left" size={24} color="#2196F3" />
          </TouchableOpacity>
          
          <View style={styles.semanaTextContainer}>
            <Text style={styles.semanaText}>
              {semanaActual === 0 ? "Esta semana" : 
               semanaActual === -1 ? "Semana anterior" : 
               semanaActual === 1 ? "Próxima semana" : 
               `Semana ${semanaActual > 0 ? '+' : ''}${semanaActual}`}
            </Text>
            <Text style={styles.fechaText}>25 - 31 Marzo 2024</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.semanaButton}
            onPress={() => setSemanaActual(semanaActual + 1)}
          >
            <WebIcon name="chevron-right" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Selector de vista */}
      <View style={styles.vistaSelector}>
        <TouchableOpacity 
          style={[styles.vistaButton, vistaActual === 'semana' && styles.vistaButtonActive]}
          onPress={() => setVistaActual('semana')}
        >
          <WebIcon name="calendar-week" size={20} color={vistaActual === 'semana' ? "#fff" : "#666"} />
          <Text style={[styles.vistaButtonText, vistaActual === 'semana' && styles.vistaButtonTextActive]}>
            Semana
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.vistaButton, vistaActual === 'dia' && styles.vistaButtonActive]}
          onPress={() => setVistaActual('dia')}
        >
          <WebIcon name="calendar-today" size={20} color={vistaActual === 'dia' ? "#fff" : "#666"} />
          <Text style={[styles.vistaButtonText, vistaActual === 'dia' && styles.vistaButtonTextActive]}>
            Día
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClasesHoy = () => {
    const clasesHoy = getClasesHoy();
    
    if (clasesHoy.length === 0) {
      return (
        <View style={styles.clasesHoyCard}>
          <Text style={styles.clasesHoyTitle}>Hoy no tienes clases</Text>
          <Text style={styles.clasesHoySubtitle}>¡Disfruta tu día!</Text>
        </View>
      );
    }

    return (
      <View style={styles.clasesHoyCard}>
        <View style={styles.clasesHoyHeader}>
          <Text style={styles.clasesHoyTitle}>Clases de hoy</Text>
          <Text style={styles.clasesHoyFecha}>Lunes, 25 de Marzo</Text>
        </View>
        
        {clasesHoy.map((clase, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.claseHoyItem}
            onPress={() => Alert.alert(clase.materia, `Profesor: ${clase.profesor}\nAula: ${clase.aula}`)}
          >
            <View style={[styles.claseHoraBadge, { backgroundColor: clase.color }]}>
              <Text style={styles.claseHoraText}>{clase.hora.split(' - ')[0]}</Text>
            </View>
            
            <View style={styles.claseInfo}>
              <Text style={styles.claseMateria}>{clase.materia}</Text>
              <Text style={styles.claseDetalle}>{clase.profesor} • {clase.aula}</Text>
            </View>
            
            <View style={styles.claseHoraCompleta}>
              <Text style={styles.claseHoraCompletaText}>{clase.hora}</Text>
              <WebIcon name="chevron-right" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderHorarioSemanal = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.horarioSemanalContainer}
    >
      {diasSemana.map((dia) => (
        <View key={dia.key} style={styles.diaColumn}>
          <View style={styles.diaHeader}>
            <Text style={styles.diaNombre}>{dia.corto}</Text>
            <Text style={styles.diaNumero}>25</Text>
          </View>
          
          <ScrollView style={styles.clasesContainer}>
            {horarioSemanal[dia.key].length > 0 ? (
              horarioSemanal[dia.key].map((clase, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.claseItem, { backgroundColor: clase.color }]}
                  onPress={() => Alert.alert(
                    clase.materia,
                    `Horario: ${clase.hora}\nProfesor: ${clase.profesor}\nAula: ${clase.aula}`
                  )}
                >
                  <Text style={styles.claseHora}>{clase.hora}</Text>
                  <Text style={styles.claseMateriaSmall}>{clase.materia}</Text>
                  <Text style={styles.claseAula}>{clase.aula}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.sinClases}>
                <WebIcon name="calendar-remove" size={24} color="#ccc" />
                <Text style={styles.sinClasesText}>Sin clases</Text>
              </View>
            )}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );

  const renderHorarioTabla = () => (
    <ScrollView style={styles.horarioTablaContainer}>
      <View style={styles.tablaHeader}>
        <View style={styles.horaColumna}>
          <Text style={styles.tablaHeaderText}>Hora</Text>
        </View>
        {diasSemana.map((dia) => (
          <View key={dia.key} style={styles.diaColumna}>
            <Text style={styles.tablaHeaderText}>{dia.corto}</Text>
            <Text style={styles.tablaSubHeaderText}>25</Text>
          </View>
        ))}
      </View>
      
      {horasDelDia.map((hora, index) => (
        <View key={index} style={styles.tablaFila}>
          <View style={styles.horaCelda}>
            <Text style={styles.horaText}>{hora}</Text>
          </View>
          
          {diasSemana.map((dia) => {
            const claseEnEstaHora = horarioSemanal[dia.key].find(clase => 
              clase.hora.includes(hora.substring(0, 2))
            );
            
            return (
              <TouchableOpacity
                key={`${dia.key}-${hora}`}
                style={[
                  styles.diaCelda,
                  claseEnEstaHora && { backgroundColor: claseEnEstaHora.color }
                ]}
                onPress={() => {
                  if (claseEnEstaHora) {
                    Alert.alert(
                      claseEnEstaHora.materia,
                      `Horario: ${claseEnEstaHora.hora}\nProfesor: ${claseEnEstaHora.profesor}\nAula: ${claseEnEstaHora.aula}`
                    );
                  }
                }}
              >
                {claseEnEstaHora ? (
                  <>
                    <Text style={styles.claseMateriaTabla}>{claseEnEstaHora.materia}</Text>
                    <Text style={styles.claseAulaTabla}>{claseEnEstaHora.aula}</Text>
                  </>
                ) : (
                  <Text style={styles.celdaVacia}>-</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );

  const renderResumenMaterias = () => (
    <View style={styles.resumenSection}>
      <Text style={styles.sectionTitle}>Horario por Materia</Text>
      
      {materias.length > 0 ? (
        materias.map((materia) => {
          // Buscar todas las clases de esta materia
          const clasesMateria = [];
          Object.keys(horarioSemanal).forEach(dia => {
            horarioSemanal[dia].forEach(clase => {
              if (clase.materia === materia.nombre) {
                clasesMateria.push({ ...clase, dia });
              }
            });
          });

          return (
            <TouchableOpacity 
              key={materia.id}
              style={styles.materiaResumenCard}
              onPress={() => navigation.navigate('Horario', { materiaEspecifica: materia })}
            >
              <View style={[styles.materiaIconResumen, { backgroundColor: materia.color }]}>
                <WebIcon name={materia.icon} size={20} color="#fff" />
              </View>
              
              <View style={styles.materiaResumenInfo}>
                <Text style={styles.materiaResumenNombre}>{materia.nombre}</Text>
                <Text style={styles.materiaResumenProfesor}>{materia.profesor}</Text>
                
                {clasesMateria.length > 0 ? (
                  <View style={styles.horariosContainer}>
                    {clasesMateria.map((clase, idx) => (
                      <View key={idx} style={styles.horarioChip}>
                        <Text style={styles.horarioChipText}>
                          {clase.dia.charAt(0).toUpperCase() + clase.dia.slice(1)} {clase.hora}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.sinHorarioText}>Sin horario asignado</Text>
                )}
              </View>
              
              <WebIcon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.sinMaterias}>
          <WebIcon name="book-off" size={40} color="#ccc" />
          <Text style={styles.sinMateriasText}>No hay materias registradas</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderInfoHeader()}
        
        {vistaActual === 'semana' ? (
          <>
            {renderClasesHoy()}
            {renderHorarioSemanal()}
            {renderResumenMaterias()}
          </>
        ) : (
          renderHorarioTabla()
        )}
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
  // Header
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
  // Información de cabecera
  infoHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  materiaEspecificaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  materiaIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materiaInfoText: {
    flex: 1,
  },
  materiaEspecificaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  materiaEspecificaSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
  semanaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  semanaButton: {
    padding: 8,
  },
  semanaTextContainer: {
    alignItems: 'center',
  },
  semanaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fechaText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  vistaSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  vistaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  vistaButtonActive: {
    backgroundColor: '#2196F3',
  },
  vistaButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
  },
  vistaButtonTextActive: {
    color: '#fff',
  },
  // Clases de hoy
  clasesHoyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  clasesHoyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clasesHoyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  clasesHoyFecha: {
    fontSize: 14,
    color: '#666',
  },
  clasesHoySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  claseHoyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  claseHoraBadge: {
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  claseHoraText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  claseInfo: {
    flex: 1,
  },
  claseMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  claseDetalle: {
    fontSize: 12,
    color: '#666',
  },
  claseHoraCompleta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claseHoraCompletaText: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  // Horario semanal
  horarioSemanalContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  diaColumn: {
    width: 140,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  diaHeader: {
    backgroundColor: '#2196F3',
    padding: 12,
    alignItems: 'center',
  },
  diaNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  diaNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  clasesContainer: {
    maxHeight: 400,
    padding: 10,
  },
  claseItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  claseHora: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  claseMateriaSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  claseAula: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
  sinClases: {
    alignItems: 'center',
    padding: 20,
  },
  sinClasesText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  // Horario tabla
  horarioTablaContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tablaHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  horaColumna: {
    width: 60,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
  },
  diaColumna: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tablaHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  tablaSubHeaderText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  tablaFila: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  horaCelda: {
    width: 60,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  horaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  diaCelda: {
    flex: 1,
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    minHeight: 60,
    justifyContent: 'center',
  },
  claseMateriaTabla: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  claseAulaTabla: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
  },
  celdaVacia: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  // Resumen materias
  resumenSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
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
  materiaResumenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  materiaIconResumen: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materiaResumenInfo: {
    flex: 1,
  },
  materiaResumenNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  materiaResumenProfesor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  horarioChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  horarioChipText: {
    fontSize: 10,
    color: '#666',
  },
  sinHorarioText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  sinMaterias: {
    alignItems: 'center',
    padding: 30,
  },
  sinMateriasText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  // Acciones
  accionesContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
  },
  accionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
  },
  accionButtonSecundario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  accionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});
