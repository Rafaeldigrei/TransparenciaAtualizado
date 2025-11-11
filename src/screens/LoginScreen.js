// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity,
  TouchableWithoutFeedback, Keyboard, StatusBar, Image,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { signIn } from '../services/authService';

// --- Paletas de Cores ---
const lightTheme = {
  background: '#fff',
  text: '#000',
  inputBackground: '#fff',
  inputBorder: '#ccc',
  placeholder: '#888',
  error: 'red',
  primary: '#007AFF',
};
const darkTheme = {
  background: '#121212',
  text: '#fff',
  inputBackground: '#2E2E2E',
  inputBorder: '#555',
  placeholder: '#999',
  error: '#ff5555',
  primary: '#0A84FF',
};

// --- Estilos ---
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
    backgroundColor: theme.background
  },
  logo: {
    width: 420,
    height: 270,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40
  },
  errorText: {
    color: theme.error,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold'
  },
  input: {
    height: 50,
    backgroundColor: theme.inputBackground,
    borderColor: theme.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: theme.text
  },
  signupButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center'
  },
  signupText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: 'bold'
  },
  anonymousButton: {
    marginTop: 15,
    alignItems: 'center'
  },
  anonymousText: {
    color: theme.placeholder,
    fontSize: 14,
    textDecorationLine: 'underline'
  },
});

const lightStyles = getStyles(lightTheme);
const darkStyles = getStyles(darkTheme);

const LoginScreen = ({ navigation, route }) => {
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // se vier do cadastro com dados
  useEffect(() => {
    if (route?.params?.registeredEmail) {
      setEmail(route.params.registeredEmail);
      setPassword(route.params.registeredPassword || '');
      navigation.setParams({
        registeredEmail: undefined,
        registeredPassword: undefined,
      });
    }
  }, [route?.params, navigation]);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password); // autentica no Firebase
      // não navega aqui: App.js já troca pra Home quando detectar user logado
    } catch (err) {
      console.log(err);
      const msg = err?.message || 'Erro ao fazer login';
      setErrorMessage(msg);
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpPress = () => navigation.navigate('SignUp');

  // visitante (aqui pode navegar pq é voluntário)
  const handleAnonymousLogin = () => navigation.navigate('Home');

  const Wrapper = Platform.OS === 'web' ? View : TouchableWithoutFeedback;
  const wrapperProps = Platform.OS === 'web' ? {} : { onPress: Keyboard.dismiss };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <Wrapper {...wrapperProps}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Image
              source={require('../Componentes/assets/logo9.png')}
              style={styles.logo}
            />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={theme.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={theme.placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} />
            ) : (
              <Button title="Entrar no App" onPress={handleLogin} color={theme.primary} />
            )}

            <TouchableOpacity style={styles.signupButton} onPress={handleSignUpPress}>
              <Text style={styles.signupText}>Ainda não tem conta? Crie agora.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.anonymousButton} onPress={handleAnonymousLogin}>
              <Text style={styles.anonymousText}>Entrar como Visitante</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Wrapper>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
