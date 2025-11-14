import React, { useState, useMemo } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    TextInput,
    StyleSheet, 
    Alert,
    SafeAreaView,
    Platform,
    StatusBar // <<< Adicionado
} from "react-native";
import { medicamentosMock } from "../data/medicamentos"; 
import CadastrarMedicamentoModal from "../components/CadastrarMedicamentoModal";
import { useTheme } from '../context/ThemeContext'; // <<< Adicionado

// Mock do usuário atual
const usuarioAtual = {
  nome: "João Magne",
  tipo: "comum", // adm ou comum
};

// --- Paletas de Cores Adicionadas ---
const lightTheme = {
    background: '#f5f5f5',
    card: '#ffffff',
    headerBackground: '#ffffff',
    text: '#333',
    subtleText: '#6c757d',
    primary: '#007bff',
    primaryText: '#fff',
    borderColor: '#ddd',
    inputBackground: '#fff',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    cardHeaderText: '#333',
    cardSubText: '#555',
    cardBorder: '#eee',
};

const darkTheme = {
    background: '#121212',
    card: '#1C1C1E',
    headerBackground: '#1C1C1E',
    text: '#fff',
    subtleText: '#999',
    primary: '#0A84FF',
    primaryText: '#fff',
    borderColor: '#333',
    inputBackground: '#2E2E2E',
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF453A',
    cardHeaderText: '#fff',
    cardSubText: '#aaa',
    cardBorder: '#333',
};


