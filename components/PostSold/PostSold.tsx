import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Id } from "../../convex/_generated/dataModel";
import { styles } from "../PostSold/PostSold.styles";

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
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.rowContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />

          {/* Texto SOLD superpuesto */}
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
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
    </TouchableOpacity>
  );
}
