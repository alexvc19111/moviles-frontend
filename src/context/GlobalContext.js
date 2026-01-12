import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../api/axiosClient"; 
import { 
    MD3DarkTheme as PaperDarkTheme, 
    MD3LightTheme as PaperLightTheme 
} from "react-native-paper";

// ==================== 1. TRADUCCIONES ====================
const translations = {
  es: {
    ajustes: {
      titulo: 'Ajustes', perfil: 'Perfil', preferencias: 'Preferencias',
      seguridad: 'Seguridad', acercaDe: 'Acerca de', notificaciones: 'Notificaciones',
      notificacionesDesc: 'Recibir alertas importantes', modoOscuro: 'Modo Oscuro',
      modoOscuroDesc: 'Cambiar tema de la aplicación', idioma: 'Idioma',
      idiomaDesc: 'Lenguaje de la aplicación', cerrarSesion: 'Cerrar Sesión',
      confirmarCerrarSesion: '¿Estás seguro de que quieres salir?',
      cancelar: 'Cancelar', siSalir: 'Sí, salir', version: 'Versión'
    },
    login: {
      titulo: 'Iniciar Sesión', usuario: 'Usuario', contraseña: 'Contraseña',
      ingresar: 'Ingresar', olvideContraseña: '¿Olvidaste tu contraseña?',
      crearCuenta: 'Crear cuenta', error: 'Error', cargando: 'Cargando...'
    },
    alumno: {
      inicio: 'Inicio', calificaciones: 'Calificaciones', horarios: 'Horarios',
      materias: 'Materias', asistencias: 'Asistencias', ajustes: 'Ajustes'
    },
    general: {
      guardar: 'Guardar', cancelar: 'Cancelar', aceptar: 'Aceptar',
      eliminar: 'Eliminar', editar: 'Editar', buscar: 'Buscar',
      cargando: 'Cargando...', bienvenido: 'Bienvenido', hola: 'Hola',
      sistema: 'Sistema Escolar' 
    },
    home: {
      bienvenido: '¡Bienvenido de nuevo!',
      promedio: 'Promedio',
      asistencia: 'Asistencia',
      materias: 'Materias',
      creditos: 'Créditos',
      proximasClases: 'Próximas Clases Hoy',
      verHorario: 'Ver horario',
      misMaterias: 'Mis Materias',
      verTodas: 'Ver todas',
      calificacionesRecientes: 'Calificaciones Recientes',
      verHistorial: 'Ver historial',
      avisos: 'Avisos Recientes',
      accionesRapidas: 'Acciones Rápidas',
      sistema: 'Sistema Escolar'
    }
  },
  en: {
    ajustes: {
      titulo: 'Settings', perfil: 'Profile', preferencias: 'Preferences',
      seguridad: 'Security', acercaDe: 'About', notificaciones: 'Notifications',
      notificacionesDesc: 'Receive important alerts', modoOscuro: 'Dark Mode',
      modoOscuroDesc: 'Change application theme', idioma: 'Language',
      idiomaDesc: 'Application language', cerrarSesion: 'Logout',
      confirmarCerrarSesion: 'Are you sure you want to logout?',
      cancelar: 'Cancel', siSalir: 'Yes, logout', version: 'Version'
    },
    login: {
      titulo: 'Login', usuario: 'Username', contraseña: 'Password',
      ingresar: 'Sign In', olvideContraseña: 'Forgot password?',
      crearCuenta: 'Create account', error: 'Error', cargando: 'Loading...'
    },
    alumno: {
      inicio: 'Home', calificaciones: 'Grades', horarios: 'Schedule',
      materias: 'Subjects', asistencias: 'Attendance', ajustes: 'Settings'
    },
    general: {
      guardar: 'Save', cancelar: 'Cancel', aceptar: 'Accept',
      eliminar: 'Delete', editar: 'Edit', buscar: 'Search',
      cargando: 'Loading...', bienvenido: 'Welcome', hola: 'Hello',
      sistema: 'School System'
    },
    home: {
      bienvenido: 'Welcome back!',
      promedio: 'GPA',
      asistencia: 'Attendance',
      materias: 'Subjects',
      creditos: 'Credits',
      proximasClases: 'Next Classes Today',
      verHorario: 'View schedule',
      misMaterias: 'My Subjects',
      verTodas: 'See all',
      calificacionesRecientes: 'Recent Grades',
      verHistorial: 'View history',
      avisos: 'Recent Announcements',
      accionesRapidas: 'Quick Actions',
      sistema: 'School System'
    }
  }
};

