import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { History } from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import product from "@/assets/index/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOP_SEARCHES = ["Zapatillas", "Laptop gamer", "Celular usado", "Moto"];
const HISTORY_KEY = "expo_app_search_history";

export default function SearchOverlay() {
  const { query = "" } = useLocalSearchParams();
  const [search, setSearch] = useState(String(query));
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Cargar historial al montar
  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then(stored => {
      if (stored) setRecentSearches(JSON.parse(stored));
    });
  }, []);

  // Guardar historial cuando cambia
  useEffect(() => {
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = (text: string) => {
    const newSearch = text.trim();
    if (newSearch) {
      setRecentSearches((prev) => [
        newSearch,
        ...prev.filter((item) => item !== newSearch),
      ]);
      router.push({
        pathname: "/search/searchResults",
        params: { title: newSearch },
      });
    }
  };

  const onPressCategory = (title: string) => {
    handleSearch(title);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Barra de búsqueda */}
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
          onSubmitEditing={() => handleSearch(search)}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Historial de búsqueda */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <History color={COLORS.main} size={18} />
            <Text style={styles.sectionTitle}> Búsquedas recientes</Text>
          </View>
          {recentSearches.length === 0 ? (
            <Text style={styles.item}>No hay historial</Text>
          ) : (
            recentSearches.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleSearch(item)}>
                <Text style={styles.item}>• {item}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Top Categorías (con imágenes) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Categorías</Text>
          {product.topProducts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() =>
                router.push({
                  pathname: "/search/searchCategory",
                  params: { category: item.title },
                })
              }
            >
              {/* Usa imagen */}
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categorías (con imágenes) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          {product.products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() =>
                router.push({
                  pathname: "/search/searchCategory",
                  params: { category: item.title },
                })
              }
            >
              {/* Usa imagen */}
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top búsquedas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top búsquedas</Text>
          {TOP_SEARCHES.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleSearch(item)}>
              <Text style={styles.item}>• {item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.main,
    fontFamily: "SemiBold",
  },
  item: {
    fontSize: 16,
    paddingVertical: 6,
    color: "#222",
    fontFamily: "Medium",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  itemText: {
    fontSize: 16,
    color: "#222",
    fontFamily: "Medium",
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
    resizeMode: "contain",
  },
});
