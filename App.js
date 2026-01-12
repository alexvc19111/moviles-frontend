// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GlobalProvider } from './src/context/GlobalContext'; // Nueva importación
import AppNavigator from './src/navigation/AppNavigator';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

export default function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <ForgotPasswordScreen />
      </NavigationContainer>
    </GlobalProvider>
  );
}