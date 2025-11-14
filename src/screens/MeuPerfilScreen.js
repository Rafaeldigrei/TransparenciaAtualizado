import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    TextInput, 
    Image, 
    Alert,
    SafeAreaView,
    Platform,
    StatusBar // <<< 1. Adicionado
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { useTheme } from '../context/ThemeContext'; // <<< 2. Adicionado

// Mock de dados do usuário
const mockUser = {
// ... (mockUser permanece o mesmo)
    nome: "João Magne",
    email: "joao.magne@example.com",
    foto: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', 
};

// --- 3. Paletas de Cores Adicionadas ---
const lightTheme = {
    background: '#f5f5f5',
    card: '#ffffff',
    headerBackground: '#ffffff',
    text: '#333',
    subtleText: '#555',
    primary: '#007bff',
    primaryText: '#fff',
    borderColor: '#ddd',
    inputBackground: '#fff',
    secondaryButton: '#6c757d',
    danger: '#dc3545',
};

const darkTheme = {
    background: '#121212',
    card: '#1C1C1E',
    headerBackground: '#1C1C1E',
    text: '#fff',
    subtleText: '#aaa',
    primary: '#0A84FF',
    primaryText: '#fff',
    borderColor: '#333',
    inputBackground: '#2E2E2E',
    secondaryButton: '#8E8E93',
    danger: '#FF453A',
};

export default function MeuPerfilScreen({ navigation }) {
    // --- 4. Hooks de Tema ---
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? darkTheme : lightTheme;
    const styles = getStyles(theme, isDarkMode); // Estilos agora são dinâmicos

    // Estados para os dados do formulário
    const [nome, setNome] = useState(mockUser.nome);
// ... (o resto dos estados e funções handle... permanecem os mesmos)
    const [email, setEmail] = useState(mockUser.email);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [fotoUri, setFotoUri] = useState(mockUser.foto);

    const handleChangePhoto = async () => {
// ...
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
// ...
        if (!nome || !email) {
            Alert.alert("Erro", "Nome e Email não podem estar vazios.");
            return;
        }
        Alert.alert("Sucesso", "Dados de perfil (Nome e Email) atualizados com sucesso!");
    };
    
    const handleChangePassword = () => {
// ...
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
// ...
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
        <SafeAreaView style={styles.safeContainer}>
            {/* --- 5. StatusBar Adicionada --- */}
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{"< Voltar"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meu Perfil</Text>
                <View style={{ width: 50 }} />
            </View>

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
                        placeholderTextColor={theme.subtleText} // <<< Adicionado
                    />
                    
                    <Text style={styles.label}>E-mail:</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="seu.email@exemplo.com"
                        keyboardType="email-address"
                        placeholderTextColor={theme.subtleText} // <<< Adicionado
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
                        placeholderTextColor={theme.subtleText} // <<< Adicionado
                    />

                    <Text style={styles.label}>Nova Senha:</Text>
                    <TextInput
                        style={styles.input}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        secureTextEntry
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor={theme.subtleText} // <<< Adicionado
                    />
                    
                    <Text style={styles.label}>Confirmar Nova Senha:</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmarNovaSenha}
                        onChangeText={setConfirmarNovaSenha}
                        secureTextEntry
                        placeholder="Confirme sua nova senha"
                        placeholderTextColor={theme.subtleText} // <<< Adicionado
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
        </SafeAreaView>
    );
}

// --- 6. Estilos movidos para a função getStyles ---
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
    container: {
        flex: 1, 
        backgroundColor: theme.background, // <<< Atualizado
        padding: 16,
    },
    section: {
        backgroundColor: theme.card, // <<< Atualizado
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 1,
        // Sombra sutil para light mode
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDarkMode ? 0 : 0.1, // Sem sombra no dark mode
        shadowRadius: 1.5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: theme.text, // <<< Atualizado
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor, // <<< Atualizado
        paddingBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.subtleText, // <<< Atualizado
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.borderColor, // <<< Atualizado
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        fontSize: 16,
        backgroundColor: theme.inputBackground, // <<< Atualizado
        color: theme.text, // <<< Adicionado
    },
    saveButton: {
        backgroundColor: theme.primary, // <<< Atualizado
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: theme.primaryText, // <<< Atualizado
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
        borderColor: theme.card, // <<< Atualizado
        backgroundColor: theme.subtleText, // Fundo caso a imagem falhe
    },
    changePhotoButton: {
        backgroundColor: theme.secondaryButton, // <<< Atualizado
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginTop: 15,
    },
    changePhotoButtonText: {
        color: theme.primaryText, // <<< Atualizado
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Estilos de Exclusão
    deleteButton: {
        backgroundColor: theme.danger, // <<< Atualizado
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: theme.primaryText, // <<< Atualizado
        fontWeight: 'bold',
        fontSize: 16,
    },
    warningText: {
        fontSize: 12,
        color: theme.danger, // <<< Atualizado
        marginTop: 10,
        textAlign: 'center',
    }
});