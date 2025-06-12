import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from "react";
import { MapPin, Star } from "lucide-react-native";
import { COLORS, SIZES } from "@/constants/theme";
import SellerBottomSheet from "../SellerBottomSheet/SellerBottomSheet";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { scale } from "@/constants/scale";
import MapView, { Circle, Marker } from "react-native-maps";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import DiscountInfo from "../DiscountInfo/DiscountInfo ";

interface SellerInfoProps {
    author: Doc<"users">;
    post: Doc<"posts"> & { isBookmarked: boolean };
}

const ProductSellerInfo = ({ author, post }: SellerInfoProps) => {
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [textLines, setTextLines] = useState(0);

    const posts = useQuery( api.posts.getPostsByUser, author?._id ? { userId: author._id } : "skip" );
    const [showAll, setShowAll] = useState(false);
    const shouldShowMore = textLines > 10;


    return (
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

            <View style={{ paddingLeft: 16 }}>
                <Text style={styles.infoText}> Publicado {formatDistanceToNow(new Date(post._creationTime), { addSuffix: true, locale: es })} </Text>
                <Text style={styles.infoText}> en {post.location} </Text>
            </View>



            <View style={styles.infoTagsRow}>
                <View style={styles.tag}>
                    <Text style={styles.tagLabel}>Tipo:</Text>
                    <Text style={styles.tagValue}>{post.tipo}</Text>
                </View>

                <View style={styles.tag}>
                    <Text style={styles.tagLabel}>Categoría:</Text>
                    <Text style={styles.tagValue}>{post.category}</Text>
                </View>
            </View>

            {/* Descripcion  */}
            <View style={styles.line} />
            <View style={styles.descriptionWrapper}>
                <Text style={styles.description}>Descripción</Text>
                <View>
                    <Text
                        style={[styles.descText, { position: 'absolute', opacity: 0, zIndex: -1 }]}
                        onTextLayout={(e) => setTextLines(e.nativeEvent.lines.length)}
                    >
                        {post.caption}
                    </Text>

                    <Text
                        style={styles.descText}
                        numberOfLines={showAll ? undefined : 10}
                    >
                        {post.caption}
                    </Text>
                </View>




                {shouldShowMore && (
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                            <Text style={styles.toggleButton}>
                                {showAll ? "Ver menos" : "Ver más"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.line} />
            <View style={{ paddingHorizontal: 15 }}>
                <DiscountInfo />
            </View>

            {/* Info vendedor */}
            <View style={styles.line} />
            <Text style={[styles.description, { paddingLeft: 16 }]}>Informacion del vendedor</Text>
            <TouchableOpacity style={styles.sellerContainer} activeOpacity={0.8} onPress={() => setShowBottomSheet(true)} >

                <Image source={{ uri: author.image }} style={styles.sellerAvatar} />
                <View style={styles.sellerInfo}>

                    <Text style={styles.sellerName} numberOfLines={1}>{author.fullname}</Text>
                    <View style={styles.sellerRatingRow}>
                        <Star size={16} color={COLORS.main} />
                        <Text style={styles.sellerRatingText}>
                            {author.averageRating.toFixed(1)} • {author.reviewCount} reseñas
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.line} />

            {/* Mapa */}

            <Text style={[styles.description, { paddingLeft: 16 }]}>Ubicacion disponible</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: post.lat,
                    longitude: post.lng,
                    latitudeDelta: 0.10,
                    longitudeDelta: 0.10,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                toolbarEnabled={false}
            >
                <Circle
                    center={{ latitude: post.lat, longitude: post.lng }}
                    radius={6000}
                    strokeWidth={3}
                    strokeColor="#0066cc"
                    fillColor="rgba(0, 102, 204, 0.2)"
                />
            </MapView>



            <SellerBottomSheet author={author} posts={posts || []} visible={showBottomSheet} onClose={() => setShowBottomSheet(false)} />
        </View>
    );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    details: {
        marginTop: -SIZES.large,
        backgroundColor: COLORS.white,
        width: width,
        borderTopLeftRadius: SIZES.medium + 5,
        borderTopRightRadius: SIZES.medium + 5,
        paddingVertical: 12,
    },
    titleRow: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 21,
        fontFamily: "SemiBold",
        color: COLORS.main,
        flexShrink: 1,
    },
    conditionTag: {
        backgroundColor: "#D9D9D9",
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginLeft: 12,
    },
    conditionText: {
        fontSize: 14,
        color: COLORS.main,
        fontWeight: "600",
    },
    infoText: {
        fontFamily: "Regular",
        fontSize: 13,
        color: 'grey',

        paddingTop: 2,
    },
    infoTagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 16,
        paddingHorizontal: 20,
    },
    tag: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignItems: "center",
    },
    tagLabel: {
        fontFamily: "Medium",
        color: COLORS.gray,
        marginRight: 4,
        fontSize: 13,
    },
    tagValue: {
        fontFamily: "SemiBold",
        color: COLORS.main,
        fontSize: 13,
    },
    line: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
        marginHorizontal: 20,
    },
    descriptionWrapper: {
        paddingHorizontal: 20,
    },
    description: {
        fontFamily: "Medium",
        fontSize: 20,
        paddingBottom: 12,
        color: COLORS.main,
    },
    descText: {
        fontFamily: "Regular",
        fontSize: 15,
        textAlign: "justify",
        marginBottom: SIZES.small,
        lineHeight: 22,
    },
    toggleContainer: {
        alignItems: "flex-end",
        marginTop: 4,
    },
    toggleButton: {
        marginTop: 8,
        fontSize: 13,
        color: "#007AFF",
        fontFamily: "Medium",
    },
    sellerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "white",
    },
    sellerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 14,
    },
    sellerInfo: {
        flex: 1,
        justifyContent: "center",
    },
    sellerName: {
        fontSize: 16,
        fontFamily: "SemiBold",
        color: COLORS.main,
    },
    sellerRatingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
        gap: 6,
    },
    sellerRatingText: {
        fontSize: 13,
        color: COLORS.gray,
        fontFamily: "Regular",
    },
    map: {
        width: "90%",
        height: 100,
        alignSelf: "center",
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 16,
    },
});


export default ProductSellerInfo;