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
import Animated, { interpolate, runOnJS, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import { BottomSheet } from "@/components/bottomSheet/BottomSheet";
import SellerBottomSheet from "@/components/SellerBottomSheet/SellerBottomSheet";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 380;

export default function ProductDetail() {
    // Parámetros y estados
    const { productId } = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    // Referencias y animaciones
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

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

    // Consultas y mutaciones
    const post = useQuery(
        api.posts.getBookmarkedPostById,
        productId ? { postId: productId as Id<"posts"> } : "skip"
    );

    const author = useQuery(
        api.users.getUserProfile,
        post?.userId ? { id: post.userId } : "skip"
    );

    const posts = useQuery(
        api.posts.getPostsByUser,
        author?._id ? { userId: author._id } : "skip"
    );

    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

    // Funciones
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

    // Estados de carga
    const loadingPost = !post;
    const loadingAuthor = post && !author;
    const flatListRef = useRef(null);
    // Renderizado
    return (
        <>
            <StatusBar style="light" backgroundColor="white" />
            <View style={styles.container}>
                {/* Header */}
                <Animated.View style={[styles.header, headerAnimatedStyle]}>
                </Animated.View>

                {/* Botones (Siempre visibles) */}
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

                {/* Contenido principal */}
                <Animated.ScrollView contentContainerStyle={{ paddingBottom: 100 }} ref={scrollRef} scrollEventThrottle={16} >
                    {/* Carrusel de imágenes */}
                    {post?.imageUrls && (
                        <Animated.FlatList
                        ref={flatListRef}
                        data={post.imageUrls}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        onScroll={handleScroll}
                        renderItem={({ item, index }) => (
                          <View style={styles.imageContainer}>
                            <Animated.View
                              style={[
                                styles.image,
                                index === currentIndex ? imageAnimatedStyle : null, // Aplica la animación solo a la imagen visible
                              ]}
                            >
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
                            <Text style={styles.imageIndicatorText}> {currentIndex + 1} / {post.imageUrls.length} </Text>
                        </View>)}

                    {/* Detalles del producto */}
                    {loadingPost ? (<Loader />) : (
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
                                    {loadingAuthor ? (<Loader />) : author ? (
                                        <>
                                            <Image source={{ uri: author.image }} style={styles.person} contentFit="cover" transition={200} cachePolicy="memory-disk" />
                                            <Text style={styles.ownerName}>{author.fullname}</Text>
                                        </>
                                    ) : (<Loader />)}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.ScrollView>

                {/* Footer */}
                {post && (
                    <View style={styles.footer}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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

                {/* BottomSheet */}
                <BottomSheet visible={showBottomSheet} setVisible={setShowBottomSheet}>
                    <SellerBottomSheet
                        author={author}
                        posts={posts || []}
                        setShowBottomSheet={setShowBottomSheet}
                    />
                </BottomSheet>

            </View>
        </>
    );
}
