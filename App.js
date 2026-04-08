import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AlertProvider } from './context/AlertContext';

export default function App() {
  return (
    <AlertProvider>
      <AppNavigator />
    </AlertProvider>
  );
}