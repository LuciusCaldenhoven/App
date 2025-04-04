import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { styles } from "@/styles/bookmarks.styles";
import { useState } from "react";

import VerticalPost from "@/components/verticalPost";

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);
  const [refreshing, setRefreshing] = useState(false);

  if (bookmarkedPosts === undefined) return <Loader />;
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

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

      {/* 📌 Grid de productos guardados */}
      <FlatList
        data={bookmarkedPosts.filter((post) => post !== null)}
        numColumns={1}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        
        renderItem={({ item: post }) =>
          post && (
            <VerticalPost
              post={{
                ...post,
                isBookmarked: true, // 🔥 Ya sabemos que está en favoritos
                author:  { _id: "", username: "Desconocido", image: "" }
              }}
            />
          )
        }
        
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function NoBookmarksFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>No bookmarked posts yet</Text>
    </View>
  );
}
