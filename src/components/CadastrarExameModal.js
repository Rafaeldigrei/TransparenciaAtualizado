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
import { Picker } from "@react-native-picker/picker";
// Assumindo que você tem essa função de formatação no VerExames.js (vamos mantê-la lá por enquanto)
// Você pode precisar de uma biblioteca de utilitários se for usá-la em vários locais.

// Mock de dados para o cadastro (Você pode mover estes mocks para um arquivo de 'data' se preferir)
const mockEspecialidades = ["Cardiologia", "Ortopedia", "Dermatologia", "Oftalmologia"];
const mockUsuarios = ["João Magne", "Maria Silva", "Pedro Souza", "Ana Costa"]; 
const mockTiposExame = ["Consulta", "Raio-X", "Ultrassom", "Ressonância"];

const HOJE = new Date().toISOString().split('T')[0];

// Função para formatar a data (repetida aqui para o modal funcionar independentemente)
const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};


const CadastrarExameModal = ({ isVisible, onClose, onSave }) => {
    const [especialidade, setEspecialidade] = useState(mockEspecialidades[0]);
    const [paciente, setPaciente] = useState(mockUsuarios[0]);
    const [tipoExame, setTipoExame] = useState(mockTiposExame[0]);
    // Mantém a data no formato ISO YYYY-MM-DD para salvar
    const [dataExame, setDataExame] = useState(HOJE); 
    
    // Data formatada para exibir no TextInput
    const dataFormatada = formatarData(dataExame); 

    const handleSave = () => {
        if (!especialidade || !paciente || !dataExame) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios (Especialidade, Paciente e Data).");
            return;
        }

        const novoExame = {
            id: Date.now(), // ID único baseado no timestamp
            paciente: paciente,
            data: dataExame,
            tipo: tipoExame,
            especialidade: especialidade,
            status: "a_fazer",
        };
        
        onSave(novoExame); // Chama a função que salva no componente pai
        
        // Opcional: Resetar estados após salvar, ou fechar o modal.
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
                    <Text style={modalStyles.modalTitle}>Cadastrar Novo Exame</Text>

                    {/* Campo Especialidade */}
                    <Text style={modalStyles.label}>Especialidade:</Text>
                    <View style={modalStyles.pickerContainer}>
                        <Picker
                            selectedValue={especialidade}
                            onValueChange={(itemValue) => setEspecialidade(itemValue)}
                            style={modalStyles.picker}
                        >
                            {mockEspecialidades.map((esp) => (
                                <Picker.Item key={esp} label={esp} value={esp} />
                            ))}
                        </Picker>
                    </View>

                    {/* Campo Tipo de Exame */}
                    <Text style={modalStyles.label}>Tipo de Exame:</Text>
                    <View style={modalStyles.pickerContainer}>
                        <Picker
                            selectedValue={tipoExame}
                            onValueChange={(itemValue) => setTipoExame(itemValue)}
                            style={modalStyles.picker}
                        >
                            {mockTiposExame.map((tipo) => (
                                <Picker.Item key={tipo} label={tipo} value={tipo} />
                            ))}
                        </Picker>
                    </View>

                    {/* Campo Usuário/Paciente */}
                    <Text style={modalStyles.label}>Paciente:</Text>
                    <View style={modalStyles.pickerContainer}>
                        <Picker
                            selectedValue={paciente}
                            onValueChange={(itemValue) => setPaciente(itemValue)}
                            style={modalStyles.picker}
                        >
                            {mockUsuarios.map((user) => (
                                <Picker.Item key={user} label={user} value={user} />
                            ))}
                        </Picker>
                    </View>

                    {/* Campo Data */}
                    <Text style={modalStyles.label}>Data (DD/MM/AAAA):</Text>
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Ex: 28/10/2025"
                        value={dataFormatada}
                        onChangeText={(text) => {
                            // Lógica básica para tentar converter DD/MM/AAAA para YYYY-MM-DD
                            const partes = text.split('/');
                            if (partes.length === 3 && partes[0].length <= 2 && partes[1].length <= 2 && partes[2].length === 4) {
                                // Apenas atualiza o estado de dataExame se a conversão parecer válida
                                setDataExame(`${partes[2]}-${partes[1]}-${partes[0]}`);
                            }
                        }}
                    />


                    {/* Botões */}
                    <View style={modalStyles.buttonContainer}>
                        <TouchableOpacity style={[modalStyles.button, modalStyles.buttonClose]} onPress={onClose}>
                            <Text style={modalStyles.textStyle}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[modalStyles.button, modalStyles.buttonSave]} onPress={handleSave}>
                            <Text style={modalStyles.textStyle}>Salvar Exame</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CadastrarExameModal;

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)', 
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 25,
        alignItems: "stretch", 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%', 
        maxHeight: '80%', // Limita a altura para dispositivos menores
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#555'
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden', 
    },
    picker: {
        height: 40,
        width: '100%',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        borderRadius: 8,
        padding: 10,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center'
    },
    buttonClose: {
        backgroundColor: "#dc3545",
    },
    buttonSave: {
        backgroundColor: "#28a745",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});