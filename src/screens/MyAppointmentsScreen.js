// src/screens/MyAppointmentsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { listMyAppointments } from '../services/appointmentsService'; // <-- pega do Firestore

// --- Paletas de Cores ---
const lightTheme = {
  background: '#F5F5F5',
  card: '#fff',
  text: '#333',
  primary: '#007AFF',
  subtleText: '#666',
  confirmada: '#28A745',
  realizada: '#666',
  cancelada: '#D32F2F',
};

const darkTheme = {
  background: '#121212',
  card: '#1C1C1E',
  text: '#fff',
  primary: '#0A84FF',
  subtleText: '#aaa',
  confirmada: '#34C759',
  realizada: '#aaa',
  cancelada: '#FF453A',
};

// --- Componente do Cartão de Consulta ---
const AppointmentCard = ({ item, theme, isDarkMode }) => {
  const styles = getStyles(theme, isDarkMode);

  const statusKey = item.status ? item.status.toLowerCase() : 'confirmada';
  const statusColor = theme[statusKey] || theme.confirmada;

  // formata data se vier em ISO
  let displayDate = item.date;
  try {
    if (item.date && item.date.includes('T')) {
      displayDate = new Date(item.date).toLocaleDateString('pt-BR');
    }
  } catch (_) {}

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.detail}</Text>
      <Text style={styles.cardSubtitle}>
        Tipo: {item.type === 'consulta' ? 'Consulta' : 'Exame'}
      </Text>
      <View style={styles.separator} />
      <View style={styles.cardRow}>
        <Text style={styles.cardText}>📅 {displayDate}</Text>
        <Text style={[styles.cardText, { color: statusColor, fontWeight: 'bold' }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
};

// --- Componente Principal da Tela ---
const MyAppointmentsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme, isDarkMode);

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listMyAppointments(); // busca do Firestore
        setAppointments(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Confirmada'
  );
  const pastAppointments = appointments.filter(
    (a) => a.status && a.status !== 'Confirmada'
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
      <Text style={styles.emptySubtext}>
        {activeTab === 'upcoming'
          ? 'Os seus próximos agendamentos aparecerão aqui.'
          : 'O seu histórico de agendamentos aparecerá aqui.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"< Voltar"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meus Agendamentos</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('upcoming')}
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Próximos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('past')}
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Anteriores
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'upcoming' ? upcomingAppointments : pastAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard item={item} theme={theme} isDarkMode={isDarkMode} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={EmptyListComponent}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (theme, isDarkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      padding: 15,
      backgroundColor: theme.card,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#ddd',
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
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      padding: 10,
      justifyContent: 'space-around',
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    activeTab: { backgroundColor: theme.primary },
    tabText: { color: theme.primary, fontWeight: 'bold' },
    activeTabText: { color: '#fff' },
    list: { padding: 15, flexGrow: 1 },
    card: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text },
    cardSubtitle: { fontSize: 14, color: theme.subtleText, marginBottom: 10 },
    separator: {
      height: 1,
      backgroundColor: isDarkMode ? '#333' : '#eee',
      marginVertical: 10,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardText: { fontSize: 14, color: theme.subtleText },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: theme.text },
    emptySubtext: { fontSize: 14, color: theme.subtleText, marginTop: 8 },
  });

export default MyAppointmentsScreen;
