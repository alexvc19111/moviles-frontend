import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  Platform
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeAlumnoScreen({ navigation, route }) {
  const { user } = route.params || { 
    name: "Juan Pérez", 
    role: "alumno",
    email: "juan.perez@escuela.edu",
    matricula: "202400123",
    carrera: "Ingeniería en Sistemas",
    semestre: "5°"
  };
  
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Datos de ejemplo con imágenes
  const [dashboardData, setDashboardData] = useState({
    promedio: 8.5,
    asistencias: 92,
    materias: [
      {
        id: 1,
        nombre: "Matemáticas Avanzadas",
        profesor: "Dr. Carlos García",
        icon: "calculator",
        color: "#FF6B6B",
        codigo: "MAT501",
        horario: "Lunes 8:00-10:00, Miércoles 9:00-11:00",
        aula: "Aula 301",
        creditos: 6,
        colorHex: "#FF6B6B"
      },
      {
        id: 2,
        nombre: "Programación Avanzada",
        profesor: "Ing. Ana Rodríguez",
        icon: "code-braces",
        color: "#4ECDC4",
        codigo: "PROG501",
        horario: "Martes 10:00-12:00, Jueves 14:00-16:00",
        aula: "Laboratorio 105",
        creditos: 8,
        colorHex: "#4ECDC4"
      },
      {
        id: 3,
        nombre: "Física Cuántica",
        profesor: "Dra. María Martínez",
        icon: "atom",
        color: "#45B7D1",
        codigo: "FIS501",
        horario: "Lunes 11:00-13:00, Viernes 8:00-10:00",
        aula: "Aula 204",
        creditos: 6,
        colorHex: "#45B7D1"
      },
      {
        id: 4,
        nombre: "Historia Contemporánea",
        profesor: "Mtro. José López",
        icon: "book-open",
        color: "#96CEB4",
        codigo: "HIS401",
        horario: "Miércoles 14:00-16:00, Jueves 10:00-12:00",
        aula: "Aula 102",
        creditos: 4,
        colorHex: "#96CEB4"
      },
    ],
    calificaciones: [
      { materia: "Matemáticas Avanzadas", calificacion: 9.0, fecha: "15/03/2024", tendencia: "up", materiaId: 1 },
      { materia: "Programación Avanzada", calificacion: 8.5, fecha: "20/03/2024", tendencia: "up", materiaId: 2 },
      { materia: "Física Cuántica", calificacion: 7.8, fecha: "18/03/2024", tendencia: "down", materiaId: 3 },
      { materia: "Historia Contemporánea", calificacion: 9.2, fecha: "22/03/2024", tendencia: "up", materiaId: 4 },
    ],
    avisos: [
      {
        id: 1,
        titulo: "Suspensión de clases",
        contenido: "El próximo viernes no habrá clases por mantenimiento de las instalaciones.",
        tipo: "urgente",
        fecha: "Hoy 10:30 AM",
        icon: "alert-circle"
      },
      {
        id: 2,
        titulo: "Entrega de proyectos finales",
        contenido: "Fecha límite para proyecto final: 30 de marzo a las 23:59 hrs.",
        tipo: "académico",
        fecha: "Ayer 15:45 PM",
        icon: "file-document"
      },
      {
        id: 3,
        titulo: "Concurso de programación",
        contenido: "Inscripciones abiertas para el concurso anual de programación. Premios en efectivo.",
        tipo: "evento",
        fecha: "23/03/2024",
        icon: "trophy"
      },
    ],
    proximasClases: [
      { materia: "Matemáticas Avanzadas", hora: "8:00 AM", aula: "A301", profesor: "Dr. García" },
      { materia: "Física Cuántica", hora: "11:00 AM", aula: "A204", profesor: "Dra. Martínez" },
      { materia: "Programación Avanzada", hora: "2:00 PM", aula: "Lab 105", profesor: "Ing. Rodríguez" },
    ]
  });

  const loadDashboardData = () => {
    console.log("Cargando datos del alumno...");
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Actualizado", "Datos actualizados correctamente");
    }, 1500);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesión", 
          onPress: handleLogout
        }
      ]
    );
  };

  // Funciones de navegación
  const navigateToProfile = () => {
    setMenuVisible(false);
    navigation.navigate('PerfilAlumno', { 
      userData: user,
      promedio: dashboardData.promedio,
      asistencias: dashboardData.asistencias
    });
  };

  const navigateToCalificaciones = (materia = null) => {
    setMenuVisible(false);
    if (materia) {
      const calificacionesMateria = dashboardData.calificaciones.filter(
        cal => cal.materiaId === materia.id
      );
      
      navigation.navigate('Calificaciones', { 
        materia: materia,
        calificaciones: calificacionesMateria,
        promedioGeneral: dashboardData.promedio
      });
    } else {
      navigation.navigate('Calificaciones', { 
        todasCalificaciones: dashboardData.calificaciones,
        promedioGeneral: dashboardData.promedio,
        materias: dashboardData.materias
      });
    }
  };

  const navigateToHorario = (materia = null) => {
    setMenuVisible(false);
    if (materia) {
      navigation.navigate('Horario', { 
        materiaEspecifica: materia,
        todasMaterias: dashboardData.materias
      });
    } else {
      navigation.navigate('Horario', { 
        todasMaterias: dashboardData.materias,
        user: user
      });
    }
  };

  const navigateToAsistencias = () => {
    setMenuVisible(false);
    navigation.navigate('Asistencias', { 
      user: user,
      promedioAsistencia: dashboardData.asistencias
    });
  };

  const navigateToMaterias = () => {
    setMenuVisible(false);
    navigation.navigate('Materias', { 
      materias: dashboardData.materias,
      user: user
    });
  };

  const navigateToAjustes = () => {
    setMenuVisible(false);
    navigation.navigate('Ajustes', { 
      user: user
    });
  };

  const navigateToNotificaciones = () => {
    setMenuVisible(false);
    navigation.navigate('Notificaciones', { 
      avisos: dashboardData.avisos
    });
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.userDetails}>
          <Text style={styles.welcomeText}>¡Bienvenido de nuevo!</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>
            <Icon name="school" size={12} color="#4CAF50" /> Estudiante
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={navigateToNotificaciones}
      >
        <Icon name="bell-outline" size={24} color="#333" />
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>{dashboardData.avisos.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statRow}>
        {/* PROMEDIO */}
        <TouchableOpacity 
          style={[styles.statCard, getShadowStyle()]}
          onPress={() => navigateToCalificaciones()}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Icon name="chart-line" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{dashboardData.promedio.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Promedio</Text>
          <View style={styles.trendContainer}>
            <Icon name="trending-up" size={14} color="#4CAF50" />
            <Text style={[styles.statTrend, { color: '#4CAF50' }]}>+0.3</Text>
          </View>
        </TouchableOpacity>

        {/* ASISTENCIA */}
        <TouchableOpacity 
          style={[styles.statCard, getShadowStyle()]}
          onPress={navigateToAsistencias}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Icon name="checkbox-marked-circle-outline" size={24} color="#2196F3" />
          </View>
          <Text style={styles.statValue}>{dashboardData.asistencias}%</Text>
          <Text style={styles.statLabel}>Asistencia</Text>
          <View style={styles.trendContainer}>
            <Icon name="star" size={14} color="#FFC107" />
            <Text style={[styles.statTrend, { color: '#FF9800' }]}>Excelente</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statRow}>
        {/* MATERIAS */}
        <TouchableOpacity 
          style={[styles.statCard, getShadowStyle()]}
          onPress={navigateToMaterias}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Icon name="book-open-variant" size={24} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>{dashboardData.materias.length}</Text>
          <Text style={styles.statLabel}>Materias</Text>
          <Text style={styles.statTrend}>4 activas</Text>
        </TouchableOpacity>

        {/* CRÉDITOS */}
        <View style={[styles.statCard, getShadowStyle()]}>
          <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Icon name="credit-card-clock" size={24} color="#9C27B0" />
          </View>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Créditos</Text>
          <Text style={styles.statTrend}>5° semestre</Text>
        </View>
      </View>
    </View>
  );

  const renderProximasClases = () => (
    <View style={[styles.section, getShadowStyle()]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximas Clases Hoy</Text>
        <TouchableOpacity onPress={() => navigateToHorario()}>
          <Text style={styles.seeAll}>Ver horario completo</Text>
        </TouchableOpacity>
      </View>

      {dashboardData.proximasClases.map((clase, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.claseItem}
          onPress={() => {
            const materia = dashboardData.materias.find(m => m.nombre === clase.materia);
            if (materia) navigateToHorario(materia);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.claseTime}>
            <Text style={styles.claseHora}>{clase.hora}</Text>
          </View>
          <View style={styles.claseInfo}>
            <Text style={styles.claseMateria}>{clase.materia}</Text>
            <Text style={styles.claseDetalle}>
              <Icon name="account" size={12} color="#666" /> {clase.profesor}
            </Text>
          </View>
          <View style={styles.claseAula}>
            <Text style={styles.claseAulaText}>{clase.aula}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMaterias = () => (
    <View style={[styles.section, getShadowStyle()]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mis Materias</Text>
        <TouchableOpacity onPress={navigateToMaterias}>
          <Text style={styles.seeAll}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.materiasScroll}
      >
        {dashboardData.materias.map((materia) => (
          <TouchableOpacity 
            key={materia.id}
            style={[styles.materiaCard, { backgroundColor: materia.colorHex + '20' }]}
            onPress={() => navigateToHorario(materia)}
            activeOpacity={0.7}
          >
            <View style={[styles.materiaIcon, { backgroundColor: materia.colorHex }]}>
              <Icon name={materia.icon} size={24} color="#fff" />
            </View>
            <Text style={styles.materiaCardNombre}>{materia.nombre}</Text>
            <Text style={styles.materiaCardProfesor}>{materia.profesor}</Text>
            <View style={styles.materiaCardFooter}>
              <Text style={styles.materiaCardCodigo}>{materia.codigo}</Text>
              <Text style={styles.materiaCardCreditos}>{materia.creditos} créditos</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCalificaciones = () => (
    <View style={[styles.section, getShadowStyle()]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Calificaciones Recientes</Text>
        <TouchableOpacity onPress={() => navigateToCalificaciones()}>
          <Text style={styles.seeAll}>Ver historial</Text>
        </TouchableOpacity>
      </View>

      {dashboardData.calificaciones.map((cal, index) => {
        const materia = dashboardData.materias.find(m => m.id === cal.materiaId);
        return (
          <TouchableOpacity 
            key={index}
            style={styles.calificacionItem}
            onPress={() => materia && navigateToCalificaciones(materia)}
            activeOpacity={0.7}
          >
            <View style={[styles.calificacionIcon, { backgroundColor: materia?.colorHex + '20' }]}>
              <Icon name="file-document" size={20} color={materia?.colorHex || '#666'} />
            </View>
            <View style={styles.calificacionInfo}>
              <Text style={styles.calificacionMateria}>{cal.materia}</Text>
              <Text style={styles.calificacionFecha}>{cal.fecha}</Text>
            </View>
            <View style={styles.calificacionNotaContainer}>
              <Text style={[
                styles.calificacionNota, 
                { color: cal.calificacion >= 8 ? '#4CAF50' : cal.calificacion >= 6 ? '#FF9800' : '#F44336' }
              ]}>
                {cal.calificacion.toFixed(1)}
              </Text>
              <Icon 
                name={cal.tendencia === "up" ? "trending-up" : "trending-down"} 
                size={16} 
                color={cal.tendencia === "up" ? "#4CAF50" : "#F44336"} 
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderAvisos = () => (
    <View style={[styles.section, getShadowStyle()]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Avisos Recientes</Text>
        <TouchableOpacity onPress={navigateToNotificaciones}>
          <Icon name="bell-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {dashboardData.avisos.map((aviso) => (
        <TouchableOpacity 
          key={aviso.id}
          style={styles.avisoCard}
          activeOpacity={0.7}
        >
          <View style={[
            styles.avisoIcon,
            { 
              backgroundColor: aviso.tipo === "urgente" ? "#FFEBEE" : 
                              aviso.tipo === "académico" ? "#E8F5E9" : "#E3F2FD" 
            }
          ]}>
            <Icon 
              name={aviso.icon} 
              size={20} 
              color={aviso.tipo === "urgente" ? "#F44336" : 
                     aviso.tipo === "académico" ? "#4CAF50" : "#2196F3"} 
            />
          </View>
          <View style={styles.avisoContent}>
            <View style={styles.avisoHeader}>
              <Text style={styles.avisoTitulo}>{aviso.titulo}</Text>
              <View style={[
                styles.avisoBadge,
                { 
                  backgroundColor: aviso.tipo === "urgente" ? "#F44336" + '20' : 
                                  aviso.tipo === "académico" ? "#4CAF50" + '20' : "#2196F3" + '20' 
                }
              ]}>
                <Text style={[
                  styles.avisoBadgeText,
                  { 
                    color: aviso.tipo === "urgente" ? "#F44336" : 
                           aviso.tipo === "académico" ? "#4CAF50" : "#2196F3" 
                  }
                ]}>
                  {aviso.tipo}
                </Text>
              </View>
            </View>
            <Text style={styles.avisoContenido}>{aviso.contenido}</Text>
            <Text style={styles.avisoFecha}>{aviso.fecha}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderQuickActions = () => (
    <View style={[styles.section, getShadowStyle()]}>
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigateToHorario()}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#FFE0B2" }]}>
            <Icon name="calendar-clock" size={24} color="#FF9800" />
          </View>
          <Text style={styles.actionText}>Horario</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigateToCalificaciones()}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#C8E6C9" }]}>
            <Icon name="clipboard-check" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.actionText}>Calificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToAsistencias}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#BBDEFB" }]}>
            <Icon name="account-check" size={24} color="#2196F3" />
          </View>
          <Text style={styles.actionText}>Asistencias</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToAjustes}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#E1BEE7" }]}>
            <Icon name="cog" size={24} color="#9C27B0" />
          </View>
          <Text style={styles.actionText}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const MenuItem = ({ title, icon, color = "#333", onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={22} color={color} style={styles.menuItemIcon} />
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderStats()}
        {renderProximasClases()}
        {renderMaterias()}
        {renderCalificaciones()}
        {renderAvisos()}
        {renderQuickActions()}

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Icon name="school" size={40} color="#E0E0E0" />
            <Text style={styles.footerText}>Sistema Escolar Estudiantil v2.0</Text>
            <Text style={styles.footerSubtext}>© 2024 - Universidad Tecnológica</Text>
          </View>
        </View>
      </ScrollView>

      {/* Menú Lateral */}
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
              <View style={[styles.menuAvatar, styles.avatarFallback]}>
                <Icon name="account-school" size={32} color="#fff" />
              </View>
              <View style={styles.menuUserInfo}>
                <Text style={styles.menuUserName}>{user.name}</Text>
                <Text style={styles.menuUserRole}>
                  <Icon name="school" size={12} color="#4CAF50" /> Estudiante
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
                navigation.navigate("HomeAlumno", { user });
              }} 
            />
            <MenuItem 
              title="Mi Perfil" 
              icon="account-outline" 
              onPress={navigateToProfile} 
            />
            <MenuItem 
              title="Mis Materias" 
              icon="book-open-outline" 
              onPress={navigateToMaterias} 
            />
            <MenuItem 
              title="Horario" 
              icon="calendar-blank-outline" 
              onPress={() => navigateToHorario()} 
            />
            <MenuItem 
              title="Calificaciones" 
              icon="clipboard-check-outline" 
              onPress={() => navigateToCalificaciones()} 
            />
            <MenuItem 
              title="Asistencias" 
              icon="account-check-outline" 
              onPress={navigateToAsistencias} 
            />
            <MenuItem 
              title="Notificaciones" 
              icon="bell-outline" 
              onPress={navigateToNotificaciones} 
            />

            <View style={styles.menuDivider} />

            <MenuItem 
              title="Ajustes" 
              icon="cog-outline" 
              onPress={navigateToAjustes} 
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

      {/* Modal de Cerrar Sesión */}
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
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 3,
  },
  userRole: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  notificationButton: {
    padding: 10,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#F44336",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  statsContainer: {
    padding: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
    marginBottom: 6,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statTrend: {
    fontSize: 11,
    marginLeft: 4,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  seeAll: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  claseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  claseTime: {
    width: 60,
    alignItems: "center",
  },
  claseHora: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2196F3",
  },
  claseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  claseMateria: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  claseDetalle: {
    fontSize: 13,
    color: "#666",
  },
  claseAula: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  claseAulaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  materiasScroll: {
    marginHorizontal: -5,
  },
  materiaCard: {
    width: 200,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  materiaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  materiaCardNombre: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 6,
  },
  materiaCardProfesor: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  materiaCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  materiaCardCodigo: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  materiaCardCreditos: {
    fontSize: 11,
    color: "#666",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  calificacionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  calificacionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  calificacionInfo: {
    flex: 1,
  },
  calificacionMateria: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 2,
  },
  calificacionFecha: {
    fontSize: 12,
    color: "#999",
  },
  calificacionNotaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calificacionNota: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  avisoCard: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  avisoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avisoContent: {
    flex: 1,
  },
  avisoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  avisoTitulo: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
    flex: 1,
  },
  avisoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  avisoBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  avisoContenido: {
    fontSize: 13,
    color: "#616161",
    lineHeight: 18,
    marginBottom: 8,
  },
  avisoFecha: {
    fontSize: 11,
    color: "#9E9E9E",
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  actionButton: {
    alignItems: "center",
    width: "23%",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#616161",
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    marginTop: 20,
    paddingVertical: 25,
    alignItems: "center",
  },
  footerContent: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "500",
    marginTop: 10,
  },
  footerSubtext: {
    fontSize: 11,
    color: "#BDBDBD",
    marginTop: 5,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    backgroundColor: "#fff",
    width: 300,
    height: "100%",
    paddingTop: 50,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  avatarFallback: {
    backgroundColor: "#6f42c1",
    justifyContent: "center",
    alignItems: "center",
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  menuUserRole: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  menuUserEmail: {
    fontSize: 12,
    color: "#999",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  menuItemIcon: {
    width: 28,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    width: "85%",
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: "#F44336",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});