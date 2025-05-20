import { styles } from "@/components/postBig/postBig.styles";
import { TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export default function PostBig({ post, onPressPost }: { post: any; onPressPost: () => void }) {
  const imageUrl = useQuery(api.posts.getImageUrl, {
    storageId: post.imageUrls?.[0] as Id<"_storage">,
  });
  return (
    <TouchableOpacity onPress={onPressPost}>
      {/* Imagen del producto */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.imageLarge}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* Título del producto */}
      <Text numberOfLines={1} style={styles.titleLarge}>{post.title}</Text>
      <Text style={styles.title}>{post.category}</Text>
    </TouchableOpacity>
  );
}
