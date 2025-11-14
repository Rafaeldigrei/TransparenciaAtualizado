import React, { useState, useMemo } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Platform,
    Alert,
    SafeAreaView,
    StatusBar // <<< Adicionado
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import ExameCard from "../components/ExameCard";
import { examesMock } from "../data/exames";
import CadastrarExameModal from "../components/CadastrarExameModal"; 
import { useTheme } from '../context/ThemeContext'; // <<< Adicionado

// ... (LocaleConfig permanece o mesmo) ...
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Maio','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const usuarioAtual = {
  nome: "João Magne",
  tipo: "adm",
};

const HOJE = new Date().toISOString().split('T')[0];

// --- Paletas de Cores Adicionadas ---
const lightTheme = {
    background: '#f5f5f5',
    headerBackground: '#ffffff',
    card: '#ffffff',
    text: '#333',
    subtleText: '#6c757d',
    primary: '#007bff',
    primaryText: '#fff',
    borderColor: '#ddd',
    calendarBackground: '#ffffff',
    calendarText: '#222',
    todayText: '#007bff',
    selectedDay: '#007bff',
    selectedDayText: '#fff',
    periodDay: '#b0d4ff',
    periodDayText: '#222',
    filtroBackground: '#ddd',
    filtroText: '#000',
    success: '#28a745',
};

const darkTheme = {
    background: '#121212',
    headerBackground: '#1C1C1E',
    card: '#1C1C1E',
    text: '#fff',
    subtleText: '#999',
    primary: '#0A84FF',
    primaryText: '#fff',
    borderColor: '#333',
    calendarBackground: '#1C1C1E',
    calendarText: '#fff',
    todayText: '#0A84FF',
    selectedDay: '#0A84FF',
    selectedDayText: '#fff',
    periodDay: '#003366', // Cor mais escura para o período
    periodDayText: '#fff',
    filtroBackground: '#333',
    filtroText: '#fff',
    success: '#34C759',
};


const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};

