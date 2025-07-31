import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import styles from "@/styles/feed.styles";

export default function SearchBar({ query }: { query: string }) {
  return (
    <View style={styles.searchContainer}>

        <TouchableOpacity style={{flexDirection: "row", alignItems: "center",}} onPress={() => router.push({ pathname: "/search/searchOverlay", params: { query } })}>
          <Ionicons name="search" size={20} color="#4e5443" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="¿Qué quieres comprar?"
            placeholderTextColor="#4e5443"
            style={styles.input}
            pointerEvents="none"
          />
        </TouchableOpacity>

    </View>
  );
}
