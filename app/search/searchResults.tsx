import { View, FlatList, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { styles } from "@/components/search/search.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useState } from "react";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import Filter from "./filter";
import Search from "@/components/search";

export default function SearchPage() {
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const [searchKey, setSearchKey] = useState(query ? String(query) : "");
  const [filterVisible, setFilterVisible] = useState(false);

  const allPosts = useQuery(api.posts.getFeedPosts);

  const searchResults = allPosts
    ? allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchKey.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      <Search shouldRedirect={false} />

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        onPress={() => {
          setFilterVisible(true);
        }}
      >
        <Ionicons name="filter" size={20} color={COLORS.primary} />
        <Text style={{ color: COLORS.primary, fontSize: 15 }}>Ver filtros</Text>
      </TouchableOpacity>

      {searchResults.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Image
            source={require("@/assets/images/Pose23.png")}
            style={styles.searchImage}
          />
          <Text style={styles.noResultsText}>No se encontraron resultados</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Post post={item} />}
        />
      )}

      <Filter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={(filters) => {
          console.log("Filtros aplicados:", filters);
        }}
      />
    </View>
  );
}
