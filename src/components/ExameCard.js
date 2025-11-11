import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ExameCard({ exame, onChangeStatus, isAdmin }) {
  return (
    <View style={styles.card}>
      <Text style={styles.tipo}>{exame.tipo}</Text>
      <Text>Data: {exame.data}</Text>
      <Text>Status: {exame.status}</Text>

      {isAdmin && (
        <TouchableOpacity
          style={styles.botao}
          onPress={() => onChangeStatus(exame.id)}
        >
          <Text style={styles.textoBotao}>Alterar Status</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  tipo: {
    fontWeight: "bold",
    fontSize: 16,
  },
  botao: {
    marginTop: 8,
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 6,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
  },
});
