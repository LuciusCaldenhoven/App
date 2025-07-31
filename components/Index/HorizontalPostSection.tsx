import React from "react";
import { View, Text, FlatList, TouchableOpacity, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Post from "@/components/Post";
import styles from "@/styles/feed.styles";
import { router } from "expo-router";
import ProductSkeleton from "../loaders/ProductSkeleton";
import { Bike } from "lucide-react-native";

type Props = {
  title: string;
  category: string;
  initialItems?: number;
};

const HorizontalPostSection = ({ title, category = "", initialItems = 8 }: Props) => {
  const {
    results: filteredPosts,
    loadMore,
    status,
    isLoading,
  } = usePaginatedQuery(
    api.posts.getFilteredPosts, { category: category }, { initialNumItems: initialItems });




  return (
    <View>
      <View style={styles.SectionContainer}>
       <View style={{flexDirection: "row", alignItems: "center", gap: 12, }}>
         <Bike size={27} color="#adc92b" strokeWidth={2.2}/>
        <Text style={styles.sectionTitle}>{title}</Text>
       </View>
        <TouchableOpacity style={styles.iconWrapper2} onPress={() => router.push({ pathname: "/search/searchCategory", params: { category: category }, })} >

          <Ionicons name="chevron-forward" size={18} color="#111" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={isLoading ? Array.from({ length: 4 }) : filteredPosts}
        horizontal
        renderItem={({ item, index }) => {
          if (isLoading) {
            return <ProductSkeleton key={index} />;
          }

          // Asegura que item tiene el tipo correcto
          return <Post post={item as any} />;
        }}
        keyExtractor={(item, index) =>
          isLoading ? `skeleton-${index}` : (item as any)._id
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
        ListFooterComponent={
          !isLoading && status === "CanLoadMore" ? (
            <TouchableOpacity
              onPress={() => loadMore(initialItems)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
                marginRight: 20,
                backgroundColor: "#111",
                borderRadius: 8,
                height: 140,
                width: 120,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                Ver más
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

    </View>
  );
};

export default HorizontalPostSection;
