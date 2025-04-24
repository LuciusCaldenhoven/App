import { styles } from "@/styles/ProductCard.styles";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";

type PostProps = {
    post: {
        _id: Id<"posts">;
        userId: Id<"users">;
        imageUrl: string;
        imageUrls: string[];
        caption?: string;
        title: string;
        price: number;
        category: string;
        location: string;
        condition: "new" | "used";
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
    const { user } = useUser();
    const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user.id } : "skip");

    return (
        <TouchableOpacity onPress={() => router.push(`/product/${post._id}`)}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: post.imageUrl }}
                        style={styles.image}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="memory-disk"
                    />
                </View>
                <View style={styles.details}>
                    <Text style={styles.price}>S/{post.price}.00</Text>
                    <Text style={styles.title} numberOfLines={1}>
                        {post.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
