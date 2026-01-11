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
  Platform,
  Modal,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeProfesorScreen = ({ navigation }) => {
  // Datos del profesor
  const user = {
    nombre: "Maria García",
    email: "profesor@escuela.com",
    rol: "Profesor",
    especialidad: "Matemáticas",
    matricula: "PROF-2023-001",
    avatar: null
  };
  
  // Estados
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  
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
    { id: 1, titulo: 'Examen Parcial', materia: 'Matemáticas', fecha: '25 Mar', entregas: 38, total: 45, icon: 'file-document' },
    { id: 2, titulo: 'Proyecto Final', materia: 'Programación', fecha: '30 Mar', entregas: 15, total: 45, icon: 'code-braces' },
    { id: 3, titulo: 'Práctica de Laboratorio', materia: 'Física', fecha: '28 Mar', entregas: 42, total: 45, icon: 'flask' },
  ]);
  
  const [anuncios] = useState([
    { id: 1, titulo: 'Reunión de Departamento', fecha: 'Hoy 16:00', descripcion: 'Sala de profesores', tipo: 'reunion', icon: 'account-group' },
    { id: 2, titulo: 'Capacitación Nueva Plataforma', fecha: 'Mañana 10:00', descripcion: 'Aula Magna', tipo: 'capacitacion', icon: 'school' },
    { id: 3, titulo: 'Entrega de Calificaciones', fecha: '28 Mar', descripcion: 'Fecha límite para subir notas', tipo: 'importante', icon: 'alert-circle' },
  ]);

  // Fecha actual
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Funciones
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Actualizado', 'Datos actualizados correctamente');
    }, 1500);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          onPress: handleLogout
        }
      ]
    );
  };

  const navigateToPerfil = () => {
    setMenuVisible(false);
    navigation.navigate('PerfilProfesor', { user });
  };

  const navigateToNotificaciones = () => {
    setMenuVisible(false);
    navigation.navigate('NotificacionesProfesor', { anuncios });
  };

  const getShadowStyle = (elevation = 3) => {
    if (Platform.OS === 'web') {
      return {
        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
      };
    }
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: elevation,
    };
  };

  const MenuItem = ({ title, icon, color = '#333', onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={22} color={color} style={styles.menuItemIcon} />
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, getShadowStyle()]}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
            <Icon name="menu" size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <Text style={styles.welcomeText}>Panel del Profesor</Text>
            <Text style={styles.userName}>Prof. {user.nombre}</Text>
            <Text style={styles.userRole}>
              <Icon name="certificate" size={12} color="#FF9800" /> {user.especialidad}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={navigateToNotificaciones}
          >
            <Icon name="bell-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
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
        {/* ========== FECHA ACTUAL ========== */}
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={18} color="#666" />
          <Text style={styles.dateText}>{fechaActual}</Text>
        </View>

        {/* ========== ESTADÍSTICAS RÁPIDAS ========== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Día</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity 
              style={[styles.statCard, getShadowStyle()]}
              onPress={() => navigation.navigate('ListaAlumnos')}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="account-multiple" size={24} color="#2196F3" />
              </View>
              <Text style={styles.statNumber}>{estadisticas.totalAlumnos}</Text>
              <Text style={styles.statLabel}>Alumnos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, getShadowStyle()]}
              onPress={() => navigation.navigate('HorarioProfesor')}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="calendar-clock" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statNumber}>{estadisticas.clasesHoy}</Text>
              <Text style={styles.statLabel}>Clases Hoy</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.statCard, getShadowStyle()]}
              onPress={() => navigation.navigate('TareasPendientes')}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="clipboard-check" size={24} color="#FF9800" />
              </View>
              <Text style={styles.statNumber}>{estadisticas.tareasPendientes}</Text>
              <Text style={styles.statLabel}>Tareas Pendientes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== CLASES DE HOY ========== */}
        <View style={[styles.section, getShadowStyle()]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Clases de Hoy</Text>
            <TouchableOpacity onPress={() => navigation.navigate('HorarioProfesor')}>
              <Text style={styles.seeAll}>Ver Horario Completo</Text>
            </TouchableOpacity>
          </View>
          
          {clasesHoy.map((clase) => (
            <TouchableOpacity 
              key={clase.id} 
              style={styles.claseItem}
              onPress={() => navigation.navigate('DetalleClase', { clase })}
              activeOpacity={0.7}
            >
              <View style={[styles.claseTime, { borderLeftColor: clase.color }]}>
                <Text style={styles.claseHora}>{clase.hora}</Text>
              </View>
              <View style={styles.claseInfo}>
                <Text style={styles.claseMateria}>{clase.materia}</Text>
                <View style={styles.claseDetails}>
                  <View style={styles.claseDetail}>
                    <Icon name="map-marker" size={14} color="#666" />
                    <Text style={styles.claseDetailText}>{clase.aula}</Text>
                  </View>
                  <View style={styles.claseDetail}>
                    <Icon name="clock-outline" size={14} color="#666" />
                    <Text style={styles.claseDetailText}>90 min</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.claseAction}
                onPress={() => navigation.navigate('TomarAsistencia', { clase })}
              >
                <Icon name="clipboard-check-outline" size={20} color="#2196F3" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========== TAREAS Y EVALUACIONES ========== */}
        <View style={[styles.section, getShadowStyle()]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tareas y Evaluaciones</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TodasTareas')}>
              <Text style={styles.seeAll}>Ver Todas</Text>
            </TouchableOpacity>
          </View>
          
          {tareasRecientes.map((tarea) => (
            <TouchableOpacity 
              key={tarea.id} 
              style={styles.tareaItem}
              onPress={() => navigation.navigate('DetalleTarea', { tarea })}
              activeOpacity={0.7}
            >
              <View style={styles.tareaIconContainer}>
                <Icon name={tarea.icon} size={24} color="#2196F3" />
              </View>
              <View style={styles.tareaInfo}>
                <View style={styles.tareaHeader}>
                  <Text style={styles.tareaTitulo}>{tarea.titulo}</Text>
                  <Text style={styles.tareaFecha}>{tarea.fecha}</Text>
                </View>
                <Text style={styles.tareaMateria}>{tarea.materia}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabels}>
                    <Text style={styles.progressText}>Entregas: {tarea.entregas}/{tarea.total}</Text>
                    <Text style={styles.progressPercent}>
                      {Math.round((tarea.entregas / tarea.total) * 100)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(tarea.entregas / tarea.total) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
                
                <View style={styles.tareaActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.calificarButton]}
                    onPress={() => navigation.navigate('CalificarTarea', { tarea })}
                  >
                    <Icon name="pencil" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Calificar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.detallesButton]}
                    onPress={() => navigation.navigate('DetalleTarea', { tarea })}
                  >
                    <Text style={styles.detallesButtonText}>Detalles</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========== ANUNCIOS Y RECORDATORIOS ========== */}
        <View style={[styles.section, getShadowStyle()]}>
          <Text style={styles.sectionTitle}>Anuncios y Recordatorios</Text>
          
          {anuncios.map((anuncio) => (
            <TouchableOpacity 
              key={anuncio.id} 
              style={styles.anuncioItem}
              onPress={() => navigation.navigate('DetalleAnuncio', { anuncio })}
              activeOpacity={0.7}
            >
              <View style={[
                styles.anuncioIcon, 
                { backgroundColor: anuncio.tipo === 'reunion' ? '#2196F320' : 
                                 anuncio.tipo === 'capacitacion' ? '#4CAF5020' : '#FF980020' }
              ]}>
                <Icon 
                  name={anuncio.icon} 
                  size={20} 
                  color={anuncio.tipo === 'reunion' ? '#2196F3' : 
                         anuncio.tipo === 'capacitacion' ? '#4CAF50' : '#FF9800'} 
                />
              </View>
              <View style={styles.anuncioContent}>
                <View style={styles.anuncioHeader}>
                  <Text style={styles.anuncioTitulo}>{anuncio.titulo}</Text>
                  <View style={[
                    styles.anuncioBadge,
                    { 
                      backgroundColor: anuncio.tipo === 'reunion' ? '#2196F320' : 
                                      anuncio.tipo === 'capacitacion' ? '#4CAF5020' : '#FF980020' 
                    }
                  ]}>
                    <Text style={[
                      styles.anuncioBadgeText,
                      { 
                        color: anuncio.tipo === 'reunion' ? '#2196F3' : 
                               anuncio.tipo === 'capacitacion' ? '#4CAF50' : '#FF9800' 
                      }
                    ]}>
                      {anuncio.tipo}
                    </Text>
                  </View>
                </View>
                <Text style={styles.anuncioDesc}>{anuncio.descripcion}</Text>
                <View style={styles.anuncioFecha}>
                  <Icon name="clock-outline" size={12} color="#999" />
                  <Text style={styles.anuncioFechaText}>{anuncio.fecha}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========== ACCIONES RÁPIDAS ========== */}
        <View style={[styles.section, getShadowStyle()]}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('NuevaTarea')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="plus-circle" size={28} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Nueva Tarea</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('TomarAsistencia')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="clipboard-check-outline" size={28} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Registrar Asistencia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('SubirCalificaciones')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="upload" size={28} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Subir Calificaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('EnviarComunicado')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Icon name="email-send" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>Enviar Comunicado</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Icon name="school" size={40} color="#E0E0E0" />
            <Text style={styles.footerText}>Sistema de Gestión Docente v2.0</Text>
            <Text style={styles.footerSubtext}>© 2024 - Escuela Tecnológica</Text>
          </View>
        </View>
      </ScrollView>

      {/* ===== MENÚ LATERAL ===== */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menu, getShadowStyle(10)]}>
            <View style={styles.menuHeader}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.menuAvatar} />
              ) : (
                <View style={[styles.menuAvatar, styles.avatarFallback]}>
                  <Icon name="teach" size={32} color="#fff" />
                </View>
              )}
              <View style={styles.menuUserInfo}>
                <Text style={styles.menuUserName}>Prof. {user.nombre}</Text>
                <Text style={styles.menuUserRole}>
                  <Icon name="certificate" size={12} color="#FF9800" /> {user.especialidad}
                </Text>
                <Text style={styles.menuUserEmail}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            <MenuItem 
              title="Dashboard" 
              icon="view-dashboard-outline" 
              onPress={() => {
                setMenuVisible(false);
              }} 
            />
            <MenuItem 
              title="Mi Perfil" 
              icon="account-outline" 
              onPress={navigateToPerfil} 
            />
            <MenuItem 
              title="Mis Clases" 
              icon="calendar-blank-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('HorarioProfesor');
              }} 
            />
            <MenuItem 
              title="Lista de Alumnos" 
              icon="account-multiple-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ListaAlumnos');
              }} 
            />
            <MenuItem 
              title="Calificaciones" 
              icon="clipboard-check-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Calificaciones');
              }} 
            />
            <MenuItem 
              title="Tareas y Evaluaciones" 
              icon="file-document-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('TareasPendientes');
              }} 
            />
            <MenuItem 
              title="Notificaciones" 
              icon="bell-outline" 
              onPress={navigateToNotificaciones} 
            />

            <View style={styles.menuDivider} />

            <MenuItem 
              title="Configuración" 
              icon="cog-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ConfiguracionProfesor');
              }} 
            />
            <MenuItem 
              title="Cerrar Sesión" 
              icon="logout-variant" 
              color="#F44336"
              onPress={() => {
                setMenuVisible(false);
                setLogoutModalVisible(true);
              }} 
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ===== MODAL DE CERRAR SESIÓN ===== */}
      <Modal
        transparent={true}
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, getShadowStyle(10)]}>
            <Icon name="logout-variant" size={50} color="#F44336" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Cerrar Sesión</Text>
            <Text style={styles.modalDescription}>
              ¿Estás seguro de que quieres salir del sistema?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>Cerrar Sesión</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 3,
  },
  userRole: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
  },
  notificationButton: {
    padding: 10,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  claseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  claseTime: {
    width: 80,
    borderLeftWidth: 3,
    paddingLeft: 10,
  },
  claseHora: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  claseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  claseMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 6,
  },
  claseDetails: {
    flexDirection: 'row',
  },
  claseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  claseDetailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  claseAction: {
    padding: 10,
  },
  tareaItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  tareaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tareaInfo: {
    flex: 1,
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tareaTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  tareaFecha: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  tareaMateria: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  tareaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
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
  detallesButtonText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
  },
  anuncioItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
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
  anuncioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  anuncioTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  anuncioBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  anuncioBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  anuncioDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  anuncioFecha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anuncioFechaText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
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
    color: '#616161',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '500',
    marginTop: 10,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#BDBDBD',
    marginTop: 5,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menu: {
    backgroundColor: '#fff',
    width: 300,
    height: '100%',
    paddingTop: 50,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  avatarFallback: {
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  menuUserRole: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  menuUserEmail: {
    fontSize: 12,
    color: '#999',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  menuItemIcon: {
    width: 28,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    width: '85%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default HomeProfesorScreen;