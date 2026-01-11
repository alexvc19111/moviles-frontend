import React, { useState, useEffect } from "react";
import {SafeAreaView,View,Text,StyleSheet,ScrollView,TouchableOpacity,RefreshControl,Alert,Modal,Platform,Image} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreenAdmin({ route, navigation }) {
  const user = route?.params?.user ?? {
    name: "Admin Sistema",
    role: "admin",
    email: "admin@sistema.com",
    avatar: null,
  };

  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  /* =================== DATOS =================== */
  const [stats] = useState({
    totalAlumnos: 1250,
    totalProfesores: 85,
    totalMaterias: 45,
    usuariosActivos: 342,
  });

  const adminActions = [
    { id: 1, title: "Gestión de Usuarios", icon: "account-multiple", color: "#2196F3", screen: "GestionUsuarios" },
    { id: 2, title: "Gestión de Materias", icon: "book-open-variant", color: "#4CAF50", screen: "GestionMaterias" },
    { id: 3, title: "Asignar Grupos", icon: "account-group", color: "#FF9800", screen: "AsignarGrupos" },
    { id: 4, title: "Periodos Académicos", icon: "calendar-multiple", color: "#9C27B0", screen: "PeriodosAcademicos" },
    { id: 5, title: "Reportes", icon: "chart-bar", color: "#607D8B", screen: "Reportes" },
    { id: 6, title: "Configuración", icon: "cog", color: "#795548", screen: "Configuracion" },
  ];

  /* =================== FUNCIONES =================== */
  const getShadowStyle = () => {
    if (Platform.OS === "web") {
      return { boxShadow: "0px 2px 6px rgba(0,0,0,0.1)" };
    }
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    };
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Actualizado", "Datos actualizados");
    }, 1500);
  };

  const handleEditProfile = () => {
    setMenuVisible(false);
    navigation.navigate("EditarPerfil", { user });
  };

  const handleLogout = () => {
    setMenuVisible(false);
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Cerrar Sesión", 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        }
      ]
    );
  };

  /* =================== HEADER =================== */
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <View style={styles.menuButton}>
            <Icon name="menu" size={28} color="#333" />
          </View>
        </TouchableOpacity>
        <View style={styles.userDetails}>
          <Text style={styles.welcomeText}>Panel de Administración</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>
            <Icon name="shield-check" size={12} color="#4CAF50" /> Administrador
          </Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="bell-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  /* =================== UI =================== */
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}

        {/* ===== ESTADÍSTICAS ===== */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={[styles.statCard, getShadowStyle()]}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="account-school" size={28} color="#2196F3" />
              </View>
              <Text style={styles.statValue}>{stats.totalAlumnos}</Text>
              <Text style={styles.statLabel}>Alumnos</Text>
            </View>
            <View style={[styles.statCard, getShadowStyle()]}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="teach" size={28} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{stats.totalProfesores}</Text>
              <Text style={styles.statLabel}>Profesores</Text>
            </View>
          </View>
          
          <View style={styles.statRow}>
            <View style={[styles.statCard, getShadowStyle()]}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="book-open" size={28} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{stats.totalMaterias}</Text>
              <Text style={styles.statLabel}>Materias</Text>
            </View>
            <View style={[styles.statCard, getShadowStyle()]}>
              <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
                <Icon name="account-check" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.statValue}>{stats.usuariosActivos}</Text>
              <Text style={styles.statLabel}>Usuarios Activos</Text>
            </View>
          </View>
        </View>

        {/* ===== ACCIONES RÁPIDAS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {adminActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, getShadowStyle()]}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate(action.screen);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===== ESTADO DEL SISTEMA ===== */}
        <View style={[styles.section, getShadowStyle()]}>
          <Text style={styles.sectionTitle}>Estado del Sistema</Text>
          
          <View style={styles.systemInfo}>
            <View style={styles.infoItem}>
              <Icon name="server" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>Servidor: <Text style={styles.infoValue}>Online</Text></Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="database" size={20} color="#2196F3" />
              <Text style={styles.infoText}>Base de datos: <Text style={styles.infoValue}>2.4 GB / 10 GB</Text></Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="backup-restore" size={20} color="#9C27B0" />
              <Text style={styles.infoText}>Último backup: <Text style={styles.infoValue}>Hoy 00:00</Text></Text>
            </View>
          </View>
        </View>

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sistema de Gestión Escolar v3.0 • Panel de Administración
          </Text>
          <Text style={styles.footerSubtext}>
            Última actualización: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      {/* ===== MENÚ DESPLEGABLE ===== */}
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
          <View style={[styles.menu, getShadowStyle()]}>
            {/* Encabezado del menú */}
            <View style={styles.menuHeader}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.menuAvatar} />
              ) : (
                <View style={[styles.menuAvatar, styles.avatarFallback]}>
                  <Icon name="shield-account" size={32} color="#fff" />
                </View>
              )}
              <View style={styles.menuUserInfo}>
                <Text style={styles.menuUserName}>{user.name}</Text>
                <Text style={styles.menuUserRole}>
                  <Icon name="crown" size={12} color="#FFD700" /> Administrador
                </Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            {/* Opciones del menú */}
            <MenuItem 
              title="Dashboard" 
              icon="view-dashboard-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("HomeAdmin");
              }} 
            />
            <MenuItem 
              title="Gestión de Usuarios" 
              icon="account-multiple-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("GestionUsuarios");
              }} 
            />
            <MenuItem 
              title="Gestión de Materias" 
              icon="book-open-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("GestionMaterias");
              }} 
            />
            <MenuItem 
              title="Asignar Grupos" 
              icon="account-group-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("AsignarGrupos");
              }} 
            />
            <MenuItem 
              title="Periodos Académicos" 
              icon="calendar-blank-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("PeriodosAcademicos");
              }} 
            />
            <MenuItem 
              title="Reportes del Sistema" 
              icon="chart-bar" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Reportes");
              }} 
            />
            <MenuItem 
              title="Configuración" 
              icon="cog-outline" 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Configuracion");
              }} 
            />

            <View style={styles.menuDivider} />

            {/* Opciones de usuario */}
            <MenuItem 
              title="Editar Perfil" 
              icon="account-edit-outline" 
              color="#2196F3"
              onPress={handleEditProfile} 
            />
            <MenuItem 
              title="Cerrar Sesión" 
              icon="logout-variant" 
              color="#F44336"
              onPress={handleLogout} 
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ===== MODAL DE CONFIRMACIÓN PARA CERRAR SESIÓN ===== */}
      <Modal
        transparent={true}
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, getShadowStyle()]}>
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

