import React, { useState } from "react";
import {SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions} from "react-native";
import WebIcon from "../../components/WebIcon";

const { width } = Dimensions.get("window");

export default function ReportesScreen({ navigation }) {
  const [reportType, setReportType] = useState("general");

  // Datos de ejemplo para reportes
  const reportData = {
    general: {
      totalAlumnos: 1250,
      totalProfesores: 85,
      totalMaterias: 45,
      promedioGeneral: 8.2,
      asistenciaPromedio: 92,
    },
    academicos: {
      mejoresPromedios: [
        { nombre: "Ana García", promedio: 9.8, carrera: "Sistemas" },
        { nombre: "Carlos Ruiz", promedio: 9.7, carrera: "Industrial" },
        { nombre: "María López", promedio: 9.6, carrera: "Sistemas" },
      ],
      materiasMasCursadas: [
        { materia: "Matemáticas I", alumnos: 150 },
        { materia: "Programación I", alumnos: 145 },
        { materia: "Base de Datos", alumnos: 130 },
      ],
    },
    finanzas: {
      ingresosMensuales: 250000,
      egresosMensuales: 180000,
      saldo: 70000,
      morosidad: 12, // porcentaje
    },
  };

  const reportTypes = [
    { id: "general", label: "General", icon: "chart-bar" },
    { id: "academicos", label: "Académicos", icon: "school" },
    { id: "finanzas", label: "Finanzas", icon: "cash" },
    { id: "asistencia", label: "Asistencia", icon: "calendar-check" },
  ];

  const renderReportCards = () => {
    switch (reportType) {
      case "general":
        return (
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
                  <WebIcon name="account-school" size={24} color="#2196F3" />
                </View>
                <Text style={styles.statValue}>{reportData.general.totalAlumnos}</Text>
                <Text style={styles.statLabel}>Total Alumnos</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: "#E8F5E9" }]}>
                  <WebIcon name="teach" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.statValue}>{reportData.general.totalProfesores}</Text>
                <Text style={styles.statLabel}>Profesores</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: "#FFF3E0" }]}>
                  <WebIcon name="book-open" size={24} color="#FF9800" />
                </View>
                <Text style={styles.statValue}>{reportData.general.totalMaterias}</Text>
                <Text style={styles.statLabel}>Materias</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: "#F3E5F5" }]}>
                  <WebIcon name="chart-line" size={24} color="#9C27B0" />
                </View>
                <Text style={styles.statValue}>{reportData.general.promedioGeneral.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Promedio General</Text>
              </View>
            </View>
          </View>
        );

      case "academicos":
        return (
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Reportes Académicos</Text>
            
            <View style={styles.reportCard}>
              <Text style={styles.reportCardTitle}>Mejores Promedios</Text>
              {reportData.academicos.mejoresPromedios.map((alumno, index) => (
                <View key={index} style={styles.rankingItem}>
                  <View style={styles.rankingPosition}>
                    <Text style={styles.rankingNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.rankingInfo}>
                    <Text style={styles.rankingName}>{alumno.nombre}</Text>
                    <Text style={styles.rankingDetail}>{alumno.carrera}</Text>
                  </View>
                  <View style={styles.rankingScore}>
                    <Text style={styles.rankingValue}>{alumno.promedio.toFixed(1)}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.reportCard}>
              <Text style={styles.reportCardTitle}>Materias Más Cursadas</Text>
              {reportData.academicos.materiasMasCursadas.map((materia, index) => (
                <View key={index} style={styles.materiaItem}>
                  <Text style={styles.materiaName}>{materia.materia}</Text>
                  <View style={styles.materiaStats}>
                    <Text style={styles.materiaCount}>{materia.alumnos} alumnos</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );

      case "finanzas":
        return (
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Reportes Financieros</Text>
            
            <View style={styles.financeCard}>
              <View style={styles.financeRow}>
                <View style={styles.financeItem}>
                  <Text style={styles.financeLabel}>Ingresos Mensuales</Text>
                  <Text style={[styles.financeValue, { color: "#4CAF50" }]}>
                    ${reportData.finanzas.ingresosMensuales.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.financeItem}>
                  <Text style={styles.financeLabel}>Egresos Mensuales</Text>
                  <Text style={[styles.financeValue, { color: "#F44336" }]}>
                    ${reportData.finanzas.egresosMensuales.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.financeRow}>
                <View style={styles.financeItem}>
                  <Text style={styles.financeLabel}>Saldo Actual</Text>
                  <Text style={[styles.financeValue, { color: "#2196F3" }]}>
                    ${reportData.finanzas.saldo.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.financeItem}>
                  <Text style={styles.financeLabel}>Morosidad</Text>
                  <Text style={[styles.financeValue, { color: "#FF9800" }]}>
                    {reportData.finanzas.morosidad}%
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.reportCard}>
              <Text style={styles.reportCardTitle}>Resumen Financiero</Text>
              <Text style={styles.reportText}>
                El sistema presenta un saldo positivo con una morosidad del {reportData.finanzas.morosidad}%. 
                Se recomienda implementar estrategias para reducir la morosidad estudiantil.
              </Text>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Selecciona un tipo de reporte</Text>
          </View>
        );
    }
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
        <Text style={styles.headerTitle}>Reportes del Sistema</Text>
        <TouchableOpacity style={styles.exportButton}>
          <WebIcon name="download" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Tipo de reporte */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.reportTypesContainer}
      >
        {reportTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.reportTypeButton,
              reportType === type.id && styles.reportTypeButtonActive,
            ]}
            onPress={() => setReportType(type.id)}
          >
            <WebIcon 
              name={type.icon} 
              size={20} 
              color={reportType === type.id ? "#fff" : "#666"} 
            />
            <Text style={[
              styles.reportTypeText,
              reportType === type.id && styles.reportTypeTextActive,
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenido del reporte */}
      <ScrollView style={styles.content}>
        {renderReportCards()}

        {/* Acciones */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <WebIcon name="printer" size={24} color="#666" />
              <Text style={styles.actionButtonText}>Imprimir Reporte</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <WebIcon name="file-pdf" size={24} color="#F44336" />
              <Text style={styles.actionButtonText}>Exportar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <WebIcon name="file-excel" size={24} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Exportar Excel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información */}
        <View style={styles.infoCard}>
          <WebIcon name="information" size={24} color="#007bff" />
          <Text style={styles.infoText}>
            Los reportes se actualizan automáticamente cada 24 horas.
            Para información en tiempo real, actualiza manualmente.
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
  exportButton: {
    padding: 10,
  },
  reportTypesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  reportTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f9fa",
  },
  reportTypeButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  reportTypeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  reportTypeTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  reportSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rankingPosition: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  rankingNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  rankingDetail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  rankingScore: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rankingValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
  materiaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  materiaName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  materiaStats: {
    marginLeft: 10,
  },
  materiaCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  financeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  financeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  financeItem: {
    flex: 1,
    alignItems: "center",
  },
  financeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  financeValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  reportText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
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
  actionButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f4ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#007bff",
    lineHeight: 20,
  },
});
