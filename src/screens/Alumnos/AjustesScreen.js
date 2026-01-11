import React, { useState } from 'react';
import { SafeAreaView,  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput, Modal, ActivityIndicator} from 'react-native';
import WebIcon from "../../components/WebIcon";

const AjustesScreen = ({ navigation, route }) => {
  // ¡CORREGIR: Proporcionar valores por defecto para route!
  const routeParams = route?.params || {};
  
  // Estado para manejar errores
  const [hasError, setHasError] = useState(false);

  // Estados para los ajustes - CORREGIDOS
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [idioma, setIdioma] = useState('es');
  const [editarNombre, setEditarNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(routeParams.userName || 'Alumno');
  const [nombreTemporal, setNombreTemporal] = useState(routeParams.userName || 'Alumno');
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioActivo] = useState({
    nombre: routeParams.userName || 'Juan Pérez',
    rol: 'Estudiante',
    matricula: '20230001',
    carrera: 'Ingeniería en Sistemas'
  });

  // Si hay error, mostrar mensaje
  if (hasError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <WebIcon name="alert-circle" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>Algo salió mal en la pantalla de ajustes</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setHasError(false)}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButtonError}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Función para guardar el nombre
  const guardarNombre = () => {
    try {
      if (nombreTemporal.trim() === '') {
        Alert.alert('Error', 'El nombre no puede estar vacío');
        return;
      }
      setNuevoNombre(nombreTemporal);
      setEditarNombre(false);
      Alert.alert('Éxito', 'Nombre actualizado correctamente');
    } catch (error) {
      setHasError(true);
    }
  };

  // Función para cambiar idioma
  const cambiarIdioma = (nuevoIdioma) => {
    try {
      setIdioma(nuevoIdioma);
      setModalVisible(false);
      Alert.alert(
        'Idioma cambiado', 
        `Idioma establecido a ${nuevoIdioma === 'es' ? 'Español' : 'Inglés'}`
      );
    } catch (error) {
      setHasError(true);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          style: "destructive",
          onPress: () => {
            // Navegar a la pantalla de Login
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  // Estilos condicionales para modo oscuro
  const containerStyle = modoOscuro ? styles.darkContainer : styles.lightContainer;
  const headerStyle = modoOscuro ? styles.darkHeader : styles.lightHeader;
  const sectionStyle = modoOscuro ? styles.darkSection : styles.lightSection;
  const textStyle = modoOscuro ? styles.darkText : styles.lightText;
  const cardStyle = modoOscuro ? styles.darkCard : styles.lightCard;

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      {/* Header */}
      <View style={[styles.header, headerStyle]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <WebIcon name="arrow-left" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, textStyle]}>
          Ajustes
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de Perfil */}
        <View style={[styles.section, sectionStyle]}>
          <Text style={[styles.sectionTitle, textStyle]}>
            Perfil del Alumno
          </Text>
          
          <View style={[styles.profileCard, cardStyle]}>
            <View style={styles.avatarContainer}>
              <WebIcon name="account-school" size={70} color="#2196F3" />
            </View>
            
            <View style={styles.profileInfo}>
              {editarNombre ? (
                <View style={styles.editNameContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={nombreTemporal}
                    onChangeText={setNombreTemporal}
                    autoFocus
                    placeholder="Nuevo nombre"
                    placeholderTextColor={modoOscuro ? "#888" : "#999"}
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity 
                      onPress={guardarNombre} 
                      style={[styles.iconButton, styles.saveButton]}
                    >
                      <WebIcon name="check" size={22} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => {
                        setNombreTemporal(nuevoNombre);
                        setEditarNombre(false);
                      }} 
                      style={[styles.iconButton, styles.cancelButton]}
                    >
                      <WebIcon name="close" size={22} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.nameContainer}>
                  <Text style={[styles.userName, textStyle]}>{nuevoNombre}</Text>
                  <TouchableOpacity 
                    onPress={() => setEditarNombre(true)} 
                    style={styles.editButton}
                  >
                    <WebIcon name="pencil" size={20} color="#2196F3" />
                  </TouchableOpacity>
                </View>
              )}
              
              <Text style={styles.userRole}>Estudiante</Text>
              
              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <WebIcon name="identifier" size={16} color="#757575" />
                  <Text style={styles.detailText}>Matrícula: {usuarioActivo.matricula}</Text>
                </View>
                <View style={styles.detailRow}>
                  <WebIcon name="book-education" size={16} color="#757575" />
                  <Text style={styles.detailText}>Carrera: {usuarioActivo.carrera}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Sección de Preferencias */}
        <View style={[styles.section, sectionStyle]}>
          <Text style={[styles.sectionTitle, textStyle]}>
            Preferencias
          </Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <WebIcon name="bell-outline" size={26} color="#666" />
              <View>
                <Text style={[styles.preferenceText, textStyle]}>
                  Notificaciones
                </Text>
                <Text style={styles.preferenceSubtext}>
                  Recibir alertas importantes
                </Text>
              </View>
            </View>
            <Switch
              value={notificaciones}
              onValueChange={setNotificaciones}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificaciones ? '#2196F3' : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <WebIcon name="theme-light-dark" size={26} color="#666" />
              <View>
                <Text style={[styles.preferenceText, textStyle]}>
                  Modo oscuro
                </Text>
                <Text style={styles.preferenceSubtext}>
                  Cambiar tema de la aplicación
                </Text>
              </View>
            </View>
            <Switch
              value={modoOscuro}
              onValueChange={setModoOscuro}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={modoOscuro ? '#2196F3' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity 
            style={styles.preferenceItem} 
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.preferenceLeft}>
              <WebIcon name="translate" size={26} color="#666" />
              <View>
                <Text style={[styles.preferenceText, textStyle]}>
                  Idioma
                </Text>
                <Text style={styles.preferenceSubtext}>
                  Lenguaje de la aplicación
                </Text>
              </View>
            </View>
            <View style={styles.languageValue}>
              <Text style={styles.languageText}>
                {idioma === 'es' ? 'Español' : 'English'}
              </Text>
              <WebIcon name="chevron-right" size={22} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <WebIcon name="logout" size={22} color="#F44336" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Sistema Escolar v2.1</Text>
          <Text style={styles.footerSubtext}>© 2024 - Todos los derechos reservados</Text>
        </View>
      </ScrollView>

      {/* Modal para seleccionar idioma */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, modoOscuro && styles.darkModal]}>
            <Text style={[styles.modalTitle, textStyle]}>
              Seleccionar idioma
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.modalOption, 
                idioma === 'es' && styles.selectedOption,
                modoOscuro && styles.darkModalOption
              ]}
              onPress={() => cambiarIdioma('es')}
            >
              <View style={styles.modalOptionLeft}>
                <WebIcon name="flag" size={24} color="#2196F3" />
                <Text style={[
                  styles.modalOptionText, 
                  idioma === 'es' && styles.selectedText,
                  textStyle
                ]}>
                  Español
                </Text>
              </View>
              {idioma === 'es' && (
                <WebIcon name="check-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.modalOption, 
                idioma === 'en' && styles.selectedOption,
                modoOscuro && styles.darkModalOption
              ]}
              onPress={() => cambiarIdioma('en')}
            >
              <View style={styles.modalOptionLeft}>
                <WebIcon name="flag" size={24} color="#F44336" />
                <Text style={[
                  styles.modalOptionText, 
                  idioma === 'en' && styles.selectedText,
                  textStyle
                ]}>
                  English
                </Text>
              </View>
              {idioma === 'en' && (
                <WebIcon name="check-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F5F7FA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonError: {
    padding: 15,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  lightHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EEEEEE',
  },
  darkHeader: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  lightText: {
    color: '#212121',
  },
  darkText: {
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingBottom: 25,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  lightSection: {
    backgroundColor: '#FFFFFF',
  },
  darkSection: {
    backgroundColor: '#1E1E1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 15,
  },
  lightCard: {
    backgroundColor: '#F8F9FA',
  },
  darkCard: {
    backgroundColor: '#2D2D2D',
  },
  avatarContainer: {
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginRight: 12,
  },
  editButton: {
    padding: 6,
    backgroundColor: '#F0F7FF',
    borderRadius: 20,
  },
  editNameContainer: {
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: '700',
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    paddingVertical: 4,
    marginBottom: 8,
    color: '#212121',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#E8F5E9',
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
  },
  userRole: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 12,
  },
  userDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#616161',
    marginLeft: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
  preferenceSubtext: {
    fontSize: 13,
    color: '#9E9E9E',
    marginLeft: 15,
    marginTop: 2,
  },
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#757575',
    marginRight: 8,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutText: {
    fontSize: 17,
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 25,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#BDBDBD',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 350,
  },
  darkModal: {
    backgroundColor: '#1E1E1E',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  darkModalOption: {
    backgroundColor: '#2D2D2D',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  modalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 15,
  },
  selectedText: {
    color: '#2196F3',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
});

export default AjustesScreen;