/* =================== COMPONENTE MENÚ ITEM =================== */
const MenuItem = ({ title, icon, color = "#333", onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={22} color={color} style={styles.menuItemIcon} />
    <Text style={[styles.menuItemText, { color }]}>{title}</Text>
    <Icon name="chevron-right" size={20} color="#999" />
  </TouchableOpacity>
);

/* =================== STYLES =================== */
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#f5f7fa" 
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
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
    flex: 1 
  },

  menuButton: {
    padding: 8,
    marginRight: 15,
  },

  userDetails: {
    flex: 1,
  },

  welcomeText: { 
    fontSize: 13, 
    color: "#666",
    fontWeight: "500",
    marginBottom: 2 
  },
  
  userName: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#333",
    marginBottom: 3 
  },
  
  userRole: { 
    fontSize: 12, 
    color: "#4CAF50", 
    fontWeight: "500",
  },

  headerActions: { 
    flexDirection: "row" 
  },
  
  headerButton: { 
    padding: 10 
  },

  statsContainer: { 
    padding: 20 
  },
  
  statRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 15 
  },
  
  statCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },
  
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  
  statValue: { 
    fontSize: 28, 
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4 
  },
  
  statLabel: { 
    color: "#666",
    fontSize: 13,
    fontWeight: "500" 
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  
  actionCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  
  actionTitle: { 
    fontSize: 14, 
    fontWeight: "600", 
    textAlign: "center",
    color: "#333" 
  },

  systemInfo: {
    paddingTop: 5,
  },
  
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  
  infoText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#555",
    flex: 1,
  },
  
  infoValue: {
    fontWeight: "600",
    color: "#333",
  },

  footer: {
    paddingVertical: 25,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  
  footerText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  
  footerSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },

  /* ===== ESTILOS DEL MENÚ ===== */
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

  /* ===== ESTILOS DEL MODAL DE CERRAR SESIÓN ===== */
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