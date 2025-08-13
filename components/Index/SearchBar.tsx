import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "@/styles/feed.styles";

export default function SearchBar({ query }: { query: string }) {
  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={() =>
        router.push({ pathname: "/search/searchOverlay", params: { query } })
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name="search"
          size={20}
          color="#4e5443"
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.input, { color: "#4e5443" }]}>
          ¿Qué quieres comprarrr?
        </Text>
      </View>
    </TouchableOpacity>
  );
}
