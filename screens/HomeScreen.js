import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* 🔥 LOGO SIN FONDO */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* SECCIÓN 1 */}
      <View style={styles.card}>
        <Image
          source={require('../assets/movil.png')}
          style={styles.image}
        />

        <Text style={styles.title}>¿Quiénes somos?</Text>

        <Text style={styles.text}>
          Somos un equipo comprometido con el desarrollo de soluciones tecnológicas innovadoras enfocadas en la seguridad y el bienestar de la sociedad. Nos especializamos en la creación de herramientas accesibles, eficientes y de impacto social positivo.
        </Text>
      </View>

      {/* SECCIÓN 2 */}
      <View style={styles.card}>
        <Image
          source={require('../assets/moto.jpg')}
          style={styles.image}
        />

        <Text style={styles.title}>Visión</Text>

        <Text style={styles.text}>
          Nuestra visión es convertirnos en referentes en el desarrollo de tecnologías inteligentes para la seguridad ciudadana, contribuyendo a la construcción de comunidades más seguras mediante el uso responsable de la innovación digital.
        </Text>
      </View>

      {/* SECCIÓN 3 */}
      <View style={styles.card}>
        <Image
          source={require('../assets/calle.jpg')}
          style={styles.image}
        />

        <Text style={styles.title}>Nuestro entorno</Text>

        <Text style={styles.text}>
          Apostamos por entornos urbanos más seguros mediante el uso de herramientas tecnológicas que permitan detectar situaciones de riesgo en tiempo real.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // 🔥 blanco puro
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  // 🔥 LOGO
  logo: {
    width: '50%',
    height: 120,
    marginBottom: 20,
  },

  card: {
    width: '90%',
    backgroundColor: '#5b21b6',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: '#e0e7ff',
    textAlign: 'center',
  },
});