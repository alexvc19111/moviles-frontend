import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Image,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EditarPerfil({ route, navigation }) {
  const { user } = route.params || {};
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = () => {
    // Validar campos
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return;
    }

    // Si se está cambiando la contraseña
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      if (formData.newPassword.length < 6) {
        Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    // Aquí iría la lógica para actualizar en el backend
    Alert.alert(
      'Éxito',
      'Perfil actualizado correctamente',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleSelectImage = () => {
    // Aquí puedes implementar la selección de imagen
    Alert.alert('Seleccionar imagen', 'Esta funcionalidad requiere implementación');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Foto de perfil */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleSelectImage}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Icon name="camera-plus" size={30} color="#fff" />
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Icon name="pencil" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarText}>Toca para cambiar foto</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Icon name="account" size={16} color="#666" /> Nombre completo
            </Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Tu nombre"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Icon name="email" size={16} color="#666" /> Correo electrónico
            </Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Icon name="phone" size={16} color="#666" /> Teléfono
            </Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              placeholder="Número de teléfono"
              keyboardType="phone-pad"
            />
          </View>

          {/* Sección para cambiar contraseña */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Cambiar Contraseña</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña actual</Text>
            <TextInput
              style={styles.input}
              value={formData.currentPassword}
              onChangeText={(text) => setFormData({...formData, currentPassword: text})}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={styles.input}
              value={formData.newPassword}
              onChangeText={(text) => setFormData({...formData, newPassword: text})}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirmar nueva contraseña</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.saveButtonText}>
              <Icon name="content-save" size={20} color="#fff" /> Guardar Cambios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 24,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarFallback: {
    backgroundColor: '#6f42c1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  sectionTitle: {
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 30,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});