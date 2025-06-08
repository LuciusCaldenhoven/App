import React from "react";
import { View, Text, FlatList, TouchableOpacity, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Post from "@/components/Post";
import styles from "@/styles/feed.styles";
import { router } from "expo-router";

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
      api.posts.getFilteredPosts, {category: category}, { initialNumItems: initialItems });


  if (filteredPosts.length === 0) return null;

  return (
    <View>
      <View style={styles.SectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.iconWrapper2} onPress={() => router.push({ pathname: "/search/searchCategory", params: { category: category }, }) } >

          <Ionicons name="chevron-forward" size={18} color="#111" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPosts}
        horizontal
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
        ListFooterComponent={
          status === "CanLoadMore" ? (
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
