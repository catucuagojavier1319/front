import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import EnVivoScreen from '../screens/EnVivoScreen';
import HistorialScreen from '../screens/HistorialScreen';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowIcon: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#007AFF',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="EnVivo"
        component={EnVivoScreen}
        options={{
          tabBarLabel: 'En Vivo',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="video" color={color} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name="Historial"
        component={HistorialScreen}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" color={color} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}