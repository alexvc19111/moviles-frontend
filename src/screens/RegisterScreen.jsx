import React, { useState } from "react";
import {SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator} from "react-native";
import WebIcon from "../components/WebIcon";

export default function RegisterScreen({ navigation }) {
  // Estados
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    matricula: "",
    telefono: "",
    carrera: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("alumno");

  // Roles disponibles
  const roles = [
    { id: "alumno", label: "Alumno", icon: "school" },
    { id: "profesor", label: "Profesor", icon: "teach" },
    { id: "administrativo", label: "Administrativo", icon: "account-tie" },
  ];

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = "Mínimo 2 caracteres";
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Correo electrónico inválido";
    }

    // Validar matrícula (solo para alumnos)
    if (selectedRole === "alumno" && !formData.matricula.trim()) {
      newErrors.matricula = "La matrícula es requerida";
    }

    // Validar teléfono
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.telefono && !phoneRegex.test(formData.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = "Teléfono inválido (10 dígitos)";
    }

    // Validar contraseña
    if (!formData.contraseña) {
      newErrors.contraseña = "La contraseña es requerida";
    } else if (formData.contraseña.length < 8) {
      newErrors.contraseña = "Mínimo 8 caracteres";
    } else if (!/(?=.*[0-9])(?=.*[A-Z])/.test(formData.contraseña)) {
      newErrors.contraseña = "Debe incluir mayúscula y número";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarContraseña) {
      newErrors.confirmarContraseña = "Confirma tu contraseña";
    } else if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio en inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Formatear teléfono
  const formatPhone = (input) => {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  // Simular registro
  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simular llamada a API
    setTimeout(() => {
      setIsLoading(false);
      
      Alert.alert(
        "¡Registro Exitoso!",
        `Bienvenido ${formData.nombre} ${formData.apellido}\nTu cuenta como ${selectedRole} ha sido creada.\nRevisa tu correo para confirmar tu cuenta.`,
        [
          {
            text: "Continuar",
            onPress: () => navigation.navigate("Login", {
              autoEmail: formData.correo,
              autoPassword: formData.contraseña
            })
          }
        ]
      );
    }, 2000);
  };

  // Campos específicos por rol
  const getRoleSpecificFields = () => {
    switch (selectedRole) {
      case "alumno":
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Matrícula *</Text>
              <View style={styles.inputWrapper}>
                <WebIcon name="identifier" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Ej: A2023001"
                  value={formData.matricula}
                  onChangeText={(value) => handleInputChange("matricula", value.toUpperCase())}
                  style={[styles.input, errors.matricula && styles.inputError]}
                  maxLength={10}
                />
              </View>
              {errors.matricula && <Text style={styles.errorText}>{errors.matricula}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Carrera</Text>
              <View style={styles.inputWrapper}>
                <WebIcon name="book-education" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Ej: Ingeniería en Sistemas"
                  value={formData.carrera}
                  onChangeText={(value) => handleInputChange("carrera", value)}
                  style={styles.input}
                />
              </View>
            </View>
          </>
        );

      case "profesor":
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Departamento</Text>
            <View style={styles.inputWrapper}>
              <WebIcon name="office-building" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Ej: Ciencias Básicas"
                value={formData.carrera}
                onChangeText={(value) => handleInputChange("carrera", value)}
                style={styles.input}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <WebIcon name="arrow-left" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.title}>Crear Cuenta</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>

          <Text style={styles.subtitle}>
            Completa el formulario para registrarte
          </Text>

          {/* Selección de Rol */}
          <View style={styles.roleContainer}>
            <Text style={styles.sectionTitle}>Tipo de Usuario *</Text>
            <View style={styles.roleButtons}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleButton,
                    selectedRole === role.id && styles.roleButtonActive
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                >
                  <Icon
                    name={role.icon}
                    size={20}
                    color={selectedRole === role.id ? "#fff" : "#007bff"}
                  />
                  <Text
                    style={[
                      styles.roleButtonText,
                      selectedRole === role.id && styles.roleButtonTextActive
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Información Personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Nombre *</Text>
                <View style={styles.inputWrapper}>
                  <WebIcon name="account" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Juan"
                    value={formData.nombre}
                    onChangeText={(value) => handleInputChange("nombre", value)}
                    style={[styles.input, errors.nombre && styles.inputError]}
                    autoCapitalize="words"
                  />
                </View>
                {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Apellido *</Text>
                <View style={styles.inputWrapper}>
                  <WebIcon name="account" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChangeText={(value) => handleInputChange("apellido", value)}
                    style={[styles.input, errors.apellido && styles.inputError]}
                    autoCapitalize="words"
                  />
                </View>
                {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <View style={styles.inputWrapper}>
                <WebIcon name="email" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="ejemplo@escuela.edu"
                  value={formData.correo}
                  onChangeText={(value) => handleInputChange("correo", value.toLowerCase())}
                  style={[styles.input, errors.correo && styles.inputError]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Teléfono</Text>
              <View style={styles.inputWrapper}>
                <WebIcon name="phone" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="(555) 123-4567"
                  value={formData.telefono}
                  onChangeText={(value) => handleInputChange("telefono", formatPhone(value))}
                  style={[styles.input, errors.telefono && styles.inputError]}
                  keyboardType="phone-pad"
                  maxLength={14}
                />
              </View>
              {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
            </View>

            {/* Campos específicos por rol */}
            {getRoleSpecificFields()}
          </View>

          {/* Seguridad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seguridad</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña *</Text>
              <View style={styles.inputWrapper}>
                <WebIcon name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Mínimo 8 caracteres"
                  value={formData.contraseña}
                  onChangeText={(value) => handleInputChange("contraseña", value)}
                  style={[styles.input, errors.contraseña && styles.inputError]}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.contraseña ? (
                <Text style={styles.errorText}>{errors.contraseña}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Debe contener: 8+ caracteres, mayúscula y número
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <View style={styles.inputWrapper}>
                <WebIcon name="lock-check" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Repite tu contraseña"
                  value={formData.confirmarContraseña}
                  onChangeText={(value) => handleInputChange("confirmarContraseña", value)}
                  style={[styles.input, errors.confirmarContraseña && styles.inputError]}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmarContraseña && (
                <Text style={styles.errorText}>{errors.confirmarContraseña}</Text>
              )}
            </View>
          </View>

          {/* Términos y Condiciones */}
          <View style={styles.termsContainer}>
            <WebIcon name="shield-check" size={20} color="#007bff" />
            <Text style={styles.termsText}>
              Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
            </Text>
          </View>

          {/* Botón de Registro */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                <WebIcon name="check-circle" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Enlace a Login */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Información adicional */}
          <View style={styles.infoBox}>
            <WebIcon name="information" size={18} color="#666" />
            <Text style={styles.infoText}>
              Los campos marcados con * son obligatorios. 
              Tu información está protegida y solo será usada con fines académicos.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonPlaceholder: {
    width: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  roleContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  roleButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#007bff',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  eyeIcon: {
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#007bff',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});
