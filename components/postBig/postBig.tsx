import { styles } from "@/components/postBig/postBig.styles";
import { TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";

export default function PostBig({ post, onPressPost }: { post: any; onPressPost: () => void }) {
  return (
    <TouchableOpacity onPress={onPressPost}>
      {/* Imagen del producto */}
      <Image
        source={{ uri: post.imageUrl }}
        style={styles.imageLarge}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* Título del producto */}
      <Text style={styles.titleLarge}>{post.title}</Text>
      <Text style={styles.title}>{post.category}</Text>
    </TouchableOpacity>
  );
}
