// components/VigilanciaWebSocket.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function VigilanciaWebSocket({ onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isActive, setIsActive] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({ confidence: 0, distance: 0, state: '—' });
  const [fps, setFps] = useState(0);
  
  const cameraRef = useRef(null);
  const wsRef = useRef(null);
  const sessionIdRef = useRef(Date.now().toString());
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationRef = useRef(null);

  // Conectar WebSocket
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const connectWebSocket = () => {
    const wsUrl = 'ws://192.168.10.159:8000/api/detection/ws/' + sessionIdRef.current;
    console.log('🔌 Conectando WebSocket:', wsUrl);
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log('✅ WebSocket conectado');
      setIsConnected(true);
    };
    
    wsRef.current.onmessage = (event) => {
      const result = JSON.parse(event.data);
      setStats({
        confidence: result.confidence || 0,
        distance: result.distance || 0,
        state: result.state || '—'
      });
      
      if (result.detected) {
        Alert.alert(
          '🚨 ALERTA DE SEGURIDAD',
          `${result.message}\nDistancia: ${result.distance}px\nConfianza: ${Math.round((result.confidence || 0) * 100)}%`,
          [
            { text: 'Ver historial', onPress: onClose },
            { text: 'Continuar', style: 'cancel' },
          ]
        );
      }
    };
    
    wsRef.current.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };
    
    wsRef.current.onclose = () => {
      console.log('🔌 WebSocket desconectado');
      setIsConnected(false);
      // Intentar reconectar después de 3 segundos
      setTimeout(connectWebSocket, 3000);
    };
  };

  // Enviar frames continuamente
  useEffect(() => {
    if (isActive && isConnected && permission?.granted) {
      startSendingFrames();
    } else {
      stopSendingFrames();
    }
    return () => stopSendingFrames();
  }, [isActive, isConnected, permission]);

  const startSendingFrames = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    const sendFrame = async () => {
      if (!cameraRef.current || wsRef.current?.readyState !== WebSocket.OPEN) {
        animationRef.current = requestAnimationFrame(sendFrame);
        return;
      }
      
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.6, // Calidad más baja para mayor velocidad
        });
        
        // Calcular FPS
        const now = Date.now();
        if (now - lastTimeRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }
        frameCountRef.current++;
        
        // Enviar por WebSocket
        wsRef.current.send(JSON.stringify({ frame: photo.base64 }));
        
      } catch (error) {
        console.error('Error capturando frame:', error);
      }
      
      animationRef.current = requestAnimationFrame(sendFrame);
    };
    
    animationRef.current = requestAnimationFrame(sendFrame);
  };

  const stopSendingFrames = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Permisos
  if (!permission) {
    return <View style={styles.center}><ActivityIndicator color="#ef4444" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Se necesita acceso a la cámara</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnTxt}>Conceder permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.red]} onPress={onClose}>
          <Text style={styles.btnTxt}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar hidden />
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
      
      {/* HUD */}
      <View style={styles.overlay}>
        <View style={styles.statusBar}>
          <View style={[styles.dot, isActive && isConnected ? styles.dotOn : styles.dotOff]} />
          <Text style={styles.statusText}>
            {isActive && isConnected ? 'VIDEO EN VIVO' : isActive ? 'CONECTANDO...' : 'DETENIDO'}
          </Text>
          <Text style={styles.fpsText}>{fps} fps</Text>
        </View>
        
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>🎯 Confianza: {Math.round(stats.confidence * 100)}%</Text>
          <Text style={styles.statsText}>📏 Distancia: {stats.distance}px</Text>
          <Text style={styles.statsText}>📊 Estado: {stats.state}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.btn, isActive ? styles.red : styles.green]}
            onPress={() => setIsActive(!isActive)}
          >
            <Text style={styles.btnTxt}>{isActive ? '⏹ DETENER' : '▶ INICIAR'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.red]} onPress={onClose}>
            <Text style={styles.btnTxt}>✕ CERRAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  info: { color: '#fff', fontSize: 18, marginBottom: 20 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', paddingTop: 50, paddingBottom: 40 },
  statusBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, alignSelf: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotOn: { backgroundColor: '#22c55e' },
  dotOff: { backgroundColor: '#ef4444' },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  fpsText: { color: '#aaa', fontSize: 12 },
  statsBar: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, marginHorizontal: 20, borderRadius: 12, alignItems: 'center' },
  statsText: { color: '#fff', fontSize: 12, marginVertical: 2 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  btn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 40, minWidth: 130, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  red: { backgroundColor: '#ef4444' },
  green: { backgroundColor: '#22c55e' },
});