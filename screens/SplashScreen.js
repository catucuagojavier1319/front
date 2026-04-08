import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const progress = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 7000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      navigation.replace('Main');
    }, 7000);
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ImageBackground
      source={require('../assets/fondo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progress, { width: widthInterpolated }]}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height, // 🔥 FORZAMOS altura completa en web
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    // 🔥 fondo más claro encima de la imagen
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  logo: {
    width: '40%',
    height: '20%',
    marginBottom: 30,
  },
  progressBar: {
    width: '60%',
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
});