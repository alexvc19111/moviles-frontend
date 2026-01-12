import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper'; // 1. Importar Paper
import { GlobalProvider, useGlobalContext } from './src/context/GlobalContext'; 
import AppNavigator from './src/navigation/AppNavigator';

// 2. Componente intermedio para extraer el tema del Contexto
// Necesitamos este componente porque no puedes usar 'useGlobalContext' 
// directamente dentro del mismo componente que tiene el <GlobalProvider>
const MainContent = () => {
  const { paperTheme } = useGlobalContext(); // Extraemos el tema (Claro/Oscuro)

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

// 3. Componente Raíz
export default function App() {
  return (
    <GlobalProvider>
      <MainContent />
    </GlobalProvider>
  );
}