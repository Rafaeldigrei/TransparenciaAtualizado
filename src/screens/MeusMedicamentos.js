import React, { useState, useMemo } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    TextInput,
    StyleSheet, 
    Alert 
} from "react-native";
import { medicamentosMock } from "../data/medicamentos"; 
import CadastrarMedicamentoModal from "../components/CadastrarMedicamentoModal";

// Mock do usuário atual (mantenha a consistência com VerExames.js)
const usuarioAtual = {
  nome: "João Magne",
  tipo: "comum", // adm ou comum
};

// Componente de Apresentação Simples
const MedicamentoCard = ({ medicamento }) => {
    // Lógica para determinar a cor do status
    const getCorDisponibilidade = (disponibilidade) => {
        switch (disponibilidade) {
            case "Em Estoque":
                return "#28a745"; // Verde
            case "Baixo Estoque":
                return "#ffc107"; // Amarelo
            case "Indisponível":
                return "#dc3545"; // Vermelho
            default:
                return "#6c757d"; // Cinza
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
        <View style={[medicamentoCardStyles.card, {borderLeftColor: cor}]}>
            <View style={medicamentoCardStyles.header}>
                <Text style={medicamentoCardStyles.nome}>{medicamento.nome}</Text>
                <Text style={medicamentoCardStyles.dosagem}>{medicamento.dosagem}</Text>
            </View>
            <Text style={medicamentoCardStyles.descricao}>{medicamento.descricao}</Text>
            
            <View style={medicamentoCardStyles.detalhes}>
                <Text>Estoque: <Text style={{fontWeight: 'bold'}}>{medicamento.estoque}</Text></Text>
                
                {/* Exibe a data de chegada se estiver indisponível ou baixo estoque */}
                <Text>
                    Chegada: <Text style={{fontWeight: 'bold'}}>{formatarData(medicamento.chegadaPrevista)}</Text>
                </Text>
            </View>

            <View style={[medicamentoCardStyles.statusPill, {backgroundColor: cor}]}>
                <Text style={medicamentoCardStyles.statusText}>
                    {medicamento.disponibilidade}
                </Text>
            </View>
        </View>
    );
};

export default function MeusMedicamentos() {
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
    <View style={styles.container}>
      <Text style={styles.titulo}>Disponibilidade de Medicamentos</Text>

      {/* Barra de Pesquisa */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nome, dosagem ou descrição..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Botão de Cadastro (Apenas para ADM) */}
      {isAdmin && (
        <TouchableOpacity 
            style={styles.botaoCadastrar}
            onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.textoBotaoCadastrar}>Cadastrar novo Medicamento</Text>
        </TouchableOpacity>
      )}

      {/* Lista de Medicamentos */}
      <FlatList
        data={medicamentosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MedicamentoCard medicamento={item} />
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum medicamento encontrado.</Text>}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: '#333' },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  botaoCadastrar: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  textoBotaoCadastrar: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  vazio: { textAlign: "center", marginTop: 20, color: '#6c757d' },
});

const medicamentoCardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 5,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        // 🚨 ALTERADO: Adicionado um espaço maior entre o nome e a dosagem
        justifyContent: 'space-between', 
        alignItems: 'baseline',
        marginBottom: 8, // Aumentei a margem inferior para o texto abaixo
    },
    nome: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333', 
        // 🚨 NOVO: Adicionado um padding/margin à direita para garantir espaço
        marginRight: 10, 
    },
    dosagem: { 
        fontSize: 14, 
        color: '#6c757d', 
        fontWeight: '500', 
        // 🚨 NOVO: Para evitar que a dosagem se grude na borda do card
        paddingLeft: 5, 
    },
    descricao: { fontSize: 14, color: '#555', marginBottom: 10, },
    detalhes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    statusPill: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', }
});