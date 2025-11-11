import React, { useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Modal, 
    TextInput,
    Alert 
} from "react-native";
// Não precisa de Picker neste modal, mas as outras imports são importantes.


const CadastrarMedicamentoModal = ({ isVisible, onClose, onSave }) => {
    const [nome, setNome] = useState("");
    const [dosagem, setDosagem] = useState("");
    const [estoque, setEstoque] = useState("");
    const [chegadaPrevista, setChegadaPrevista] = useState(""); 
    const [descricao, setDescricao] = useState("");

    const handleSave = () => {
        if (!nome || !dosagem || estoque === "") {
            Alert.alert("Erro", "Preencha os campos obrigatórios: Nome, Dosagem e Estoque.");
            return;
        }

        const estoqueNum = parseInt(estoque);
        
        let disponibilidade = "Em Estoque";
        if (estoqueNum === 0) {
            disponibilidade = "Indisponível";
        } else if (estoqueNum < 20) {
            disponibilidade = "Baixo Estoque";
        }

        const novoMedicamento = {
            id: Date.now(), // ID único baseado no timestamp
            nome: nome,
            dosagem: dosagem,
            descricao: descricao,
            estoque: estoqueNum,
            chegadaPrevista: chegadaPrevista || null, 
            disponibilidade: disponibilidade,
        };
        
        onSave(novoMedicamento); 
        
        // Reset dos campos e Fechamento
        setNome("");
        setDosagem("");
        setEstoque("");
        setChegadaPrevista("");
        setDescricao("");
        onClose(); 
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Cadastrar Novo Medicamento</Text>

                    <Text style={modalStyles.label}>Nome do Medicamento:</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Ex: Amoxicilina"
                        value={nome}
                        onChangeText={setNome}
                    />
                    
                    <Text style={modalStyles.label}>Dosagem:</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Ex: 500mg, 1g"
                        value={dosagem}
                        onChangeText={setDosagem}
                    />

                    <Text style={modalStyles.label}>Estoque Atual:</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Ex: 150"
                        keyboardType="numeric"
                        value={estoque.toString()}
                        onChangeText={setEstoque}
                    />

                    <Text style={modalStyles.label}>Chegada Prevista (YYYY-MM-DD):</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder={`Ex: 2025-10-30 (Deixe vazio se em estoque)`}
                        value={chegadaPrevista}
                        onChangeText={setChegadaPrevista}
                    />

                    <Text style={modalStyles.label}>Descrição/Uso:</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Uso principal do medicamento."
                        value={descricao}
                        onChangeText={setDescricao}
                        multiline
                    />

                    <View style={modalStyles.buttonContainer}>
                        <TouchableOpacity style={[modalStyles.button, modalStyles.buttonClose]} onPress={onClose}>
                            <Text style={modalStyles.textStyle}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[modalStyles.button, modalStyles.buttonSave]} onPress={handleSave}>
                            <Text style={modalStyles.textStyle}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CadastrarMedicamentoModal;

const modalStyles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)', },
    modalView: { margin: 20, backgroundColor: "white", borderRadius: 12, padding: 25, alignItems: "stretch", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '90%', maxHeight: '90%', },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: 'center', color: '#333' },
    label: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 5, color: '#555' },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 5, },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, },
    button: { borderRadius: 8, padding: 10, elevation: 2, flex: 1, marginHorizontal: 5, alignItems: 'center' },
    buttonClose: { backgroundColor: "#dc3545", },
    buttonSave: { backgroundColor: "#007bff", },
    textStyle: { color: "white", fontWeight: "bold", textAlign: "center" }
});