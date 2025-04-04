import { View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import { styles } from "@/styles/productDetail.styles";
import { Id } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { Loader } from "@/components/Loader";
import { useState, useRef } from "react";
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import { scale } from '@/constants/scale';
import Button from "@/components/button/component";
const { width } = Dimensions.get("window");

export default function ProductDetail() {
    const { productId } = useLocalSearchParams();
    const post = useQuery(
        api.posts.getBookmarkedPostById,
        productId ? { postId: productId as Id<"posts"> } : "skip"
    );

    const author = useQuery(
        api.users.getUserProfile,
        post ? { id: post.userId } : "skip"
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    if (!post) return <Loader />;

    const handleBookmark = async () => {
        await toggleBookmark({ postId: post._id });
    };

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <View style={styles.upperRow}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back-circle" size={30} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons
                        name={post.isBookmarked ? "heart" : "heart-outline"}
                        size={30}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 🏆 Carrusel de imágenes */}
                <View style={{ position: "relative" }}>
                    <FlatList
                        ref={flatListRef}
                        data={post.imageUrls}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={{ width, height: 400 }}
                                contentFit="cover"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        )}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    />
                </View>

                {/* ℹ️ Información del producto */}
                <View style={styles.details}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{post.title}</Text>
                        <View style={styles.priceWrapper}>
                            <Text style={styles.price}>${post.price}</Text>
                        </View>
                    </View>

                    <View style={styles.ratingRow}>
                        <View style={styles.rating}>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <Ionicons key={index} name="star" size={24} color="gold" />
                            ))}
                            <Text style={styles.ratingText}>(2.9)</Text>
                        </View>
                    </View>

                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.description}>Descripción</Text>
                        <Text style={styles.descText}>{post.caption}</Text>
                    </View>

                    <View style={{ marginBottom: SIZES.small }}>
                        <View style={styles.info}>
                            <View style={{ flexDirection: "row" }}>
                                <Ionicons name="location-outline" size={20} />
                                <Text>{post.location}</Text>
                            </View>
                        </View>
                        <View style={styles.info}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="cube-outline" size={20} />
                                <Text>
                                    {post.condition === "new" ? "Nuevo" : "Usado"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {renderMarginBottom(12)}
                    {renderBorderBottom(2)}
                    {renderMarginTop(18)}
                    <View style={styles.profile}>
                        <View style = {styles.cg14}>
                            <Image
                                source={{ uri: author?.image }}
                                style={styles.person}
                                contentFit="cover"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                            <Text style={styles.ownerName}>{author?.fullname}</Text>
                            
                        </View>
                        {/* <View style = {styles.cg14}>
                            <Pressable style={styles.iconBorder}>
                                <AntDesign name="message1" size={(scale(22))} color={COLORS.gray} />
                            </Pressable>
                            
                        </View> */}

                    </View>
                </View>
                
            </ScrollView>
            <Button text="Mensajea" buttonStyles={styles.btn}/>
            {renderBorderBottom(6)}
        </View>
    );
}
