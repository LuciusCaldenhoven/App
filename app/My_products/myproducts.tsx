import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import styles from "../My_products/myproducts.styles";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import PostProduct from "@/components/PostProduct/PostProduct";
import PostSold from "@/components/PostSold/PostSold";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";


export default function MyProducts() {
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"En venta" | "Vendidos">("En venta");
  // Consulta para obtener los productos del usuario
  const posts = useQuery(api.posts.getNotSoldPostsByUser, {});
  const postsSold = useQuery(api.posts.getSoldPostsByUser, {});
  // Mostrar un loader mientras se cargan los datos
  if (!posts) return <Loader />;

  // Mostrar un mensaje si no hay productos
 

  // Función para manejar el refresco
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };


  const renderContent = () => {
    if (selectedTab === "En venta") {
      if (!posts || posts.length === 0) return <NoProductsFound />;
      return (
        <FlatList
        data={posts}
        numColumns={1}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: post }) => (
          <PostProduct
            post={{
              ...post,
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
      );
    } else {
      if (!postsSold || postsSold.length === 0) return <NoProductsFound />;
      return (
        <FlatList
        data={postsSold}
        numColumns={1}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: post }) => (
          <PostSold
            post={{
              ...post,
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
      );
    }
  };

  if (!posts) return <Loader />;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="chevron-left" size={35} color={COLORS.black} style={{ paddingLeft: 7,  }} />
      </TouchableOpacity>
      <Text style={styles.title}>
        {selectedTab === "En venta" ? "En venta" : "Vendidos"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedTab === "En venta" && styles.activeButton]}
          onPress={() => setSelectedTab("En venta")}
        >
          <Text style={[styles.buttonText, selectedTab === "En venta" && styles.activeButtonText]} > En venta </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedTab === "Vendidos" && styles.activeButton]}
          onPress={() => setSelectedTab("Vendidos")}
        >
          <Text style={[styles.buttonText, selectedTab === "Vendidos" && styles.activeButtonText]} > Vendidos </Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
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

