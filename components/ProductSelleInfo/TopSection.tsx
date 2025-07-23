import { View, Text, Dimensions, Image, TouchableOpacity, StyleSheet } from "react-native";
import { CornerUpLeft, MapPin } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const { width } = Dimensions.get("window");

type TopSectionProps = {
  currentUser: any;
  scrollY: SharedValue<number>;
};

export default function TopSection({ currentUser, scrollY }: TopSectionProps) {
  const iconOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const postsSold = useQuery(api.posts.getSoldPostsByUser, { userId: currentUser?._id });
  const displayName =
    typeof currentUser.fullname === "string" && currentUser.fullname.trim().length > 0
      ? currentUser.fullname.trim().split(" ").slice(0, 2).join(" ")
      : "User";

  return (
    <View style={styles.topSection}>
      <View style={styles.iconWrapper}>
        <Animated.View style={[styles.iconBackground, iconOpacityStyle]} />
        <TouchableOpacity onPress={() => router.back()}>
          <CornerUpLeft size={28} strokeWidth={2.2} color="#222" />
        </TouchableOpacity>
      </View>

      {/* CENTRADO: foto, nombre y locación */}
      <View style={{ alignItems: "center", marginTop: 24 }}>
        <Image source={{ uri: currentUser.image }} style={styles.avatar} />
        <Text style={styles.name}>{displayName}</Text>
        {currentUser.location && (
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#888" style={{ marginRight: 4 }} />
            <Text numberOfLines={1} style={styles.textLocation}>
              {currentUser.location}
            </Text>
          </View>
        )}
      </View>

      {/* STATS EN HORIZONTAL */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser.averageRating?.toFixed(1) ?? "0.0"}</Text>
          <Text style={styles.statLabel}>Calificación</Text>
        </View>
        <View style={styles.statDividerV} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser.reviewCount ?? 0}</Text>
          <Text style={styles.statLabel}>Reseñas</Text>
        </View>
        <View style={styles.statDividerV} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{postsSold?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Ventas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "flex-end",
    paddingBottom: 20,
   
  },
  iconWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  iconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 8,
    backgroundColor: "#eaeaea",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#222",
    fontFamily: "Medium",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 2,
  },
  textLocation: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#666",
    maxWidth: 300,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    marginBottom: 4,
  },
  statItem: {
    alignItems: "center",
    minWidth: 68,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "SemiBold",
    color: "#000",
  },
  statLabel: {
    fontSize: 13,
    color: "gray",
    fontFamily: "Medium",
    marginBottom: 2,
  },
  statDividerV: {
    width: 1,
    height: 32,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    alignSelf: "center",
  },
});
