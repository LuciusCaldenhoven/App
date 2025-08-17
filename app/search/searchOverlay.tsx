import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { History } from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 👇 usamos tus datos e íconos actuales
import DATA from "@/assets/categoria/all";
import { CATEGORY_ICON_BY_SLUG, slugify } from "@/assets/categoria/iconMap";

const HISTORY_KEY = "expo_app_search_history";

// Ícono por defecto si algún slug no tiene ícono en el mapa
const FallbackIcon = ({ size = 24, color = "#888", style }: any) => (
  <Ionicons name="pricetag-outline" size={size} color={color} style={style} />
);

// (Opcional) orden destacado de “Top categorías” por slug.
// Solo se mostrarán si existen en DATA. Ajusta el orden/nombres a tus slugs reales.
const TOP_CATEGORY_SLUGS = [
  "moda-y-accesorios",
  "vehiculos",
  "electronica",
  "deportes",
  "hogar-y-jardin",
  "muebles",
];

type RootTree = Record<string, unknown>;

export default function SearchOverlay() {
  const { query = "" } = useLocalSearchParams();
  const [search, setSearch] = useState(String(query));
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const ROOT = DATA as RootTree;

  const allCategories = useMemo(() => {
    return Object.keys(ROOT).map((title) => {
      const slug = slugify(title);
      const IconComp = CATEGORY_ICON_BY_SLUG[slug] || FallbackIcon;
      return { id: slug, title, slug, IconComp };
    });
  }, [ROOT]);

  const topCategories = useMemo(() => {
    const bySlug: Record<string, (typeof allCategories)[number]> = {};
    for (const cat of allCategories) bySlug[cat.slug] = cat;

    const curated = TOP_CATEGORY_SLUGS
      .map((slug) => bySlug[slug])
      .filter(Boolean) as (typeof allCategories)[number][];

    return curated.length ? curated : allCategories.slice(0, 6);
  }, [allCategories]);

  // --- Historial ---
  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then((stored) => {
      if (stored) setRecentSearches(JSON.parse(stored));
    });
  }, []);

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

  const removeRecentSearch = (itemToRemove: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== itemToRemove));
  };

  const goToCategory = (title: string) => {
    router.push({
      pathname: "/search/searchCategory",
      params: { category: title },
    });
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
          keyboardAppearance="light"
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
              <View key={`${item}-${index}`} style={styles.recentItemContainer}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSearch(item)}>
                  <Text style={styles.item}>• {item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeRecentSearch(item)}>
                  <Ionicons name="close" size={18} color="#888" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Top Categorías (desde DATA) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Categorías</Text>
          {topCategories.map((cat) => (
            <TouchableOpacity
              key={`top-${cat.slug}`}
              style={styles.itemContainer}
              onPress={() => goToCategory(cat.title)}
            >
              {typeof cat.IconComp === "function" ? (
                <cat.IconComp size={24} color="#888" style={{ marginRight: 12 }} />
              ) : (
                <Image source={cat.IconComp} style={{ width: 24, height: 24, marginRight: 12 }} resizeMode="contain" />
              )}
              <Text style={styles.itemText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Todas las Categorías (desde DATA) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          {allCategories.map((cat) => (
            <TouchableOpacity
              key={`all-${cat.slug}`}
              style={styles.itemContainer}
              onPress={() => goToCategory(cat.title)}
            >
              {typeof cat.IconComp === "function" ? (
                <cat.IconComp size={24} color="#888" style={{ marginRight: 12 }} />
              ) : (
                <Image source={cat.IconComp} style={{ width: 24, height: 24, marginRight: 12 }} resizeMode="contain" />
              )}
              <Text style={styles.itemText}>{cat.title}</Text>
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
    fontFamily: "Regular",
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
  recentItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
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
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 17,
    color: "#222",
    fontFamily: "Medium",
  },
});
