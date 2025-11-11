// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, Switch, SafeAreaView, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, 
  TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { signUp } from '../services/authService'; // <-- novo import

// Paletas de cores para a tela
const lightTheme = {
  background: '#fff',
  text: '#333',
  inputBackground: '#fff',
  inputBorder: '#ccc',
  placeholder: '#888',
  error: '#D32F2F',
  success: '#388E3C',
  primary: '#007AFF',
};
const darkTheme = {
  background: '#121212',
  text: '#fff',
  inputBackground: '#2E2E2E',
  inputBorder: '#555',
  placeholder: '#999',
  error: '#ff5555',
  success: '#66bb6a',
  primary: '#0A84FF',
};

const SignUpScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme, isDarkMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const emailRegex = /\S+@\S+\.\S+$/;

  const handleSignUp = async () => {
    setFeedbackMessage({ text: '', type: '' });

    if (!email || !password || !confirmPassword) {
      setFeedbackMessage({ text: 'Por favor, preencha todos os campos.', type: 'error' });
      return;
    }
    if (!emailRegex.test(email)) {
      setFeedbackMessage({ text: 'Digite um e-mail válido.', type: 'error' });
      return;
    }
    if (password.length > 8) {
      setFeedbackMessage({ text: 'A senha deve ter no máximo 8 caracteres.', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setFeedbackMessage({ text: 'As senhas não coincidem!', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, { isAdmin }); // salva auth + perfil no Firestore
      setFeedbackMessage({ text: 'Conta criada com sucesso! Redirecionando...', type: 'success' });
      setTimeout(() => {
        navigation.replace('Home');
      }, 1500);
    } catch (err) {
      console.error(err);
      setFeedbackMessage({ text: err.message, type: 'error' });
      Alert.alert('Erro ao cadastrar', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backButton}>{"< Voltar"}</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Crie Sua Conta</Text>
            </View>

            <View style={styles.formContainer}>
              {feedbackMessage.text ? (
                <Text
                  style={[
                    styles.feedbackText,
                    feedbackMessage.type === 'error' ? styles.errorText : styles.successText
                  ]}
                >
                  {feedbackMessage.text}
                </Text>
              ) : null}

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
                placeholder="Senha (máx. 8 caracteres)"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                maxLength={8}
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirme a Senha"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                maxLength={8}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Criar como Administrador</Text>
                <Switch
                  trackColor={{ false: "#767577", true: theme.primary }}
                  thumbColor={"#f4f3f4"}
                  onValueChange={setIsAdmin}
                  value={isAdmin}
                />
              </View>

              {loading ? (
                <ActivityIndicator size="large" color={theme.primary} />
              ) : (
                <Button title="Cadastrar" onPress={handleSignUp} color="#28A745" />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    padding: 15,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { fontSize: 16, color: theme.primary },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    flex: 1,
    marginRight: 50,
  },
  formContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    height: 50,
    backgroundColor: theme.inputBackground,
    borderColor: theme.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: theme.text,
  },
  feedbackText: { textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  errorText: { color: theme.error },
  successText: { color: theme.success },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  switchLabel: { fontSize: 16, color: theme.text },
});

export default SignUpScreen;
