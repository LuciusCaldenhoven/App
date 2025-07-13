import {
  FlatList,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,

} from "react-native-reanimated"; 
import styles from "@/styles/feed.styles";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { useCallback, useRef, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LocationPickerModal from "@/components/LocationPickerModal";
import { Ionicons } from "@expo/vector-icons";
import TopSection from "@/components/Index/TopSection";
import SearchBar from "@/components/Index/SearchBar";
import { usePaginatedQuery } from "convex/react";
import HorizontalPostSection from "@/components/Index/HorizontalPostSection";

const tabItems = ["Recomendacion", "Celulares", "Motos", "Servicios"];

export default function Index() {
  const router = useRouter();
  const { userId } = useAuth();
  const HEADER_HEIGHT = 160;
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
    <View style={styles.container}>
      {/* TopSection now static */}
 
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
          paddingBottom: 300,
        }}
        onScroll={handleScroll} 
        scrollEventThrottle={16}
      >
        <View style={styles.scrollContent}>
          <View style={{ paddingHorizontal: 20 }}>
            <SearchBar query={searchInput} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.HorizontalContainer}
          >
            {tabItems.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() =>
                    router.push({
                      pathname: "/search/searchResults",
                      params: { title: tab },
                    })
                  }
                >
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

      
          <HorizontalPostSection title="Bicicletas" category="Bicicletas" />
          <HorizontalPostSection title="Electronica" category="Electronica" />
          <HorizontalPostSection title="Ropa" category="Ropa" />
          <HorizontalPostSection title="Deportes" category="Deportes" />
          <HorizontalPostSection title="Vehiculos" category="Vehiculos" />
          <HorizontalPostSection title="Electrodomésticos" category="Electrodomésticos" />
          {/* <Button title="Abrir galería animada" onPress={() => router.push('/welcome')} /> */}

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
