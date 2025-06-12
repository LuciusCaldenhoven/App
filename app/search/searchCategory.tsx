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
import ProductSkeleton from "@/components/loaders/ProductSkeleton";


export default function SearchPage() {
    const { category } = useLocalSearchParams();
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


    return (
        <View style={styles.container}>
            {/* Barra superior */}
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingBottom: 10 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} style={{ marginRight: 20, paddingLeft: 20 }} />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Medium', fontSize: 22 }}>{category}</Text>
                </View>

                <TouchableOpacity onPress={() => setFilterVisible(true)}>
                    <FontAwesome6 name="sliders" size={20} style={{ marginHorizontal: 10 }} />
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
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <Post post={item} />}
                    onEndReached={() => {
                        if (status === "CanLoadMore") loadMore(10);
                    }}
                    columnWrapperStyle={{ justifyContent: "space-between", }}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{ paddingHorizontal: 12, }}
                />
            )}

            {/* Modal de filtros */}
            <Filter
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApplyFilters={(appliedFilters) => { setFilters(appliedFilters); }}
                category={Array.isArray(category) ? category[0] : category}
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