// ==================== 2. CREACIÓN DEL CONTEXTO ====================
const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  // --- ESTADOS GLOBALES ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState('es');
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ==================== 3. API HELPER (AXIOS) ====================
  const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
      const response = await axiosClient({
        url: endpoint,
        method: method,
        data: body,
      });
      return response.data; 
    } catch (error) {
      console.error("API Error:", error.response || error);
      
      // Manejo de error 401 (Token vencido)
      if (error.response && error.response.status === 401) {
          await logout();
          Alert.alert("Sesión expirada", "Por favor ingresa nuevamente.");
      }
      throw error;
    }
  };

  // ==================== 4. CARGA INICIAL ====================
  const loadInitialData = async () => {
    try {
      // 1. Cargar Usuario y Token
      const savedUser = await AsyncStorage.getItem("@user");
      const savedToken = await AsyncStorage.getItem("@token");

      // VALIDACIÓN DE SEGURIDAD:
      // Verificamos que existan Y que no sean la palabra "undefined"
      if (savedUser && savedToken && savedUser !== "undefined" && savedToken !== "undefined") {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setToken(savedToken);
          } catch (e) {
            // Si el JSON está roto, limpiamos para evitar el crash infinito
            console.warn("Datos de usuario corruptos, limpiando sesión...");
            await AsyncStorage.multiRemove(["@user", "@token"]);
            setUser(null);
            setToken(null);
          }
      }

      // 2. Cargar Tema
      const savedTheme = await AsyncStorage.getItem("@theme");
      if (savedTheme) setIsDarkTheme(savedTheme === "dark");

      // 3. Cargar Idioma
      const savedLang = await AsyncStorage.getItem("@language");
      if (savedLang) setLanguage(savedLang);

    } catch (e) {
      console.error("Error general cargando sesión:", e);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // ==================== 5. AUTH LOGIC (CORREGIDO) ====================
  const login = async (emailInput, passwordInput) => {
    try {
        // Mapeo explícito:
        // 'correo': es lo que espera Laravel (según tu error anterior).
        // 'password': es lo que suele esperar Laravel para la clave (incluso en español).
        // Si tu Laravel espera 'contraseña', cambia 'password:' por 'contraseña:'.
        
        const payload = {
            correo: emailInput,     
            contraseña: passwordInput 
        };

        const data = await apiRequest('/login', 'POST', payload); 

        let tokenValue = null;
        let userData = null;
        
       if (data.token && data.token.token && data.token.user) {
            tokenValue = data.token.token;
            userData = data.token.user;
        } 
        // Caso 2: Estructura plana (Por si arreglas Laravel después)
        else if (data.token && data.user) {
            tokenValue = data.token;
            userData = data.user;
        }

        if (tokenValue && userData) {
            // CORRECCIÓN DE ROL: 
            // Tu BD devuelve 'rol', pero el Navigator suele buscar 'role'.
            // Creamos 'role' para que la navegación funcione siempre.
            if (userData.rol && !userData.role) {
                userData.role = userData.rol;
            }

            console.log("✅ Datos extraídos correctamente:");
            console.log("   - Token:", tokenValue.substring(0, 10) + "...");
            console.log("   - Usuario:", userData.nombre);
            console.log("   - Rol:", userData.role);

            setUser(userData);
            setToken(tokenValue);
            
            await AsyncStorage.setItem("@user", JSON.stringify(userData));
            await AsyncStorage.setItem("@token", tokenValue);
            return true; 
        } else {
             console.error("❌ Estructura de respuesta inesperada:", data);
             Alert.alert("Error", "El servidor respondió, pero los datos no tienen el formato esperado.");
             return false;
        }

    } catch (error) {
        console.log("Error detallado:", error.response?.data); 
        //Alert.alert("Error de acceso", error.response?.data?.message || error.message);
        throw error;
    }
  };

  const logout = async () => {
    try {
        if(token) await apiRequest('/logout', 'POST').catch(() => {});
    } finally {
        setUser(null);
        setToken(null);
        await AsyncStorage.multiRemove(["@user", "@token"]);
    }
  };

  // ==================== 6. UI LOGIC ====================
  const toggleTheme = async () => {
    const newVal = !isDarkTheme;
    setIsDarkTheme(newVal);
    await AsyncStorage.setItem("@theme", newVal ? "dark" : "light");
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem("@language", lang);
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) return key;

    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(`{${param}}`, params[param]);
    });
    return result;
  };

  const paperTheme = isDarkTheme ? PaperDarkTheme : PaperLightTheme;

  // ==================== 7. EXPORTAR VALUE ====================
  const value = useMemo(() => ({
    user,
    token,
    loadingAuth,
    login,
    logout,
    apiRequest,
    isDarkTheme,
    toggleTheme,
    paperTheme,
    language,
    setLanguage: changeLanguage,
    t
  }), [user, token, loadingAuth, isDarkTheme, language]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

// ==================== HOOK ====================
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext debe usarse dentro de un GlobalProvider");
  }
  return context;
}