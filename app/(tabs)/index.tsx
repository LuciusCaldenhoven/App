import { FlatList, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import { useState } from "react";
import Search from "@/app/search/index"

export default function Index() {
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const posts = useQuery(api.posts.getFeedPosts)

  if (posts === undefined) return <Loader />
  if (posts.length === 0) return <NoPostsFound />

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.secondary}
          />
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
          <View style={{ paddingHorizontal: 8 }}>
            <Search />
          </View>

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

