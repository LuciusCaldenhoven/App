import { View, TextInput, FlatList, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { styles } from "@/styles/search.styles";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useState } from "react";
import Post from "@/components/Post";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import Filter from "./filter";

type PostProps = {
  _id: Id<"posts">;
  userId: Id<"users">;
  imageUrl: string;
  imageUrls: string[];
  caption?: string;
  title: string;
  price: number;
  category: string;
  location: string;
  condition: "new" | "used";
  likes: number;
  comments: number;
  _creationTime: number;
  isBookmarked: boolean;
  author: {
    _id: Id<"users">;
    username: string;
    image: string;
  };
};


export default function SearchPage() {
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const [searchKey, setSearchKey] = useState(query ? String(query) : "");
  const [searchResults, setSearchResults] = useState<PostProps[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);



  const allPosts = useQuery(api.posts.getFeedPosts);

  const handleSearch = () => {
    if (!allPosts || searchKey.trim() === "") return;

    const filteredResults = allPosts.filter((post) =>
      post.title.toLowerCase().includes(searchKey.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  return (
    <View style={styles.container}>
      {/* 🔎 Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchKey}
            onChangeText={setSearchKey}
            placeholder="¿Qué estás buscando?"
            placeholderTextColor={COLORS.grey}
            autoFocus
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Feather name="search" size={24} color={COLORS.offwhite} />
        </TouchableOpacity>



        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={24} color={COLORS.offwhite} />
        </TouchableOpacity>

      </View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        onPress={() => {
          setFilterVisible(true); // 👈 Esto abre el Bottom Sheet
        }}
      >
        <Ionicons name="filter" size={20} color={COLORS.primary} />
        <Text style={{ color: COLORS.primary, fontSize: 15 }}>Ver filtros</Text>
      </TouchableOpacity>
      {/* 📌 Mostrar imagen si no hay resultados */}
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
        // Aquí podrías aplicar lógica con searchPrompt más adelante
      }}
    />
    </View>
  );
  
}
