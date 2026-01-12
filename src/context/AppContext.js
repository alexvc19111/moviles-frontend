import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ==================== TRADUCCIONES ====================
const translations = {
  es: {
    ajustes: {
      titulo: 'Ajustes',
      perfil: 'Perfil',
      preferencias: 'Preferencias',
      seguridad: 'Seguridad',
      acercaDe: 'Acerca de',
      notificaciones: 'Notificaciones',
      notificacionesDesc: 'Recibir alertas importantes',
      modoOscuro: 'Modo Oscuro',
      modoOscuroDesc: 'Cambiar tema de la aplicación',
      idioma: 'Idioma',
      idiomaDesc: 'Lenguaje de la aplicación',
      seleccionarIdioma: 'Seleccionar idioma',
      idiomaCambiado: 'Idioma cambiado',
      idiomaEstablecido: 'Idioma establecido a {idioma}',
      cambiarContraseña: 'Cambiar contraseña',
      privacidad: 'Privacidad',
      version: 'Versión',
      desarrollador: 'Desarrollador',
      sistema: 'Sistema Escolar',
      derechos: 'Todos los derechos reservados',
      cerrarSesion: 'Cerrar Sesión',
      confirmarCerrarSesion: '¿Estás seguro de que quieres salir?',
      cancelar: 'Cancelar',
      siSalir: 'Sí, salir',
      nombreVacio: 'El nombre no puede estar vacío',
      exito: 'Éxito',
      nombreActualizado: 'Nombre actualizado correctamente',
      nuevoNombre: 'Nuevo nombre',
      matricula: 'Matrícula',
      guardando: 'Guardando...',
      error: 'Error',
      reintentar: 'Reintentar',
      volver: 'Volver al inicio'
    },
    login: {
      titulo: 'Iniciar Sesión',
      usuario: 'Usuario',
      contraseña: 'Contraseña',
      ingresar: 'Ingresar',
      olvideContraseña: '¿Olvidaste tu contraseña?',
      crearCuenta: 'Crear cuenta'
    },
    alumno: {
      inicio: 'Inicio',
      calificaciones: 'Calificaciones',
      horarios: 'Horarios',
      materias: 'Materias',
      asistencias: 'Asistencias',
      ajustes: 'Ajustes'
    },
    general: {
      guardar: 'Guardar',
      cancelar: 'Cancelar',
      aceptar: 'Aceptar',
      eliminar: 'Eliminar',
      editar: 'Editar',
      buscar: 'Buscar',
      cargando: 'Cargando...'
    }
  },
  en: {
    ajustes: {
      titulo: 'Settings',
      perfil: 'Profile',
      preferencias: 'Preferences',
      seguridad: 'Security',
      acercaDe: 'About',
      notificaciones: 'Notifications',
      notificacionesDesc: 'Receive important alerts',
      modoOscuro: 'Dark Mode',
      modoOscuroDesc: 'Change application theme',
      idioma: 'Language',
      idiomaDesc: 'Application language',
      seleccionarIdioma: 'Select language',
      idiomaCambiado: 'Language changed',
      idiomaEstablecido: 'Language set to {idioma}',
      cambiarContraseña: 'Change password',
      privacidad: 'Privacy',
      version: 'Version',
      desarrollador: 'Developer',
      sistema: 'School System',
      derechos: 'All rights reserved',
      cerrarSesion: 'Logout',
      confirmarCerrarSesion: 'Are you sure you want to logout?',
      cancelar: 'Cancel',
      siSalir: 'Yes, logout',
      nombreVacio: 'Name cannot be empty',
      exito: 'Success',
      nombreActualizado: 'Name updated successfully',
      nuevoNombre: 'New name',
      matricula: 'Student ID',
      guardando: 'Saving...',
      error: 'Error',
      reintentar: 'Retry',
      volver: 'Back to home'
    },
    login: {
      titulo: 'Login',
      usuario: 'Username',
      contraseña: 'Password',
      ingresar: 'Sign In',
      olvideContraseña: 'Forgot password?',
      crearCuenta: 'Create account'
    },
    alumno: {
      inicio: 'Home',
      calificaciones: 'Grades',
      horarios: 'Schedule',
      materias: 'Subjects',
      asistencias: 'Attendance',
      ajustes: 'Settings'
    },
    general: {
      guardar: 'Save',
      cancelar: 'Cancel',
      aceptar: 'Accept',
      eliminar: 'Delete',
      editar: 'Edit',
      buscar: 'Search',
      cargando: 'Loading...'
    }
  }
};

// ==================== CONTEXTOS ====================
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // Usuario logueado
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Tema
  const [language, setLanguage] = useState('es');   // Idioma
  const [loadingAuth, setLoadingAuth] = useState(true); // Cargando inicial


  useEffect(() => {
    const loadSession = async () => {
      try {
        // 1. Cargar Usuario
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        // 2. Cargar Preferencias
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme) setIsDarkTheme(storedTheme === "dark");

        const storedLang = await AsyncStorage.getItem("language");
        if (storedLang) setLanguage(storedLang);

      } catch (e) {
        console.error("Error cargando sesión:", e);
      } finally {
        setLoadingAuth(false);
      }
    };
    loadSession();
  }, []);


  // Función para obtener traducción
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Reemplazar parámetros en el texto
    let result = value || key;
    Object.keys(params).forEach(param => {
      result = result.replace(`{${param}}`, params[param]);
    });
    
    return result;
  };

  // Cargar preferencias guardadas
  useEffect(() => {
    cargarPreferencias();
  }, []);

  const cargarPreferencias = async () => {
    try {
      const tema = await AsyncStorage.getItem('tema');
      const idioma = await AsyncStorage.getItem('idioma');
      
      if (tema) setIsDarkMode(tema === 'oscuro');
      if (idioma) setLanguage(idioma);
    } catch (error) {
      console.log('Error cargando preferencias:', error);
    }
  };

  // Guardar preferencias cuando cambian
  useEffect(() => {
    guardarPreferencias();
  }, [isDarkMode, language]);

  const guardarPreferencias = async () => {
    try {
      await AsyncStorage.setItem('tema', isDarkMode ? 'oscuro' : 'claro');
      await AsyncStorage.setItem('idioma', language);
    } catch (error) {
      console.log('Error guardando preferencias:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <LanguageContext.Provider value={{ 
        language, 
        setLanguage: changeLanguage, 
        t 
      }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

// ==================== EXPORT COMBINADO ====================
export default {
  ThemeContext,
  LanguageContext,
  AppProvider
};