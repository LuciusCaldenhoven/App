import { FlatList, Text, View, TextInput, Dimensions, Animated, TouchableOpacity, Button } from "react-native";
import styles from "@/styles/feed.styles";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
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
    const scrollY = useRef(new Animated.Value(0)).current;

    const [searchInput, setSearchInput] = useState("");
    const [activeTab, setActiveTab] = useState("Recomendacion");
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const openBottomSheet = useCallback(() => { bottomSheetRef.current?.present(); }, []);

    const currentUser = useQuery(
        api.users.getUserByClerkId,
        userId ? { clerkId: userId } : "skip"
    );

    const saveLocation = useMutation(api.users.saveLocation);
    
    return (
        <View style={styles.container}>
            <TopSection
                scrollY={scrollY}
                openBottomSheet={openBottomSheet}
                currentUser={currentUser}
            />

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingTop: HEADER_HEIGHT + 230,
                    paddingBottom: 100,
                }}
            >
                <View style={styles.scrollContent}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <SearchBar query={searchInput} />
                    </View>

                    <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.HorizontalContainer}>
                        {tabItems.map((tab) => {
                            const isActive = tab === activeTab;
                            return (
                                <TouchableOpacity
                                    key={tab}
                                    style={[styles.tab, isActive && styles.activeTab]}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </Animated.ScrollView>

                    <HorizontalPostSection title="Electrodomésticos" category="Electrodomésticos" />
                    <HorizontalPostSection title="Bicicletas" category="Bicicletas" />
                    <HorizontalPostSection title="Cine, libros y música" category="Cine, libros y música" />
                </View>

                <Button title="Ver más" onPress={() => router.push('/screen3/screen3')} />
                <Button title="Ver más" onPress={() => router.push('/screen3/screen1')} />
            </Animated.ScrollView>

            <LocationPickerModal
                currentUser={currentUser}
                saveLocation={saveLocation}
                bottomSheetRef={bottomSheetRef}
            />
        </View>
    );
}



