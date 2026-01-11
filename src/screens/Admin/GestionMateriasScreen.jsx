import React, { useState, useEffect } from "react";
import {SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, RefreshControl, ActivityIndicator, ScrollView} from "react-native";
import WebIcon from "../../components/WebIcon";

export default function GestionMateriasScreen({ navigation }) {
  const [materias, setMaterias] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [searchText, setSearchText] = useState("");
  const [selectedMateria, setSelectedMateria] = useState(null);

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    creditos: "5",
    horasSemana: "4",
    carrera: "sistemas",
    semestre: "1",
    profesor: "",
    estado: "activa",
  });

  // Datos de ejemplo
  const initialMaterias = [
    {
      id: 1,
      codigo: "MAT101",
      nombre: "Matemáticas I",
      descripcion: "Álgebra y cálculo básico",
      creditos: 5,
      horasSemana: 4,
      carrera: "sistemas",
      semestre: 1,
      profesor: "Dr. García",
      alumnosInscritos: 45,
      estado: "activa",
    },
    {
      id: 2,
      codigo: "PROG201",
      nombre: "Programación I",
      descripcion: "Introducción a la programación",
      creditos: 6,
      horasSemana: 5,
      carrera: "sistemas",
      semestre: 2,
      profesor: "Ing. Rodríguez",
      alumnosInscritos: 50,
      estado: "activa",
    },
    {
      id: 3,
      codigo: "BD301",
      nombre: "Base de Datos",
      descripcion: "Diseño e implementación de bases de datos",
      creditos: 6,
      horasSemana: 5,
      carrera: "sistemas",
      semestre: 3,
      profesor: "Mtra. López",
      alumnosInscritos: 40,
      estado: "activa",
    },
    {
      id: 4,
      codigo: "RED401",
      nombre: "Redes de Computadoras",
      descripcion: "Fundamentos de redes y comunicaciones",
      creditos: 5,
      horasSemana: 4,
      carrera: "sistemas",
      semestre: 4,
      profesor: "Ing. Martínez",
      alumnosInscritos: 35,
      estado: "inactiva",
    },
  ];

  useEffect(() => {
    loadMaterias();
  }, []);

  useEffect(() => {
    filterMaterias();
  }, [searchText, materias]);

  const loadMaterias = () => {
    setLoading(true);
    setTimeout(() => {
      setMaterias(initialMaterias);
      setFilteredMaterias(initialMaterias);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadMaterias();
      setRefreshing(false);
    }, 1500);
  };

  const filterMaterias = () => {
    if (!searchText.trim()) {
      setFilteredMaterias(materias);
      return;
    }

    const filtered = materias.filter(materia =>
      materia.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      materia.codigo.toLowerCase().includes(searchText.toLowerCase()) ||
      materia.profesor.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMaterias(filtered);
  };

  const openCreateModal = () => {
    setFormData({
      codigo: "",
      nombre: "",
      descripcion: "",
      creditos: "5",
      horasSemana: "4",
      carrera: "sistemas",
      semestre: "1",
      profesor: "",
      estado: "activa",
    });
    setModalType("create");
    setModalVisible(true);
  };

  const openEditModal = (materia) => {
    setSelectedMateria(materia);
    setFormData({
      codigo: materia.codigo,
      nombre: materia.nombre,
      descripcion: materia.descripcion,
      creditos: materia.creditos.toString(),
      horasSemana: materia.horasSemana.toString(),
      carrera: materia.carrera,
      semestre: materia.semestre.toString(),
      profesor: materia.profesor,
      estado: materia.estado,
    });
    setModalType("edit");
    setModalVisible(true);
  };

  const handleSaveMateria = () => {
    // Validaciones
    if (!formData.codigo.trim() || !formData.nombre.trim()) {
      Alert.alert("Error", "Código y nombre son obligatorios");
      return;
    }

    if (modalType === "create") {
      const newMateria = {
        id: materias.length + 1,
        ...formData,
        creditos: parseInt(formData.creditos),
        horasSemana: parseInt(formData.horasSemana),
        semestre: parseInt(formData.semestre),
        alumnosInscritos: 0,
      };
      
      setMaterias([...materias, newMateria]);
      Alert.alert("Éxito", "Materia creada correctamente");
    } else {
      const updatedMaterias = materias.map(materia =>
        materia.id === selectedMateria.id 
          ? { 
              ...materia, 
              ...formData,
              creditos: parseInt(formData.creditos),
              horasSemana: parseInt(formData.horasSemana),
              semestre: parseInt(formData.semestre),
            }
          : materia
      );
      
      setMaterias(updatedMaterias);
      Alert.alert("Éxito", "Materia actualizada correctamente");
    }

    setModalVisible(false);
  };

  const handleDeleteMateria = (materia) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de eliminar la materia "${materia.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const updatedMaterias = materias.filter(m => m.id !== materia.id);
            setMaterias(updatedMaterias);
            Alert.alert("Éxito", "Materia eliminada correctamente");
          },
        },
      ]
    );
  };

  const getEstadoColor = (estado) => {
    return estado === "activa" ? "#28a745" : "#dc3545";
  };

  const renderMateriaItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.materiaCard}
      onPress={() => navigation.navigate("MateriaDetalle", { materia: item })}
    >
      <View style={styles.materiaHeader}>
        <View style={styles.materiaInfo}>
          <Text style={styles.materiaCodigo}>{item.codigo}</Text>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoText}>
              {item.estado === "activa" ? "Activa" : "Inactiva"}
            </Text>
          </View>
        </View>
        <View style={styles.materiaActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <WebIcon name="pencil" size={20} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteMateria(item)}
          >
            <WebIcon name="delete" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.materiaNombre}>{item.nombre}</Text>
      <Text style={styles.materiaDescripcion} numberOfLines={2}>
        {item.descripcion}
      </Text>

      <View style={styles.materiaDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <WebIcon name="teach" size={16} color="#666" />
            <Text style={styles.detailText}>{item.profesor}</Text>
          </View>
          <View style={styles.detailItem}>
            <WebIcon name="account-group" size={16} color="#666" />
            <Text style={styles.detailText}>{item.alumnosInscritos} alumnos</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <WebIcon name="school" size={16} color="#666" />
            <Text style={styles.detailText}>Semestre {item.semestre}</Text>
          </View>
          <View style={styles.detailItem}>
            <WebIcon name="clock-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.horasSemana}h/semana</Text>
          </View>
          <View style={styles.detailItem}>
            <WebIcon name="credit-card" size={16} color="#666" />
            <Text style={styles.detailText}>{item.creditos} créditos</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <WebIcon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Materias</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={openCreateModal}
        >
          <WebIcon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <WebIcon name="magnify" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar materias..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{materias.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {materias.filter(m => m.estado === "activa").length}
          </Text>
          <Text style={styles.statLabel}>Activas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {materias.reduce((sum, m) => sum + m.alumnosInscritos, 0)}
          </Text>
          <Text style={styles.statLabel}>Alumnos</Text>
        </View>
      </View>

      {/* Lista de materias */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Cargando materias...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMaterias}
          renderItem={renderMateriaItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <WebIcon name="book-open-variant" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No se encontraron materias</Text>
            </View>
          }
        />
      )}

      {/* Modal de creación/edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === "create" ? "Nueva Materia" : "Editar Materia"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <WebIcon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* Código */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Código *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: MAT101"
                  value={formData.codigo}
                  onChangeText={(text) => setFormData({...formData, codigo: text.toUpperCase()})}
                />
              </View>

              {/* Nombre */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Matemáticas I"
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({...formData, nombre: text})}
                />
              </View>

              {/* Descripción */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Descripción de la materia"
                  value={formData.descripcion}
                  onChangeText={(text) => setFormData({...formData, descripcion: text})}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Créditos y Horas */}
              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Créditos</Text>
                  <View style={styles.selectContainer}>
                    <TextInput
                      style={styles.selectInput}
                      value={formData.creditos}
                      onChangeText={(text) => setFormData({...formData, creditos: text})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Horas/Semana</Text>
                  <View style={styles.selectContainer}>
                    <TextInput
                      style={styles.selectInput}
                      value={formData.horasSemana}
                      onChangeText={(text) => setFormData({...formData, horasSemana: text})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Carrera y Semestre */}
              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Carrera</Text>
                  <View style={styles.selectContainer}>
                    <TextInput
                      style={styles.selectInput}
                      value={formData.carrera}
                      onChangeText={(text) => setFormData({...formData, carrera: text})}
                      placeholder="sistemas"
                    />
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Semestre</Text>
                  <View style={styles.selectContainer}>
                    <TextInput
                      style={styles.selectInput}
                      value={formData.semestre}
                      onChangeText={(text) => setFormData({...formData, semestre: text})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Profesor */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Profesor</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del profesor"
                  value={formData.profesor}
                  onChangeText={(text) => setFormData({...formData, profesor: text})}
                />
              </View>

              {/* Estado */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Estado</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      formData.estado === "activa" && styles.statusButtonActive,
                      { borderColor: "#28a745" }
                    ]}
                    onPress={() => setFormData({...formData, estado: "activa"})}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.estado === "activa" && styles.statusButtonTextActive,
                    ]}>
                      Activa
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      formData.estado === "inactiva" && styles.statusButtonActive,
                      { borderColor: "#dc3545" }
                    ]}
                    onPress={() => setFormData({...formData, estado: "inactiva"})}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.estado === "inactiva" && styles.statusButtonTextActive,
                    ]}>
                      Inactiva
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Botones del modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveMateria}
              >
                <Text style={styles.saveButtonText}>
                  {modalType === "create" ? "Crear Materia" : "Guardar Cambios"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007bff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  listContainer: {
    padding: 20,
  },
  materiaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  materiaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  materiaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  materiaCodigo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
    marginRight: 10,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  materiaActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  materiaNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  materiaDescripcion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  materiaDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  statusButtons: {
    flexDirection: "row",
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "#28a745",
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusButtonTextActive: {
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
      
