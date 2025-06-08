import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePaginatedQuery } from "convex/react";
import { styles } from "@/components/search/search.styles";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useState } from "react";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import Filter from "./filter";
import Search from "@/components/search";
import Fuse from "fuse.js";

export default function SearchPage() {
  const { query, category } = useLocalSearchParams();
  const [searchKey, setSearchKey] = useState(query ? String(query) : "");
  const [filterVisible, setFilterVisible] = useState(false);
  
  const [filters, setFilters] = useState({
    category: category || "",
    type: "",
    condition: [],
    priceRange: [0, 15000],
    date: "",
  });

  const {
    results: filteredPosts,
    loadMore,
    status,
    isLoading,
  } = usePaginatedQuery(
    api.posts.getFilteredPosts,
    {
      category: Array.isArray(filters.category) ? filters.category[0] : filters.category || undefined,
      type: filters.type || undefined,
      condition: filters.condition.length > 0 ? filters.condition.join(",") : undefined,
      priceRange: filters.priceRange,
      date: filters.date || undefined,
      // order: filters.order,
      // location: filters.location,
    },
    {
      initialNumItems: 10,
    }
  );

  const searchResults = (() => {
    if (!filteredPosts || !Array.isArray(filteredPosts)) return [];

    const fuse = new Fuse(filteredPosts, {
      keys: ["title"],
      threshold: 0.3,
    });

    return searchKey.trim()
      ? fuse.search(searchKey).map((res) => res.item)
      : filteredPosts;
  })();

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} style={{ marginRight: 20, paddingLeft: 20 }} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Search shouldRedirect={false} />
        </View>

        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FontAwesome6 name="sliders" size={20} style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={COLORS.main} />
        </View>
      ) : searchResults.length === 0 ? (
        <NoSearchResults />
      ) : (
        <FlatList
          data={searchResults}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Post post={item} />}
          onEndReached={() => {
            if (status === "CanLoadMore") loadMore(10);
          }}
          onEndReachedThreshold={0.5}
        />
      )}

      {/* Modal de filtros */}
      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(appliedFilters) => {
          setFilters(appliedFilters);
        }}
      />
    </View>
  );
}

function NoSearchResults() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
      <Ionicons
        name="search-outline"
        size={80}
        color={COLORS.main}
        style={{ marginBottom: 20 }}
      />
      <Text style={{ fontSize: 22, fontWeight: "600", color: COLORS.main, marginBottom: 8 }}>
        No se encontraron resultados
      </Text>
      <Text style={{ fontSize: 16, color: "#888", textAlign: "center" }}>
        Intenta modificar tu búsqueda o revisar los filtros aplicados.
      </Text>
    </View>
  );
}
