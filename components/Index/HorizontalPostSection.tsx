import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Post from "@/components/Post";
import styles from "@/styles/feed.styles";
import { router } from "expo-router";
import ProductSkeleton from "../loaders/ProductSkeleton";

type Props = {
  title: string;
  category?: string;
  subcategory?: string;
};

const HorizontalPostSection = ({ title, category = "", subcategory = "" }: Props) => {

  const data = useQuery(api.posts.getFeed, { category: category, subcategory: subcategory });

  const feedItems = data ? [...data.recent, ...data.random] : [];

  const isLoading = !data;

  return (
    <View>
      <View style={styles.SectionContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconWrapper2}
          onPress={() =>
            router.push({
              pathname: "/search/searchCategory",
              params: { category },
            })
          }
        >
          <Ionicons name="chevron-forward" size={18} color="#111" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={isLoading ? Array.from({ length: 4 }) : feedItems}
        horizontal
        renderItem={({ item, index }) => {
          if (isLoading) {
            return <ProductSkeleton key={index} />;
          }
          return <Post post={item as any} />;
        }}
        keyExtractor={(item, index) =>
          isLoading ? `skeleton-${index}` : (item as any)._id
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
      />
    </View>
  );
};

export default HorizontalPostSection;
