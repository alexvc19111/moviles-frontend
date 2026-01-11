import React, { useState } from "react";
import {SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Switch} from "react-native";
import WebIcon from "../../components/WebIcon";
import { getShadowStyle } from "../../utils/shadowStyles";

export default function PeriodosAcademicos({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [periodos, setPeriodos] = useState([
    {
      id: 1,
      nombre: "Primavera 2024",
      fechaInicio: "2024-01-15",
      fechaFin: "2024-05-30",
      estado: "activo",
      inscripcionesAbiertas: true,
      grupos: 45,
      alumnos: 1250,
    },
    {
      id: 2,
      nombre: "Otoño 2023",
      fechaInicio: "2023-08-20",
      fechaFin: "2023-12-15",
      estado: "completado",
      inscripcionesAbiertas: false,
      grupos: 40,
      alumnos: 1200,
    },
    {
      id: 3,
      nombre: "Verano 2024",
      fechaInicio: "2024-06-10",
      fechaFin: "2024-07-30",
      estado: "programado",
      inscripcionesAbiertas: false,
      grupos: 20,
      alumnos: 500,
    },
    {
      id: 4,
      nombre: "Primavera 2023",
      fechaInicio: "2023-01-10",
      fechaFin: "2023-05-25",
      estado: "completado",
      inscripcionesAbiertas: false,
      grupos: 38,
      alumnos: 1150,
    },
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    inscripcionesAbiertas: true,
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <WebIcon name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Periodos Académicos</Text>
        <Text style={styles.headerSubtitle}>Gestión de ciclos escolares</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingPeriodo(null);
          setFormData({
            nombre: "",
            fechaInicio: "",
            fechaFin: "",
            inscripcionesAbiertas: true,
          });
          setModalVisible(true);
        }}
      >
        <WebIcon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activo": return "#4CAF50";
      case "programado": return "#2196F3";
      case "completado": return "#9C27B0";
      default: return "#666";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "activo": return "check-circle";
      case "programado": return "clock";
      case "completado": return "check-all";
      default: return "help-circle";
    }
  };

  const handleSavePeriodo = () => {
    if (!formData.nombre || !formData.fechaInicio || !formData.fechaFin) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (editingPeriodo) {
      // Editar periodo existente
      setPeriodos(prev =>
        prev.map(p =>
          p.id === editingPeriodo.id
            ? { ...p, ...formData }
            : p
        )
      );
      Alert.alert("Actualizado", "Periodo académico actualizado");
    } else {
      // Crear nuevo periodo
      const newPeriodo = {
        id: periodos.length + 1,
        ...formData,
        estado: "programado",
        grupos: 0,
        alumnos: 0,
      };
      setPeriodos(prev => [...prev, newPeriodo]);
      Alert.alert("Creado", "Nuevo periodo académico creado");
    }

    setModalVisible(false);
  };

  const handleDeletePeriodo = (id) => {
    Alert.alert(
      "Eliminar Periodo",
      "¿Estás seguro de eliminar este periodo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setPeriodos(prev => prev.filter(p => p.id !== id));
            Alert.alert("Eliminado", "Periodo académico eliminado");
          },
        },
      ]
    );
  };

  const renderPeriodosLista = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Periodos Académicos</Text>
      {periodos.map(periodo => (
        <View key={periodo.id} style={[styles.periodoCard, getShadowStyle()]}>
          <View style={styles.periodoHeader}>
            <View style={styles.periodoInfo}>
              <Text style={styles.periodoNombre}>{periodo.nombre}</Text>
              <View style={styles.periodoDates}>
                <WebIcon name="calendar" size={14} color="#666" />
                <Text style={styles.periodoFecha}>
                  {periodo.fechaInicio} - {periodo.fechaFin}
                </Text>
              </View>
            </View>
            <View style={[
              styles.periodoEstado,
              { backgroundColor: `${getEstadoColor(periodo.estado)}20` }
            ]}>
              <WebIcon 
                name={getEstadoIcon(periodo.estado)} 
                size={16} 
                color={getEstadoColor(periodo.estado)} 
              />
              <Text style={[
                styles.periodoEstadoText,
                { color: getEstadoColor(periodo.estado) }
              ]}>
                {periodo.estado.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.periodoStats}>
            <View style={styles.statItem}>
              <WebIcon name="account-group" size={16} color="#2196F3" />
              <Text style={styles.statValue}>{periodo.grupos}</Text>
              <Text style={styles.statLabel}>Grupos</Text>
            </View>
            <View style={styles.statItem}>
              <WebIcon name="account" size={16} color="#4CAF50" />
              <Text style={styles.statValue}>{periodo.alumnos}</Text>
              <Text style={styles.statLabel}>Alumnos</Text>
            </View>
            <View style={styles.statItem}>
              <WebIcon 
                name={periodo.inscripcionesAbiertas ? "lock-open" : "lock"} 
                size={16} 
                color={periodo.inscripcionesAbiertas ? "#FF9800" : "#666"} 
              />
              <Text style={styles.statValue}>
                {periodo.inscripcionesAbiertas ? "Abiertas" : "Cerradas"}
              </Text>
              <Text style={styles.statLabel}>Inscripciones</Text>
            </View>
          </View>

          <View style={styles.periodoActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setEditingPeriodo(periodo);
                setFormData({
                  nombre: periodo.nombre,
                  fechaInicio: periodo.fechaInicio,
                  fechaFin: periodo.fechaFin,
                  inscripcionesAbiertas: periodo.inscripcionesAbiertas,
                });
                setModalVisible(true);
              }}
            >
              <WebIcon name="pencil" size={18} color="#2196F3" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeletePeriodo(periodo.id)}
            >
              <WebIcon name="delete" size={18} color="#F44336" />
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
            
            {periodo.estado === "programado" && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setPeriodos(prev =>
                    prev.map(p =>
                      p.id === periodo.id
                        ? { ...p, estado: "activo" }
                        : p
                    )
                  );
                  Alert.alert("Activado", "Periodo académico activado");
                }}
              >
                <WebIcon name="play" size={18} color="#4CAF50" />
                <Text style={styles.actionButtonText}>Activar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        {renderPeriodosLista()}
        
        <View style={styles.infoBox}>
          <WebIcon name="information" size={24} color="#2196F3" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Información Importante</Text>
            <Text style={styles.infoText}>
              • Solo puede haber un periodo académico activo a la vez{"\n"}
              • No se pueden eliminar periodos con datos registrados{"\n"}
              • Las fechas no deben solaparse con otros periodos
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal para crear/editar periodo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, getShadowStyle(5, 0.2, 10)]}>
            <Text style={styles.modalTitle}>
              {editingPeriodo ? "Editar Periodo" : "Nuevo Periodo"}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre del Periodo</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ej: Primavera 2024"
                value={formData.nombre}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.formLabel}>Fecha Inicio</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={formData.fechaInicio}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, fechaInicio: text }))}
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Fecha Fin</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={formData.fechaFin}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, fechaFin: text }))}
                />
              </View>
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Inscripciones abiertas</Text>
              <Switch
                value={formData.inscripcionesAbiertas}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, inscripcionesAbiertas: value }))
                }
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.inscripcionesAbiertas ? "#2196F3" : "#f4f3f4"}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePeriodo}
              >
                <Text style={styles.saveButtonText}>
                  {editingPeriodo ? "Actualizar" : "Crear"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: "#2196F3",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  periodoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  periodoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  periodoInfo: {
    flex: 1,
  },
  periodoNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  periodoDates: {
    flexDirection: "row",
    alignItems: "center",
  },
  periodoFecha: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  periodoEstado: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  periodoEstadoText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 5,
  },
  periodoStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  periodoActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  formInput: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  formRow: {
    flexDirection: "row",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
