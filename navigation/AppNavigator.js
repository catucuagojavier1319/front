// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import TopTabs from './TopTabs';
import VigilanciaWebSocket from '../components/VigilanciaWebSocket';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={TopTabs} />
        {/* 👇 Agregar pantalla de Vigilancia */}
        <Stack.Screen 
          name="Vigilancia" 
          component={VigilanciaWebSocket} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}