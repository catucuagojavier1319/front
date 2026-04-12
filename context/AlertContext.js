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
    
    const formattedAlerts = alertasList.map((alerta) => ({
      id: alerta.id.toString(),
      imagen: alerta.foto1_url,
      distancia: alerta.distancia,
      confianza: alerta.moto_confianza,
      fecha: alerta.fecha,
      tipo_evento: alerta.tipo_evento || "normal",
      arma_utilizada: alerta.arma_utilizada || "ninguna",
      testigos: alerta.testigos || 0,
      descripcion: alerta.descripcion || ""
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