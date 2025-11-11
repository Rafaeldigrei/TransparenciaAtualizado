// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';

import { ThemeProvider } from './src/context/ThemeContext';
import { auth } from './src/firebase'; // importa o auth do Firebase

// Telas
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScheduleExamScreen from './src/screens/ScheduleExamScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MyAppointmentsScreen from './src/screens/MyAppointmentsScreen';
import VerExames from './src/screens/VerExames';
import MeusMedicamentos from './src/screens/MeusMedicamentos';
import MeuPerfilScreen from './src/screens/MeuPerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = carregando
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ouve o estado do login
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // remove listener ao desmontar
  }, []);

  if (loading || user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // 🔒 Usuário logado → mostra o app completo
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="ScheduleExam" component={ScheduleExamScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
              <Stack.Screen name="VerExames" component={VerExames} />
              <Stack.Screen name="MeusMedicamentos" component={MeusMedicamentos} />
              <Stack.Screen
                name="MeuPerfil"
                component={MeuPerfilScreen}
                options={{ title: 'Meu Perfil' }}
              />
            </>
          ) : (
            // 🚪 Não logado → mostra login e cadastro
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
