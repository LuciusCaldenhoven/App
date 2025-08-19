import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePaginatedQuery } from "convex/react";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { COLORS } from "@/constants/theme";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import Filter from "./filter";
import SearchBar from "@/components/SearchBar";
import ProductSkeleton from "@/components/loaders/ProductSkeleton";

export default function SearchPage() {
  const { title, category } = useLocalSearchParams();

  const [filterVisible, setFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    title: Array.isArray(title) ? title[0] : (title as string) || "",
    category: Array.isArray(category) ? category[0] : (category as string) || "",
    type: "",
    condition: [] as string[],
    priceRange: [0, 1000000],
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
      search: true,
      title: Array.isArray(filters.title) ? filters.title[0] : filters.title || undefined,
      category: Array.isArray(filters.category) ? filters.category[0] : filters.category || undefined,
      type: filters.type || undefined,
      condition: filters.condition.length > 0 ? filters.condition.join(",") : undefined,
      priceRange: filters.priceRange,
      date: filters.date || undefined,
    },
    { initialNumItems: 20 }
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: 50 }}>
      {/* Barra superior */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderColor: "#e0e0e0",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} style={{ marginRight: 20, paddingLeft: 20 }} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <SearchBar
            initialQuery={Array.isArray(filters.title) ? filters.title[0] : (filters.title as string)}
            onSearch={(newTitle) =>
              setFilters((prev) => ({
                ...prev,
                title: newTitle,
              }))
            }
          />
        </View>

        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FontAwesome6 name="sliders" size={20} style={{ marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      {isLoading ? (
        <FlatList
          data={Array.from({ length: 8 })}
          numColumns={2}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <ProductSkeleton />}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12, marginBottom: 16 }}
          contentContainerStyle={{ paddingTop: 20 }}
        />
      ) : filteredPosts.length === 0 ? (
        <NoSearchResults />
      ) : (
        <FlatList
          data={filteredPosts}
          numColumns={2}
          keyExtractor={(item) => `${item._id}`}
          renderItem={({ item }) => <Post post={item} />}
          onEndReached={() => {
            if (status === "CanLoadMore") loadMore(10);
          }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      )}

      {/* Modal de filtros */}
      <Filter
      search={true}
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(appliedFilters) => {
          setFilters(appliedFilters);
        }}
        title={Array.isArray(filters.title) ? filters.title[0] : (filters.title as string)}
        category={Array.isArray(filters.category) ? filters.category[0] : (filters.category as string)}
      />
    </View>
  );
}

function NoSearchResults() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
      <Ionicons name="search-outline" size={80} color={COLORS.main} style={{ marginBottom: 20 }} />
      <Text style={{ fontSize: 22, fontWeight: "600", color: COLORS.main, marginBottom: 8 }}>
        No se encontraron resultados
      </Text>
      <Text style={{ fontSize: 16, color: "#888", textAlign: "center" }}>
        Intenta modificar tu búsqueda o revisar los filtros aplicados.
      </Text>
    </View>
  );
}
