import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { styles } from "@/styles/bookmarks.styles";
import { useState } from "react";
import PostFav from "@/components/PostFav/PostFav";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);
  const [refreshing, setRefreshing] = useState(false);

  if (bookmarkedPosts === undefined) return <Loader />;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      {bookmarkedPosts.length === 0 ? (
        <NoBookmarksFound />
      ) : (
        <FlatList
          data={bookmarkedPosts.filter((post) => post !== null)}
          numColumns={1}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: post }) =>
            post && (
              <PostFav
                post={{
                  ...post,
                  isBookmarked: true,
                  author: { _id: "", username: "Desconocido", image: "" }
                }}
              />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.main}
            />
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
      <Ionicons name="bookmark-outline" size={80} color={COLORS.main} style={{ marginBottom: 20 }} />

      <Text style={{ fontSize: 22, fontWeight: "600", color: COLORS.main, marginBottom: 8 }}>
        Sin favoritos aún
      </Text>

      <Text style={{ fontSize: 16, color: "#888", textAlign: "center", marginBottom: 24 }}>
        Todavía no has guardado ninguna publicación.
      </Text>

      <TouchableOpacity style={styles.favoritosText} onPress={() => { router.push("/") }} >
        <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>
          Explorar productos
        </Text>
      </TouchableOpacity>
    </View>
  );

}