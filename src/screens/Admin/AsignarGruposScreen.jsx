import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Alert} from "react-native";
import WebIcon from "../../components/WebIcon";
import { getShadowStyle } from "../../utils/shadowStyles"; // Asegúrate de crear esta utilidad

export default function AsignarGruposScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [grupos, setGrupos] = useState([
    { id: 1, nombre: "Grupo A", materia: "Matemáticas", capacidad: 30, alumnos: 25, profesor: "Prof. García" },
    { id: 2, nombre: "Grupo B", materia: "Física", capacidad: 25, alumnos: 20, profesor: "Prof. Rodríguez" },
    { id: 3, nombre: "Grupo C", materia: "Química", capacidad: 35, alumnos: 30, profesor: "Prof. Martínez" },
    { id: 4, nombre: "Grupo D", materia: "Programación", capacidad: 40, alumnos: 38, profesor: "Prof. López" },
  ]);

  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: "Juan Pérez", matricula: "2023001", carrera: "Ing. Software", grupoActual: null },
    { id: 2, nombre: "María García", matricula: "2023002", carrera: "Ing. Civil", grupoActual: "Grupo A" },
    { id: 3, nombre: "Carlos López", matricula: "2023003", carrera: "Administración", grupoActual: null },
    { id: 4, nombre: "Ana Martínez", matricula: "2023004", carrera: "Medicina", grupoActual: "Grupo B" },
    { id: 5, nombre: "Pedro Rodríguez", matricula: "2023005", carrera: "Derecho", grupoActual: null },
    { id: 6, nombre: "Laura Sánchez", matricula: "2023006", carrera: "Arquitectura", grupoActual: "Grupo C" },
  ]);

  const [busqueda, setBusqueda] = useState("");

  const handleAsignarGrupo = (alumnoId, grupoId) => {
    const grupo = grupos.find(g => g.id === grupoId);
    const alumno = alumnos.find(a => a.id === alumnoId);

    if (grupo.alumnos >= grupo.capacidad) {
      Alert.alert("Capacidad llena", `El grupo ${grupo.nombre} está lleno`);
      return;
    }

    setAlumnos(prev =>
      prev.map(alumno =>
        alumno.id === alumnoId
          ? { ...alumno, grupoActual: grupo.nombre }
          : alumno
      )
    );

    setGrupos(prev =>
      prev.map(g =>
        g.id === grupoId ? { ...g, alumnos: g.alumnos + 1 } : g
      )
    );

    Alert.alert("Asignación exitosa", `${alumno.nombre} asignado a ${grupo.nombre}`);
    setModalVisible(false);
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
        <Text style={styles.headerTitle}>Asignar Grupos</Text>
        <Text style={styles.headerSubtitle}>Gestión de asignación de alumnos</Text>
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => Alert.alert("Filtros", "Opciones de filtrado")}
      >
        <WebIcon name="filter" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderGruposDisponibles = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Grupos Disponibles</Text>
      <View style={styles.gruposContainer}>
        {grupos.map(grupo => (
          <View key={grupo.id} style={[styles.grupoCard, getShadowStyle()]}>
            <View style={styles.grupoHeader}>
              <View style={styles.grupoIconContainer}>
                <WebIcon name="account-group" size={24} color="#2196F3" />
              </View>
              <View style={styles.grupoInfo}>
                <Text style={styles.grupoNombre}>{grupo.nombre}</Text>
                <Text style={styles.grupoMateria}>{grupo.materia}</Text>
              </View>
              <View style={styles.grupoStats}>
                <Text style={styles.grupoCapacidad}>
                  {grupo.alumnos}/{grupo.capacidad}
                </Text>
                <Text style={styles.grupoLabel}>Alumnos</Text>
              </View>
            </View>
            <View style={styles.grupoFooter}>
              <Text style={styles.grupoProfesor}>Prof. {grupo.profesor}</Text>
              <View style={[
                styles.grupoEstado,
                { backgroundColor: grupo.alumnos >= grupo.capacidad ? "#FFCDD2" : "#C8E6C9" }
              ]}>
                <Text style={[
                  styles.grupoEstadoText,
                  { color: grupo.alumnos >= grupo.capacidad ? "#D32F2F" : "#388E3C" }
                ]}>
                  {grupo.alumnos >= grupo.capacidad ? "Lleno" : "Disponible"}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAlumnosLista = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Alumnos sin Grupo</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alumno..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>
      <FlatList
        data={alumnos.filter(a => !a.grupoActual && a.nombre.toLowerCase().includes(busqueda.toLowerCase()))}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.alumnoCard, getShadowStyle()]}
            onPress={() => {
              setSelectedAlumno(item);
              setModalVisible(true);
            }}
          >
            <View style={styles.alumnoInfo}>
              <View style={styles.alumnoAvatar}>
                <WebIcon name="account" size={20} color="#fff" />
              </View>
              <View style={styles.alumnoDetails}>
                <Text style={styles.alumnoNombre}>{item.nombre}</Text>
                <Text style={styles.alumnoMatricula}>Matrícula: {item.matricula}</Text>
                <Text style={styles.alumnoCarrera}>{item.carrera}</Text>
              </View>
            </View>
            <View style={styles.alumnoActions}>
              <WebIcon name="account-plus" size={24} color="#2196F3" />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <WebIcon name="check-circle" size={50} color="#4CAF50" />
            <Text style={styles.emptyText}>Todos los alumnos tienen grupo asignado</Text>
          </View>
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        {renderGruposDisponibles()}
        {renderAlumnosLista()}
      </ScrollView>

      {/* Modal para asignar grupo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, getShadowStyle(5, 0.2, 10)]}>
            <Text style={styles.modalTitle}>Asignar Grupo</Text>
            <Text style={styles.modalSubtitle}>
              Selecciona un grupo para {selectedAlumno?.nombre}
            </Text>

            <FlatList
              data={grupos.filter(g => g.alumnos < g.capacidad)}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalGrupoItem}
                  onPress={() => handleAsignarGrupo(selectedAlumno?.id, item.id)}
                >
                  <View style={styles.modalGrupoInfo}>
                    <Text style={styles.modalGrupoNombre}>{item.nombre}</Text>
                    <Text style={styles.modalGrupoDetails}>
                      {item.materia} • {item.alumnos}/{item.capacidad} alumnos
                    </Text>
                  </View>
                  <WebIcon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  filterButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
  },
  gruposContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  grupoCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  grupoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  grupoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  grupoInfo: {
    flex: 1,
  },
  grupoNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  grupoMateria: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  grupoStats: {
    alignItems: "center",
  },
  grupoCapacidad: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  grupoLabel: {
    fontSize: 10,
    color: "#999",
  },
  grupoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  grupoProfesor: {
    fontSize: 12,
    color: "#666",
  },
  grupoEstado: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  grupoEstadoText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  alumnoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  alumnoInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  alumnoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6f42c1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alumnoDetails: {
    flex: 1,
  },
  alumnoNombre: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  alumnoMatricula: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  alumnoCarrera: {
    fontSize: 12,
    color: "#2196F3",
    marginTop: 2,
  },
  alumnoActions: {
    paddingLeft: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  modalGrupoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalGrupoInfo: {
    flex: 1,
  },
  modalGrupoNombre: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  modalGrupoDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  modalButtons: {
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
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
});
