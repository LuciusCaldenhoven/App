import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import styles from "./product.styles";
import { CornerUpLeft, MapPin, MessageCircle } from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";



const { width } = Dimensions.get("window");

export default function TopSection({ currentUser, scrollY }: {
  currentUser: any;
  scrollY: Animated.SharedValue<number>; 
}) {
const iconOpacityStyle = useAnimatedStyle(() => { 
    const opacity = interpolate(
      scrollY.value, 
      [0, 200],
      [0, 1],
      Extrapolate.CLAMP 
    );
    return {
      opacity: opacity,
    };
  });


  const postsSold = useQuery(api.posts.getSoldPostsByUser, { userId: currentUser?._id });
  const displayName = typeof currentUser.fullname === "string" && currentUser.fullname.trim().length > 0 ? currentUser.fullname.trim().split(" ").slice(0, 2).join(" ") : "User";


  return (
    <View style={styles.topSection}>
     <View style={styles.iconWrapper}>
  {/* Fondo animado */}
  <Animated.View style={[styles.iconBackground, iconOpacityStyle]} />

      {/* Ícono siempre visible */}
      <TouchableOpacity onPress={() => router.back()}>
        <CornerUpLeft size={28} strokeWidth={2.2} color="#222" />
      </TouchableOpacity>
    </View>

       
          <View style={styles.infoRow}>
                <Animated.View style={{ alignItems: 'center'}}>
                    <Image source={{ uri: currentUser.image }} style={styles.avatar} />
                    <Text style={styles.name}>{displayName}</Text>
                    {currentUser.location && <Text numberOfLines={1} style={styles.textLocation}>{currentUser.location}</Text>}
                </Animated.View>

                <Animated.View style={[styles.locationTextContainer]}>
                    <View style={styles.statsColumn}>
                        <Text style={styles.statValue}>{currentUser.averageRating?.toFixed(1) ?? "0.0"}</Text>
                        <Text style={styles.statLabel}>Calificación</Text>

                        <View style={styles.statDivider} />

                        <Text style={styles.statValue}>{currentUser.reviewCount ?? 0}</Text>
                        <Text style={styles.statLabel}>Reseñas</Text>

                        <View style={styles.statDivider} />

                        <Text style={styles.statValue}>{postsSold?.length}</Text>
                        <Text style={styles.statLabel}>Ventas</Text>
                    </View>
                </Animated.View>
            </View>



    </View>
  );
}
