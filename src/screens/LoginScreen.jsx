import React, { useState } from "react";
import {SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Usuarios de prueba
  const testUsers = [
    {
      email: "alumno@escuela.com",
      password: "123456",
      role: "alumno",
      name: "Juan Pérez",
    },
    {
      email: "profesor@escuela.com",
      password: "123456",
      role: "profesor",
      name: "María García",
    },
    {
      email: "admin@escuela.com",
      password: "admin123",
      role: "admin",
      name: "Admin Sistema",
    },
  ];

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = testUsers.find(
        (u) => u.email === email && u.password === password
      );

      setLoading(false);

      if (!user) {
        Alert.alert("Error", "Credenciales incorrectas");
        return;
      }

      console.log("Usuario logueado:", user);

      // Alerta solo informativa (NO navegación aquí)
      Alert.alert("¡Bienvenido!", `Hola ${user.name}`);

      // 🔥 Navegación segura (WEB + MÓVIL)
      if (user.role === "admin") {
        navigation.replace("HomeAdmin", { user });
      } else if (user.role === "alumno") {
        navigation.replace("HomeAlumno", { user });
      } else if (user.role === "profesor") {
        navigation.replace("HomeProfesor", { user });
      }
    }, 1200);
  };

  const handleQuickLogin = (type) => {
    const demo = testUsers.find((u) => u.role === type);
    if (!demo) return;

    setEmail(demo.email);
    setPassword(demo.password);
    Alert.alert("Demo", `Credenciales de ${demo.role} cargadas`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🏫</Text>
            </View>
            <Text style={styles.title}>Sistema Escolar</Text>
            <Text style={styles.subtitle}>Gestión Académica</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Ingresar</Text>

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="admin@escuela.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eye}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={{ fontSize: 18 }}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Ingresar</Text>
              )}
            </TouchableOpacity>

            {/* DEMO */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Credenciales de Demo</Text>
              <View style={styles.demoRow}>
                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: "#4CAF50" }]}
                  onPress={() => handleQuickLogin("alumno")}
                >
                  <Text style={styles.demoText}>Alumno</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: "#2196F3" }]}
                  onPress={() => handleQuickLogin("profesor")}
                >
                  <Text style={styles.demoText}>Profesor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoBtn, { backgroundColor: "#FF9800" }]}
                  onPress={() => handleQuickLogin("admin")}
                >
                  <Text style={styles.demoText}>Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LINKS */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text style={styles.link}>Crear cuenta nueva</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Recuperar Contraseña")}
              disabled={loading}
            >
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Text style={styles.version}>
              Versión 1.0.0 • Modo demostración
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  logoText: { fontSize: 48 },
  title: { fontSize: 26, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 15, color: "#666" },
  form: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  label: { fontSize: 14, color: "#555", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  eye: { padding: 10 },
  loginButton: {
    backgroundColor: "#007bff",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  demoBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
  },
  demoTitle: {
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },
  demoRow: { flexDirection: "row", justifyContent: "space-around" },
  demoBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  demoText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  link: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 25,
  },
});

