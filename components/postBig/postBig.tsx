import { styles } from "@/components/postBig/postBig.styles";
import { TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface PostBigProps {
  post: Doc<"posts">;
  onPressPost: () => void;
}


export default function PostBig({ post, onPressPost }: PostBigProps) {
  const imageUrl = useQuery(api.posts.getImageUrl, {
            storageId: post.storageId,
        });
  return (
    <TouchableOpacity onPress={onPressPost}>
      {/* Imagen del producto */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.imageLarge}
        contentFit="cover"
        transition={200}
        cachePolicy="memory"
      />

      {/* Título del producto */}
      <Text numberOfLines={1} style={styles.titleLarge}>{post.title}</Text>
      <Text style={styles.title}>{post.category}</Text>
    </TouchableOpacity>
  );
}
