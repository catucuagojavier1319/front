import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { AlertContext } from '../context/AlertContext';
import { API_BASE_URL } from '../config';
import * as WebBrowser from 'expo-web-browser';

export default function HistorialScreen() {
  const { alerts, refreshFromBackend, loadingBackend } = useContext(AlertContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    refreshFromBackend();
  }, []);

  // 📄 GENERAR PDF - Abre en navegador
  const generatePDF = async (tipo) => {
    setGenerating(true);
    try {
      const url = `${API_BASE_URL}/api/reportes/pdf?tipo=${tipo}`;
      console.log('📡 Abriendo:', url);
      
      // Abrir el PDF en el navegador del celular
      await WebBrowser.openBrowserAsync(url);
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo abrir el reporte');
    } finally {
      setGenerating(false);
      setModalVisible(false);
    }
  };

  // ⏳ LOADING
  if (loadingBackend && alerts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Alertas</Text>

      {/* 🔘 BOTÓN */}
      <TouchableOpacity
        style={styles.reportBtn}
        onPress={() => setModalVisible(true)}
        disabled={generating}
      >
        <Text style={{ color: '#fff' }}>{generating ? '⏳ Generando...' : '📄 Generar Reporte'}</Text>
      </TouchableOpacity>

      {/* 🪟 MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Seleccionar tipo de reporte</Text>

            <TouchableOpacity style={styles.optionBtn} onPress={() => generatePDF('day')}>
              <Text>📅 Por Día</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={() => generatePDF('week')}>
              <Text>📆 Por Semana</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={() => generatePDF('month')}>
              <Text>🗓️ Por Mes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#fff' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 📋 LISTA */}
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imagen ? (
              <Image source={{ uri: item.imagen }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.noImage]}>
                <Text>📷 Sin imagen</Text>
              </View>
            )}

            <Text> Distancia: {item.distancia}px</Text>
            <Text> Confianza: {Math.round(item.confianza * 100)}%</Text>
            
            {/* NUEVOS CAMPOS */}
            <Text> Tipo: {item.tipo_evento || "normal"}</Text>
            <Text> Arma: {item.arma_utilizada || "ninguna"}</Text>
            <Text> Testigos: {item.testigos || 0}</Text>
            {item.descripcion && (
              <Text> {item.descripcion}</Text>
            )}
            
            {item.fecha && (
              <Text>📅 {new Date(item.fecha).toLocaleString()}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#eef2ff' },

  title: { fontSize: 22, marginBottom: 10 },

  reportBtn: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginBottom: 15,
    backgroundColor: '#e0e7ff',
  },

  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },

  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },

  optionBtn: {
    padding: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },

  closeBtn: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});