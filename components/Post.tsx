import { styles } from "@/styles/ProductCard.styles";
import { Link, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-expo";




type PostProps = {
    post: {
        _id: Id<"posts">;
        userId: Id<"users">;
        imageUrl: string;
        imageUrls: string[]; // ✅ Varias imágenes
        caption?: string;
        title: string; // ✅ Título
        price: number; // ✅ Precio
        category: string; // ✅ Categoría
        location: string; // ✅ Ubicación
        condition: "new" | "used"; // ✅ Condición del producto
        likes: number;
        comments: number;
        _creationTime: number;
        isBookmarked: boolean;
        author: {
            _id: string;
            username: string;
            image: string;
        };
    };
};





export default function Post({ post }: PostProps) {

    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    const [showComments, setShowComments] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const { user } = useUser();
    const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user.id } : "skip");


    
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost)




    const handleBookmark = async () => {
        const newIsBookmarked = await toggleBookmark({ postId: post._id });
        setIsBookmarked(newIsBookmarked);
    };

    const handleDelete = async () => {
        try {
            await deletePost({ postId: post._id });
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };



    return (
        <TouchableOpacity onPress={() => router.push(`/product/${post._id}`)}>
            
            <View style={styles.container}>
                {/* Contenedor de la imagen */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: post.imageUrl }}
                        style={styles.image}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="memory-disk"
                    />
                </View>

                {/* Información del producto */}
                <View style={styles.details}>
                    <Text style={styles.title} numberOfLines={1}>
                        {post.title}
                    </Text>
                    <Text style={styles.supplier} numberOfLines={1}>
                        {post.category}
                    </Text>
                    <Text style={styles.price}>
                        ${post.price}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>

    );


}
