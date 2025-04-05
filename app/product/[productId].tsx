import { View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, Pressable, StatusBar, Share } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import { styles } from "@/styles/productDetail.styles";
import { Id } from "@/convex/_generated/dataModel";
import { Image } from "expo-image";
import { Loader } from "@/components/Loader";
import { useState, useRef } from "react";
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import { scale } from "@/constants/scale";
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
    const shareListing = async () => {
        try {
            await Share.share({
                title: post.title,
                url: `https://revende.com/post/${post._id}`,
            });
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <View style={styles.container}>

            <View style={styles.headerButtonsContainer}>
                {/* Botón Back a la izquierda */}
                <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} />
                </TouchableOpacity>

                {/* Share + Bookmark a la derecha */}
                <View style={styles.rightButtons}>
                    <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
                        <Feather name="share" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton} onPress={handleBookmark}>
                        <FontAwesome
                            name={post.isBookmarked ? "heart" : "heart-o"}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
                                style={styles.image}
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
                        <View style={styles.cg14}>
                            <Image
                                source={{ uri: author?.image }}
                                style={styles.person}
                                contentFit="cover"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                            <Text style={styles.ownerName}>{author?.fullname}</Text>

                        </View>
                        

                    </View>
                </View>

            </ScrollView>
            <View style={styles.footer} >
                <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.footerText}>
                        <View style={styles.priceWrapper}>
                            <Text style={styles.price}>${post.price}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btnn, { paddingRight: 20, paddingLeft: 20 }]}>
                        <Text style={styles.btnText}>Mandale un mensaje!</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Button text="Mensajea" buttonStyles={styles.btn}/> */}
            {renderBorderBottom(6)}
        </View>
    );
}
