import React, { useState, useMemo } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Platform,
    Alert // Importação do Alert para mensagens de sucesso
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import ExameCard from "../components/ExameCard";
import { examesMock } from "../data/exames";
// *** NOVO: Importando o Modal que acabamos de criar ***
import CadastrarExameModal from "../components/CadastrarExameModal"; 


// Configuração para português
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
  tipo: "adm", //  "adm" ou "comum"
};

const HOJE = new Date().toISOString().split('T')[0];

const calendarTheme = {
  calendarBackground: '#ffffff',
  arrowColor: '#007bff',
  todayTextColor: '#007bff',
  selectedDayBackgroundColor: '#007bff',
  textDayFontSize : 12,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 12,
  textDayStyle: { margin: 0, padding: 0 },
  'stylesheet.calendar.header': {
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 8, paddingRight: 8, marginTop: 6, alignItems: 'center' },
    monthText: { fontSize: 14, fontWeight: '500' },
  },
};

const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};


export default function VerExames() {
  const [filtro, setFiltro] = useState("todos");
  // *** ALTERADO: Inicializa com mock para permitir adições ***
  const [exames, setExames] = useState(examesMock); 
  const [dataInicial, setDataInicial] = useState(HOJE); 
  const [dataFinal, setDataFinal] = useState(HOJE);   
  const [showCalendar, setShowCalendar] = useState(false); 
  // *** NOVO: Estado para controlar a visibilidade do modal ***
  const [isModalVisible, setIsModalVisible] = useState(false); 

  // *** NOVO: Função para adicionar o novo exame à lista ***
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

  const markedDates = useMemo(() => {
    const marked = {};
    if (dataInicial) {
      marked[dataInicial] = { startingDay: true, color: '#007bff', textColor: 'white' };
    }
    if (dataFinal) {
      marked[dataFinal] = { endingDay: true, color: '#007bff', textColor: 'white' };
      let dataCorrente = new Date(dataInicial);
      const dataFimDate = new Date(dataFinal);
      dataCorrente.setDate(dataCorrente.getDate() + 1); 
      while (dataCorrente < dataFimDate) {
        const dataString = dataCorrente.toISOString().split('T')[0];
        marked[dataString] = { color: '#b0d4ff', textColor: '#222' }; 
        dataCorrente.setDate(dataCorrente.getDate() + 1);
      }
    } 
    else if (dataInicial) {
        marked[dataInicial] = { startingDay: true, endingDay: true, color: '#007bff', textColor: 'white' };
    }
    return marked;
  }, [dataInicial, dataFinal]);

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
    <View style={styles.container}>
      <Text style={styles.titulo}>Ver Exames</Text>

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

      {/* Filtros de status */}
      <View style={styles.filtros}>
        {["todos", "a_fazer", "pendente", "a_buscar", "concluido"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.botaoFiltro, filtro === item && styles.selecionado]}
            onPress={() => setFiltro(item)}
          >
            <Text style={[styles.textoFiltro, filtro === item && { color: '#fff' }]}>{item.replace("_", " ")}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de exames */}
      <FlatList
        data={examesFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExameCard
            exame={item}
            isAdmin={usuarioAtual.tipo === "adm"}
            onChangeStatus={alterarStatus}
          />
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum exame encontrado para este período.</Text>}
      />

      {/* *** ALTERADO: Botão Cadastrar para abrir o modal *** */}
      {usuarioAtual.tipo === "adm" && (
        <TouchableOpacity 
            style={styles.botaoCadastrar}
            onPress={() => setIsModalVisible(true)} // Abre o modal
        >
          <Text style={styles.textoBotaoCadastrar}>Cadastrar novo exame</Text>
        </TouchableOpacity>
      )}

      {/* *** NOVO: Renderização do Modal *** */}
      <CadastrarExameModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Fecha o modal
        onSave={handleNovoExame} // Envia os dados para a função de salvar
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  botaoData: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
  },
  label: { 
    fontSize: 16, 
    fontWeight: "500", 
    color: '#333' 
  },
  textoData: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#007bff',
  },
  filtroData: { 
    marginBottom: 14,
  },
  calendario: { 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  filtros: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  botaoFiltro: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#ddd",
    margin: 4,
  },
  selecionado: { backgroundColor: "#007bff" },
  textoFiltro: { color: "#000" },
  vazio: { textAlign: "center", marginTop: 20 },
  botaoCadastrar: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotaoCadastrar: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});