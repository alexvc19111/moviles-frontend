import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  Platform
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from "../../context/GlobalContext";

export default function HomeAlumnoScreen({ navigation }) {
  // 1. Conexión Global
  const { user, logout, apiRequest, t } = useGlobalContext();
  const theme = useTheme(); 
  
  // Estados UI
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Datos (Iniciales / Mock)
  const [dashboardData, setDashboardData] = useState({
    promedio: 8.5,
    asistencias: 92,
    materias: [
      { id: 1, nombre: "Matemáticas Avanzadas", profesor: "Dr. García", icon: "calculator", colorHex: "#FF6B6B", codigo: "MAT501", creditos: 6 },
      { id: 2, nombre: "Programación Avanzada", profesor: "Ing. Rodríguez", icon: "code-braces", colorHex: "#4ECDC4", codigo: "PROG501", creditos: 8 },
      { id: 3, nombre: "Física Cuántica", profesor: "Dra. Martínez", icon: "atom", colorHex: "#45B7D1", codigo: "FIS501", creditos: 6 },
    ],
    calificaciones: [
      { materia: "Matemáticas Avanzadas", calificacion: 9.0, fecha: "15/03/2024", tendencia: "up", materiaId: 1 },
      { materia: "Programación Avanzada", calificacion: 8.5, fecha: "20/03/2024", tendencia: "up", materiaId: 2 },
    ],
    avisos: [
      { id: 1, titulo: "Bienvenido", contenido: "Versión 2.0 del sistema.", tipo: "académico", fecha: "Hoy", icon: "school" }
    ],
    proximasClases: [
      { materia: "Matemáticas Avanzadas", hora: "8:00 AM", aula: "A301", profesor: "Dr. García" },
      { materia: "Programación Avanzada", hora: "10:00 AM", aula: "Lab 1", profesor: "Ing. Ana" },
    ]
  });

  // Carga de datos
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
        // AQUÍ CONECTARÁS CON LARAVEL EN EL FUTURO:
        // const response = await apiRequest('/alumno/dashboard');
        // setDashboardData(response); 
        await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
        console.error("Error dashboard:", error);
    } finally {
        setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Logout
  const handleLogout = async () => {
    setLogoutModalVisible(false);
    setMenuVisible(false);
    await logout();
  };

  // Navegación Helper
  const navigateTo = (screen, params = {}) => {
    setMenuVisible(false);
    navigation.navigate(screen, { ...params });
  };

  // Estilos Dinámicos (Theme)
  const containerStyle = { backgroundColor: theme.colors.background };
  const cardStyle = { backgroundColor: theme.colors.elevation.level1 };
  const textPrimary = { color: theme.colors.onSurface };
  const textSecondary = { color: theme.colors.onSurfaceVariant };
  
  const getShadowStyle = () => Platform.OS === 'web' ? { boxShadow: '0px 2px 6px rgba(0,0,0,0.1)' } : { elevation: 2 };

  // ==================== RENDERIZADO ====================

  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: theme.colors.surfaceVariant, backgroundColor: theme.colors.surface }]}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Icon name="menu" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.userDetails}>
          <Text style={[styles.welcomeText, textSecondary]}>{t('home.bienvenido')}</Text>
          <Text style={[styles.userName, textPrimary]}>
            {user?.name || user?.nombre || "Estudiante"}
          </Text>
          <Text style={styles.userRole}>
            <Icon name="school" size={12} color="#4CAF50" /> {user?.role || "Alumno"}
          </Text>
        </View>
      </View>

      
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statRow}>
        <TouchableOpacity style={[styles.statCard, cardStyle, getShadowStyle()]} onPress={() => navigateTo('Calificaciones')}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Icon name="chart-line" size={24} color="#4CAF50" />
          </View>
          <Text style={[styles.statValue, textPrimary]}>{dashboardData.promedio.toFixed(1)}</Text>
          <Text style={[styles.statLabel, textSecondary]}>{t('home.promedio')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statCard, cardStyle, getShadowStyle()]} onPress={() => navigateTo('Asistencias')}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Icon name="checkbox-marked-circle-outline" size={24} color="#2196F3" />
          </View>
          <Text style={[styles.statValue, textPrimary]}>{dashboardData.asistencias}%</Text>
          <Text style={[styles.statLabel, textSecondary]}>{t('home.asistencia')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statRow}>
        <TouchableOpacity style={[styles.statCard, cardStyle, getShadowStyle()]} onPress={() => navigateTo('Materias')}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Icon name="book-open-variant" size={24} color="#FF9800" />
          </View>
          <Text style={[styles.statValue, textPrimary]}>{dashboardData.materias.length}</Text>
          <Text style={[styles.statLabel, textSecondary]}>{t('home.materias')}</Text>
        </TouchableOpacity>

        <View style={[styles.statCard, cardStyle, getShadowStyle()]}>
          <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Icon name="credit-card-clock" size={24} color="#9C27B0" />
          </View>
          <Text style={[styles.statValue, textPrimary]}>24</Text>
          <Text style={[styles.statLabel, textSecondary]}>{t('home.creditos')}</Text>
        </View>
      </View>
    </View>
  );

  const renderProximasClases = () => (
    <View style={[styles.section, cardStyle, getShadowStyle()]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, textPrimary]}>{t('home.proximasClases')}</Text>
        <TouchableOpacity onPress={() => navigateTo('Horario')}>
          <Text style={styles.seeAll}>{t('home.verHorario')}</Text>
        </TouchableOpacity>
      </View>

      {dashboardData.proximasClases.map((clase, index) => (
        <TouchableOpacity key={index} style={[styles.claseItem, { borderBottomColor: theme.colors.outlineVariant }]}>
          <View style={styles.claseTime}>
            <Text style={styles.claseHora}>{clase.hora}</Text>
          </View>
          <View style={styles.claseInfo}>
            <Text style={[styles.claseMateria, textPrimary]}>{clase.materia}</Text>
            <Text style={[styles.claseDetalle, textSecondary]}>
              <Icon name="account" size={12} color={theme.colors.onSurfaceVariant} /> {clase.profesor}
            </Text>
          </View>
          <View style={[styles.claseAula, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.claseAulaText, textSecondary]}>{clase.aula}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMaterias = () => (
    <View style={[styles.section, cardStyle, getShadowStyle()]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, textPrimary]}>{t('home.misMaterias')}</Text>
        <TouchableOpacity onPress={() => navigateTo('Materias')}>
          <Text style={styles.seeAll}>{t('home.verTodas')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -5 }}>
        {dashboardData.materias.map((materia) => (
          <TouchableOpacity 
            key={materia.id} 
            style={[styles.materiaCard, { backgroundColor: materia.colorHex + '20' }]}
            onPress={() => navigateTo('Horario')}
          >
            <View style={[styles.materiaIcon, { backgroundColor: materia.colorHex }]}>
              <Icon name={materia.icon} size={24} color="#fff" />
            </View>
            <Text style={[styles.materiaCardNombre, { color: theme.colors.onSurface }]}>{materia.nombre}</Text>
            <Text style={styles.materiaCardProfesor}>{materia.profesor}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCalificaciones = () => (
    <View style={[styles.section, cardStyle, getShadowStyle()]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, textPrimary]}>{t('home.calificacionesRecientes')}</Text>
        <TouchableOpacity onPress={() => navigateTo('Calificaciones')}>
          <Text style={styles.seeAll}>{t('home.verHistorial')}</Text>
        </TouchableOpacity>
      </View>

      {dashboardData.calificaciones.map((cal, index) => (
        <View key={index} style={[styles.claseItem, { borderBottomColor: theme.colors.outlineVariant }]}>
            <View style={{flex: 1}}>
                <Text style={[styles.claseMateria, textPrimary]}>{cal.materia}</Text>
                <Text style={[styles.claseDetalle, textSecondary]}>{cal.fecha}</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: cal.calificacion >= 8 ? '#4CAF50' : '#F44336' }}>
                {cal.calificacion}
            </Text>
        </View>
      ))}
    </View>
  );

  const renderAvisos = () => (
    <View style={[styles.section, cardStyle, getShadowStyle()]}>
       <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, textPrimary]}>{t('home.avisos')}</Text>
      </View>
      {dashboardData.avisos.map((aviso) => (
          <View key={aviso.id} style={{flexDirection:'row', marginBottom: 10}}>
              <Icon name={aviso.icon} size={24} color={theme.colors.primary} style={{marginRight: 10}} />
              <View style={{flex:1}}>
                  <Text style={{fontWeight: 'bold', color: textPrimary.color}}>{aviso.titulo}</Text>
                  <Text style={{color: textSecondary.color}}>{aviso.contenido}</Text>
              </View>
          </View>
      ))}
    </View>
  );

  const renderQuickActions = () => (
    <View style={[styles.section, cardStyle, getShadowStyle()]}>
      <Text style={[styles.sectionTitle, textPrimary, {marginBottom: 15}]}>{t('home.accionesRapidas')}</Text>
      <View style={styles.actionsGrid}>
        {[
            {label: t('alumno.horarios'), icon: 'calendar-clock', color: '#FF9800', nav: 'Horario'},
            {label: t('alumno.calificaciones'), icon: 'clipboard-check', color: '#4CAF50', nav: 'Calificaciones'},
            {label: t('alumno.asistencias'), icon: 'account-check', color: '#2196F3', nav: 'Asistencias'},
            {label: t('alumno.ajustes'), icon: 'cog', color: '#9C27B0', nav: 'Ajustes'},
        ].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionButton} onPress={() => navigateTo(action.nav)}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '30' }]}>
                    <Icon name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.actionText, textSecondary]}>{action.label}</Text>
            </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Componente de Item de Menú
  const MenuItem = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.outlineVariant }]} onPress={onPress}>
      <Icon name={icon} size={22} color={color || theme.colors.onSurface} style={styles.menuItemIcon} />
      <Text style={[styles.menuItemText, { color: color || theme.colors.onSurface }]}>{title}</Text>
      <Icon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {renderHeader()}
        {renderStats()}
        {renderProximasClases()}
        {renderMaterias()}
        {renderCalificaciones()}
        {renderAvisos()}
        {renderQuickActions()}

        <View style={styles.footer}>
          <Icon name="school" size={40} color={theme.colors.outline} />
          <Text style={[styles.footerText, textSecondary]}>{t('home.sistema')} v2.1</Text>
        </View>
      </ScrollView>

      {/* === MENÚ LATERAL === */}
      <Modal transparent={true} animationType="fade" visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menu, cardStyle, { borderRightWidth: 1, borderColor: theme.colors.outlineVariant }]}>
            <View style={[styles.menuHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
              <View style={[styles.menuAvatar, { backgroundColor: theme.colors.primaryContainer }]}>
                <Icon name="account-school" size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.menuUserInfo}>
                <Text style={[styles.menuUserName, textPrimary]}>{user?.name || user?.nombre || "Estudiante"}</Text>
                <Text style={styles.menuUserRole}>{user?.role || "Alumno"}</Text>
              </View>
            </View>

            <MenuItem title={t('alumno.inicio')} icon="view-dashboard-outline" onPress={() => setMenuVisible(false)} />
            <MenuItem title={t('ajustes.perfil')} icon="account-outline" onPress={() => navigateTo('PerfilAlumno')} />
            <MenuItem title={t('alumno.materias')} icon="book-open-outline" onPress={() => navigateTo('Materias')} />
            <MenuItem title={t('alumno.horarios')} icon="calendar-blank-outline" onPress={() => navigateTo('Horario')} />
            <MenuItem title={t('alumno.calificaciones')} icon="clipboard-check-outline" onPress={() => navigateTo('Calificaciones')} />
            
            <View style={[styles.menuDivider, { backgroundColor: theme.colors.outlineVariant }]} />

            <MenuItem title={t('alumno.ajustes')} icon="cog-outline" onPress={() => navigateTo('Ajustes')} />
            <MenuItem title={t('ajustes.cerrarSesion')} icon="logout-variant" color={theme.colors.error} onPress={() => { setMenuVisible(false); setLogoutModalVisible(true); }} />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* === MODAL LOGOUT === */}
      <Modal transparent={true} visible={logoutModalVisible} animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, cardStyle]}>
            <Icon name="logout-variant" size={50} color={theme.colors.error} style={{marginBottom: 15}} />
            <Text variant="titleLarge" style={[textPrimary, { fontWeight: 'bold', marginBottom: 10 }]}>{t('ajustes.cerrarSesion')}</Text>
            <Text style={[textSecondary, { textAlign: 'center', marginBottom: 20 }]}>{t('ajustes.confirmarCerrarSesion')}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.colors.surfaceVariant }]} onPress={() => setLogoutModalVisible(false)}>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>{t('ajustes.cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.colors.error }]} onPress={handleLogout}>
                <Text style={{ color: 'white' }}>{t('ajustes.siSalir')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 15, paddingBottom: 15, borderBottomWidth: 1,
  },
  userInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  menuButton: { padding: 8, marginRight: 15 },
  userDetails: { flex: 1 },
  welcomeText: { fontSize: 12, fontWeight: "500", marginBottom: 2 },
  userName: { fontSize: 18, fontWeight: "bold", marginBottom: 3 },
  userRole: { fontSize: 12, color: "#4CAF50", fontWeight: "500" },
  notificationButton: { padding: 10, position: "relative" },
  notificationBadge: {
    position: "absolute", top: 5, right: 5, backgroundColor: "#F44336",
    borderRadius: 10, width: 18, height: 18, justifyContent: "center", alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  statsContainer: { padding: 20 },
  statRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  statCard: { flex: 1, borderRadius: 16, padding: 20, marginHorizontal: 5, alignItems: "center" },
  statIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: "500", marginBottom: 6 },
  section: { marginHorizontal: 20, marginBottom: 15, borderRadius: 16, padding: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { fontSize: 14, color: "#2196F3", fontWeight: "500" },
  claseItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1 },
  claseTime: { width: 70 },
  claseHora: { fontSize: 14, fontWeight: "600", color: "#2196F3" },
  claseInfo: { flex: 1, marginLeft: 5 },
  claseMateria: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  claseDetalle: { fontSize: 13 },
  claseAula: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  claseAulaText: { fontSize: 12, fontWeight: "600" },
  materiaCard: { width: 140, borderRadius: 12, padding: 15, marginRight: 10 },
  materiaIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  materiaCardNombre: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  materiaCardProfesor: { fontSize: 12, color: "#666" },
  actionsGrid: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: { alignItems: "center", width: "23%" },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  actionText: { fontSize: 11, textAlign: "center", fontWeight: "500" },
  footer: { marginTop: 20, paddingVertical: 25, alignItems: "center" },
  footerText: { fontSize: 14, fontWeight: "500", marginTop: 10 },
  
  // Menu
  menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  menu: { width: 300, height: "100%", paddingTop: 50 },
  menuHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 20, marginBottom: 10, borderBottomWidth: 1 },
  menuAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15, justifyContent:'center', alignItems:'center' },
  menuUserInfo: { flex: 1 },
  menuUserName: { fontSize: 16, fontWeight: "bold", marginBottom: 3 },
  menuUserRole: { fontSize: 13, color: "#666" },
  menuDivider: { height: 1, marginVertical: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1 },
  menuItemIcon: { width: 28 },
  menuItemText: { fontSize: 16, fontWeight: "500", flex: 1, marginLeft: 10 },

  // Modal Logout
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { borderRadius: 16, padding: 25, width: "85%", alignItems: "center" },
  modalButtons: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: "center", marginHorizontal: 6 },
});