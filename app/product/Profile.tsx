import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions, Animated, ScrollView, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // si usas expo-router
import { MapPin, MoveLeft } from "lucide-react-native";
import { Image } from "expo-image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductSkeleton from "@/components/loaders/ProductSkeleton";
import Post from "@/components/Post";
import ReviewComponent from "@/components/review/component";
import ReviewComponentVertical from "@/components/ReviewComponentVertical/ReviewComponentVertical";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { COLORS } from "@/constants/theme";

const HEADER_MAX_HEIGHT = 290;
const HEADER_MIN_HEIGHT = 80;
const { width } = useWindowDimensions();

export default function SellerScreen() {
    const router = useRouter();
    const { authorId } = useLocalSearchParams();
    const author = useQuery(api.users.getById, { userId: authorId as Id<"users"> });
    const posts = useQuery(api.posts.getPostsByUser, { userId: authorId as Id<"users"> });
    const [showAllReviews, setShowAllReviews] = useState(false);

    const postsSold = useQuery(api.posts.getSoldPostsByUser, { userId: author?._id });

    const [activeTab, setActiveTab] = useState("Productos");
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: "clamp",
    });

    const avatarOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_MIN_HEIGHT],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const textOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_MIN_HEIGHT],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    if (!author) return null;

    const displayName = typeof author.fullname === "string" && author.fullname.trim().length > 0 ? author.fullname.trim().split(" ").slice(0, 2).join(" ") : "User";

    return (
        <View style={styles.container}>
            {/* Header animado */}
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
                    <MoveLeft size={26} color="black" strokeWidth={2.2} />
                </TouchableOpacity>

                <View style={{ alignItems: "center", position: "absolute", top: 50, width: "100%" }}>
                    <Text style={styles.title}>Perfil</Text>
                </View>

                <View style={styles.infoRow}>
                    <Animated.View style={{ alignItems: 'center', opacity: avatarOpacity }}>
                        <Image source={{ uri: author.image }} style={styles.avatar} />
                        <Text style={styles.name}>{displayName}</Text>
                        {author.location && <Text numberOfLines={1} style={styles.textLocation}>{author.location}</Text>}
                    </Animated.View>

                    <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
                        <View style={styles.statsColumn}>
                            <Text style={styles.statValue}>{author.averageRating?.toFixed(1) ?? "0.0"}</Text>
                            <Text style={styles.statLabel}>Calificación</Text>

                            <View style={styles.statDivider} />

                            <Text style={styles.statValue}>{author.reviewCount ?? 0}</Text>
                            <Text style={styles.statLabel}>Reseñas</Text>

                            <View style={styles.statDivider} />

                            <Text style={styles.statValue}>{postsSold?.length}</Text>
                            <Text style={styles.statLabel}>Ventas</Text>
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>

            {/* Tabs */}
            <View style={{ paddingTop: 10, backgroundColor: 'white' }}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, activeTab === "Productos" && styles.activeButton]}
                        onPress={() => setActiveTab("Productos")}
                    >
                        <Text style={[styles.buttonText, activeTab === "Productos" && styles.activeButtonText]}>
                            Productos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, activeTab === "Reviews" && styles.activeButton]}
                        onPress={() => setActiveTab("Reviews")}
                    >
                        <Text style={[styles.buttonText, activeTab === "Reviews" && styles.activeButtonText]}>
                            Reviews
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scroll principal */}
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 120, backgroundColor: 'white' }}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: false,
                })}
                scrollEventThrottle={16}
                bounces={true}
            >
                {activeTab === "Productos" ? (
                    !posts ? (
                        <FlatList
                            data={Array.from({ length: 8 })}
                            numColumns={2}
                            keyExtractor={(_, index) => `skeleton-${index}`}
                            renderItem={() => <ProductSkeleton />}
                            columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12, marginBottom: 16 }}
                            contentContainerStyle={{ paddingTop: 20 }}
                            scrollEnabled={false}
                        />
                    ) : posts.length === 0 ? (
                        <Text style={{ textAlign: "center", marginTop: 20 }}>No hay productos</Text>
                    ) : (
                        <FlatList
                            data={posts}
                            numColumns={2}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => <Post post={item} isBookmarked={false} />}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            contentContainerStyle={{ paddingHorizontal: 12 }}
                            scrollEnabled={false}
                        />
                    )
                ) : (
                    <View>
                        <View>
                            <ReviewComponent sellerId={author._id} />

                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setShowAllReviews(true)} style={styles.floatingButton} >
                                <Text style={styles.floatingButtonText}>Ver más</Text>
                            </TouchableOpacity>
                        </View>
                        <ReviewComponentVertical
                            visible={showAllReviews}
                            onClose={() => setShowAllReviews(false)}
                            sellerId={author._id}
                        />
                    </View>
                )}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 16,

    },
    floatingButton: {
        position: 'absolute',
        top: 30,
        right: 20,
        backgroundColor: COLORS.black,

        borderRadius: 25,
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    floatingButtonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
    },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },

    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
    },

    closeButton: {
        alignSelf: 'flex-end',
    },

    seeMoreFooter: {
        width: 120,
        height: 180,
        marginLeft: 12,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
    },

    seeMoreText: {
        fontSize: 14,
        fontFamily: "SemiBold",
        color: "#007AFF",
    },

    statsColumn: {
        alignItems: "flex-start",
        justifyContent: "center",
        paddingVertical: 10,
    },

    statValue: {
        fontSize: 18,
        fontFamily: 'SemiBold',
        color: "#000",
    },

    statLabel: {
        fontSize: 13,
        color: "gray",
        fontFamily: 'Meidum',
        marginBottom: 6,
    },

    statDivider: {
        height: 1,
        width: 80,
        backgroundColor: "#e0e0e0",
        marginVertical: 6,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",

        alignItems: "flex-start",
        marginBottom: 5,
    },
    button: {
        flex: 1,
        marginHorizontal: 30,
        paddingVertical: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        alignItems: "center",

    },
    activeButton: {
        backgroundColor: COLORS.black,
    },
    buttonText: {
        fontSize: 12,
        color: COLORS.black,
        fontFamily: "Regular",
    },
    activeButtonText: {
        color: "#fff",
        fontFamily: "Regular",
    },


    backIcon: {
        position: "absolute",
        left: 30,
        top: 55,
        zIndex: 2,
    },
    title: {
        textAlign: "center",
        fontSize: 26,
        fontFamily: "SemiBold",
        color: "black",
    },
    profileInfo: {
        alignItems: "center",
        justifyContent: "center",
    },
    textRating: {
        marginTop: 4,
        fontSize: 14,
        color: "gray",
    },
    card: {
        paddingLeft: 10,
        alignItems: "center",
        paddingBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#fff",
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "gray",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,

    },

    textContainer: {
        marginLeft: 70,
        justifyContent: "center",
    },
    locationContainer: {
        marginTop: 6,

    },
    textLocation: {
        fontFamily: "Regular",
        fontSize: 14,
        maxWidth: 10,
    },
});
