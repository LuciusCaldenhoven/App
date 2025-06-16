import { View, Text, Animated, Dimensions, Image, TouchableOpacity } from "react-native";
import styles from "@/styles/feed.styles";
import { MapPin, MessageCircle } from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";

const items = [
  { id: "1", image: require("@/assets/images/banners/image_4.jpg") },
  { id: "2", image: require("@/assets/images/banners/image_5.jpg") },
  { id: "3", image: require("@/assets/images/banners/image_6.jpg") },
  { id: "4", image: require("@/assets/images/banners/image_7.jpg") },
];

const { width } = Dimensions.get("window");

export default function TopSection({ scrollY, openBottomSheet, currentUser }: {
  scrollY: Animated.Value;
  openBottomSheet: () => void;
  currentUser: any;
}) {
  const topOpacity = scrollY.interpolate({
    inputRange: [30, 70],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.topSection, { opacity: topOpacity }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconWrapper} onPress={openBottomSheet}>
          <MapPin size={24} strokeWidth={2.2} color="#222" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>
            {currentUser?.location && currentUser?.km
              ? `${currentUser.location} - ${currentUser.km} km`
              : 'Establecer ubicación'}
          </Text>
          <Text style={styles.subtitle}>Peru</Text>
        </View>

        <View style={styles.iconWrapper}>
          <MessageCircle size={24} strokeWidth={2.2} color="#222" />
        </View>
      </View>

      <View style={styles.containerCarousel}>
        <Carousel
          width={width }
          height={160}
          data={items}
          loop
          autoPlay
          autoPlayInterval={4000}
          scrollAnimationDuration={600}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
        />
      </View>
    </Animated.View>
  );
}
