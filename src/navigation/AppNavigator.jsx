import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGlobalContext } from "../context/GlobalContext"; // Importamos el contexto

// ================= PANTALLAS =================

// Auth
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

// ALUMNO
import HomeAlumnoScreen from "../screens/Alumnos/HomeAlumnoScreen";
import CalificacionesScreen from "../screens/Alumnos/CalificacionesScreen";
import HorarioScreen from "../screens/Alumnos/HorarioScreen";
import PerfilAlumnoScreen from "../screens/Alumnos/PerfilAlumnoScreen";
import AsistenciasScreen from "../screens/Alumnos/AsistenciasScreen";
import MateriasScreen from "../screens/Alumnos/MateriasScreen";
import AjustesScreen from "../screens/Alumnos/AjustesScreen";

// ADMIN
import HomeScreenAdmin from "../screens/Admin/HomeScreenAdmin";
import GestionUsuariosScreen from "../screens/Admin/GestionUsuariosScreen";
import GestionMateriasScreen from "../screens/Admin/GestionMateriasScreen";
import ReportesScreen from "../screens/Admin/ReporteScreen";
import ConfiguracionScreen from "../screens/Admin/ConfiguracionScreen";
import BackupScreen from "../screens/Admin/BakupScreen";
import ActividadScreen from "../screens/Admin/ActividadScreen";
import AlertasScreen from "../screens/Admin/AlertasScreen";
import AsignarGruposScreen from "../screens/Admin/AsignarGruposScreen";
import PeriodosAcademicosScreen from "../screens/Admin/PeriodosAcademicosScreen";
import EditarPerfil from "../screens/Admin/EditarPerfil";

// PROFESOR
import HomeProfesorScreen from "../screens/Profesor/HomeProfesorScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // 1. Obtenemos el estado del usuario desde el contexto
  const { user, loadingAuth } = useGlobalContext();

  // 2. Pantalla de carga (mientras verifica si hay sesión guardada en el celular)
  if (loadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {user ? (
        // ================= SI HAY USUARIO (LOGUEADO) =================
        // Renderizamos las pantallas según el ROL del usuario
        <>
          {user.role === 'admin' ? (
            // --- STACK DE ADMIN ---
            <Stack.Group>
              <Stack.Screen name="HomeAdmin" component={HomeScreenAdmin} />
              <Stack.Screen name="GestionUsuarios" component={GestionUsuariosScreen} />
              <Stack.Screen name="GestionMaterias" component={GestionMateriasScreen} />
              <Stack.Screen name="Reportes" component={ReportesScreen} />
              <Stack.Screen name="Configuracion" component={ConfiguracionScreen} />
              <Stack.Screen name="Backup" component={BackupScreen} />
              <Stack.Screen name="Actividad" component={ActividadScreen} />
              <Stack.Screen name="Alertas" component={AlertasScreen} />
              <Stack.Screen name="AsignarGrupos" component={AsignarGruposScreen} />
              <Stack.Screen name="PeriodosAcademicos" component={PeriodosAcademicosScreen} />
              <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
            </Stack.Group>
          ) : user.role === 'docente' ? (
            // --- STACK DE PROFESOR ---
            <Stack.Group>
              <Stack.Screen name="HomeProfesor" component={HomeProfesorScreen} />
              {/* Agrega aquí más pantallas específicas de profesor si las tienes */}
               {/* Ejemplo: <Stack.Screen name="PerfilProfesor" component={PerfilProfesorScreen} /> */}
               <Stack.Screen name="Ajustes" component={AjustesScreen} />
            </Stack.Group>
          ) : (
            // --- STACK DE ALUMNO (Default) ---
            <Stack.Group>
              <Stack.Screen name="HomeAlumno" component={HomeAlumnoScreen} />
              <Stack.Screen name="Calificaciones" component={CalificacionesScreen} />
              <Stack.Screen name="Horario" component={HorarioScreen} />
              <Stack.Screen name="PerfilAlumno" component={PerfilAlumnoScreen} />
              <Stack.Screen name="Asistencias" component={AsistenciasScreen} />
              <Stack.Screen name="Materias" component={MateriasScreen} />
              <Stack.Screen name="Ajustes" component={AjustesScreen} />
              <Stack.Screen name="Alertas" component={AlertasScreen} />
            </Stack.Group>
          )}
        </>
      ) : (
        // ================= SI NO HAY USUARIO (INVITADO) =================
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Recuperar Contraseña" component={ForgotPasswordScreen} />
        </Stack.Group>
      )}

    </Stack.Navigator>
  );
}