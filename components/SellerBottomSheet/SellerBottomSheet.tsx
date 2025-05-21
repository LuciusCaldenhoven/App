import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, Pressable } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { styles } from "../SellerBottomSheet/SelletBottomSheet.styles";
import { Image } from "expo-image";
import ReviewComponent from "@/components/review/component";
import PostBig from "@/components/postBig/postBig";
import { router } from "expo-router";
import Animated, { useAnimatedStyle, interpolate, useSharedValue } from "react-native-reanimated";
import { Loader } from "../Loader";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ReviewComponentVertical from "../ReviewComponentVertical/ReviewComponentVertical";

type SellerBottomSheetProps = {
  author: any;
  posts: any[];
  visible: boolean;
  onClose: () => void;
};


export default function SellerBottomSheet({ author, posts, visible, onClose }: SellerBottomSheetProps) {
  const scrollOffset = useSharedValue(0);
  const postsSold = useQuery(api.posts.getSoldPostsByUser, {});
  const [showAllReviews, setShowAllReviews] = useState(false);


  if (!author || !posts) return <Loader />; // Manejo de errores

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, 100], [0, 1]),
    };
  });

  const handleScroll = (event: any) => {
    scrollOffset.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { onClose() }} >
      <View style={styles.headerButtonsContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={onClose}>
          <Feather name="share" size={22} color="black" />
        </TouchableOpacity>
      </View>
      {/* Header animado */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
      </Animated.View>

      {/* Contenido principal */}
      <ScrollView style={styles.bottomContainer} contentContainerStyle={{ paddingBottom: 100 }} onScroll={handleScroll} scrollEventThrottle={16} >


        {/* Información del autor */}
        <View style={styles.card}>
          {author && <Image source={{ uri: author.image }} style={styles.avatar} />}
          <Text style={styles.textName}>{author && author.fullname.split(" ")[0]}</Text>
          {author.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={22} color="grey" />
              <Text style={styles.textLocation}> {author.location}</Text>
            </View>)}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <AntDesign name="star" size={16} color="#FF5A5F" style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#333" }}>
              {(author.averageRating ?? 0).toFixed(1)}
            </Text>

            <View style={styles.ventasContainer} />
            <Text style={{ fontSize: 15, color: "#555" }}>
              {postsSold?.length} ventas
            </Text>
          </View>
        </View>

        {author.bio && (
          <View style={{ marginTop: 12, paddingHorizontal: 20 }}>
            <Text style={styles.bioText} >
              {author.bio}
            </Text>
          </View>
        )}


        {/* Reseñas */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 20, marginTop: 24, marginBottom: 12 }}>
          <Text style={styles.textReview}>Reseñas de {author && author.fullname.split(" ")[0]}</Text>
          <Pressable onPress={() => setShowAllReviews(true)}>
            <Text style={{ fontSize: 14, color: "#007AFF", fontWeight: "500" }}>Ver más</Text>
          </Pressable >
        </View>


        {author && <ReviewComponent sellerId={author._id} />}



        {/* Posts del vendedor */}
        <Text style={styles.textReview}>Productos de {author && author.fullname.split(" ")[0]}</Text>

        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostBig
              post={{
                ...item,
                author: { username: "Unknown", image: "", _id: "" },
              }}
              onPressPost={() => {
                onClose();
                router.push(`/product/${item._id}`);
              }}
            />
          )}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />


        <ReviewComponentVertical
          visible={showAllReviews}
          onClose={() => setShowAllReviews(false)}
          sellerId={author._id}
        />
      </ScrollView>
    </Modal>
  );
}