export default function VerExames({ navigation }) {
  // --- Hooks de Tema ---
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme, isDarkMode); // <<< Estilos dinâmicos

  const [filtro, setFiltro] = useState("todos");
  const [exames, setExames] = useState(examesMock); 
  const [dataInicial, setDataInicial] = useState(HOJE); 
  const [dataFinal, setDataFinal] = useState(HOJE);   
  const [showCalendar, setShowCalendar] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const handleNovoExame = (novoExame) => {
    setExames(prevExames => [novoExame, ...prevExames]);
    Alert.alert("Sucesso", `Exame de ${novoExame.especialidade} para ${novoExame.paciente} cadastrado!`);
  };

  const examesFiltrados = exames.filter((exame) => {
    if (usuarioAtual.tipo === "comum" && exame.paciente !== usuarioAtual.nome)
      return false;
    if (filtro !== "todos" && exame.status !== filtro) return false;

    const dataExame = new Date(exame.data);
    const dataInicialDate = new Date(`${dataInicial}T00:00:00`);
    const dataFinalDate = new Date(`${dataFinal}T00:00:00`);
    dataExame.setHours(0, 0, 0, 0);

    return (
      dataExame >= dataInicialDate && dataExame <= dataFinalDate
    );
  });
  
  const onDayPress = (day) => {
    const { dateString } = day;
    if (!dataInicial || dataFinal) {
      setDataInicial(dateString);
      setDataFinal(null); 
    } 
    else if (!dataFinal) {
      if (new Date(dateString) < new Date(dataInicial)) {
        setDataInicial(dateString);
        setDataFinal(null);
      } else {
        setDataFinal(dateString);
        setShowCalendar(false); 
      }
    }
  };

  // --- Tema do Calendário agora é dinâmico ---
  const calendarTheme = {
    calendarBackground: theme.calendarBackground,
    arrowColor: theme.primary,
    todayTextColor: theme.todayText,
    selectedDayBackgroundColor: theme.selectedDay,
    selectedDayTextColor: theme.selectedDayText,
    textDayFontSize : 12,
    textMonthFontSize: 14,
    textDayHeaderFontSize: 12,
    textDayStyle: { margin: 0, padding: 0 },
    monthTextColor: theme.text, // <<< Adicionado
    dayTextColor: theme.calendarText, // <<< Adicionado
    'stylesheet.calendar.header': {
      header: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 8, paddingRight: 8, marginTop: 6, alignItems: 'center' },
      monthText: { fontSize: 14, fontWeight: '500', color: theme.text }, // <<< Atualizado
    },
  };

  const markedDates = useMemo(() => {
    const marked = {};
    if (dataInicial) {
      marked[dataInicial] = { startingDay: true, color: theme.selectedDay, textColor: theme.selectedDayText };
    }
    if (dataFinal) {
      marked[dataFinal] = { endingDay: true, color: theme.selectedDay, textColor: theme.selectedDayText };
      let dataCorrente = new Date(dataInicial);
      const dataFimDate = new Date(dataFinal);
      dataCorrente.setDate(dataCorrente.getDate() + 1); 
      while (dataCorrente < dataFimDate) {
        const dataString = dataCorrente.toISOString().split('T')[0];
        marked[dataString] = { color: theme.periodDay, textColor: theme.periodDayText }; 
        dataCorrente.setDate(dataCorrente.getDate() + 1);
      }
    } 
    else if (dataInicial) {
        marked[dataInicial] = { startingDay: true, endingDay: true, color: theme.selectedDay, textColor: theme.selectedDayText };
    }
    return marked;
  }, [dataInicial, dataFinal, theme]); // <<< 'theme' adicionado como dependência

  const alterarStatus = (id) => {
    setExames((prev) =>
      prev.map((ex) => {
        if (ex.id === id) {
          const statusOrder = ["a_fazer", "pendente", "a_buscar", "concluido"];
          const atual = statusOrder.indexOf(ex.status);
          const proximo = (atual + 1) % statusOrder.length;
          return { ...ex, status: statusOrder[proximo] };
        }
        return ex;
      })
    );
  };

  const textoPeriodo = dataInicial === dataFinal || !dataFinal
    ? formatarData(dataInicial)
    : `${formatarData(dataInicial)} - ${formatarData(dataFinal)}`;

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* --- StatusBar Adicionada --- */}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"< Voltar"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ver Exames</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.filtroData}>
          <TouchableOpacity 
              style={styles.botaoData}
              onPress={() => setShowCalendar(!showCalendar)}
          >
              <Text style={styles.label}>Período Selecionado:</Text>
              <Text style={styles.textoData}>{textoPeriodo}</Text>
          </TouchableOpacity>
          
          {showCalendar && (
            <Calendar
              markingType={'period'}
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={calendarTheme} 
              hideExtraDays={true} 
              style={styles.calendario} 
            />
          )}
        </View>

        <View style={styles.filtros}>
          {["todos", "a_fazer", "pendente", "a_buscar", "concluido"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.botaoFiltro, filtro === item && styles.selecionado]}
              onPress={() => setFiltro(item)}
            >
              <Text style={[styles.textoFiltro, filtro === item && { color: theme.primaryText }]}>{item.replace("_", " ")}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={examesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExameCard
              exame={item}
              isAdmin={usuarioAtual.tipo === "adm"}
              onChangeStatus={alterarStatus}
              // <<< Passa o tema para o ExameCard (assumindo que ele também será atualizado)
              theme={theme} 
              isDarkMode={isDarkMode}
            />
          )}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum exame encontrado para este período.</Text>}
        />

        {usuarioAtual.tipo === "adm" && (
          <TouchableOpacity 
              style={styles.botaoCadastrar}
              onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.textoBotaoCadastrar}>Cadastrar novo exame</Text>
          </TouchableOpacity>
        )}

        <CadastrarExameModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleNovoExame}
        />
      </View>
    </SafeAreaView>
  );
}

// --- Estilos movidos para a função getStyles ---
const getStyles = (theme, isDarkMode) => StyleSheet.create({
  safeContainer: { 
    flex: 1,
    backgroundColor: theme.background, // <<< Atualizado
  },
  header: { 
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.headerBackground, // <<< Atualizado
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor, // <<< Atualizado
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 40 : 15, 
  },
  backButton: { 
    fontSize: 16, 
    color: theme.primary // <<< Atualizado
  },
  headerTitle: { 
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text, // <<< Atualizado
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: theme.background, // <<< Atualizado
  },

  botaoData: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.primary, // <<< Atualizado
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: isDarkMode ? theme.card : '#e6f0ff', // Fundo sutil
  },

  label: { 
    fontSize: 16, 
    fontWeight: "500", 
    color: theme.text // <<< Atualizado
  },

  textoData: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.primary, // <<< Atualizado
  },

  filtroData: { marginBottom: 14 },

  calendario: { 
    borderWidth: 1,
    borderColor: theme.borderColor, // <<< Atualizado
    borderRadius: 8,
  },

  filtros: { 
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12 
  },

  botaoFiltro: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: theme.filtroBackground, // <<< Atualizado
    margin: 4,
  },

  selecionado: { 
    backgroundColor: theme.primary // <<< Atualizado
  },

  textoFiltro: { 
    color: theme.filtroText, // <<< Atualizado
    fontSize: 12,
    fontWeight: "600",
    textTransform: 'capitalize', // Para ficar "A Fazer"
  },

  vazio: { 
    textAlign: "center", 
    marginTop: 20,
    color: theme.subtleText, // <<< Atualizado
  },

  botaoCadastrar: {
    backgroundColor: theme.success, // <<< Atualizado
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  textoBotaoCadastrar: { 
    color: theme.primaryText, // <<< Atualizado
    textAlign: "center", 
    fontWeight: "bold" 
  },
});