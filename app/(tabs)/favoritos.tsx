import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { styles } from "@/styles/bookmarks.styles";
import { useState } from "react";
import PostFav from "@/components/PostFav/PostFav";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import snap from "@/assets/animations/Chasquido.json";

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);
  
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      {bookmarkedPosts === undefined ? (
        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 200 }}>
          <LottieView
            source={snap}
            autoPlay
            loop
            style={{ width: 240, height: 240 }}
          />
        </View>
      ) : bookmarkedPosts.length === 0 ? (
        <NoBookmarksFound />
      ) : (
        <FlatList
          data={bookmarkedPosts.filter((post) => post !== null)}
          numColumns={1}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: post }) =>
            post && (
              <PostFav post={post} />
            )
          }
          
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function NoBookmarksFound() {
  return (
    <View style={styles.favoritosContainer}>
      <Ionicons
        name="bookmark-outline"
        size={80}
        color={COLORS.main}
        style={{ marginBottom: 20 }}
      />

      <Text style={{ fontSize: 22, fontFamily:"Medium", color: COLORS.main, marginBottom: 8 }}>
        Sin favoritos aún
      </Text>

      <Text style={{ fontSize: 16, color: "#888", textAlign: "center", marginBottom: 24, fontFamily:"Regular" }}>
        Todavía no has guardado ninguna publicación.
      </Text>

      
    </View>
  );
}
