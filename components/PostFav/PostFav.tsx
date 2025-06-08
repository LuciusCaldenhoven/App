import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { styles } from "../PostFav/PostFav.styles";


type PostProps = {
    post: {
        tipo: string;
        _id: Id<"posts">;
        userId: Id<"users">;
        storageId: Id<"_storage">;
        imageUrls: Id<"_storage">[];
        caption?: string;
        title: string;
        price: number;
        currency: string;
        category: string;
        location: string;
        condition: string;
        _creationTime: number;
        isBookmarked: boolean;
        author: {
            _id: string;
            username: string;
            image: string;
        };
    };
};

export default function PostFav({ post }: PostProps) {
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

    const handleBookmark = async () => {
        const newIsBookmarked = await toggleBookmark({ postId: post._id });
        setIsBookmarked(newIsBookmarked);
    };

    const imageUrl = useQuery(api.posts.getImageUrl, {
        storageId: post.storageId,
    });

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${post._id}`)}
        >
            {/* Imagen */}
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                cachePolicy="memory"
            />

            {/* Información */}
            <View style={styles.info}>
                <Text numberOfLines={1} style={styles.title}>
                    {post.title}
                </Text>
                <Text numberOfLines={1} style={styles.category}>
                    {post.category}
                </Text>

            </View>

            {/* Favorito */}
            <TouchableOpacity style={styles.bookmark} onPress={handleBookmark}>
                <Ionicons
                    name={isBookmarked ? "heart" : "heart-outline"}
                    size={24} // Aumentado el tamaño
                    color={isBookmarked ? "#FF5A7A" : "#555"} // Color rosa al estar marcado
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

