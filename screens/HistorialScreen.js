import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { AlertContext } from '../context/AlertContext';

export default function HistorialScreen() {
  const { alerts, refreshFromBackend, loadingBackend } = useContext(AlertContext);

  //  Cargar automáticamente al entrar a la pantalla
  useEffect(() => {
    console.log('📱 HistorialScreen - Cargando alertas...');
    refreshFromBackend();
  }, []);


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
      <Text style={styles.title}> Historial de Alertas</Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* 📷 Imagen - Ajusta el tamaño aquí */}
            {item.imagen ? (
              <Image 
                source={{ uri: item.imagen }} 
                style={styles.image}
                resizeMode="cover" // Opciones: 'cover', 'contain', 'stretch', 'center'
              />
            ) : (
              <View style={[styles.image, styles.noImage]}>
                <Text>📷 Sin imagen disponible</Text>
              </View>
            )}

            {/* 📊 Datos */}
            <Text style={styles.distance}> Distancia: {item.distancia}px</Text>
            <Text style={styles.confidence}> Confianza: {Math.round(item.confianza * 100)}%</Text>
            {item.fecha && (
              <Text style={styles.dateText}>
                📅 {new Date(item.fecha).toLocaleString()}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭 No hay alertas</Text>
            <Text style={styles.emptySubtext}>
              Las alertas aparecerán aquí cuando se detecten incidentes
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef2ff',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
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
  downloadBtn: {
    marginTop: 10,
    backgroundColor: '#7c3aed',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 1,
  },
});