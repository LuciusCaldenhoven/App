import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePaginatedQuery } from "convex/react";
import { styles } from "@/components/search/search.styles";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import React, { useState } from "react";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import Filter from "./filter";
import ProductSkeleton from "@/components/loaders/ProductSkeleton";

export default function SearchPage() {
  const { category, nivel2, nivel3, nivel4, subcategory } = useLocalSearchParams();

  const [filterVisible, setFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    category: category || "",
    nivel2: nivel2 || "",
    nivel3: nivel3 || "",
    nivel4: nivel4 || "",
    subcategory: subcategory || "",
    type: "",
    condition: [] as string[],
    priceRange: [0, 1_000_000],
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
      search: false,
      category: Array.isArray(filters.category) ? filters.category[0] : (filters.category as string) || undefined,
      type: filters.type || undefined,
      condition: filters.condition.length > 0 ? filters.condition.join(",") : undefined,
      priceRange: filters.priceRange,
      date: filters.date || undefined,
      nivel2: Array.isArray(filters.nivel2) ? filters.nivel2[0] : (filters.nivel2 as string) || undefined,
      nivel3: Array.isArray(filters.nivel3) ? filters.nivel3[0] : (filters.nivel3 as string) || undefined,
      nivel4: Array.isArray(filters.nivel4) ? filters.nivel4[0] : (filters.nivel4 as string) || undefined,
      subcategory: Array.isArray(filters.subcategory) ? filters.subcategory[0] : (filters.subcategory as string) || undefined,
      // order: filters.order,
      // location: filters.location,
    },
    {
      initialNumItems: 10,
    }
  );

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderColor: "#e0e0e0",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontFamily: "Medium", fontSize: 21 }}>
            {category}
            {nivel2}
            {nivel3}
            {nivel4}
            {subcategory}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FontAwesome6 name="sliders" size={20} />
        </TouchableOpacity>
      </View>

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
          keyExtractor={(item) => String(item._id)}
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
        search={false}
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(appliedFilters) => {
          setFilters((prev) => ({ ...prev, ...appliedFilters }));
        }}
        category={Array.isArray(category) ? category[0] : (category as string)}
        nivel2={Array.isArray(nivel2) ? nivel2[0] : (nivel2 as string)}
        nivel3={Array.isArray(nivel3) ? nivel3[0] : (nivel3 as string)}
        nivel4={Array.isArray(nivel4) ? nivel4[0] : (nivel4 as string)}
        subcategory={Array.isArray(subcategory) ? subcategory[0] : (subcategory as string)}
      />
    </View>
  );
}

function NoSearchResults() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
      <Ionicons name="search-outline" size={80} color={COLORS.main} style={{ marginBottom: 20 }} />
      <Text style={{ fontSize: 22, fontFamily: "Medium", color: COLORS.main, marginBottom: 8 }}>
        No se encontraron resultados
      </Text>
      <Text style={{ fontSize: 16, color: "#888", textAlign: "center", fontFamily: "Regular" }}>
        Intenta modificar tu búsqueda o revisar los filtros aplicados.
      </Text>
    </View>
  );
}
