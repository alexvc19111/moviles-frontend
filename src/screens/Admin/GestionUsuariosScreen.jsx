import React, { useState, useEffect } from "react";
import {SafeAreaView, View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl, ActivityIndicator} from "react-native";
import WebIcon from "../../components/WebIcon";

export default function GestionUsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" o "edit"
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "alumno",
    matricula: "",
    telefono: "",
    estado: "activo",
  });

  // Datos de ejemplo
  const initialUsers = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "alumno@escuela.com",
      rol: "alumno",
      matricula: "A2023001",
      telefono: "555-1234",
      estado: "activo",
      fechaRegistro: "2023-08-15",
    },
    {
      id: 2,
      nombre: "María García",
      email: "profesor@escuela.com",
      rol: "profesor",
      departamento: "Ciencias",
      telefono: "555-5678",
      estado: "activo",
      fechaRegistro: "2023-07-20",
    },
    {
      id: 3,
      nombre: "Admin Sistema",
      email: "admin@escuela.com",
      rol: "admin",
      telefono: "555-9012",
      estado: "activo",
      fechaRegistro: "2023-06-10",
    },
    {
      id: 4,
      nombre: "Carlos López",
      email: "carlos@escuela.com",
      rol: "alumno",
      matricula: "A2023002",
      telefono: "555-3456",
      estado: "inactivo",
      fechaRegistro: "2023-09-05",
    },
  ];

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    filterUsuarios();
  }, [searchText, usuarios]);

  const loadUsuarios = () => {
    setLoading(true);
    setTimeout(() => {
      setUsuarios(initialUsers);
      setFilteredUsuarios(initialUsers);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadUsuarios();
      setRefreshing(false);
    }, 1500);
  };

  const filterUsuarios = () => {
    if (!searchText.trim()) {
      setFilteredUsuarios(usuarios);
      return;
    }

    const filtered = usuarios.filter(user =>
      user.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.matricula?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.rol.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  };

  const openCreateModal = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      rol: "alumno",
      matricula: "",
      telefono: "",
      estado: "activo",
    });
    setModalType("create");
    setModalVisible(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: "", // No mostrar contraseña actual
      rol: user.rol,
      matricula: user.matricula || "",
      telefono: user.telefono || "",
      estado: user.estado,
    });
    setModalType("edit");
    setModalVisible(true);
  };

  const handleSaveUser = () => {
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.email.trim()) {
      Alert.alert("Error", "Nombre y correo son obligatorios");
      return;
    }

    if (modalType === "create" && !formData.password.trim()) {
      Alert.alert("Error", "La contraseña es obligatoria para nuevos usuarios");
      return;
    }

    if (modalType === "create") {
      // Crear nuevo usuario
      const newUser = {
        id: usuarios.length + 1,
        ...formData,
        fechaRegistro: new Date().toISOString().split('T')[0],
      };
      
      setUsuarios([...usuarios, newUser]);
      Alert.alert("Éxito", "Usuario creado correctamente");
    } else {
      // Editar usuario existente
      const updatedUsers = usuarios.map(user =>
        user.id === selectedUser.id ? { ...user, ...formData } : user
      );
      
      setUsuarios(updatedUsers);
      Alert.alert("Éxito", "Usuario actualizado correctamente");
    }

    setModalVisible(false);
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de eliminar a ${user.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const updatedUsers = usuarios.filter(u => u.id !== user.id);
            setUsuarios(updatedUsers);
            Alert.alert("Éxito", "Usuario eliminado correctamente");
          },
        },
      ]
    );
  };

  const toggleUserStatus = (user) => {
    const updatedUsers = usuarios.map(u =>
      u.id === user.id 
        ? { ...u, estado: u.estado === "activo" ? "inactivo" : "activo" }
        : u
    );
    
    setUsuarios(updatedUsers);
    const newStatus = user.estado === "activo" ? "inactivo" : "activo";
    Alert.alert("Éxito", `Usuario ${newStatus === "activo" ? "activado" : "desactivado"}`);
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case "admin": return "#6f42c1";
      case "profesor": return "#007bff";
      case "alumno": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getEstadoColor = (estado) => {
    return estado === "activo" ? "#28a745" : "#dc3545";
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.rolBadge, { backgroundColor: getRolColor(item.rol) }]}>
            <Text style={styles.rolText}>
              {item.rol === "admin" ? "👑 Admin" : 
               item.rol === "profesor" ? "👨‍🏫 Prof" : "🎓 Alumno"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.statusText}>
              {item.estado === "activo" ? "Activo" : "Inactivo"}
            </Text>
          </View>
        </View>
        <View style={styles.userActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleUserStatus(item)}
          >
            <WebIcon 
              name={item.estado === "activo" ? "account-off" : "account-check"} 
              size={20} 
              color={item.estado === "activo" ? "#dc3545" : "#28a745"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <WebIcon name="pencil" size={20} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteUser(item)}
          >
            <WebIcon name="delete" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.userName}>{item.nombre}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      
      <View style={styles.userDetails}>
        {item.matricula && (
          <View style={styles.detailItem}>
            <WebIcon name="identifier" size={16} color="#666" />
            <Text style={styles.detailText}>Matrícula: {item.matricula}</Text>
          </View>
        )}
        {item.telefono && (
          <View style={styles.detailItem}>
            <WebIcon name="phone" size={16} color="#666" />
            <Text style={styles.detailText}>Tel: {item.telefono}</Text>
          </View>
        )}
        <View style={styles.detailItem}>
          <WebIcon name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>Registro: {item.fechaRegistro}</Text>
        </View>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
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
            placeholder="Buscar por nombre, email o matrícula..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <WebIcon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Todos ({usuarios.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Alumnos ({usuarios.filter(u => u.rol === "alumno").length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Profesores ({usuarios.filter(u => u.rol === "profesor").length})</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de usuarios */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsuarios}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <WebIcon name="account-multiple" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No se encontraron usuarios</Text>
              <Text style={styles.emptySubtext}>
                {searchText ? "Intenta con otros términos de búsqueda" : "Presiona + para agregar un usuario"}
              </Text>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === "create" ? "Nuevo Usuario" : "Editar Usuario"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <WebIcon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Nombre */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nombre completo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Juan Pérez García"
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({...formData, nombre: text})}
                />
              </View>

              {/* Email */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Correo electrónico *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@escuela.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Contraseña (solo para creación) */}
              {modalType === "create" && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Contraseña *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})}
                    secureTextEntry
                  />
                </View>
              )}

              {/* Rol */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Rol *</Text>
                <View style={styles.roleButtons}>
                  {["alumno", "profesor", "admin"].map((rol) => (
                    <TouchableOpacity
                      key={rol}
                      style={[
                        styles.roleButton,
                        formData.rol === rol && styles.roleButtonActive,
                        { borderColor: getRolColor(rol) }
                      ]}
                      onPress={() => setFormData({...formData, rol})}
                    >
                      <Text style={[
                        styles.roleButtonText,
                        formData.rol === rol && styles.roleButtonTextActive,
                        { color: formData.rol === rol ? "#fff" : getRolColor(rol) }
                      ]}>
                        {rol === "admin" ? "Administrador" : 
                         rol === "profesor" ? "Profesor" : "Alumno"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Matrícula (solo para alumnos) */}
              {formData.rol === "alumno" && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Matrícula</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: A2023001"
                    value={formData.matricula}
                    onChangeText={(text) => setFormData({...formData, matricula: text.toUpperCase()})}
                  />
                </View>
              )}

              {/* Teléfono */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 555-123-4567"
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({...formData, telefono: text})}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Estado */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Estado</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      formData.estado === "activo" && styles.statusButtonActive,
                      { borderColor: "#28a745" }
                    ]}
                    onPress={() => setFormData({...formData, estado: "activo"})}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.estado === "activo" && styles.statusButtonTextActive,
                    ]}>
                      Activo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      formData.estado === "inactivo" && styles.statusButtonActive,
                      { borderColor: "#dc3545" }
                    ]}
                    onPress={() => setFormData({...formData, estado: "inactivo"})}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.estado === "inactivo" && styles.statusButtonTextActive,
                    ]}>
                      Inactivo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

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
                onPress={handleSaveUser}
              >
                <Text style={styles.saveButtonText}>
                  {modalType === "create" ? "Crear Usuario" : "Guardar Cambios"}
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  listContainer: {
    padding: 20,
  },
  userCard: {
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
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
  },
  rolBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  rolText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  userActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  userDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
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
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
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
    width: "90%",
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    maxHeight: 400,
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
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#007bff",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  roleButtonTextActive: {
    color: "#fff",
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
