import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import  styles  from "../My_products/myproducts.styles";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import VerticalPost from "@/components/verticalPost";
import { Id } from "@/convex/_generated/dataModel";

export default function MyProducts() {
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();

  // Consulta para obtener los productos del usuario
  const posts = useQuery(api.posts.getPostsByUser, {});

  // Mostrar un loader mientras se cargan los datos
  if (!posts) return <Loader />;

  // Mostrar un mensaje si no hay productos
  if (posts.length === 0) return <NoProductsFound />;

  // Función para manejar el refresco
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Productos</Text>
      </View>

      {/* Lista de productos del usuario */}
      <FlatList
        data={posts}
        numColumns={1}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: post }) => (
          <VerticalPost
            post={{
              ...post,
              isBookmarked: false, // No es necesario marcar como favorito
              author: { _id: userId || "", username: "Tú", image: "" },
            }}
          />
        )}
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

function NoProductsFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>
        No tienes productos
      </Text>
    </View>
  );
}