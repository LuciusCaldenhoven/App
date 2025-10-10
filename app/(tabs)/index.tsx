import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate, withTiming, } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { MapPin, ChevronDown, Search } from "lucide-react-native";
import styles from "@/styles/feed.styles";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HorizontalPostSection from "@/components/Index/HorizontalPostSection";
import Carousel from "react-native-reanimated-carousel";
import { BlurView } from "expo-blur";
import Button from "@/components/button/component";


const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const { userId } = useAuth();
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "ios" ? 50 : 40;
  const BASE_HEADER = 50; // base visual header
  const BASE_SEARCH = 56; // base search
  const isSmall = height <= 570; // iPhone SE ~568
  const HEADER_HEIGHT = Math.max(44, Math.min(BASE_HEADER + topInset, isSmall ? 64 : 100));
  const SEARCH_HEIGHT = isSmall ? 48 : BASE_SEARCH;
  const PLATE_HEIGHT = HEADER_HEIGHT + SEARCH_HEIGHT;

  const items = [
    { id: "1", image: require("@/assets/images/banners/1.jpg") },
    { id: "2", image: require("@/assets/images/banners/2.jpg") },
    { id: "3", image: require("@/assets/images/banners/3.jpg") },
    { id: "4", image: require("@/assets/images/banners/4.jpg") },
  ];

  const carouselHeight = width * 0.42;


  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // backPlate animation (same)
  const plateStyle = useAnimatedStyle(() => {
    const APPEAR_DISTANCE = 100;
    const translateY = interpolate(
      scrollY.value,
      [0, APPEAR_DISTANCE],
      [-PLATE_HEIGHT, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY: withTiming(translateY, { duration: 0 }) }],
    };
  });

  /** NEW ANIMATIONS: header/search "apinan" y chevron desaparece **/
  // Ajustes dependientes de tamaño: si es pant pequeña, movemos más hacia arriba
  const headerMoveUp = isSmall ? -10 : -6; // px que sube el header text
  const searchMoveUp = isSmall ? -12 : -8; // px que sube el search
  const headerScaleTarget = isSmall ? 0.90 : 0.92;
  const searchScaleTarget = isSmall ? 0.90 : 0.92;
  const chevronDisappearDistance = isSmall ? 70 : 80; // chevron desaparece antes en pant pequeñas

  // header texts: scale down slightly and move up as plate appears
  const headerTextStyle = useAnimatedStyle(() => {
    const APPEAR_DISTANCE = 100;
    // scale from 1 -> headerScaleTarget
    const scale = interpolate(
      scrollY.value,
      [0, APPEAR_DISTANCE],
      [1, headerScaleTarget],
      Extrapolate.CLAMP
    );
    // translateY from 0 -> headerMoveUp
    const ty = interpolate(scrollY.value, [0, APPEAR_DISTANCE], [0, headerMoveUp], Extrapolate.CLAMP);
    return {
      transform: [{ translateY: withTiming(ty, { duration: 120 }) }, { scale: withTiming(scale, { duration: 120 }) }],
    };
  });

  // search: scale down a bit and move up slightly (para dar efecto de "stacking")
  const searchStyle = useAnimatedStyle(() => {
    const APPEAR_DISTANCE = 100;
    const scale = interpolate(scrollY.value, [0, APPEAR_DISTANCE], [1, searchScaleTarget], Extrapolate.CLAMP);
    const ty = interpolate(scrollY.value, [0, APPEAR_DISTANCE], [0, searchMoveUp], Extrapolate.CLAMP);
    return {
      transform: [{ translateY: withTiming(ty, { duration: 120 }) }, { scale: withTiming(scale, { duration: 120 }) }],
      // reduce elevation slightly so it looks 'behind' when stacked
      elevation: withTiming(interpolate(scrollY.value, [0, APPEAR_DISTANCE], [3, 1], Extrapolate.CLAMP), { duration: 120 }),
    };
  });

  // chevron/button: fade out and shrink until disappears
  const chevronStyle = useAnimatedStyle(() => {
    const APPEAR_DISTANCE = chevronDisappearDistance;
    const opacity = interpolate(scrollY.value, [0, APPEAR_DISTANCE], [1, 0], Extrapolate.CLAMP);
    const scale = interpolate(scrollY.value, [0, APPEAR_DISTANCE], [1, 0.6], Extrapolate.CLAMP);
    return {
      opacity: withTiming(opacity, { duration: 120 }),
      transform: [{ scale: withTiming(scale, { duration: 120 }) }],
    };
  });


  return (
    <View style={styles.page}>
      {/* PLACA */}
      <Animated.View
        style={[
          styles.backPlate,
          { top: 0, width: width, height: PLATE_HEIGHT },
          plateStyle,
        ]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.headerRow,
          {
            height: HEADER_HEIGHT,
            zIndex: 40,
            elevation: 40,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: topInset,
          },
        ]}
      >
        <View style={styles.headerContainer}>
          {/* Animated header texts */}
          <Animated.View style={[styles.headerTexts, headerTextStyle]}>
            <Text style={styles.headerSmall} numberOfLines={1}>
              {"Peru"}
            </Text>

            <Text style={styles.headerLarge} numberOfLines={1} ellipsizeMode="tail">
              {currentUser?.location && currentUser?.km
                ? `${currentUser.location} - ${currentUser.km} km`
                : "Establecer ubicación"}
            </Text>
          </Animated.View>

          {/* chevron circular a la derecha (desaparece con la animación) */}
          <Animated.View style={chevronStyle}>
            <TouchableOpacity
              style={styles.chevronButton}
              activeOpacity={0.75}
              onPress={() => router.push("/location/LocationPickerScreen")}
              accessibilityLabel="Cambiar ubicación"
            >
              <ChevronDown size={18} strokeWidth={3} color="#444" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* SEARCH (animated) */}
      <Animated.View
        style={[
          styles.searchWrapper,
          {
            position: "absolute",
            top: HEADER_HEIGHT,
            left: 0,
            right: 0,
            zIndex: 41,
            elevation: 41,
            height: SEARCH_HEIGHT,
            justifyContent: "center",
          },
          searchStyle,
        ]}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push("/search/searchOverlay")}
            activeOpacity={0.8}
          >
            <Search size={16} strokeWidth={1.8} />
            <Text style={styles.searchPlaceholder}>¿Qué estás buscando?</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* SCROLL: comienza después de header+search */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: PLATE_HEIGHT + 12,
          paddingBottom: 80,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerCarousel} pointerEvents="none">
          <Carousel
            width={width}
            height={carouselHeight}
            data={items}
            loop
            autoPlay
            autoPlayInterval={4000}
            scrollAnimationDuration={600}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
              </View>
            )}
          />
        </View>

        <HorizontalPostSection title="Zapatillas" nivel3="Zapatillas" />
        <HorizontalPostSection title="Tecnología y electrónica" category="Tecnología y electrónica" />
        <HorizontalPostSection title="Ropa" nivel2="Ropa" />
        <HorizontalPostSection title="Vehículos" category="Vehículos" />
        <HorizontalPostSection title="Motos" category="Motos" />
        <HorizontalPostSection title="Bicicletas" category="Bicicletas" />
        <HorizontalPostSection title="Accesorios" nivel2="Accesorios" />

        <Button text="Ver más" onPress={() => router.push("/create/page1")} />
      </Animated.ScrollView>
    </View>
  );
}
