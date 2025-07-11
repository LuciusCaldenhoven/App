import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import styles from "@/styles/feed.styles";
import { MapPin, MessageCircle } from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { router } from "expo-router";


const items = [
  { id: "1", image: require("@/assets/images/banners/image_4.jpg") },
  { id: "2", image: require("@/assets/images/banners/image_5.jpg") },
  { id: "3", image: require("@/assets/images/banners/image_6.jpg") },
  { id: "4", image: require("@/assets/images/banners/image_7.jpg") },
];

const { width } = Dimensions.get("window");

export default function TopSection({ openBottomSheet, currentUser, scrollY }: {
  openBottomSheet: () => void;
  currentUser: any;
  scrollY: Animated.SharedValue<number>; 
}) {
const iconOpacityStyle = useAnimatedStyle(() => { 
    const opacity = interpolate(
      scrollY.value, 
      [0, 200],
      [1, 0],
      Extrapolate.CLAMP 
    );
    return {
      opacity: opacity,
    };
  });





  return (
    <View style={styles.topSection}>
      <View style={styles.header}>
        <Animated.View 
          style={[styles.iconWrapper, iconOpacityStyle]} 
        >
          <TouchableOpacity onPress={openBottomSheet}>
            <MapPin size={24} strokeWidth={2.2} color="#222" />
          </TouchableOpacity>
        </Animated.View>
        <View style={{ alignItems: "center", maxWidth: "65%" }}>
          <Text style={styles.title}   numberOfLines={1} ellipsizeMode="tail">
            {currentUser?.location && currentUser?.km
              ? `${currentUser.location} - ${currentUser.km} km`
              : 'Establecer ubicación'}
          </Text>
          <Text style={styles.subtitle}>Peru</Text>
        </View>

      </View>

      <View style={styles.containerCarousel}>
        <Carousel
          width={width}
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
    </View>
  );
}
