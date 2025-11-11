import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Paletas de cores
const lightTheme = {
  background: '#F5F5F5',
  card: '#fff',
  text: '#333',
  primary: '#007AFF',
};

const darkTheme = {
  background: '#121212',
  card: '#1C1C1E',
  text: '#fff',
  primary: '#0A84FF',
};

const SettingsScreen = ({ navigation }) => { // A prop 'navigation' está de volta
  const { isDarkMode, toggleTheme } = useTheme();
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme, isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"< Voltar"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Modo Escuro</Text>
          <Switch
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 15,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: theme.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    flex: 1,
    marginRight: 50,
  },
  content: {
    padding: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 15,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: theme.text,
  },
});

export default SettingsScreen;

