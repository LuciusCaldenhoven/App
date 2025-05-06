import { View, FlatList, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { styles } from "@/components/search/search.styles";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useState } from "react";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import Filter from "./filter";
import Search from "@/components/search";

export default function SearchPage() {
  const { query, category } = useLocalSearchParams(); // Obtén la categoría de los parámetros
  const [searchKey, setSearchKey] = useState(query ? String(query) : "");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: category || "", // Usa la categoría recibida como filtro inicial
    type: "",
    condition: [],
    priceRange: [0, 1500],
    date: "",
  });

  // Consulta los posts filtrados directamente desde Convex
  const filteredPosts = useQuery(api.posts.getFilteredPosts, {
    category: Array.isArray(filters.category) ? filters.category.join(",") : filters.category,
    type: filters.type,
    condition: filters.condition.join(","), 
    priceRange: filters.priceRange,
    date: filters.date,
  });

  // Filtrar los resultados de búsqueda por el término de búsqueda
  const searchResults = filteredPosts
    ? filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(searchKey.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda y botón de filtros */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} style={{ marginRight: 20,paddingLeft: 20  }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Search shouldRedirect={false} />
        </View>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FontAwesome6 name="sliders" size={20} style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>

      {/* Mostrar estado de carga o resultados */}
      {filteredPosts === undefined ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : searchResults.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Image
            source={require("@/assets/images/Pose23.png")}
            style={styles.searchImage}
          />
          <Text style={styles.noResultsText}>No se encontraron resultados</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Post
              post={ item }
            />
          )}
        />
      )}

      {/* Componente de filtros */}
      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(appliedFilters) => {
          console.log("Filtros aplicados:", appliedFilters);
          setFilters(appliedFilters);
        }}
      />
    </View>
  );
}
