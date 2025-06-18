import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, Share, Modal } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/productDetail.styles";
import { Id } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { Loader } from "@/components/Loader";
import Animated, { interpolate, runOnJS, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useScrollViewOffset, useSharedValue } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@clerk/clerk-expo";
import ProductSellerInfo from "@/components/ProductSelleInfo/ProductSellerInfo";
import LoaderPosts from "@/components/loaders/loaderPosts";
import LoaderProductDetail from "@/components/loaders/loaderPosts";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 380;

export default function ProductDetail() {
    const { productId } = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useSharedValue(0);

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
                    scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });


    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
        };
    }, []);

    const formatPrice = (price: number, currency: string) => {
        const formatter = new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const formattedPrice = formatter.format(price);

        return currency.toLowerCase() === 'soles'
            ? `S/${formattedPrice}`
            : `$${formattedPrice}`;
    };

    const post = useQuery(
        api.posts.getBookmarkedPostById,
        productId ? { postId: productId as Id<"posts"> } : "skip"
    );

    const author = useQuery(api.users.getUserProfile, post?.userId ? { id: post.userId } : "skip");

    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

    const createChat = useMutation(api.chats.createChat);
    const existingChats = useQuery(api.chats.getChats);

    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

    const handleBookmark = async () => {
        await toggleBookmark({ postId: post!._id });
    };

    const shareListing = async () => {
        try {
            await Share.share({
                title: post?.title || "Mira este producto",
                url: `https://revende.com/post/${post?._id}`,
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

    const handleChat = async () => {
        try {
            const existingChat = existingChats?.find(
                (chat: any) =>
                    (currentUser?._id === chat.buyerId && post?.userId === chat.sellerId) ||
                    (currentUser?._id === chat.sellerId && post?.userId === chat.buyerId)
            );

            if (existingChat) {
                router.push(`/chat/${existingChat._id}`);
            } else {
                const newChat = await createChat({
                    sellerId: post?.userId as Id<"users">,
                });

                router.push(`/chat/${newChat}`);
            }
        } catch (error) {
            console.error("Error al manejar el chat:", error);
        }
    };

    if (!post || !author || !currentUser) {
        return <LoaderProductDetail />;
    }

    const allImageIds = [post.storageId, ...post.imageUrls];

    return (
        <>
            <StatusBar style="light" backgroundColor="white" />
            <View style={styles.container}>
                <Animated.View style={[styles.header, headerAnimatedStyle]}></Animated.View>
                <View style={styles.headerButtonsContainer}>
                    <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={20} />
                    </TouchableOpacity>
                    <View style={styles.rightButtons}>
                        <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
                            <Feather name="share" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={handleBookmark}>
                            <FontAwesome name={post?.isBookmarked ? "heart" : "heart-o"} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Animated.ScrollView contentContainerStyle={{ paddingBottom: 100 }} onScroll={scrollHandler} scrollEventThrottle={16}>

                    <Animated.FlatList
                        ref={flatListRef}
                        data={allImageIds}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        onScroll={handleScroll}
                        renderItem={({ item, index }) => (
                            <View style={styles.imageContainer}>
                                <ProductImageItem
                                    storageId={item as Id<"_storage">}
                                    animatedStyle={index === currentIndex ? imageAnimatedStyle : undefined}
                                />
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



                    <ProductSellerInfo post={post} author={author} />


                </Animated.ScrollView>
                <View style={styles.footer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={styles.footerText}>
                            <Text style={styles.price}>
                                {formatPrice(post.price, post.currency)}
                            </Text>
                        </View>
                        <TouchableOpacity style={[styles.btnn, { paddingRight: 20, paddingLeft: 20 }]} onPress={handleChat}>
                            <Text style={styles.btnText}>¡Mándale un mensaje!</Text>
                        </TouchableOpacity>
                    </View>
                </View>





            </View>
        </>
    );
}


function ProductImageItem({ storageId, animatedStyle, }: { storageId: Id<"_storage">; animatedStyle?: any; }) {
    const imageUrl = useQuery(api.posts.getImageUrl, { storageId });
    if (!imageUrl) return null;

    return (
        <TouchableOpacity activeOpacity={1}>
            <Animated.View style={[styles.image, animatedStyle]}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory"

                />
            </Animated.View>
        </TouchableOpacity>
    );
}