// <<< Componente de Apresentação agora recebe 'styles' e 'theme'
const MedicamentoCard = ({ medicamento, styles, theme }) => {
    // Lógica para determinar a cor do status
    const getCorDisponibilidade = (disponibilidade) => {
        switch (disponibilidade) {
            case "Em Estoque":
                return theme.success;
            case "Baixo Estoque":
                return theme.warning;
            case "Indisponível":
                return theme.danger;
            default:
                return theme.subtleText;
        }
    };

    // Formata a data de chegada para DD/MM/AAAA
    const formatarData = (dataString) => {
        if (!dataString || dataString.length !== 10) return 'Indefinida';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const cor = getCorDisponibilidade(medicamento.disponibilidade);

    return (
        // <<< Usa styles.card
        <View style={[styles.card, {borderLeftColor: cor}]}>
            <View style={styles.header}>
                <Text style={styles.nome}>{medicamento.nome}</Text>
                <Text style={styles.dosagem}>{medicamento.dosagem}</Text>
            </View>
            <Text style={styles.descricao}>{medicamento.descricao}</Text>
            
            <View style={styles.detalhes}>
                {/* <<< Adicionado style de texto sutil */}
                <Text style={styles.detalhesText}>
                    Estoque: <Text style={{fontWeight: 'bold'}}>{medicamento.estoque}</Text>
                </Text>
                
                <Text style={styles.detalhesText}>
                    Chegada: <Text style={{fontWeight: 'bold'}}>{formatarData(medicamento.chegadaPrevista)}</Text>
                </Text>
            </View>

            <View style={[styles.statusPill, {backgroundColor: cor}]}>
                <Text style={styles.statusText}>
                    {medicamento.disponibilidade}
                </Text>
            </View>
        </View>
    );
};

export default function MeusMedicamentos({ navigation }) {
  // --- Hooks de Tema ---
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme, isDarkMode); // <<< Estilos dinâmicos

  const [medicamentos, setMedicamentos] = useState(medicamentosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isAdmin = usuarioAtual.tipo === "adm";

  // Lógica para filtrar a lista (Busca do Usuário Comum)
  const medicamentosFiltrados = useMemo(() => {
    if (!searchTerm) {
      return medicamentos;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return medicamentos.filter(med => 
      med.nome.toLowerCase().includes(lowerCaseSearch) ||
      med.descricao.toLowerCase().includes(lowerCaseSearch) ||
      med.dosagem.toLowerCase().includes(lowerCaseSearch)
    );
  }, [medicamentos, searchTerm]);

  // Função para adicionar o novo medicamento à lista
  const handleNovoMedicamento = (novoMed) => {
    setMedicamentos(prevMeds => [novoMed, ...prevMeds]);
    Alert.alert("Sucesso", `Medicamento ${novoMed.nome} (${novoMed.dosagem}) cadastrado!`);
  };

  return (
    <SafeAreaView style={styles.main.safeContainer}>
        {/* --- StatusBar Adicionada --- */}
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <View style={styles.main.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.main.backButton}>{"< Voltar"}</Text>
            </TouchableOpacity>
            <Text style={styles.main.headerTitle}>Medicamentos</Text>
            <View style={{ width: 50 }} />
        </View>

        <View style={styles.main.contentContainer}>
            {/* Barra de Pesquisa */}
            <TextInput
                style={styles.main.searchInput}
                placeholder="Buscar por nome, dosagem ou descrição..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor={theme.subtleText} // <<< Adicionado
            />

            {/* Botão de Cadastro (Apenas para ADM) */}
            {isAdmin && (
                <TouchableOpacity 
                    style={styles.main.botaoCadastrar}
                    onPress={() => setIsModalVisible(true)}
                >
                <Text style={styles.main.textoBotaoCadastrar}>Cadastrar novo Medicamento</Text>
                </TouchableOpacity>
            )}

            {/* Lista de Medicamentos */}
            <FlatList
                data={medicamentosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // <<< Passa styles.card e theme para o componente
                    <MedicamentoCard 
                        medicamento={item} 
                        styles={styles.card} 
                        theme={theme} 
                    />
                )}
                ListEmptyComponent={<Text style={styles.main.vazio}>Nenhum medicamento encontrado.</Text>}
            />

            {/* Modal de Cadastro (Apenas para ADM) */}
            {isAdmin && (
                <CadastrarMedicamentoModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSave={handleNovoMedicamento}
                />
            )}
        </View>

    </SafeAreaView>
  );
}

// <<< Função getStyles agora engloba AMBOS os style sheets
const getStyles = (theme, isDarkMode) => {
    const main = StyleSheet.create({
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
            paddingBottom: 16,
            backgroundColor: theme.background // <<< Atualizado
        },
        searchInput: {
            height: 40,
            borderColor: theme.borderColor, // <<< Atualizado
            borderWidth: 1,
            paddingHorizontal: 10,
            borderRadius: 8,
            marginBottom: 15,
            backgroundColor: theme.inputBackground, // <<< Atualizado
            color: theme.text, // <<< Adicionado
        },
        botaoCadastrar: {
            backgroundColor: theme.primary, // <<< Atualizado
            padding: 12,
            borderRadius: 8,
            marginBottom: 15,
        },
        textoBotaoCadastrar: { 
            color: theme.primaryText, // <<< Atualizado
            textAlign: "center", 
            fontWeight: "bold" 
        },
        vazio: { 
            textAlign: "center", 
            marginTop: 20, 
            color: theme.subtleText // <<< Atualizado
        },
    });

    const card = StyleSheet.create({
        card: {
            backgroundColor: theme.card, // <<< Atualizado
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            borderLeftWidth: 5,
            elevation: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDarkMode ? 0 : 0.1, // Sem sombra no dark mode
            shadowRadius: 1.5,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between', 
            alignItems: 'baseline',
            marginBottom: 8,
        },
        nome: { 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: theme.cardHeaderText, // <<< Atualizado
            marginRight: 10, 
            flexShrink: 1, // Impede que o nome empurre a dosagem
        },
        dosagem: { 
            fontSize: 14, 
            color: theme.subtleText, // <<< Atualizado
            fontWeight: '500', 
            paddingLeft: 5, 
            flexShrink: 0, // Dosagem não encolhe
        },
        descricao: { 
            fontSize: 14, 
            color: theme.cardSubText, // <<< Atualizado
            marginBottom: 10, 
        },
        detalhes: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 5,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder, // <<< Atualizado
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder, // <<< Atualizado
            marginBottom: 10,
        },
        detalhesText: { // <<< Adicionado para o texto dos detalhes
            color: theme.subtleText,
        },
        statusPill: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 15,
            alignSelf: 'flex-start',
        },
        statusText: { 
            color: theme.primaryText, // <<< Atualizado
            fontWeight: 'bold', 
            fontSize: 12, 
            textTransform: 'uppercase', 
        }
    });

    return { main, card };
};