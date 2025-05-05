import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/verticalPost.style";
import { router } from "expo-router";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type PostProps = {
    post: {
        tipo: string;
        _id: Id<"posts">;
        userId: Id<"users">;
        imageUrl: string;
        imageUrls: string[];
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
export default function VerticalPost({ post }: PostProps) {
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

    const handleBookmark = async () => {
        const newIsBookmarked = await toggleBookmark({ postId: post._id });
        setIsBookmarked(newIsBookmarked);
    };

    return (
        <TouchableOpacity style = {styles.container} onPress={() => router.push(`/product/${post._id}`)}>

            {/* 📌 Contenedor de la imagen */}
            <View style={styles.image}>
                <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.productImg}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                />
            </View>

            {/* 📌 Información del producto */}
            <View style={styles.textContainer}>
                <Text style={styles.productTitle} >{post.title}</Text>
                <Text style={styles.supplier} >{post.category}</Text>
                <Text style={styles.supplier}>${post.price}</Text>
            </View>

            {/* 📌 Botón de favoritos */}


        </TouchableOpacity>
    );
}
