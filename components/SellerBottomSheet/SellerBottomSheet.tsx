import React from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { styles } from "../SellerBottomSheet/SelletBottomSheet.styles";
import { Image } from "expo-image";
import ReviewComponent from "@/components/review/component";
import PostBig from "@/components/postBig/postBig";
import { router } from "expo-router";
import { renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import Animated, { useAnimatedStyle, interpolate, useSharedValue } from "react-native-reanimated";

type SellerBottomSheetProps = {
  author: any;
  posts: any[];
  setShowBottomSheet: (visible: boolean) => void;
};

export default function SellerBottomSheet({
  author,
  posts,
  setShowBottomSheet,
}: SellerBottomSheetProps) {
  const scrollOffset = useSharedValue(0);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, 100], [0, 1]), // Desaparece al desplazarse
    };
  });

  const handleScroll = (event: any) => {
    scrollOffset.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <GestureHandlerRootView style={{ flex: 0.9 }}>
      {/* Botón de cerrar (Siempre visible) */}
      <View style={styles.headerButtonsContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={() => setShowBottomSheet(false)}>
          <AntDesign name="close" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={() => setShowBottomSheet(false)}>
          <Feather name="share" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Header animado */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
      </Animated.View>

      {/* Contenido principal */}
      <ScrollView
        style={styles.bottomContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderMarginBottom(40)}

        {/* Información del autor */}
        <View style={styles.card}>
          {author && <Image source={{ uri: author.image }} style={styles.avatar} />}
          <Text style={styles.textName}>{author && author.fullname.split(" ")[0]}</Text>
        </View>

        {/* Reseñas */}
        <Text style={styles.textReview}>Reseñas de {author && author.fullname.split(" ")[0]}</Text>
        {renderMarginTop(8)}
        {author && <ReviewComponent sellerId={author._id} horizontal={true} />}
        {renderMarginBottom(20)}

        {/* Posts del vendedor */}
        <Text style={styles.textReview}>Productos de {author && author.fullname.split(" ")[0]}</Text>
        {renderMarginBottom(15)}
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostBig
              post={{
                ...item,
                author: { username: "Unknown", image: "", _id: "" },
              }}
              onPressPost={() => {
                setShowBottomSheet(false);
                router.push(`/product/${item._id}`);
              }}
            />
          )}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
}