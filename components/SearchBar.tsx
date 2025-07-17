import { View, TextInput, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SearchBar({ initialQuery, onSearch }: { initialQuery: string; onSearch: (text: string) => void }) {
  const [input, setInput] = useState(initialQuery);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={18} color="#666" style={{ marginRight: 8 }} />
      <TextInput
        placeholder="¿Qué quieres comprar?"
        placeholderTextColor="#666"
        style={styles.input}
        value={input}
        onChangeText={setInput}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F7FA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "Regular",
  },
});
