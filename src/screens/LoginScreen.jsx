import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
// 👇 IMPORTAMOS HelperText y Snackbar
import { Text, TextInput, Button, useTheme, Surface, HelperText, Snackbar } from "react-native-paper";
import { useGlobalContext } from "../context/GlobalContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- NUEVOS ESTADOS PARA FEEDBACK ---
  const [emailError, setEmailError] = useState(false);      // ¿El email está vacío?
  const [passError, setPassError] = useState(false);        // ¿La clave está vacía?
  const [snackVisible, setSnackVisible] = useState(false);  // Mostrar barra inferior
  const [snackMessage, setSnackMessage] = useState("");     // Mensaje del servidor

  const { login, t } = useGlobalContext();
  const theme = useTheme(); 

  const demoUsers = {
    alumno: { email: "e1315736908@live.uleam.edu.ec", password: "sandino" }, // Ajusta a tus datos reales
    docente: { email: "docente@escuela.com", password: "password" },
    admin: { email: "admin@escuela.com", password: "password" },
  };

  const handleLogin = async () => {
    // 1. Resetear errores previos
    setEmailError(false);
    setPassError(false);

    // 2. Validación Local (Campos vacíos)
    let hasError = false;
    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }
    if (!password.trim()) {
      setPassError(true);
      hasError = true;
    }

    if (hasError) return; // Si hay error visual, no llamamos a la API

    setLoading(true);

    try {
      // 3. Intentar Login
      await login(email, password);
      // Si pasa, el AppNavigator cambia la pantalla solo.
      
    } catch (error) {
      // 4. CAPTURAR ERROR DEL SERVIDOR
      const mensajeServidor = error.response?.data?.message || "Credenciales incorrectas";
      setSnackMessage(mensajeServidor);
      setSnackVisible(true); // Mostrar Snackbar
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (type) => {
    const demo = demoUsers[type];
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
      // Limpiamos errores al usar demo
      setEmailError(false); 
      setPassError(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* LOGO */}
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: theme.colors.primary }]}>
              <Text style={{ fontSize: 48 }}>🏫</Text>
            </View>
            <Text variant="headlineMedium" style={{ fontWeight: "bold", color: theme.colors.onBackground }}>
              {t('general.sistema', { defaultValue: 'Sistema Escolar' })}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>
              Gestión Académica
            </Text>
          </View>

          {/* FORMULARIO */}
          <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <Text variant="headlineSmall" style={[styles.formTitle, { color: theme.colors.onSurface }]}>
              {t('login.titulo')}
            </Text>

            {/* INPUT EMAIL */}
            <TextInput
              label={t('login.usuario')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if(text) setEmailError(false); // Quitar error mientras escribe
              }}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              disabled={loading}
              error={emailError} // <--- Pone el borde rojo
              left={<TextInput.Icon icon="email" />}
            />
            {/* TEXTO DE ERROR EMAIL */}
            <HelperText type="error" visible={emailError}>
              El correo es obligatorio.
            </HelperText>

            {/* INPUT PASSWORD */}
            <TextInput
              label={t('login.contraseña')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if(text) setPassError(false);
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              disabled={loading}
              error={passError} // <--- Pone el borde rojo
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)} 
                />
              }
            />
            {/* TEXTO DE ERROR PASSWORD */}
            <HelperText type="error" visible={passError}>
              La contraseña es obligatoria.
            </HelperText>

            <Button 
              mode="contained" 
              onPress={handleLogin} 
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={{ paddingVertical: 5 }}
            >
              {loading ? t('login.cargando') : t('login.ingresar')}
            </Button>

            {/* DEMO BUTTONS */}
            <View style={[styles.demoBox, { backgroundColor: theme.colors.elevation.level1 }]}>
              <Text variant="labelMedium" style={{ textAlign: "center", marginBottom: 10, color: theme.colors.onSurfaceVariant }}>
                Credenciales de Demo
              </Text>
              <View style={styles.demoRow}>
                <Button mode="contained-tonal" compact onPress={() => handleQuickLogin("alumno")}>
                  Alumno
                </Button>
                <Button mode="contained-tonal" compact onPress={() => handleQuickLogin("docente")}>
                  Docente
                </Button>
                <Button mode="contained-tonal" compact onPress={() => handleQuickLogin("admin")}>
                  Admin
                </Button>
              </View>
            </View>

            {/* LINKS */}
            <Button 
              mode="text" 
              onPress={() => navigation.navigate("Register")} 
              disabled={loading}
              style={{ marginTop: 10 }}
            >
              {t('login.crearCuenta')}
            </Button>

            <Button 
              mode="text" 
              onPress={() => navigation.navigate("Recuperar Contraseña")} 
              disabled={loading}
              compact
            >
              {t('login.olvideContraseña')}
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* SNACKBAR (Mensajes flotantes de error) */}
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackVisible(false),
        }}
        style={{ backgroundColor: theme.colors.error }} // Fondo rojo para errores
      >
        {snackMessage}
      </Snackbar>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  form: {
    borderRadius: 20,
    padding: 25,
  },
  formTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    // Quitamos marginBottom grande porque ahora está el HelperText
    marginTop: 5, 
    backgroundColor: 'transparent'
  },
  loginButton: {
    marginTop: 15,
    borderRadius: 8,
  },
  demoBox: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
  },
  demoRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    gap: 5
  },
});