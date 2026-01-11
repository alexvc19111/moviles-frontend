import React, { useState } from "react";
import {SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert} from "react-native";
import WebIcon from "../../components/WebIcon";

export default function ConfiguracionScreen({ navigation }) {
  const [settings, setSettings] = useState({
    // Sistema
    mantenimiento: false,
    registroAutomatico: true,
    notificacionesPush: true,
    
    // Seguridad
    autenticacionDosFactores: false,
    sesionesMultiples: true,
    bloqueoIntentos: true,
    
    // Académico
    calificacionMinima: 7,
    asistenciaMinima: 80,
    diasEntrega: 3,
    
    // Notificaciones
    emailCalificaciones: true,
    emailAsistencias: true,
    emailAvisos: true,
  });

  const toggleSwitch = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    Alert.alert(
      "Configuración Guardada",
      "Los cambios han sido guardados exitosamente.",
      [{ text: "OK" }]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      "Copia de Seguridad",
      "¿Deseas crear una copia de seguridad ahora?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Crear Backup", onPress: () => {
          Alert.alert("Éxito", "Copia de seguridad creada correctamente.");
        }},
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert(
      "Restaurar Sistema",
      "Esta acción restaurará la configuración a valores por defecto. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Restaurar", style: "destructive", onPress: () => {
          Alert.alert("Éxito", "Sistema restaurado a valores por defecto.");
        }},
      ]
    );
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
        <Text style={styles.headerTitle}>Configuración del Sistema</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Sección: Sistema */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <WebIcon name="cog" size={20} color="#007bff" />
            <Text style={styles.sectionTitle}>Sistema</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Modo Mantenimiento</Text>
              <Text style={styles.settingDescription}>
                Bloquea el acceso general al sistema
              </Text>
            </View>
            <Switch
              value={settings.mantenimiento}
              onValueChange={() => toggleSwitch("mantenimiento")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.mantenimiento ? "#007bff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Registro Automático</Text>
              <Text style={styles.settingDescription}>
                Registra automáticamente las actividades del sistema
              </Text>
            </View>
            <Switch
              value={settings.registroAutomatico}
              onValueChange={() => toggleSwitch("registroAutomatico")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.registroAutomatico ? "#007bff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notificaciones Push</Text>
              <Text style={styles.settingDescription}>
                Envía notificaciones en tiempo real
              </Text>
            </View>
            <Switch
              value={settings.notificacionesPush}
              onValueChange={() => toggleSwitch("notificacionesPush")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.notificacionesPush ? "#007bff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Sección: Seguridad */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <WebIcon name="shield" size={20} color="#28a745" />
            <Text style={styles.sectionTitle}>Seguridad</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Autenticación 2 Factores</Text>
              <Text style={styles.settingDescription}>
                Requiere código adicional para iniciar sesión
              </Text>
            </View>
            <Switch
              value={settings.autenticacionDosFactores}
              onValueChange={() => toggleSwitch("autenticacionDosFactores")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.autenticacionDosFactores ? "#007bff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sesiones Múltiples</Text>
              <Text style={styles.settingDescription}>
                Permite múltiples sesiones simultáneas
              </Text>
            </View>
            <Switch
              value={settings.sesionesMultiples}
              onValueChange={() => toggleSwitch("sesionesMultiples")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.sesionesMultiples ? "#007bff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Bloqueo por Intentos</Text>
              <Text style={styles.settingDescription}>
                Bloquea cuenta tras 5 intentos fallidos
              </Text>
            </View>
            <Switch
              value={settings.bloqueoIntentos}
              onValueChange={() => toggleSwitch("bloqueoIntentos")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.bloqueoIntentos ? "#007bff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Sección: Académico */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <WebIcon name="school" size={20} color="#FF9800" />
            <Text style={styles.sectionTitle}>Académico</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Calificación Mínima Aprobatoria</Text>
              <Text style={styles.settingDescription}>
                Puntaje mínimo para aprobar una materia
              </Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{settings.calificacionMinima}</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Asistencia Mínima Requerida</Text>
              <Text style={styles.settingDescription}>
                Porcentaje mínimo de asistencia
              </Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{settings.asistenciaMinima}%</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Días para Entrega de Calificaciones</Text>
              <Text style={styles.settingDescription}>
                Plazo para registrar calificaciones después del examen
              </Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{settings.diasEntrega} días</Text>
            </View>
          </View>
        </View>

        {/* Sección: Notificaciones por Email */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <WebIcon name="email" size={20} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Notificaciones por Email</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Calificaciones</Text>
              <Text style={styles.settingDescription}>
                Envía email al registrar calificaciones
              </Text>
            </View>
            <Switch
              value={settings.emailCalificaciones}
              onValueChange={() => toggleSwitch("emailCalificaciones")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.emailCalificaciones ? "#007bff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Asistencias</Text>
              <Text style={styles.settingDescription}>
                Envía email con reporte de asistencias
              </Text>
            </View>
            <Switch
              value={settings.emailAsistencias}
              onValueChange={() => toggleSwitch("emailAsistencias")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.emailAsistencias ? "#007bff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Avisos del Sistema</Text>
              <Text style={styles.settingDescription}>
                Envía email con avisos importantes
              </Text>
            </View>
            <Switch
              value={settings.emailAvisos}
              onValueChange={() => toggleSwitch("emailAvisos")}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.emailAvisos ? "#007bff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Sección: Acciones del Sistema */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <WebIcon name="backup-restore" size={20} color="#607D8B" />
            <Text style={styles.sectionTitle}>Acciones del Sistema</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleBackup}>
            <View style={styles.actionIcon}>
              <WebIcon name="database-export" size={24} color="#007bff" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Copia de Seguridad</Text>
              <Text style={styles.actionDescription}>
                Crea un respaldo completo del sistema
              </Text>
            </View>
            <WebIcon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleRestore}>
            <View style={styles.actionIcon}>
              <WebIcon name="database-restore" size={24} color="#28a745" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Restaurar Sistema</Text>
              <Text style={styles.actionDescription}>
                Restaura valores por defecto
              </Text>
            </View>
            <WebIcon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <WebIcon name="file-document" size={24} color="#FF9800" />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Registros del Sistema</Text>
              <Text style={styles.actionDescription}>
                Ver logs y actividades del sistema
              </Text>
            </View>
            <WebIcon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Información del Sistema */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <WebIcon name="information" size={24} color="#007bff" />
            <Text style={styles.infoTitle}>Información del Sistema</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versión:</Text>
            <Text style={styles.infoValue}>3.2.1</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Última Actualización:</Text>
            <Text style={styles.infoValue}>15/03/2024</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Base de Datos:</Text>
            <Text style={styles.infoValue}>MySQL 8.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Usuarios Activos:</Text>
            <Text style={styles.infoValue}>342</Text>
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
  saveButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
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
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  valueContainer: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionIcon: {
    marginRight: 15,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
