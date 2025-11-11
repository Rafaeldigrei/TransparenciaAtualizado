import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    TextInput, 
    Image, 
    Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 

// Mock de dados do usuário
const mockUser = {
    nome: "João Magne",
    email: "joao.magne@example.com",
    // Usando uma imagem padrão genérica para evitar erros de placeholder
    foto: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', 
};

export default function MeuPerfilScreen({ navigation }) {
    // Estados para os dados do formulário
    const [nome, setNome] = useState(mockUser.nome);
    const [email, setEmail] = useState(mockUser.email);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [fotoUri, setFotoUri] = useState(mockUser.foto);

    const handleChangePhoto = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            Alert.alert("Permissão Necessária", "Precisamos de permissão para acessar sua galeria.");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setFotoUri(pickerResult.assets[0].uri); 
            Alert.alert("Sucesso", "Foto de perfil atualizada!");
        }
    };

    const handleUpdateProfile = () => {
        if (!nome || !email) {
            Alert.alert("Erro", "Nome e Email não podem estar vazios.");
            return;
        }
        Alert.alert("Sucesso", "Dados de perfil (Nome e Email) atualizados com sucesso!");
    };
    
    const handleChangePassword = () => {
        if (novaSenha !== confirmarNovaSenha) {
            Alert.alert("Erro", "A nova senha e a confirmação não coincidem.");
            return;
        }
        if (novaSenha.length < 6) {
             Alert.alert("Erro", "A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (!senhaAtual) {
             Alert.alert("Erro", "Preencha sua Senha Atual para confirmar.");
            return;
        }

        Alert.alert("Sucesso", "Sua senha foi alterada com sucesso!");
        
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarNovaSenha('');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Excluir Conta",
            "Tem certeza de que deseja EXCLUIR sua conta? Esta ação é irreversível.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sim, Excluir",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
                        navigation.navigate('Login'); 
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            
            {/* Seção de Foto de Perfil */}
            <View style={styles.photoContainer}>
                <Image
                    source={{ uri: fotoUri }}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
                    <Text style={styles.changePhotoButtonText}>Alterar Foto</Text>
                </TouchableOpacity>
            </View>

            {/* Seção de Atualização de Dados (Nome e Email) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                
                <Text style={styles.label}>Nome:</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Seu Nome Completo"
                />
                
                <Text style={styles.label}>E-mail:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu.email@exemplo.com"
                    keyboardType="email-address"
                />
                
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                    <Text style={styles.saveButtonText}>Salvar Dados</Text>
                </TouchableOpacity>
            </View>

            {/* Seção de Alteração de Senha */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alterar Senha</Text>

                <Text style={styles.label}>Senha Atual:</Text>
                <TextInput
                    style={styles.input}
                    value={senhaAtual}
                    onChangeText={setSenhaAtual}
                    secureTextEntry
                    placeholder="Digite sua senha atual"
                />

                <Text style={styles.label}>Nova Senha:</Text>
                <TextInput
                    style={styles.input}
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    secureTextEntry
                    placeholder="Mínimo 6 caracteres"
                />
                
                <Text style={styles.label}>Confirmar Nova Senha:</Text>
                <TextInput
                    style={styles.input}
                    value={confirmarNovaSenha}
                    onChangeText={setConfirmarNovaSenha}
                    secureTextEntry
                    placeholder="Confirme sua nova senha"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                    <Text style={styles.saveButtonText}>Alterar Senha</Text>
                </TouchableOpacity>
            </View>

            {/* Seção de Exclusão de Conta */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gerenciamento de Conta</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={styles.deleteButtonText}>Excluir Minha Conta</Text>
                </TouchableOpacity>
                <Text style={styles.warningText}>Atenção: A exclusão de conta é permanente e não pode ser desfeita.</Text>
            </View>

            <View style={{height: 50}} /> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    section: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Estilos de Foto de Perfil
    photoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    changePhotoButton: {
        backgroundColor: '#6c757d',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginTop: 15,
    },
    changePhotoButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Estilos de Exclusão
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // 🚨 Esta era a área mais propensa ao erro de sintaxe.
    warningText: {
        fontSize: 12,
        color: '#dc3545',
        marginTop: 10,
        textAlign: 'center',
    } // ⚠️ SEM VÍRGULA AQUI!
});