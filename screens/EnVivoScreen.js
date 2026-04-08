import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function EnVivoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Vigilancia Activa</Text>
      
      <Text style={styles.description}>
        Al iniciar la vigilancia, la cámara se activará y funcionará como un sistema de vigilancia en tiempo real.
      </Text>
      
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Vigilancia')}
      >
        <Text style={styles.startButtonText}> Iniciar Vigilancia</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#eef2ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 40,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 10,
    width: '70%',
  },
  videoBox: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#dbeafe',
  },
  delete: {
    color: 'red',
    marginTop: 5,
  },
});