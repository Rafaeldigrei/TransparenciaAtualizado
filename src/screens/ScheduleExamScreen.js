// src/screens/ScheduleScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { createAppointment } from '../services/appointmentsService'; // <-- novo: salva no Firestore

// --- DADOS FICTÍCIOS ---
const ALL_SPECIALTIES = [
  'Cardiologia',
  'Dermatologia',
  'Ginecologia',
  'Neurologia',
  'Ortopedia',
  'Pediatria',
  'Urologia',
];
const ALL_EXAMS = [
  'Ecocardiograma',
  'Eletrocardiograma',
  'Exame de Sangue',
  'Mamografia',
  'Raio-X',
  'Ressonância Magnética',
  'Tomografia',
  'Ultrassom',
];

// Paletas de cores
const lightTheme = {
  background: '#F5F5F5',
  headerBackground: '#fff',
  text: '#333',
  inputBackground: '#fff',
  inputBorder: '#ddd',
  placeholder: '#888',
  primary: '#007AFF',
  listBackground: '#fff',
  listItemBorder: '#eee',
  selectorText: '#007AFF',
  selectorTextActive: '#fff',
};
const darkTheme = {
  background: '#121212',
  headerBackground: '#1C1C1E',
  text: '#fff',
  inputBackground: '#2E2E2E',
  inputBorder: '#555',
  placeholder: '#999',
  primary: '#0A84FF',
  listBackground: '#2E2E2E',
  listItemBorder: '#444',
  selectorText: '#0A84FF',
  selectorTextActive: '#000',
};

// --- Componentes ---
const SearchableList = ({
  data,
  value,
  onSearch,
  onSelect,
  placeholder,
  isVisible,
  setVisible,
  theme,
}) => {
  const styles = getStyles(theme);
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        value={value}
        onChangeText={onSearch}
        onFocus={() => setVisible(true)}
      />
      {isVisible && (
        <View style={styles.listContainer}>
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => onSelect(item)}
              >
                <Text style={{ color: theme.text }}>{item}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}
    </View>
  );
};

const ScheduleScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  const [scheduleType, setScheduleType] = useState('consulta');
  const [specialty, setSpecialty] = useState('');
  const [examType, setExamType] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredSpecialties, setFilteredSpecialties] =
    useState(ALL_SPECIALTIES);
  const [isSpecialtyListVisible, setIsSpecialtyListVisible] = useState(false);
  const [filteredExams, setFilteredExams] = useState(ALL_EXAMS);
  const [isExamListVisible, setIsExamListVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSchedule = async () => {
    const selectedDate = date.toLocaleDateString('pt-BR');
    const detail = scheduleType === 'consulta' ? specialty : examType;

    if (!detail) {
      Alert.alert(
        'Erro',
        `Por favor, selecione ${
          scheduleType === 'consulta' ? 'uma especialidade' : 'um tipo de exame'
        }.`,
      );
      return;
    }

    try {
      setSaving(true);
      // salva no Firestore
      await createAppointment({
        type: scheduleType, // "consulta" ou "exame"
        detail,
        date: date.toISOString(), // salva ISO no banco
        status: 'Confirmada',
      });

      Alert.alert(
        'Sucesso!',
        `${
          scheduleType === 'consulta' ? 'Sua consulta' : 'Seu exame'
        } de "${detail}" foi agendada para ${selectedDate}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (e) {
      console.log(e);
      Alert.alert('Erro', e.message || 'Não foi possível agendar.');
    } finally {
      setSaving(false);
    }
  };

  const searchSpecialty = (text) => {
    setSpecialty(text);
    setFilteredSpecialties(
      text
        ? ALL_SPECIALTIES.filter((s) =>
            s.toLowerCase().includes(text.toLowerCase()),
          )
        : ALL_SPECIALTIES,
    );
  };

  const searchExam = (text) => {
    setExamType(text);
    setFilteredExams(
      text
        ? ALL_EXAMS.filter((e) =>
            e.toLowerCase().includes(text.toLowerCase()),
          )
        : ALL_EXAMS,
    );
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setIsSpecialtyListVisible(false);
            setIsExamListVisible(false);
            if (Platform.OS !== 'ios') setShowDatePicker(false);
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backButton}>{"< Voltar"}</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Agendamento</Text>
              <View style={{ width: 50 }} />
            </View>

            <View style={styles.selectorContainer}>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  scheduleType === 'consulta' && styles.selectorActive,
                ]}
                onPress={() => setScheduleType('consulta')}
              >
                <Text
                  style={[
                    styles.selectorText,
                    scheduleType === 'consulta' && styles.selectorTextActive,
                  ]}
                >
                  Marcar Consulta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  scheduleType === 'exame' && styles.selectorActive,
                ]}
                onPress={() => setScheduleType('exame')}
              >
                <Text
                  style={[
                    styles.selectorText,
                    scheduleType === 'exame' && styles.selectorTextActive,
                  ]}
                >
                  Marcar Exame
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {scheduleType === 'consulta' ? (
                <>
                  <Text style={styles.label}>Especialidade Médica</Text>
                  <SearchableList
                    theme={theme}
                    placeholder="Pesquise ou selecione"
                    data={filteredSpecialties}
                    value={specialty}
                    onSearch={searchSpecialty}
                    onSelect={(item) => {
                      setSpecialty(item);
                      setIsSpecialtyListVisible(false);
                      Keyboard.dismiss();
                    }}
                    isVisible={isSpecialtyListVisible}
                    setVisible={setIsSpecialtyListVisible}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.label}>Tipo de Exame</Text>
                  <SearchableList
                    theme={theme}
                    placeholder="Pesquise ou selecione"
                    data={filteredExams}
                    value={examType}
                    onSearch={searchExam}
                    onSelect={(item) => {
                      setExamType(item);
                      setIsExamListVisible(false);
                      Keyboard.dismiss();
                    }}
                    isVisible={isExamListVisible}
                    setVisible={setIsExamListVisible}
                  />
                </>
              )}

              <Text style={styles.label}>Data Desejada</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowDatePicker(!showDatePicker);
                }}
              >
                <Text style={{ fontSize: 16, color: theme.text }}>
                  {date.toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  themeVariant={isDarkMode ? 'dark' : 'light'}
                />
              )}

              <View style={{ marginTop: 'auto' }}>
                <Button
                  title={saving ? 'Salvando...' : 'Confirmar Agendamento'}
                  onPress={handleSchedule}
                  color="#28A745"
                  disabled={saving}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      padding: 15,
      backgroundColor: theme.headerBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.inputBorder,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: { fontSize: 16, color: theme.primary },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
    },
    selectorContainer: {
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'space-around',
      backgroundColor: theme.headerBackground,
    },
    selectorButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    selectorActive: { backgroundColor: theme.primary },
    selectorText: { color: theme.selectorText, fontWeight: '600' },
    selectorTextActive: { color: theme.selectorTextActive },
    form: { padding: 20, flex: 1 },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.inputBackground,
      paddingHorizontal: 15,
      height: 50,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      marginBottom: 20,
      fontSize: 16,
      justifyContent: 'center',
      color: theme.text,
    },
    listContainer: {
      position: 'absolute',
      top: 82,
      left: 0,
      right: 0,
      backgroundColor: theme.listBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 8,
      maxHeight: 200,
      zIndex: 1,
    },
    listItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.listItemBorder,
    },
  });

export default ScheduleScreen;
