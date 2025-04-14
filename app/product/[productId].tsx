import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, Share } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/productDetail.styles";
import { Id } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { Loader } from "@/components/Loader";
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { BottomSheet } from "@/components/bottomSheet/BottomSheet";
import { ScrollView } from "react-native-gesture-handler";
import ReviewComponent from "@/components/review/component";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 380;

export default function ProductDetail() {
    const { productId } = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0); // Estado para rastrear el índice actual

    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

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

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const post = useQuery(
        api.posts.getBookmarkedPostById,
        productId ? { postId: productId as Id<"posts"> } : "skip"
    );

    const author = useQuery(
        api.users.getUserProfile,
        post?.userId ? { id: post.userId } : "skip"
    );

    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
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

    const flatListRef = useRef(null);

    const loadingPost = !post;
    const loadingAuthor = post && !author;

    return (
        <>
            <StatusBar style="light" backgroundColor="white" />
            <View style={styles.container}>
                <Animated.View style={styles.headerButtonsContainer}>
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
                </Animated.View>

                <Animated.ScrollView contentContainerStyle={{ paddingBottom: 100 }} ref={scrollRef} scrollEventThrottle={16}>
                    {/* Carrusel */}
                    {post?.imageUrls && (
                        <Animated.FlatList
                            ref={flatListRef}
                            data={post.imageUrls}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, index) => index.toString()}
                            onScroll={handleScroll} // Maneja el evento de scroll
                            renderItem={({ item }) => (
                                <View style={styles.imageContainer}>
                                    <Animated.View style={[styles.image, imageAnimatedStyle]}>
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.image}
                                            contentFit="cover"
                                            transition={200}
                                            cachePolicy="memory-disk"
                                        />
                                    </Animated.View>
                                </View>

                            )}

                        />
                    )}
                    {post?.imageUrls && (
                        <View style={styles.imageIndicator}>
                            <Text style={styles.imageIndicatorText}>
                                {currentIndex + 1} / {post.imageUrls.length}
                            </Text>
                        </View>
                    )}
                    {loadingPost ? (
                        <Loader />
                    ) : (
                        <View style={styles.details}>
                            <View style={styles.titleRow}>
                                <Text style={styles.title}>{post.title}</Text>
                            </View>

                            <View style={styles.descriptionWrapper}>
                                <Text style={styles.description}>Descripción</Text>
                                <Text style={styles.descText}>{post.caption}</Text>
                            </View>

                            {renderMarginBottom(12)}
                            {renderBorderBottom(2)}
                            {renderMarginTop(18)}

                            {/* Perfil del autor */}
                            <TouchableOpacity style={styles.profile} onPress={() => setShowBottomSheet(true)}>
                                <View style={styles.cg14}>
                                    {loadingAuthor ? (
                                        <Loader />
                                    ) : author ? (
                                        <>
                                            <Image
                                                source={{ uri: author.image }}
                                                style={styles.person}
                                                contentFit="cover"
                                                transition={200}
                                                cachePolicy="memory-disk"
                                            />
                                            <Text style={styles.ownerName}>{author.fullname}</Text>
                                        </>
                                    ) : (
                                        <Loader />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.ScrollView>

                {/* Footer */}
                {post && (
                    <View style={styles.footer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.footerText}>
                                <View style={styles.priceWrapper}>
                                    <Text style={styles.price}>${post.price}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.btnn, { paddingRight: 20, paddingLeft: 20 }]}>
                                <Text style={styles.btnText}>¡Mándale un mensaje!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {renderBorderBottom(6)}

                <BottomSheet visible={showBottomSheet} setVisible={setShowBottomSheet}>
                    <View style={styles.bottomContainer}>
                        <View style={styles.card}>
                            <View style={styles.avatarContainer}>
                                {author && <Image source={{ uri: author.image }} style={styles.avatar} />}
                            </View>
                        </View>
                        <Text style={styles.textReview}> {author && author.fullname} Reviews</Text>
                        {renderMarginTop(8)}
                        {author && <ReviewComponent sellerId={author._id} horizontal={true} />}
                        
                    </View>
                </BottomSheet>

            </View >
        </>
    );
}
