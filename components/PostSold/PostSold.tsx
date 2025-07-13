import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Id } from "../../convex/_generated/dataModel";
import { styles } from "../PostSold/PostSold.styles";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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


export default function PostProduct({ post }: PostProps) {
  const imageUrl = useQuery(api.posts.getImageUrl, {
    storageId: post.storageId,
  });
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.rowContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory"
          />

          {/* Texto SOLD superpuesto */}

        </View>

        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {post.title}
          </Text>
          <Text numberOfLines={1} style={styles.category}>
            {post.category}
          </Text>
        </View>
        


      </View>
      <View style={styles.soldStamp}>
        <Text style={styles.soldStampText}>VENDIDO</Text>
      </View>
    </TouchableOpacity>
  );
}
