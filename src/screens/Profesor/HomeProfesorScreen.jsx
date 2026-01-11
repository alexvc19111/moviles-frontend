import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeProfesorScreen = ({ navigation }) => {
  // Datos del profesor
  const user = {
    nombre: "Maria García",
    email: "profesor@escuela.com",
    rol: "Profesor",
    especialidad: "Matemáticas",
    matricula: "PROF-2023-001"
  };
  
  const isDarkMode = false;
  
  // Estados
  const [refreshing, setRefreshing] = useState(false);
  const [estadisticas] = useState({
    totalAlumnos: 45,
    clasesHoy: 3,
    tareasPendientes: 12,
    proximoExamen: 'Matemáticas'
  });
  
  const [clasesHoy] = useState([
    { id: 1, materia: 'Matemáticas', hora: '08:00 - 09:30', aula: 'A-201', color: '#4CAF50' },
    { id: 2, materia: 'Física', hora: '10:00 - 11:30', aula: 'Lab-3', color: '#2196F3' },
    { id: 3, materia: 'Programación', hora: '14:00 - 15:30', aula: 'Comp-5', color: '#FF9800' },
  ]);
  
  const [tareasRecientes] = useState([
    { id: 1, titulo: 'Examen Parcial', materia: 'Matemáticas', fecha: '25 Mar', entregas: 38, total: 45 },
    { id: 2, titulo: 'Proyecto Final', materia: 'Programación', fecha: '30 Mar', entregas: 15, total: 45 },
    { id: 3, titulo: 'Práctica de Laboratorio', materia: 'Física', fecha: '28 Mar', entregas: 42, total: 45 },
  ]);
  
  const [anuncios] = useState([
    { id: 1, titulo: 'Reunión de Departamento', fecha: 'Hoy 16:00', descripcion: 'Sala de profesores', tipo: 'reunion' },
    { id: 2, titulo: 'Capacitación Nueva Plataforma', fecha: 'Mañana 10:00', descripcion: 'Aula Magna', tipo: 'capacitacion' },
    { id: 3, titulo: 'Entrega de Calificaciones', fecha: '28 Mar', descripcion: 'Fecha límite para subir notas', tipo: 'importante' },
  ]);

  // Fecha actual
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Actualizado', 'Datos actualizados correctamente');
    }, 1500);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const handleCardPress = (tipo) => {
    Alert.alert('Navegar', `Ir a ${tipo}`);
  };

  const handleClasePress = (clase) => {
    Alert.alert(clase.materia, `Hora: ${clase.hora}\nAula: ${clase.aula}`);
  };

  const handleTareaPress = (tarea) => {
    Alert.alert(tarea.titulo, `Materia: ${tarea.materia}\nEntregas: ${tarea.entregas}/${tarea.total}`);
  };

  const handleAnuncioPress = (anuncio) => {
    Alert.alert(anuncio.titulo, anuncio.descripcion);
  };

  // Estilos
  const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
  const headerStyle = isDarkMode ? styles.darkHeader : styles.lightHeader;
  const cardStyle = isDarkMode ? styles.darkCard : styles.lightCard;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;
  const subtextStyle = isDarkMode ? styles.darkSubtext : styles.lightSubtext;

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#1E1E1E" : "#FFFFFF"}
      />
      
      {/* Header */}
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => Alert.alert('Perfil', 'Ver perfil del profesor')}
          >
            <Text style={{ fontSize: 40, color: '#2196F3' }}>👨‍🏫</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.greeting, textStyle]}>
              ¡Buen día, Prof. {user.nombre.split(' ')[0]}!
            </Text>
            <Text style={[styles.date, subtextStyle]}>{fechaActual}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => Alert.alert('Notificaciones', 'Tienes 3 notificaciones nuevas')}
          >
            <Text style={{ fontSize: 24, color: '#666' }}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>✕ Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      >
        {/* ========== ESTADÍSTICAS RÁPIDAS ========== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textStyle]}>Resumen del Día</Text>
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={[styles.statCard, cardStyle]}
              onPress={() => navigation.navigate('ListaAlumnos')}
            >
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <Text style={{ fontSize: 24, color: '#2196F3' }}>👥</Text>
              </View>
              <Text style={[styles.statNumber, textStyle]}>{estadisticas.totalAlumnos}</Text>
              <Text style={[styles.statLabel, subtextStyle]}>Alumnos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, cardStyle]}
              onPress={() => handleCardPress('clases')}
            >
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={{ fontSize: 24, color: '#4CAF50' }}>📅</Text>
              </View>
              <Text style={[styles.statNumber, textStyle]}>{estadisticas.clasesHoy}</Text>
              <Text style={[styles.statLabel, subtextStyle]}>Clases Hoy</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, cardStyle]}
              onPress={() => handleCardPress('tareas')}
            >
              <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={{ fontSize: 24, color: '#FF9800' }}>📋</Text>
              </View>
              <Text style={[styles.statNumber, textStyle]}>{estadisticas.tareasPendientes}</Text>
              <Text style={[styles.statLabel, subtextStyle]}>Tareas Pendientes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== CLASES DE HOY ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, textStyle]}>Clases de Hoy</Text>
            <TouchableOpacity onPress={() => navigation.navigate('HorarioProfesor')}>
              <Text style={[styles.seeAll, { color: '#2196F3' }]}>Ver Horario</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {clasesHoy.map((clase) => (
              <TouchableOpacity 
                key={clase.id} 
                style={[styles.claseCard, cardStyle]}
                onPress={() => handleClasePress(clase)}
              >
                <View style={[styles.claseColor, { backgroundColor: clase.color }]} />
                <Text style={[styles.claseMateria, textStyle]}>{clase.materia}</Text>
                <View style={styles.claseInfo}>
                  <Text style={{ fontSize: 14, color: '#757575' }}>🕐</Text>
                  <Text style={[styles.claseHora, subtextStyle]}>{clase.hora}</Text>
                </View>
                <View style={styles.claseInfo}>
                  <Text style={{ fontSize: 14, color: '#757575' }}>📍</Text>
                  <Text style={[styles.claseAula, subtextStyle]}>{clase.aula}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.claseButton}
                  onPress={() => navigation.navigate('TomarAsistencia')}
                >
                  <Text style={styles.claseButtonText}>Tomar Asistencia</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========== TAREAS Y EVALUACIONES ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, textStyle]}>Tareas y Evaluaciones</Text>
            <TouchableOpacity onPress={() => Alert.alert('Tareas', 'Ver todas las tareas')}>
              <Text style={[styles.seeAll, { color: '#2196F3' }]}>Ver Todas</Text>
            </TouchableOpacity>
          </View>
          
          {tareasRecientes.map((tarea) => (
            <TouchableOpacity 
              key={tarea.id} 
              style={[styles.tareaCard, cardStyle]}
              onPress={() => handleTareaPress(tarea)}
            >
              <View style={styles.tareaHeader}>
                <View style={styles.tareaLeft}>
                  <Text style={{ fontSize: 24, color: '#2196F3' }}>📋</Text>
                  <View style={styles.tareaInfo}>
                    <Text style={[styles.tareaTitulo, textStyle]}>{tarea.titulo}</Text>
                    <Text style={[styles.tareaMateria, subtextStyle]}>{tarea.materia}</Text>
                  </View>
                </View>
                <View style={styles.tareaFechaContainer}>
                  <Text style={[styles.tareaFecha, subtextStyle]}>{tarea.fecha}</Text>
                  <Text style={{ fontSize: 14, color: '#757575' }}>📅</Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(tarea.entregas / tarea.total) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, subtextStyle]}>
                  {tarea.entregas} de {tarea.total} entregados
                </Text>
              </View>
              
              <View style={styles.tareaActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.calificarButton]}
                  onPress={() => navigation.navigate('CalificarTareas')}
                >
                  <Text style={{ fontSize: 16, color: '#FFFFFF' }}>✏️</Text>
                  <Text style={styles.actionButtonText}>Calificar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.detallesButton]}
                  onPress={() => handleTareaPress(tarea)}
                >
                  <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>Detalles</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========== ANUNCIOS ========== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textStyle]}>Anuncios y Recordatorios</Text>
          
          {anuncios.map((anuncio) => (
            <TouchableOpacity 
              key={anuncio.id} 
              style={[styles.anuncioCard, cardStyle]}
              onPress={() => handleAnuncioPress(anuncio)}
            >
              <View style={[
                styles.anuncioIcon, 
                { backgroundColor: anuncio.tipo === 'reunion' ? '#2196F3' : 
                                 anuncio.tipo === 'capacitacion' ? '#4CAF50' : '#FF9800' }
              ]}>
                <Text style={{ fontSize: 20, color: '#FFFFFF' }}>
                  {anuncio.tipo === 'reunion' ? '👥' : 
                   anuncio.tipo === 'capacitacion' ? '🏫' : '⚠️'}
                </Text>
              </View>
              <View style={styles.anuncioContent}>
                <Text style={[styles.anuncioTitulo, textStyle]}>{anuncio.titulo}</Text>
                <Text style={[styles.anuncioDesc, subtextStyle]}>{anuncio.descripcion}</Text>
                <View style={styles.anuncioFecha}>
                  <Text style={{ fontSize: 12, color: '#757575' }}>🕒</Text>
                  <Text style={[styles.anuncioFechaText, subtextStyle]}>{anuncio.fecha}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 20, color: '#757575' }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========== ACCIONES RÁPIDAS ========== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textStyle]}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, cardStyle]}
              onPress={() => navigation.navigate('NuevaTarea')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Text style={{ fontSize: 28, color: '#2196F3' }}>➕</Text>
              </View>
              <Text style={[styles.actionText, textStyle]}>Nueva Tarea</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, cardStyle]}
              onPress={() => navigation.navigate('TomarAsistencia')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={{ fontSize: 28, color: '#4CAF50' }}>✔️</Text>
              </View>
              <Text style={[styles.actionText, textStyle]}>Registrar Asistencia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, cardStyle]}
              onPress={() => navigation.navigate('SubirCalificaciones')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={{ fontSize: 28, color: '#FF9800' }}>⬆️</Text>
              </View>
              <Text style={[styles.actionText, textStyle]}>Subir Calificaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, cardStyle]}
              onPress={() => navigation.navigate('EnviarComunicado')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Text style={{ fontSize: 28, color: '#9C27B0' }}>✉️</Text>
              </View>
              <Text style={[styles.actionText, textStyle]}>Enviar Comunicado</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Espacio al final */}
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Botón Flotante */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => Alert.alert('Acción Rápida', '¿Qué deseas hacer?')}
      >
        <Text style={{ fontSize: 24, color: '#FFFFFF' }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  lightContainer: {
    backgroundColor: '#F5F7FA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  date: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  lightText: {
    color: '#212121',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightSubtext: {
    color: '#757575',
  },
  darkSubtext: {
    color: '#B0B0B0',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 4,
    minHeight: 110,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  claseCard: {
    width: 200,
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  claseColor: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  claseMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  claseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  claseHora: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
  },
  claseAula: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
  },
  claseButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  claseButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tareaCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tareaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tareaInfo: {
    marginLeft: 12,
    flex: 1,
  },
  tareaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  tareaMateria: {
    fontSize: 12,
    color: '#757575',
  },
  tareaFechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tareaFecha: {
    fontSize: 12,
    color: '#757575',
    marginRight: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#757575',
    textAlign: 'right',
  },
  tareaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  calificarButton: {
    backgroundColor: '#2196F3',
  },
  detallesButton: {
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  anuncioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  anuncioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  anuncioContent: {
    flex: 1,
  },
  anuncioTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  anuncioDesc: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 6,
  },
  anuncioFecha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anuncioFechaText: {
    fontSize: 10,
    color: '#757575',
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  footerSpacer: {
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default HomeProfesorScreen;
