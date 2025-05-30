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
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import Animated, { interpolate, runOnJS, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import SellerBottomSheet from "@/components/SellerBottomSheet/SellerBottomSheet";
import { useAuth } from "@clerk/clerk-expo";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 380;

export default function ProductDetail() {
    const { productId } = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef.current ? scrollRef : null);
    const flatListRef = useAnimatedRef<Animated.FlatList<any>>();

    const imageAnimatedStyle = useAnimatedStyle(() => ({
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
    }));

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]);

        if (opacity >= 1) {
            runOnJS(setStatusBarStyle)("dark");
        } else {
            runOnJS(setStatusBarStyle)("light");
        }

        return {
            opacity,
        };
    }, []);

    const post = useQuery(
        api.posts.getBookmarkedPostById,
        productId ? { postId: productId as Id<"posts"> } : "skip"
    );

    const author = useQuery(api.users.getUserProfile, post?.userId ? { id: post.userId } : "skip");

    const posts = useQuery(
        api.posts.getPostsByUser,
        author?._id ? { userId: author._id } : "skip"
    );

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
        return <Loader />;
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
                <Animated.ScrollView contentContainerStyle={{ paddingBottom: 100 }} ref={scrollRef} scrollEventThrottle={16}>

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
                    <View style={styles.details}>
                        <View style={styles.titleRow}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, }}>
                                <Text style={styles.title}>{post.title}</Text>
                                {post.condition && (
                                    <View style={styles.conditionTag}>
                                        <Text style={styles.conditionText}>{post.condition}</Text>
                                    </View>
                                )}
                            </View>


                        </View>
                        <View style={styles.descriptionWrapper}>
                            <Text style={styles.description}>Descripción</Text>
                            <Text style={styles.descText}>{post.caption}</Text>
                        </View>
                        {renderMarginBottom(12)}
                        {renderBorderBottom(2)}
                        {renderMarginTop(18)}
                        <TouchableOpacity style={styles.profile} onPress={() => setShowBottomSheet(true)}>
                            <View style={styles.cg14}>
                                <Image
                                    source={{ uri: author.image }}
                                    style={styles.person}
                                    contentFit="cover"
                                    transition={200}
                                    cachePolicy="memory-disk"
                                />
                                <Text style={styles.ownerName}>{author.fullname}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.ScrollView>
                <View style={styles.footer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={styles.footerText}>

                            <Text style={styles.price}>${post.price}</Text>

                        </View>
                        <TouchableOpacity style={[styles.btnn, { paddingRight: 20, paddingLeft: 20 }]} onPress={handleChat}>
                            <Text style={styles.btnText}>¡Mándale un mensaje!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {renderBorderBottom(6)}

                <SellerBottomSheet author={author} posts={posts || []} visible={showBottomSheet} onClose={() => setShowBottomSheet(false)} />


            </View>
        </>
    );
}


function ProductImageItem({ storageId, animatedStyle, }: { storageId: Id<"_storage">; animatedStyle?: any; }) {
    const imageUrl = useQuery(api.posts.getImageUrl, { storageId });
    if (!imageUrl) return null;

    return (
        <Animated.View style={[styles.image, animatedStyle]}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
            />
        </Animated.View>
    );
}