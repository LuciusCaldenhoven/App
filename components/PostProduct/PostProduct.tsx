import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Id } from "../../convex/_generated/dataModel";
import { styles } from "../PostProduct/PostProduct.styles";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

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
        author: {
            _id: string;
            username: string;
            image: string;
        };
    };
};

export default function PostProduct({ post }: PostProps) {
    const deletePost = useMutation(api.posts.deletePost);

    const confirmDelete = () => {
        Alert.alert(
            "¿Eliminar publicación?",
            "Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                {  
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        await deletePost({ postId: post._id });
                    },
                },
            ]
        );
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/product/${post._id}`)} >
            <Image
                source={{ uri: post.imageUrl }}
                style={styles.image}
                contentFit="cover"
            />

            {/* Información */}
            <View style={styles.info}>
                <Text numberOfLines={1} style={styles.title}>
                    {post.title}
                </Text>
                <Text numberOfLines={1} style={styles.category}>
                    {post.category}
                </Text>

                <View style={styles.verticalActions}>
                    <TouchableOpacity onPress={() => console.log("xd")} style={styles.iconButton}>
                        <Feather name="edit-3" size={20} color="#4F8EF7" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={confirmDelete} style={styles.iconButton}>
                        <Feather name="trash-2" size={20} color="#FF5A5F" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

