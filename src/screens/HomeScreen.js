// src/screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../services/authService'; // <-- novo

// --- Paletas de Cores ---
const lightTheme = {
  background: '#F5F5F5',
  text: '#333',
  card: '#fff',
};
const darkTheme = {
  background: '#121212',
  text: '#fff',
  card: '#1C1C1E',
};

// --- Componente do Botão do Dashboard ---
const DashboardItem = ({ icon, title, onPress, styles }) => (
  <TouchableOpacity style={styles.gridItem} onPress={onPress}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.itemText}>{title}</Text>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme, isDarkMode);

  const handleLogout = async () => {
    try {
      await logout(); // desconecta do Firebase
      // não precisa navegar: App.js já vai mostrar Login quando user === null
    } catch (e) {
      console.log('Erro ao sair:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>

      <Image
        source={require('../Componentes/assets/logo9.png')}
        style={styles.logo}
      />

      <View style={styles.gridContainer}>
        <DashboardItem
          styles={styles}
          icon="📅"
          title="Marcar Consulta/Exame"
          onPress={() => navigation.navigate('ScheduleExam')}
        />
        <DashboardItem
          styles={styles}
          icon="📄"
          title="Ver Exames"
          onPress={() => navigation.navigate('VerExames')}
        />
        <DashboardItem
          styles={styles}
          icon="🏥"
          title="Minhas Consultas"
          onPress={() => navigation.navigate('MyAppointments')}
        />
        <DashboardItem
          styles={styles}
          icon="💊"
          title="Meus Medicamentos"
          onPress={() => navigation.navigate('MeusMedicamentos')}
        />
        <DashboardItem
          styles={styles}
          icon="👤"
          title="Meu Perfil"
          onPress={() => navigation.navigate('MeuPerfil')}
        />
        <DashboardItem
          styles={styles}
          icon="⚙️"
          title="Configurações"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme, isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'space-between',
      padding: 15,
    },
    logo: {
      height: 270,
      width: '90%',
      resizeMode: 'contain',
      alignSelf: 'center',
      marginTop: 40,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    gridItem: {
      width: '46%',
      aspectRatio: 1,
      backgroundColor: theme.card,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0 : 0.23,
      shadowRadius: 2.62,
      elevation: isDarkMode ? 0 : 4,
    },
    icon: {
      fontSize: 40,
      marginBottom: 10,
    },
    itemText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
    },
    logoutButton: {
      position: 'absolute',
      top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
      left: 20,
      zIndex: 1,
    },
    logoutButtonText: {
      color: '#D32F2F',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default HomeScreen;
