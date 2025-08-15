import { Text, View, Dimensions, TouchableOpacity, } from "react-native"; import Animated, { useSharedValue, useAnimatedScrollHandler, } from "react-native-reanimated";
import styles from "@/styles/feed.styles";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { useCallback, useRef, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LocationPickerModal from "@/components/LocationPickerModal";
import TopSection from "@/components/Index/TopSection";
import SearchBar from "@/components/Index/SearchBar";
import HorizontalPostSection from "@/components/Index/HorizontalPostSection";
import { LinearGradient } from "expo-linear-gradient";
import { Bike, Monitor, Shirt, Dumbbell, Car, Tv, Home, Book, Music } from "lucide-react-native";
import Button from "@/components/button/component";

export default function Index() {
  const router = useRouter();
  const { userId } = useAuth();
  const { width } = Dimensions.get("window");
  const HEADER_HEIGHT = width * 0.42;
  const scrollY = useSharedValue(0);

  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("Recomendacion");
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const saveLocation = useMutation(api.users.saveLocation);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#F5F5F5", "#F5F5F5", "#fff"]}
        locations={[0, 0.5, 0.55]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <TopSection
        openBottomSheet={openBottomSheet}
        currentUser={currentUser}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 230,
          paddingBottom: 100,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.scrollContent}>

          <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>

            <SearchBar query={searchInput} />
          </View>

        <HorizontalPostSection title="Celulares" subcategory="Celulares" />
        <HorizontalPostSection title="Consolas y accesorios" subcategory="Consolas y accesorios" />
        <HorizontalPostSection  title="Zapatillas" subcategory="Zapatillas" />
        <HorizontalPostSection  title="Bolsos y mochilas" subcategory="Bolsos y mochilas" />
        <HorizontalPostSection  title="Muebles" subcategory="Muebles" />
        <HorizontalPostSection  title="Decoración" subcategory="Decoración" />
        <HorizontalPostSection  title="Bicicletas" category="Bicicletas" />
        <HorizontalPostSection  title="Material deportivo" category="Material Deporte y ocio" />
        <HorizontalPostSection  title="Libros" subcategory="Libros" />
        <HorizontalPostSection  title="Instrumentos musicales" subcategory="Instrumentos musicales" />
        <HorizontalPostSection  title="Vehículos" category="Vehículos" />
        <HorizontalPostSection  title="Accesorios de moto" subcategory="Accesorios de moto" />


        </View>
      </Animated.ScrollView>

      <LocationPickerModal
        currentUser={currentUser}
        saveLocation={saveLocation}
        bottomSheetRef={bottomSheetRef}
      />
    </View>
  );
}
