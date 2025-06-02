export const screenOptions = {
  animation: "none",
};

import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SearchOverlay() {
  
  const { query = "" } = useLocalSearchParams();
  const [search, setSearch] = useState(String(query));

  const handleSearch = () => {
    if (search.trim()) {
      router.push({
        pathname: "/search/searchResults",
        params: { query: search },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          autoFocus
          placeholder="¿Qué quieres comprar?"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* 🔍 Sugerencias rápidas o historial (puede ser dinámico en el futuro) */}
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionTitle}>Sugerencias:</Text>
        <Text style={styles.suggestion}>• Moto</Text>
        <Text style={styles.suggestion}>• Zapatillas</Text>
        <Text style={styles.suggestion}>• Celular usado</Text>
        <Text style={styles.suggestion}>• Laptop gamer</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  suggestionContainer: {
    paddingHorizontal: 4,
  },
  suggestionTitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 16,
    paddingVertical: 6,
  },
});
