import { Animated, FlatList, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/feed.styles";

import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import { useRef, useState } from "react";
import Search from "@/components/search/index"
import { useRouter } from "expo-router";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const translateY = useRef(new Animated.Value(0)).current;
  const [backgroundColor, setBackgroundColor] = useState<string>(COLORS.background);
  const [searchText, setSearchText] = useState("");
  const posts = useQuery(api.posts.getFeedPosts)

  if (posts === undefined) return <Loader />
  if (posts.length === 0) return <NoPostsFound />

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); }, 2000);
  };

  const handleFocus = () => {
    setBackgroundColor('red');
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleSearch = () => {
    if (searchText.trim() !== "") {
      router.push("/search/searchResults");
    }
  };


  return (
    
    <View style={styles.container}>
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <Ionicons name="location-outline" size={24} />
          <Text style={styles.location}>Arequipa, Peru</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.secondary} />
        }
      >
        {/* 🏆 Encabezado fijo con textos y barra de búsqueda */}
        <View style={{ backgroundColor: COLORS.background, paddingBottom: 10 }}>
          <Text style={{ fontFamily: "Bold", fontSize: SIZES.xxLarge - 6, marginTop: SIZES.xSmall, color: COLORS.black, marginHorizontal: 12 }}>
            Gana dinero extra
          </Text>
          <Text style={{ fontFamily: "Bold", fontSize: SIZES.xxLarge - 6, marginTop: 0, color: COLORS.primary, marginHorizontal: 12 }}>
            Sin esfuerzo
          </Text>

          {/* Barra de búsqueda */}
          <Animated.View style={[styles.actionRow, { transform: [{ translateY }], backgroundColor }]}>
            <TouchableOpacity style={styles.searchBtn} onPress={handleFocus}>
              <Ionicons name="search" size={24} color={COLORS.grey} />
              <TextInput
                style={styles.searchInput}
                placeholder={"¿Qué quieres comprar?"}
                placeholderTextColor={COLORS.grey}
                
                onSubmitEditing={handleSearch}
               
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Título de la sección */}
          <Text style={styles.titulo}>Las Novedadessss pa</Text>
        </View>

        {/* 🔄 Sección de productos con desplazamiento horizontal */}
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ columnGap: 0, paddingLeft: 12, paddingRight: 12 }}
        />

      </ScrollView>



    </View>
  );
}



const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);

