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

  // Función para cargar alertas del backend
// context/AlertContext.js
const refreshFromBackend = async () => {
  try {
    setLoadingBackend(true);
    const response = await fetch(`${API_BASE_URL}/api/incidents/`);
    const alertasList = await response.json();
    
    // ✅ Ahora las URLs vienen directamente del backend
    const formattedAlerts = alertasList.map((alerta) => ({
      id: alerta.id.toString(),
      imagen: alerta.foto1_url,  // 👈 URL directa de S3 (no base64)
      distancia: alerta.distancia,
      confianza: alerta.moto_confianza,
      mensaje: `🚨 Estado: ${alerta.estado} | 📨 Telegram: ${alerta.telegram_enviado ? 'Enviado' : 'Pendiente'}`,
      fecha: alerta.fecha,
    }));
    
    setAlerts(formattedAlerts);
    
  } catch (error) {
    console.error('Error:', error);
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