// context/AlertContext.js
import React, { createContext, useState } from 'react';
import { API_BASE_URL } from '../config';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingBackend, setLoadingBackend] = useState(false);

  const addVideo = (video) => {
    setVideos((prev) => [video, ...prev]);
  };

  const removeVideo = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  // 📥 Función para cargar alertas del backend
  const refreshFromBackend = async () => {
    try {
      setLoadingBackend(true);
      console.log('🔄 Cargando alertas desde:', `${API_BASE_URL}/api/incidents`);
      
      const response = await fetch(`${API_BASE_URL}/api/incidents/`);
      const alertasList = await response.json();
      
      console.log('📋 Alertas recibidas:', alertasList.length);
      
      // Convertir al formato que espera HistorialScreen
      const formattedAlerts = await Promise.all(
        alertasList.map(async (alerta) => {
          try {
            const imgResponse = await fetch(`${API_BASE_URL}/api/incidents/${alerta.id}/imagenes`);
            const imgData = await imgResponse.json();
            
            return {
              id: alerta.id.toString(),
              imagen: `data:image/jpeg;base64,${imgData.foto1_base64}`,
              distancia: alerta.distancia,
              confianza: alerta.moto_confianza,
              mensaje: `🚨 Estado: ${alerta.estado} | 📨 Telegram: ${alerta.telegram_enviado ? 'Enviado' : 'Pendiente'}`,
              fecha: alerta.fecha,
            };
          } catch (error) {
            // Si no hay imagen, devolver sin imagen
            return {
              id: alerta.id.toString(),
              imagen: null,
              distancia: alerta.distancia,
              confianza: alerta.moto_confianza,
              mensaje: `🚨 Estado: ${alerta.estado} | 📨 Telegram: ${alerta.telegram_enviado ? 'Enviado' : 'Pendiente'}`,
              fecha: alerta.fecha,
            };
          }
        })
      );
      
      setAlerts(formattedAlerts);
      console.log('✅ Alertas cargadas:', formattedAlerts.length);
      
    } catch (error) {
      console.error('❌ Error cargando alertas:', error);
    } finally {
      setLoadingBackend(false);
    }
  };

  const addAlert = (videoUri) => {
    const newAlert = {
      id: Date.now().toString(),
      imagen: videoUri,
      distancia: Math.floor(Math.random() * 150),
      confianza: (Math.random() * 1).toFixed(2),
      mensaje: 'Posible arrebato detectado',
      fecha: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        videos,
        addVideo,
        removeVideo,
        refreshFromBackend,  // ← Exportar función
        loadingBackend,       // ← Exportar estado
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};