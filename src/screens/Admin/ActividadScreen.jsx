import React, { useState, useEffect } from "react";
import {SafeAreaView,View, Text,StyleSheet,ScrollView,TouchableOpacity,FlatList, TextInput,RefreshControl} from "react-native";
import WebIcon from "../../components/WebIcon";
import { getShadowStyle } from "../../utils/shadowStyles";

export default function ActividadScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [actividad, setActividad] = useState([
    {
      id: 1,
      usuario: "Prof. Ana García",
      accion: "Registró calificaciones del parcial",
      tipo: "academico",
      detalles: "Materia: Matemáticas, Grupo: 301",
      fecha: "2024-01-15 14:30",
      icono: "file-document",
      color: "#4CAF50",
    },
    {
      id: 2,
      usuario: "Admin Sistema",
      accion: "Creó nuevo usuario",
      tipo: "usuarios",
      detalles: "Usuario: Carlos Rodríguez, Rol: Profesor",
      fecha: "2024-01-15 13:45",
      icono: "account-plus",
      color: "#2196F3",
    },
    {
      id: 3,
      usuario: "Alumno Juan Pérez",
      accion: "Actualizó información personal",
      tipo: "perfil",
      detalles: "Cambió número telefónico",
      fecha: "2024-01-15 12:20",
      icono: "account-edit",
      color: "#9C27B0",
    },
    {
      id: 4,
      usuario: "Sistema Automático",
      accion: "Backup completado exitosamente",
      tipo: "sistema",
      detalles: "Tamaño: 2.3 GB, Duración: 15 min",
      fecha: "2024-01-15 03:00",
      icono: "backup-restore",
      color: "#607D8B",
    },
    {
      id: 5,
      usuario: "Prof. Roberto Sánchez",
      accion: "Subió material de estudio",
      tipo: "academico",
      detalles: "Archivo: Guía de ejercicios.pdf",
      fecha: "2024-01-14 16:15",
      icono: "upload",
      color: "#FF9800",
    },
    {
      id: 6,
      usuario: "Admin Sistema",
      accion: "Modificó permisos de usuario",
      tipo: "seguridad",
      detalles: "Usuario: María López, Nuevo rol: Coordinador",
      fecha: "2024-01-14 11:30",
      icono: "shield-account",
      color: "#F44336",
    },
    {
      id: 7,
      usuario: "Alumno Sofía Martínez",
      accion: "Realizó examen en línea",
      tipo: "academico",
      detalles: "Examen: Física I, Calificación: 95/100",
      fecha: "2024-01-14 10:45",
      icono: "pencil-box",
      color: "#00BCD4",
    },
    {
      id: 8,
      usuario: "Sistema Automático",
      accion: "Limpieza de archivos temporales",
      tipo: "sistema",
      detalles: "Espacio liberado: 1.2 GB",
      fecha: "2024-01-14 04:30",
      icono: "delete-empty",
      color: "#795548",
    },
    {
      id: 9,
      usuario: "Prof. Luis Fernández",
      accion: "Envió mensaje al grupo",
      tipo: "comunicacion",
      detalles: "Grupo: 401, Asunto: Recordatorio tarea",
      fecha: "2024-01-13 18:20",
      icono: "message-text",
      color: "#3F51B5",
    },
    {
      id: 10,
      usuario: "Admin Sistema",
      accion: "Actualizó configuración del sistema",
      tipo: "configuracion",
      detalles: "Cambios en parámetros académicos",
      fecha: "2024-01-13 15:10",
      icono: "cog",
      color: "#9E9E9E",
    },
  ]);

  const [estadisticas, setEstadisticas] = useState({
    totalHoy: 0,
    totalSemana: 0,
    usuariosActivos: 0,
    actividadAcademica: 0,
  });

  useEffect(() => {
    calcularEstadisticas();
  }, []);

  const calcularEstadisticas = () => {
    const hoy = new Date().toISOString().split('T')[0];
    
    const actividadesHoy = actividad.filter(a => a.fecha.startsWith(hoy));
    const actividadesSemana = actividad.filter(a => {
      const fechaAct = new Date(a.fecha.split(' ')[0]);
      const hoyDate = new Date();
      const diffTime = Math.abs(hoyDate - fechaAct);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });

    const usuariosUnicos = [...new Set(actividad.map(a => a.usuario))];
    const actividadesAcademicas = actividad.filter(a => a.tipo === "academico").length;

    setEstadisticas({
      totalHoy: actividadesHoy.length,
      totalSemana: actividadesSemana.length,
      usuariosActivos: usuariosUnicos.length,
      actividadAcademica: actividadesAcademicas,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      calcularEstadisticas();
    }, 1000);
  };

  const getTipoTexto = (tipo) => {
    switch (tipo) {
      case "academico": return "Académico";
      case "usuarios": return "Usuarios";
      case "perfil": return "Perfil";
      case "sistema": return "Sistema";
      case "seguridad": return "Seguridad";
      case "comunicacion": return "Comunicación";
      case "configuracion": return "Configuración";
      default: return "General";
    }
  };

  const filtrarActividad = () => {
    let filtrada = actividad;

    // Filtrar por tipo
    if (filtroTipo !== "todos") {
      filtrada = filtrada.filter(a => a.tipo === filtroTipo);
    }

    // Filtrar por búsqueda
    if (busqueda) {
      filtrada = filtrada.filter(a =>
        a.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.detalles.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return filtrada;
  };

  const exportarActividad = () => {
    Alert.alert(
      "Exportar Actividad",
      "Seleccione el formato de exportación",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "CSV", onPress: () => console.log("Exportando CSV") },
        { text: "PDF", onPress: () => console.log("Exportando PDF") },
        { text: "Excel", onPress: () => console.log("Exportando Excel") },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <WebIcon name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Registro de Actividad</Text>
        <Text style={styles.headerSubtitle}>Bitácora del sistema</Text>
      </View>
      <TouchableOpacity
        style={styles.exportButton}
        onPress={exportarActividad}
      >
        <WebIcon name="export" size={24} color="#2196F3" />
      </TouchableOpacity>
    </View>
  );

  const renderEstadisticas = () => (
    <View style={[styles.estadisticasContainer, getShadowStyle()]}>
      <View style={styles.estadisticaItem}>
        <View style={[styles.estadisticaIcon, { backgroundColor: "#E8F5E9" }]}>
          <WebIcon name="clock" size={20} color="#4CAF50" />
        </View>
        <View style={styles.estadisticaInfo}>
          <Text style={styles.estadisticaValor}>{estadisticas.totalHoy}</Text>
          <Text style={styles.estadisticaLabel}>Hoy</Text>
        </View>
      </View>

      <View style={styles.estadisticaItem}>
        <View style={[styles.estadisticaIcon, { backgroundColor: "#E3F2FD" }]}>
          <WebIcon name="calendar-week" size={20} color="#2196F3" />
        </View>
        <View style={styles.estadisticaInfo}>
          <Text style={styles.estadisticaValor}>{estadisticas.totalSemana}</Text>
          <Text style={styles.estadisticaLabel}>Esta semana</Text>
        </View>
      </View>

      <View style={styles.estadisticaItem}>
        <View style={[styles.estadisticaIcon, { backgroundColor: "#FFF3E0" }]}>
          <WebIcon name="account-group" size={20} color="#FF9800" />
        </View>
        <View style={styles.estadisticaInfo}>
          <Text style={styles.estadisticaValor}>{estadisticas.usuariosActivos}</Text>
          <Text style={styles.estadisticaLabel}>Usuarios activos</Text>
        </View>
      </View>
    </View>
  );

  const renderFiltros = () => (
    <View style={styles.filtrosContainer}>
      <View style={styles.searchContainer}>
        <WebIcon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en actividad..."
          value={busqueda}
          onChangeText={setBusqueda}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tiposContainer}
      >
        <TouchableOpacity
          style={[
            styles.tipoButton,
            filtroTipo === "todos" && styles.tipoButtonActive
          ]}
          onPress={() => setFiltroTipo("todos")}
        >
          <Text style={[
            styles.tipoButtonText,
            filtroTipo === "todos" && styles.tipoButtonTextActive
          ]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoButton,
            filtroTipo === "academico" && styles.tipoButtonActive
          ]}
          onPress={() => setFiltroTipo("academico")}
        >
          <WebIcon name="school" size={16} color="#4CAF50" />
          <Text style={[
            styles.tipoButtonText,
            filtroTipo === "academico" && styles.tipoButtonTextActive
          ]}>
            Académico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoButton,
            filtroTipo === "usuarios" && styles.tipoButtonActive
          ]}
          onPress={() => setFiltroTipo("usuarios")}
        >
          <WebIcon name="account-group" size={16} color="#2196F3" />
          <Text style={[
            styles.tipoButtonText,
            filtroTipo === "usuarios" && styles.tipoButtonTextActive
          ]}>
            Usuarios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoButton,
            filtroTipo === "sistema" && styles.tipoButtonActive
          ]}
          onPress={() => setFiltroTipo("sistema")}
        >
          <WebIcon name="server" size={16} color="#607D8B" />
          <Text style={[
            styles.tipoButtonText,
            filtroTipo === "sistema" && styles.tipoButtonTextActive
          ]}>
            Sistema
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoButton,
            filtroTipo === "seguridad" && styles.tipoButtonActive
          ]}
          onPress={() => setFiltroTipo("seguridad")}
        >
          <WebIcon name="shield-account" size={16} color="#F44336" />
          <Text style={[
            styles.tipoButtonText,
            filtroTipo === "seguridad" && styles.tipoButtonTextActive
          ]}>
            Seguridad
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderActividadItem = ({ item }) => (
    <View style={[styles.actividadCard, getShadowStyle()]}>
      <View style={styles.actividadHeader}>
        <View style={[styles.actividadIcon, { backgroundColor: `${item.color}20` }]}>
          <WebIcon name={item.icono} size={20} color={item.color} />
        </View>
        <View style={styles.actividadInfo}>
          <Text style={styles.actividadUsuario}>{item.usuario}</Text>
          <Text style={styles.actividadAccion}>{item.accion}</Text>
          <Text style={styles.actividadDetalles}>{item.detalles}</Text>
        </View>
        <View style={styles.actividadMeta}>
          <View style={[
            styles.tipoBadge,
            { backgroundColor: `${item.color}20` }
          ]}>
            <Text style={[styles.tipoBadgeText, { color: item.color }]}>
              {getTipoTexto(item.tipo)}
            </Text>
          </View>
          <Text style={styles.actividadFecha}>{item.fecha}</Text>
        </View>
      </View>
    </View>
  );

  const renderListaActividad = () => (
    <FlatList
      data={filtrarActividad()}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listaContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <WebIcon name="text-box-search" size={50} color="#ccc" />
          <Text style={styles.emptyText}>
            No se encontraron registros con los filtros seleccionados
          </Text>
        </View>
      }
      renderItem={renderActividadItem}
      ListHeaderComponent={
        <Text style={styles.listaTitle}>
          {filtrarActividad().length} registros encontrados
        </Text>
      }
    />
  );

  const renderLineaTiempo = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const actividadesHoy = actividad.filter(a => a.fecha.startsWith(hoy));

    if (actividadesHoy.length === 0) return null;

    return (
      <View style={styles.lineaTiempoContainer}>
        <Text style={styles.lineaTiempoTitle}>Actividad de hoy</Text>
        <View style={styles.lineaTiempo}>
          {actividadesHoy.slice(0, 5).map((item, index) => (
            <View key={item.id} style={styles.lineaTiempoItem}>
              <View style={[styles.lineaTiempoDot, { backgroundColor: item.color }]} />
              <View style={styles.lineaTiempoContent}>
                <Text style={styles.lineaTiempoAccion}>{item.accion}</Text>
                <Text style={styles.lineaTiempoHora}>
                  {item.fecha.split(' ')[1]}
                </Text>
              </View>
              {index < actividadesHoy.length - 1 && (
                <View style={styles.lineaTiempoLinea} />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        {renderEstadisticas()}
        {renderFiltros()}
        {renderLineaTiempo()}
        {renderListaActividad()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  exportButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  estadisticasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 12,
  },
  estadisticaItem: {
    alignItems: "center",
  },
  estadisticaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  estadisticaInfo: {
    alignItems: "center",
  },
  estadisticaValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  estadisticaLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  filtrosContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    ...getShadowStyle(1, 0.05, 2),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  tiposContainer: {
    flexDirection: "row",
  },
  tipoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tipoButtonActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  tipoButtonText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  tipoButtonTextActive: {
    color: "#2196F3",
    fontWeight: "500",
  },
  lineaTiempoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    ...getShadowStyle(),
  },
  lineaTiempoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  lineaTiempo: {
    marginLeft: 10,
  },
  lineaTiempoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  lineaTiempoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 15,
    zIndex: 1,
  },
  lineaTiempoContent: {
    flex: 1,
  },
  lineaTiempoAccion: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  lineaTiempoHora: {
    fontSize: 12,
    color: "#666",
  },
  lineaTiempoLinea: {
    position: "absolute",
    left: 5,
    top: 10,
    width: 1,
    height: "100%",
    backgroundColor: "#ddd",
  },
  listaContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listaTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  actividadCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  actividadHeader: {
    flexDirection: "row",
  },
  actividadIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  actividadInfo: {
    flex: 1,
  },
  actividadUsuario: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  actividadAccion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  actividadDetalles: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  actividadMeta: {
    alignItems: "flex-end",
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 5,
  },
  tipoBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  actividadFecha: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
