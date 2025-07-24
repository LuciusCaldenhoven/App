import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import styles from "./myproducts.styles";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import PostProduct from "@/components/PostProduct/PostProduct";
import PostSold from "@/components/PostSold/PostSold";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import snap from "@/assets/animations/Chasquido.json";
import LottieView from "lottie-react-native";


export default function MyProducts() {
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"En venta" | "Vendidos">("En venta");
  const [showAnimation, setShowAnimation] = useState(false);

  const posts = useQuery(api.posts.getNotSoldPostsByUser, {});
  const postsSold = useQuery(api.posts.getSoldPostsByUser, {});

  if (!posts ) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LottieView
          source={snap}
          autoPlay
          loop
          style={{
            width: 220,
            height: 220,
          }}
        />
      </View>
    );
  }




  const onRefresh = () => {
    setRefreshing(true);
    setShowAnimation(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
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
                isBookmarked: false,
                author: { _id: userId || "", username: "Tú", image: "" },
              }}
            />
          )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.main}
          />
        }
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      if (!postsSold || postsSold.length === 0) return <NoProductsSold />;
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
                isBookmarked: false,
                author: { _id: userId || "", username: "Tú", image: "" },
              }}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.main}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

  if (!posts ) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <LottieView
        source={snap}
        autoPlay
        loop
        style={{
          width: 220,
          height: 220,
        }}
      />
    </View>
  );
}

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="chevron-left" size={35} color={COLORS.black} style={{ paddingLeft: 7, }} />
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, }} >
      <Text style={{ color: COLORS.main, fontSize: 20, fontWeight: '600', marginBottom: 6 }}>
        Aún no has publicado productos
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 24, textAlign: 'center' }}>
        Empieza a vender o alquilar algo en minutos
      </Text>
      <TouchableOpacity
        onPress={() => router.replace('/publicar')}
        style={{
          flexDirection: 'row',
          backgroundColor: COLORS.main,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Plus size={18} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Publicar ahora</Text>
      </TouchableOpacity>
    </View>
  );
}



function NoProductsSold() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, }} >
      <Text style={{ color: COLORS.main, fontSize: 20, fontWeight: '600', marginBottom: 6 }}>
        Aún no has vendido productos
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 24, textAlign: 'center' }}>
        Empieza a vender o alquilar algo en minutos
      </Text>
      
    </View>
  );
}
