import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { 
  Text, TextInput, Button, useTheme, HelperText, 
  Portal, Dialog, Paragraph, ActivityIndicator 
} from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from "../context/GlobalContext";

export default function RegisterScreen({ navigation }) {
  const { apiRequest } = useGlobalContext();
  const theme = useTheme();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "", 
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para el Modal de Éxito
  const [successVisible, setSuccessVisible] = useState(false);

  // Validaciones
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio.";
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Correo inválido.";
    } else if (!formData.correo.includes("uleam.edu.ec")) {
      newErrors.correo = "Debe ser un correo institucional (@uleam.edu.ec).";
    }

    if (!formData.contraseña) {
      newErrors.contraseña = "La contraseña es obligatoria.";
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = "Mínimo 6 caracteres.";
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        nombre: formData.nombre,
        correo: formData.correo,
        contraseña: formData.contraseña
      };

      // 🚫 ELIMINADO: Ya no mostramos el payload en consola por seguridad
      // console.log("📨 Enviando registro:", payload); 

      // 1. Enviamos a la API
      await apiRequest('/register', 'POST', payload);

      // 2. Limpiamos el formulario (visual)
      setFormData({
        nombre: "",
        correo: "",
        contraseña: "",
        confirmarContraseña: ""
      });

      // 3. Mostramos el Modal de Éxito
      setSuccessVisible(true);

      // 4. TEMPORIZADOR PARA REDIRIGIR AUTOMÁTICAMENTE
      setTimeout(() => {
        setSuccessVisible(false); // Cerramos modal
        navigation.navigate("Login"); // Redirigimos
      }, 2500); // Espera 2.5 segundos antes de cambiar

    } catch (error) {
      console.error("❌ Error Registro:", error); // Solo mostramos el error, no los datos
      const msg = error.response?.data?.message || "No se pudo crear la cuenta.";
      
      if (Platform.OS === 'web') {
          alert(msg);
      } else {
          // Si tienes configurado un Snackbar global sería ideal, si no, warning en consola
          console.warn(msg); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos dinámicos
  const containerStyle = { backgroundColor: theme.colors.background };
  const cardStyle = { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 20 };
  const textSecondary = { color: theme.colors.onSurfaceVariant };

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              Crear Cuenta
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={[styles.subtitle, textSecondary]}>
            Ingresa tus datos institucionales
          </Text>

          {/* Formulario */}
          <View style={cardStyle}>
            
            {/* NOMBRE */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Nombre Completo"
                placeholder="Ej: Alexander Velez"
                value={formData.nombre}
                onChangeText={(v) => handleInputChange("nombre", v)}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                error={!!errors.nombre}
                style={{ backgroundColor: theme.colors.surface }}
              />
              <HelperText type="error" visible={!!errors.nombre}>{errors.nombre}</HelperText>
            </View>

            {/* CORREO */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Correo Institucional"
                placeholder="e...@live.uleam.edu.ec"
                value={formData.correo}
                onChangeText={(v) => handleInputChange("correo", v.toLowerCase())}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                error={!!errors.correo}
                style={{ backgroundColor: theme.colors.surface }}
              />
              <HelperText type="error" visible={!!errors.correo}>{errors.correo}</HelperText>
            </View>

            {/* CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Contraseña"
                value={formData.contraseña}
                onChangeText={(v) => handleInputChange("contraseña", v)}
                mode="outlined"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                error={!!errors.contraseña}
                style={{ backgroundColor: theme.colors.surface }}
              />
              <HelperText type="error" visible={!!errors.contraseña}>{errors.contraseña}</HelperText>
            </View>

            {/* CONFIRMAR */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Confirmar Contraseña"
                value={formData.confirmarContraseña}
                onChangeText={(v) => handleInputChange("confirmarContraseña", v)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                left={<TextInput.Icon icon="lock-check" />}
                right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                error={!!errors.confirmarContraseña}
                style={{ backgroundColor: theme.colors.surface }}
              />
              <HelperText type="error" visible={!!errors.confirmarContraseña}>{errors.confirmarContraseña}</HelperText>
            </View>

            {/* BOTÓN */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              contentStyle={{ paddingVertical: 5 }}
            >
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </View>

          <View style={styles.loginLinkContainer}>
            <Text style={textSecondary}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* === MODAL DE ÉXITO AUTOMÁTICO === */}
      <Portal>
        <Dialog visible={successVisible} dismissable={false} style={{ backgroundColor: theme.colors.elevation.level3 }}>
          <Dialog.Icon icon="check-circle" size={50} color="#4CAF50" />
          <Dialog.Title style={{ textAlign: 'center' }}>¡Cuenta Creada!</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ textAlign: 'center', marginBottom: 20 }}>
              Tu registro fue exitoso.
            </Paragraph>
            
            {/* INDICADOR DE CARGA Y TEXTO DE REDIRECCIÓN */}
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator animating={true} color={theme.colors.primary} size="small" />
                <Text style={{ marginTop: 10, color: theme.colors.secondary, fontSize: 12 }}>
                    Redirigiendo al login...
                </Text>
            </View>

          </Dialog.Content>
          {/* Sin botones porque redirige solo */}
        </Dialog>
      </Portal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  backButton: { padding: 5 },
  subtitle: { textAlign: 'center', marginBottom: 20 },
  inputContainer: { marginBottom: 5 },
  button: { marginTop: 10, borderRadius: 8 },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  }
});