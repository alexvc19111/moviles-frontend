import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

//Profesor
import HomeProfesorScreen from "../screens/Profesor/HomeProfesorScreen";
import CalificarTareasScreen from "../screens/Profesor/CalificarTareasScreen";
import EnviarComunicadoScreen from "../screens/Profesor/EnviarComunicadoScreen";
import HorarioProfesorScreen from "../screens/Profesor/HorarioProfesorScreen";
import ListaAlumnosScreen from "../screens/Profesor/ListaAlumnosScreen";
import NuevaTareaScreen from "../screens/Profesor/NuevaTareaScreen";
import SubirCalificacionesScreen from "../screens/Profesor/SubirCalificacionesScreen";
import TomarAsistenciaScreen from "../screens/Profesor/TomarAsistenciaScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Recuperar Contraseña" component={ForgotPasswordScreen} />
      {/* ALUMNOS */}
      <Stack.Screen name="HomeAlumno" component={HomeAlumnoScreen} />
      <Stack.Screen name="Calificaciones" component={CalificacionesScreen} />
      <Stack.Screen name="Horario" component={HorarioScreen} />
      <Stack.Screen name="PerfilAlumno" component={PerfilAlumnoScreen} />
      <Stack.Screen name="Asistencias" component={AsistenciasScreen} />
      <Stack.Screen name="Materias" component={MateriasScreen} />
      <Stack.Screen name="Ajustes" component={AjustesScreen} />
      
   {/* PROFESOR */}
   <Stack.Screen name="HomeProfesor" component={HomeProfesorScreen} />
   <Stack.Screen name="CalificarTarea" component={CalificarTareasScreen} />
   <Stack.Screen name="EnviarComunicado" component={EnviarComunicadoScreen} />
   <Stack.Screen name="HorarioProfesor" component={HorarioProfesorScreen} />
   <Stack.Screen name="ListaAlumno" component={ListaAlumnosScreen} />
   <Stack.Screen name="NuevasTareas" component={NuevaTareaScreen} />
   <Stack.Screen name="SubirCalificaciones" component={SubirCalificacionesScreen} />
   <Stack.Screen name="TomarAsistencia" component={TomarAsistenciaScreen} />

      {/* ADMIN */}
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

    

    </Stack.Navigator>
  );
}