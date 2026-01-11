import React, { useState } from 'react';
import {SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity,  TextInput, Alert} from 'react-native';
import WebIcon from "../../components/WebIcon";


export default function PerfilAlumnoScreen({ navigation, route }) {
  // Manejo SEGURO de parámetros
  const params = route.params || {};
  const userData = params.userData || params.user || {
    name: 'Juan Pérez',
    email: 'alumno@escuela.com',
    matricula: '2023001',
    carrera: 'Ingeniería en Software',
    semestre: '4to',
    role: 'alumno'
  };
  const promedio = params.promedio || 8.5;
  const asistencias = params.asistencias || 92;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: userData.name,
    email: userData.email,
    phone: '',
    address: '',
  });

  const handleSave = () => {
    Alert.alert('Guardado', 'Perfil actualizado correctamente');
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, salir',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  // Header con botón de retroceso
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <WebIcon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Mi Perfil</Text>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <WebIcon name="logout" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      
      <ScrollView>
        {/* Header con avatar */}
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <WebIcon name="account-school" size={48} color="#fff" />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <WebIcon name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userMatricula}>Matrícula: {userData.matricula}</Text>
          
          {/* Botón para editar */}
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => setEditing(!editing)}
          >
            <WebIcon 
              name={editing ? "close" : "pencil"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.editProfileButtonText}>
              {editing ? "Cancelar" : "Editar Perfil"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Información del perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre Completo</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
            ) : (
              <Text style={styles.value}>{userData.name}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Correo Electrónico</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.value}>{userData.email}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Matrícula</Text>
            <Text style={styles.value}>{userData.matricula}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Carrera</Text>
            <Text style={styles.value}>{userData.carrera}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Semestre</Text>
            <Text style={styles.value}>{userData.semestre}</Text>
          </View>

          {editing && (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={styles.input}
                  value={form.address}
                  onChangeText={(text) => setForm({ ...form, address: text })}
                />
              </View>
            </>
          )}
        </View>

        {/* Botones de acción cuando está editando */}
        {editing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  userHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#2196F3',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF9800',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  userMatricula: {
    fontSize: 16,
    color: '#e3f2fd',
    marginTop: 5,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  backToHomeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});