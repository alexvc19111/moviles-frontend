import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Switch, 
  Modal, 
  Alert 
} from 'react-native';
import { Text, useTheme, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from '../../context/GlobalContext';

const AjustesScreen = ({ navigation }) => {
  // 1. Conexión Global
  const { 
    user, 
    logout, 
    isDarkTheme, 
    toggleTheme, 
    language, 
    setLanguage, 
    t 
  } = useGlobalContext();
  
  const theme = useTheme(); 

  // ==================== ESTADOS (AQUÍ FALTABA EL DEL LOGOUT) ====================
  const [notificaciones, setNotificaciones] = useState(true);
  const [modalIdiomaVisible, setModalIdiomaVisible] = useState(false);
  
  // 👇 ESTO ERA LO QUE TE FALTABA:
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); 

  // Edición de nombre (Simulada)
  const [editarNombre, setEditarNombre] = useState(false);
  const [nombreTemporal, setNombreTemporal] = useState(user?.name || user?.nombre || '');

  // Función final de logout (llamada desde el Modal)
  const performLogout = async () => {
      try {
          setLogoutModalVisible(false); // Cerramos el modal
          await logout(); // Limpiamos sesión
          // El AppNavigator detectará user=null y cambiará a Login solo
      } catch (error) {
          console.error("Error logout:", error);
      }
  };

  // Guardar nombre (Simulado)
  const guardarNombre = () => {
    if (nombreTemporal.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    setEditarNombre(false);
    Alert.alert('Info', 'Nombre actualizado localmente.');
  };

  // Estilos dinámicos
  const containerStyle = { backgroundColor: theme.colors.background };
  const cardStyle = { backgroundColor: theme.colors.elevation.level1, borderRadius: 12 };
  const textSecondary = { color: theme.colors.onSurfaceVariant };

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
          {t('ajustes.titulo') || "Ajustes"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Sección de Perfil */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            {t('ajustes.perfil') || "Perfil"}
          </Text>
          
          <View style={[styles.profileCard, cardStyle]}>
            <View style={styles.avatarContainer}>
              <Icon name="account-circle" size={70} color={theme.colors.primary} />
            </View>
            
            <View style={styles.profileInfo}>
              {editarNombre ? (
                <View>
                  <TextInput
                    value={nombreTemporal}
                    onChangeText={setNombreTemporal}
                    mode="flat"
                    style={{ backgroundColor: 'transparent', height: 40, marginBottom: 5 }}
                    autoFocus
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={guardarNombre} style={{ marginRight: 15 }}>
                       <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEditarNombre(false)}>
                       <Text style={{ color: '#F44336' }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.nameContainer}>
                  <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                    {nombreTemporal}
                  </Text>
                  <TouchableOpacity onPress={() => setEditarNombre(true)} style={styles.editButton}>
                    <Icon name="pencil" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
              
              <Text style={textSecondary}>{user?.role || 'Estudiante'}</Text>
              <Text style={[textSecondary, { fontSize: 12 }]}>{user?.email || user?.correo}</Text>
            </View>
          </View>
        </View>

        {/* Sección de Preferencias */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            {t('ajustes.preferencias') || "Preferencias"}
          </Text>
          
          {/* Notificaciones */}
          <View style={[styles.preferenceItem, { borderBottomColor: theme.colors.outlineVariant }]}>
            <View style={styles.preferenceLeft}>
              <Icon name="bell-outline" size={26} color={theme.colors.onSurface} />
              <View style={{ marginLeft: 15 }}>
                <Text variant="bodyLarge">{t('ajustes.notificaciones') || "Notificaciones"}</Text>
                <Text variant="bodySmall" style={textSecondary}>{t('ajustes.notificacionesDesc') || "Alertas importantes"}</Text>
              </View>
            </View>
            <Switch
              value={notificaciones}
              onValueChange={setNotificaciones}
              trackColor={{ false: '#767577', true: theme.colors.primaryContainer }}
              thumbColor={notificaciones ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          {/* Modo Oscuro */}
          <View style={[styles.preferenceItem, { borderBottomColor: theme.colors.outlineVariant }]}>
            <View style={styles.preferenceLeft}>
              <Icon name="theme-light-dark" size={26} color={theme.colors.onSurface} />
              <View style={{ marginLeft: 15 }}>
                <Text variant="bodyLarge">{t('ajustes.modoOscuro') || "Modo Oscuro"}</Text>
                <Text variant="bodySmall" style={textSecondary}>{t('ajustes.modoOscuroDesc') || "Tema de la app"}</Text>
              </View>
            </View>
            <Switch
              value={isDarkTheme}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.colors.primaryContainer }}
              thumbColor={isDarkTheme ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          {/* Idioma */}
          <TouchableOpacity 
            style={styles.preferenceItem} 
            onPress={() => setModalIdiomaVisible(true)}
          >
            <View style={styles.preferenceLeft}>
              <Icon name="translate" size={26} color={theme.colors.onSurface} />
              <View style={{ marginLeft: 15 }}>
                <Text variant="bodyLarge">{t('ajustes.idioma') || "Idioma"}</Text>
                <Text variant="bodySmall" style={textSecondary}>{t('ajustes.idiomaDesc') || "Lenguaje"}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: theme.colors.primary, marginRight: 5 }}>
                {language === 'es' ? 'Español' : 'English'}
              </Text>
              <Icon name="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Botón Cerrar Sesión (ABRE EL MODAL) */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.errorContainer }]}
          onPress={() => setLogoutModalVisible(true)} // <--- AHORA SÍ FUNCIONARÁ
        >
          <Icon name="logout" size={22} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>
            {t('ajustes.cerrarSesion') || "Cerrar Sesión"}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ color: theme.colors.outline }}>{t('general.sistema') || "Sistema Escolar"} v2.1</Text>
        </View>
      </ScrollView>

      {/* === MODAL IDIOMA === */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalIdiomaVisible}
        onRequestClose={() => setModalIdiomaVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalIdiomaVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.elevation.level3 }]}>
            <Text variant="headlineSmall" style={{ marginBottom: 20, textAlign: 'center' }}>
              {t('ajustes.idioma') || "Idioma"}
            </Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, language === 'es' && { backgroundColor: theme.colors.secondaryContainer }]}
              onPress={() => { setLanguage('es'); setModalIdiomaVisible(false); }}
            >
              <Text variant="bodyLarge">🇪🇸 Español</Text>
              {language === 'es' && <Icon name="check" size={20} color={theme.colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, language === 'en' && { backgroundColor: theme.colors.secondaryContainer }]}
              onPress={() => { setLanguage('en'); setModalIdiomaVisible(false); }}
            >
              <Text variant="bodyLarge">🇺🇸 English</Text>
              {language === 'en' && <Icon name="check" size={20} color={theme.colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
                style={{ marginTop: 15, padding: 10, alignItems: 'center' }}
                onPress={() => setModalIdiomaVisible(false)}
            >
                <Text style={{ color: theme.colors.primary }}>{t('ajustes.cancelar') || "Cancelar"}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* === MODAL LOGOUT (EL QUE TE FALTABA O FALLABA) === */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.elevation.level3 }]}>
            
            <Icon name="logout-variant" size={50} color={theme.colors.error} style={{marginBottom: 15, alignSelf:'center'}} />
            
            <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 10, textAlign:'center' }}>
                {t('ajustes.cerrarSesion') || "Cerrar Sesión"}
            </Text>
            
            <Text style={[textSecondary, { textAlign: 'center', marginBottom: 20 }]}>
                {t('ajustes.confirmarCerrarSesion') || "¿Seguro que quieres salir?"}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.surfaceVariant }]} 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={{ color: theme.colors.onSurfaceVariant }}>{t('ajustes.cancelar') || "Cancelar"}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.error }]} 
                onPress={performLogout} // <--- LLAMA A LA FUNCIÓN DE SALIDA
              >
                <Text style={{ color: 'white' }}>{t('ajustes.siSalir') || "Salir"}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  scrollContent: { paddingBottom: 30 },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: { marginRight: 20 },
  profileInfo: { flex: 1 },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  editButton: { marginLeft: 10 },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderRadius: 20,
    padding: 25,
    width: '80%',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtons: { 
    flexDirection: "row", 
    width: "100%", 
    justifyContent: "space-between" 
  },
  modalButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: "center", 
    marginHorizontal: 6 
  },
});

export default AjustesScreen;