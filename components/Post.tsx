import { styles } from "@/styles/ProductCard.styles";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";

interface PostProps {
  post: Doc<"posts">;
  isBookmarked?: boolean;
}

export default function Post({ post }: PostProps) {
  const { user } = useUser();
  const { width } = useWindowDimensions();


  const imageUrl = useQuery(api.posts.getImageUrl, {
    storageId: post.storageId,
  });

  const getTipoBackgroundColor = (tipo: string) => {
    switch (tipo) {
      case "Venta":
        return "#DCEEFF";
      case "Alquiler":
        return "#DFF5E5";
      case "Servicio":
        return "#F0E9FF";
      default:
        return "#777";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Venta":
        return "#4F8EF7";
      case "Alquiler":
        return "#30C04F";
      case "Servicio":
        return "#A86AEF";
      default:
        return "#777";
    }
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/product/${post._id}`)}>
      <View
        style={[
          styles.container,
          { width: (width - 36) / 2 }, // width dinámico aquí
        ]}
      >
        {/* Mostrar el tipo de producto con un fondo dinámico */}
        <Text
          style={[
            styles.tipo,
            {
              backgroundColor: getTipoBackgroundColor(post.tipo),
              color: getTipoColor(post.tipo),
            },
          ]}
        >
          {post.tipo}
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.price}>{post.currency === "Soles" ? `S/${post.price}.00` : `$${post.price}.00`}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {post.title}
          </Text>
        </View>
        {post.sold && (
          <View style={styles.soldStamp}>
            <Text style={styles.soldStampText}>VENDIDO</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
