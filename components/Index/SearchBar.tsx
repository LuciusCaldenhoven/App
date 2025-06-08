import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import styles from "@/styles/feed.styles";

export default function SearchBar({ query }: { query: string }) {
  return (
    <View style={styles.searchContainer}>
      <Link href={{ pathname: "/search/searchOverlay", params: { query } }} asChild>
        <TouchableOpacity style={{ flexDirection: "row" }}>
          <Ionicons name="search" size={18} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="¿Qué quieres comprar?"
            placeholderTextColor="#666"
            style={styles.input}
            pointerEvents="none"
          />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
