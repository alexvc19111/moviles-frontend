// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GlobalProvider } from './src/context/GlobalContext'; // Nueva importación
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GlobalProvider>
  );
}