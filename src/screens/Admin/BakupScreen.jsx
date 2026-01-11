import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import WebIcon from "../../components/WebIcon";

export default function BackupScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState([
    {
      id: 1,
      nombre: "Backup Completo",
      fecha: "2024-03-15 20:00",
      tamaño: "2.4 GB",
      tipo: "completo",
      estado: "completado",
    },
    {
      id: 2,
      nombre: "Backup Base de Datos",
      fecha: "2024-03-14 20:00",
      tamaño: "1.8 GB",
      tipo: "bd",
      estado: "completado",
    },
    {
      id: 3,
      nombre: "Backup Documentos",
      fecha: "2024-03-13 20:00",
      tamaño: "600 MB",
      tipo: "documentos",
      estado: "completado",
    },
    {
      id: 4,
      nombre: "Backup Programado",
      fecha: "2024-03-15 20:00 (programado)",
      tamaño: "-",
      tipo: "programado",
      estado: "pendiente",
    },
  ]);

  const handleCreateBackup = (type) => {
    setLoading(true);
    
    Alert.alert(
      "Confirmar Copia de Seguridad",
      `¿Deseas crear una copia de seguridad ${type === "completo" ? "completa" : "de la base de datos"}?`,
      [
        { text: "Cancelar", style: "cancel", onPress: () => setLoading(false) },
        { 
          text: "Crear", 
          onPress: () => {
            // Simular creación de backup
            setTimeout(() => {
              setLoading(false);
              
              const newBackup = {
                id: backups.length + 1,
                nombre: type === "completo" ? "Backup Manual Completo" : "Backup Manual BD",
                fecha: new Date().toLocaleString(),
                tamaño: type === "completo" ? "2.5 GB" : "1.9 GB",
                tipo: type === "completo" ? "completo" : "bd",
                estado: "completado",
              };
              
              setBackups([newBackup, ...backups]);
              
              Alert.alert(
                "Copia de Seguridad Exitosa",
                `Backup ${type === "completo" ? "completo" : "de base de datos"} creado correctamente.`,
                [{ text: "OK" }]
              );
            }, 2000);
          }
        },
      ]
    );
  };

  const handleRestoreBackup = (backup) => {
    Alert.alert(
      "Restaurar Sistema",
      `¿Estás seguro de restaurar el sistema desde "${backup.nombre}"?\n\nEsta acción sobreescribirá datos actuales.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Restaurar", 
          style: "destructive",
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              Alert.alert("Éxito", "Sistema restaurado correctamente.");
            }, 3000);
          }
        },
      ]
    );
  };

  const handleDeleteBackup = (backup) => {
    Alert.alert(
      "Eliminar Backup",
      `¿Eliminar "${backup.nombre}" permanentemente?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            const updatedBackups = backups.filter(b => b.id !== backup.id);
            setBackups(updatedBackups);
            Alert.alert("Éxito", "Backup eliminado correctamente.");
          }
        },
      ]
    );
  };

  const getBackupIcon = (tipo) => {
    switch (tipo) {
      case "completo": return "database";
      case "bd": return "database-search";
      case "documentos": return "file-document-multiple";
      case "programado": return "calendar-clock";
      default: return "database";
    }
  };

  const getBackupColor = (tipo) => {
    switch (tipo) {
      case "completo": return "#007bff";
      case "bd": return "#28a745";
      case "documentos": return "#FF9800";
      case "programado": return "#9C27B0";
      default: return "#6c757d";
    }
  };

  const getEstadoColor = (estado) => {
    return estado === "completado" ? "#28a745" : 
           estado === "pendiente" ? "#FF9800" : 
           estado === "fallido" ? "#F44336" : "#6c757d";
  };

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
        <Text style={styles.headerTitle}>Copias de Seguridad</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crear Backup</Text>
          <Text style={styles.sectionDescription}>
            Crea una copia de seguridad del sistema
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: "#007bff" }]}
              onPress={() => handleCreateBackup("completo")}
              disabled={loading}
            >
              <WebIcon name="database" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Backup Completo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: "#28a745" }]}
              onPress={() => handleCreateBackup("bd")}
              disabled={loading}
            >
              <WebIcon name="database-search" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Solo Base de Datos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{backups.length}</Text>
            <Text style={styles.statLabel}>Backups</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {backups.filter(b => b.estado === "completado").length}
            </Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {backups.filter(b => b.estado === "pendiente").length}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>

        {/* Lista de Backups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Backups Existentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {backups.map((backup) => (
            <View key={backup.id} style={styles.backupCard}>
              <View style={styles.backupHeader}>
                <View style={styles.backupInfo}>
                  <View style={[styles.backupIcon, { backgroundColor: getBackupColor(backup.tipo) + "20" }]}>
                    <WebIcon 
                      name={getBackupIcon(backup.tipo)} 
                      size={20} 
                      color={getBackupColor(backup.tipo)} 
                    />
                  </View>
                  <View>
                    <Text style={styles.backupName}>{backup.nombre}</Text>
                    <Text style={styles.backupDate}>{backup.fecha}</Text>
                  </View>
                </View>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(backup.estado) + "20" }]}>
                  <Text style={[styles.estadoText, { color: getEstadoColor(backup.estado) }]}>
                    {backup.estado}
                  </Text>
                </View>
              </View>
              
              <View style={styles.backupDetails}>
                {backup.tamaño !== "-" && (
                  <View style={styles.detailItem}>
                    <WebIcon name="harddisk" size={16} color="#666" />
                    <Text style={styles.detailText}>{backup.tamaño}</Text>
                  </View>
                )}
                <View style={styles.detailItem}>
                  <WebIcon name="calendar" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {backup.tipo === "programado" ? "Programado" : "Completado"}
                  </Text>
                </View>
              </View>
              
              <View style={styles.backupActions}>
                {backup.estado === "completado" && (
                  <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => handleRestoreBackup(backup)}
                    disabled={loading}
                  >
                    <WebIcon name="backup-restore" size={20} color="#007bff" />
                    <Text style={styles.actionBtnText}>Restaurar</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate("BackupDetalle", { backup })}
                  disabled={loading}
                >
                  <WebIcon name="information" size={20} color="#666" />
                  <Text style={styles.actionBtnText}>Detalles</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleDeleteBackup(backup)}
                  disabled={loading}
                >
                  <WebIcon name="delete" size={20} color="#F44336" />
                  <Text style={styles.actionBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Configuración de Backups Automáticos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración Automática</Text>
          
          <View style={styles.configItem}>
            <View style={styles.configInfo}>
              <Text style={styles.configLabel}>Backups Automáticos</Text>
              <Text style={styles.configDescription}>
                Crear backups automáticamente cada 24 horas
              </Text>
            </View>
            <TouchableOpacity style={styles.configToggle}>
              <View style={styles.toggleCircle} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.configItem}>
            <View style={styles.configInfo}>
              <Text style={styles.configLabel}>Retención de Backups</Text>
              <Text style={styles.configDescription}>
                Conservar backups por 30 días
              </Text>
            </View>
            <TouchableOpacity style={styles.configValue}>
              <Text style={styles.valueText}>30 días</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.configItem}>
            <View style={styles.configInfo}>
              <Text style={styles.configLabel}>Almacenamiento en la Nube</Text>
              <Text style={styles.configDescription}>
                Subir backups a almacenamiento en la nube
              </Text>
            </View>
            <TouchableOpacity style={styles.configToggle}>
              <View style={styles.toggleCircle} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Información Importante */}
        <View style={styles.infoCard}>
          <WebIcon name="alert-circle" size={24} color="#FF9800" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Recomendaciones</Text>
            <Text style={styles.infoText}>
              • Crea backups completos semanalmente{"\n"}
              • Mantén al menos 3 backups recientes{"\n"}
              • Verifica la integridad de los backups regularmente{"\n"}
              • Almacena una copia fuera del servidor principal
            </Text>
          </View>
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
  headerPlaceholder: {
    width: 40,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  seeAll: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  backupCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  backupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backupInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backupName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  backupDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  backupDetails: {
    flexDirection: "row",
    marginBottom: 15,
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
  backupActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  actionBtnText: {
    fontSize: 12,
    marginLeft: 5,
  },
  configItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  configInfo: {
    flex: 1,
    marginRight: 15,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  configDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  configToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ddd",
    padding: 2,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  configValue: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  valueText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
