import React, { useState, useEffect } from "react";
import {SafeAreaView, View, Text, StyleSheet,ScrollView, TouchableOpacity, FlatList, Alert, Switch, RefreshControl} from "react-native";
import WebIcon from "../../components/WebIcon";
import { getShadowStyle } from "../../utils/shadowStyles";

export default function AlertasScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      titulo: "Calificaciones Pendientes",
      descripcion: "5 profesores tienen calificaciones pendientes de registrar",
      tipo: "academico",
      nivel: "alto",
      fecha: "2024-01-15 10:30",
      leida: false,
      accion: "revisar_calificaciones",
    },
    {
      id: 2,
      titulo: "Espacio en Disco",
      descripcion: "El servidor tiene 85% de uso de espacio en disco",
      tipo: "sistema",
      nivel: "medio",
      fecha: "2024-01-15 09:15",
      leida: true,
      accion: "revisar_servidor",
    },
    {
      id: 3,
      titulo: "Backup Programado",
      descripcion: "Backup automático programado para hoy a las 20:00",
      tipo: "sistema",
      nivel: "bajo",
      fecha: "2024-01-15 08:00",
      leida: true,
      accion: null,
    },
    {
      id: 4,
      titulo: "Usuarios Inactivos",
      descripcion: "15 usuarios no han iniciado sesión en más de 30 días",
      tipo: "usuarios",
      nivel: "medio",
      fecha: "2024-01-14 16:45",
      leida: false,
      accion: "revisar_usuarios",
    },
    {
      id: 5,
      titulo: "Error de Conexión",
      descripcion: "Problema de conexión con el servidor de base de datos",
      tipo: "sistema",
      nivel: "alto",
      fecha: "2024-01-14 14:20",
      leida: false,
      accion: "revisar_conexion",
    },
    {
      id: 6,
      titulo: "Actualización Disponible",
      descripcion: "Nueva versión del sistema disponible",
      tipo: "actualizacion",
      nivel: "bajo",
      fecha: "2024-01-14 11:10",
      leida: true,
      accion: "actualizar_sistema",
    },
  ]);

  const [filtros, setFiltros] = useState({
    nivelAlto: true,
    nivelMedio: true,
    nivelBajo: true,
    noLeidas: true,
    tipoAcademico: true,
    tipoSistema: true,
    tipoUsuarios: true,
  });

  useEffect(() => {
    // Cargar alertas al iniciar
    cargarAlertas();
  }, []);

  const cargarAlertas = () => {
    // Simular carga de alertas
    console.log("Cargando alertas...");
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Actualizado", "Alertas actualizadas");
    }, 1500);
  };

  const marcarComoLeida = (id) => {
    setAlertas(prev =>
      prev.map(alerta =>
        alerta.id === id ? { ...alerta, leida: true } : alerta
      )
    );
  };

  const marcarTodasComoLeidas = () => {
    Alert.alert(
      "Marcar todas como leídas",
      "¿Marcar todas las alertas como leídas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Marcar",
          onPress: () => {
            setAlertas(prev => prev.map(alerta => ({ ...alerta, leida: true })));
          },
        },
      ]
    );
  };

  const eliminarAlerta = (id) => {
    Alert.alert(
      "Eliminar Alerta",
      "¿Estás seguro de eliminar esta alerta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setAlertas(prev => prev.filter(alerta => alerta.id !== id));
          },
        },
      ]
    );
  };

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case "alto": return "#F44336";
      case "medio": return "#FF9800";
      case "bajo": return "#4CAF50";
      default: return "#666";
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "academico": return "school";
      case "sistema": return "server";
      case "usuarios": return "account-group";
      case "actualizacion": return "update";
      default: return "bell";
    }
  };

  const handleAccionAlerta = (alerta) => {
    if (!alerta.accion) return;

    switch (alerta.accion) {
      case "revisar_calificaciones":
        Alert.alert("Acción", "Redirigiendo a calificaciones pendientes");
        // navigation.navigate("CalificacionesPendientes");
        break;
      case "revisar_servidor":
        Alert.alert("Acción", "Mostrando estadísticas del servidor");
        break;
      case "revisar_usuarios":
        Alert.alert("Acción", "Mostrando usuarios inactivos");
        break;
      case "actualizar_sistema":
        Alert.alert("Actualización", "Iniciando proceso de actualización");
        break;
      default:
        Alert.alert("Alerta", alerta.titulo);
    }

    if (!alerta.leida) {
      marcarComoLeida(alerta.id);
    }
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
        <Text style={styles.headerTitle}>Alertas del Sistema</Text>
        <View style={styles.headerStats}>
          <View style={styles.statBadge}>
            <WebIcon name="alert-circle" size={14} color="#F44336" />
            <Text style={styles.statText}>
              {alertas.filter(a => a.nivel === "alto").length} Altas
            </Text>
          </View>
          <View style={styles.statBadge}>
            <WebIcon name="alert" size={14} color="#FF9800" />
            <Text style={styles.statText}>
              {alertas.filter(a => !a.leida).length} No leídas
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={marcarTodasComoLeidas}
      >
        <WebIcon name="check-all" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  const renderFiltros = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtrosContainer}
    >
      <TouchableOpacity
        style={[
          styles.filtroButton,
          filtros.nivelAlto && styles.filtroButtonActive
        ]}
        onPress={() => setFiltros(prev => ({ ...prev, nivelAlto: !prev.nivelAlto }))}
      >
        <View style={[styles.nivelIndicator, { backgroundColor: "#F44336" }]} />
        <Text style={styles.filtroButtonText}>Alto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filtroButton,
          filtros.nivelMedio && styles.filtroButtonActive
        ]}
        onPress={() => setFiltros(prev => ({ ...prev, nivelMedio: !prev.nivelMedio }))}
      >
        <View style={[styles.nivelIndicator, { backgroundColor: "#FF9800" }]} />
        <Text style={styles.filtroButtonText}>Medio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filtroButton,
          filtros.nivelBajo && styles.filtroButtonActive
        ]}
        onPress={() => setFiltros(prev => ({ ...prev, nivelBajo: !prev.nivelBajo }))}
      >
        <View style={[styles.nivelIndicator, { backgroundColor: "#4CAF50" }]} />
        <Text style={styles.filtroButtonText}>Bajo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filtroButton,
          filtros.noLeidas && styles.filtroButtonActive
        ]}
        onPress={() => setFiltros(prev => ({ ...prev, noLeidas: !prev.noLeidas }))}
      >
        <WebIcon name="email-outline" size={16} color="#666" />
        <Text style={styles.filtroButtonText}>No leídas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filtroButton,
          filtros.tipoAcademico && styles.filtroButtonActive
        ]}
        onPress={() => setFiltros(prev => ({ ...prev, tipoAcademico: !prev.tipoAcademico }))}
      >
        <WebIcon name="school" size={16} color="#666" />
        <Text style={styles.filtroButtonText}>Académico</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filtroButton,
          filtros.tipoSistema && styles.filtroButtonActive
        ]}
        onPress={() => setFiltros(prev => ({ ...prev, tipoSistema: !prev.tipoSistema }))}
      >
        <WebIcon name="server" size={16} color="#666" />
        <Text style={styles.filtroButtonText}>Sistema</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const alertasFiltradas = alertas.filter(alerta => {
    if (!filtros[`nivel${alerta.nivel.charAt(0).toUpperCase() + alerta.nivel.slice(1)}`]) {
      return false;
    }
    if (filtros.noLeidas && alerta.leida) {
      return false;
    }
    if (!filtros[`tipo${alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)}`]) {
      return false;
    }
    return true;
  });

  const renderListaAlertas = () => (
    <FlatList
      data={alertasFiltradas}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listaContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <WebIcon name="bell-off" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No hay alertas con los filtros seleccionados</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.alertaCard,
            getShadowStyle(),
            !item.leida && styles.alertaNoLeida
          ]}
          onPress={() => handleAccionAlerta(item)}
          onLongPress={() => eliminarAlerta(item.id)}
        >
          <View style={styles.alertaHeader}>
            <View style={styles.alertaTipo}>
              <Icon
                name={getTipoIcon(item.tipo)}
                size={20}
                color="#666"
              />
            </View>
            <View style={styles.alertaInfo}>
              <Text style={styles.alertaTitulo}>{item.titulo}</Text>
              <Text style={styles.alertaFecha}>
                <WebIcon name="clock-outline" size={12} color="#999" />
                {" "}{item.fecha}
              </Text>
            </View>
            <View style={[
              styles.alertaNivel,
              { backgroundColor: `${getNivelColor(item.nivel)}20` }
            ]}>
              <Text style={[
                styles.alertaNivelText,
                { color: getNivelColor(item.nivel) }
              ]}>
                {item.nivel.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.alertaDescripcion}>{item.descripcion}</Text>

          <View style={styles.alertaFooter}>
            <View style={styles.alertaAcciones}>
              {item.accion && (
                <TouchableOpacity
                  style={styles.accionButton}
                  onPress={() => handleAccionAlerta(item)}
                >
                  <WebIcon name="arrow-right-circle" size={18} color="#2196F3" />
                  <Text style={styles.accionButtonText}>Tomar acción</Text>
                </TouchableOpacity>
              )}

              {!item.leida && (
                <TouchableOpacity
                  style={styles.accionButton}
                  onPress={() => marcarComoLeida(item.id)}
                >
                  <WebIcon name="check" size={18} color="#4CAF50" />
                  <Text style={styles.accionButtonText}>Marcar leída</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.eliminarButton}
              onPress={() => eliminarAlerta(item.id)}
            >
              <WebIcon name="delete-outline" size={18} color="#F44336" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  const renderResumen = () => (
    <View style={[styles.resumenContainer, getShadowStyle()]}>
      <View style={styles.resumenItem}>
        <View style={[styles.resumenIcon, { backgroundColor: "#FFEBEE" }]}>
          <WebIcon name="alert-circle" size={24} color="#F44336" />
        </View>
        <View style={styles.resumenInfo}>
          <Text style={styles.resumenValue}>
            {alertas.filter(a => a.nivel === "alto").length}
          </Text>
          <Text style={styles.resumenLabel}>Alertas Altas</Text>
        </View>
      </View>

      <View style={styles.resumenItem}>
        <View style={[styles.resumenIcon, { backgroundColor: "#FFF3E0" }]}>
          <WebIcon name="alert" size={24} color="#FF9800" />
        </View>
        <View style={styles.resumenInfo}>
          <Text style={styles.resumenValue}>
            {alertas.filter(a => !a.leida).length}
          </Text>
          <Text style={styles.resumenLabel}>No Leídas</Text>
        </View>
      </View>

      <View style={styles.resumenItem}>
        <View style={[styles.resumenIcon, { backgroundColor: "#E8F5E9" }]}>
          <WebIcon name="server" size={24} color="#4CAF50" />
        </View>
        <View style={styles.resumenInfo}>
          <Text style={styles.resumenValue}>
            {alertas.filter(a => a.tipo === "sistema").length}
          </Text>
          <Text style={styles.resumenLabel}>Del Sistema</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        {renderResumen()}
        {renderFiltros()}
        {renderListaAlertas()}

        <View style={styles.infoContainer}>
          <WebIcon name="information" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            Mantén presionada una alerta para eliminarla
          </Text>
        </View>
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
    marginBottom: 5,
  },
  headerStats: {
    flexDirection: "row",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 10,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  headerButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  resumenContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 12,
  },
  resumenItem: {
    alignItems: "center",
  },
  resumenIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  resumenInfo: {
    alignItems: "center",
  },
  resumenValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resumenLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  filtrosContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filtroButton: {
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
  filtroButtonActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  nivelIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  filtroButtonText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
  },
  listaContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  alertaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  alertaNoLeida: {
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  alertaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  alertaTipo: {
    marginRight: 10,
  },
  alertaInfo: {
    flex: 1,
  },
  alertaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  alertaFecha: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  alertaNivel: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertaNivelText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  alertaDescripcion: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  alertaFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  alertaAcciones: {
    flexDirection: "row",
  },
  accionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  accionButtonText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  eliminarButton: {
    padding: 5,
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
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    marginLeft: 8,
  },
});
