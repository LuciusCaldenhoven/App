import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Share,
  Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/productDetail.styles";
import { Id } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { Loader } from "@/components/Loader";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@clerk/clerk-expo";
import ProductSellerInfo from "@/components/ProductSelleInfo/ProductSellerInfo";
import ImageView from "react-native-image-viewing";
import LoaderProductDetail from "@/components/loaders/loaderPosts";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Leaf, PiggyBank, Recycle } from "lucide-react-native";
import DiscountModal from "@/components/DiscountInfo/DiscountModal";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 380;

export default function ProductDetail() {
  const { productId } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);

  const scrollOffset = useSharedValue(0);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });
  const flatListRef = useAnimatedRef<Animated.FlatList<any>>();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);



  const post = useQuery(
    api.posts.getBookmarkedPostById,
    productId ? { postId: productId as Id<"posts"> } : "skip"
  );

  const author = useQuery(
    api.users.getUserProfile,
    post?.userId ? { id: post.userId } : "skip"
  );

  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

  const { userId } = useAuth();
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const allImageIds = post ? [post.storageId, ...(post.imageUrls || [])] : [];
  const imageUrls =
    useQuery(api.posts.getAllImageUrls, { storageIds: allImageIds }) || [];

  const imagesForModal = imageUrls
    .filter((url): url is string => !!url)
    .map((url) => ({ uri: url }));

  const handleBookmark = async () => {
    await toggleBookmark({ postId: post!._id });
  };

  const shareListing = async () => {
    try {
      await Share.share({
        title: post?.title || "Mira este producto",
        url: `https://Diuna.com/post/${post?._id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  if (!post || !author || !currentUser) {
    return <LoaderProductDetail />;
  }

  return (
    <>
    <StatusBar style="auto" />
      <View style={styles.container}>
        <Animated.View style={[styles.header, headerAnimatedStyle]} ></Animated.View>
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity style={styles.roundButton} onPress={() => router.back()} >
            <Ionicons name="chevron-back" size={20} />
          </TouchableOpacity>
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
              <Feather name="share" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={handleBookmark}
            >
              <FontAwesome
                name={post?.isBookmarked ? "heart" : "heart-o"}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Animated.ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Animated.FlatList
            ref={flatListRef}
            data={imagesForModal} // <-- Aquí pasas directamente los links ya resueltos
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onScroll={handleScroll}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setIsVisible(true);
                  }}
                >
                  <Animated.View
                    style={[
                      styles.image,
                      index === currentIndex ? imageAnimatedStyle : undefined,
                    ]}
                  >
                    <Image
                      source={item}
                      style={[styles.image, { width, height: 380, backgroundColor: "#f0f0f0" }]}
                      contentFit="cover"
                      transition={200}
                      cachePolicy="memory-disk"
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            )}
          />

          {allImageIds.length > 0 && (
            <View style={styles.imageIndicator}>
              <Text style={styles.imageIndicatorText}>
                {currentIndex + 1} / {allImageIds.length}
              </Text>
            </View>
          )}

          <ProductSellerInfo
            post={post}
            author={author}
            bottomSheetRef={bottomSheetRef}
            openBottomSheet = {openBottomSheet}
          />

          
           <DiscountModal bottomSheetRef={bottomSheetRef} />        
        </Animated.ScrollView>

        <ImageView
          images={imagesForModal}
          imageIndex={currentIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </View>
    </>
  );
}
