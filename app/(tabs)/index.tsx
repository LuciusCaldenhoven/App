import { FlatList, ScrollView, Text, View, Image, Button, TouchableOpacity, TextInput } from "react-native";
import styles from "@/styles/feed.styles";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import React, { useCallback, useRef, useState } from "react";
import { CategoryBox } from "@/components/categoryBox/categoryBox";
import { renderMarginBottom } from "@/constants/ui-utils";
import product from "@/assets/index/data"
import { Link, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { LocationEdit, Search } from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import LocationPickerModal from "@/components/LocationPickerModal";

export default function Index() {
    const router = useRouter();
    const { userId } = useAuth();

    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");
    const posts = useQuery(api.posts.getFeedPosts);
    const saveLocation = useMutation(api.users.saveLocation);
    const [searchInput, setSearchInput] = useState("");

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const openBottomSheet = useCallback(() => bottomSheetRef.current?.present(), []);

    if (posts === undefined) return <Loader />;

    if (posts.length === 0) {
        return (
            <View style={styles.container}>
                <NoPost />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Link
                        href={{
                            pathname: "/search/searchOverlay",
                            params: { query: searchInput },
                        }}
                        asChild
                    >
                        <TouchableOpacity style={styles.searchBtn}>
                            <Search size={20} color="grey" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="¿Qué quieres comprar?"
                                placeholderTextColor="grey"
                                value={searchInput}
                                onChangeText={setSearchInput}
                                editable={false} // evita teclado en esta vista
                                pointerEvents="none" // desactiva eventos
                            />
                        </TouchableOpacity>
                    </Link>
                </View>

                <View style={styles.locationButton}>
                    <TouchableOpacity style={styles.locationButton2} onPress={openBottomSheet} >
                        <LocationEdit size={16} />
                        <Text style={styles.locationText}>
                            {currentUser?.location && currentUser?.km
                                ? `${currentUser.location} - ${currentUser.km} km`
                                : 'Establecer ubicación'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 25, paddingBottom: 16 }} >
                        <CategoryBox
                            icon={<Image source={require('@/assets/index/ropa.png')} style={{ width: 100, height: 100 }} />}
                            title="Ropa y Accesorios"
                            backgroundColor={'rgba(0, 200, 83, 0.2)'}
                            onPress={() => router.push(`/search/searchResults?category=Ropa y Accesorios`)}
                            width={160}
                            height={140}
                            textColor="#212121"
                        />
                        <CategoryBox
                            icon={<Image source={require('@/assets/index/electronica.png')} style={{ width: 100, height: 100 }} />}
                            title="Electrónica"
                            backgroundColor={'rgba(0, 230, 118, 0.25)'}
                            onPress={() => router.push(`/search/searchResults?category=Electrónica`)}
                            width={160}
                            height={140}
                        />
                    </View>

                    <View style={{ paddingVertical: 20 }}>
                        <FlatList
                            data={product.products}
                            renderItem={({ item }) => (
                                <CategoryBox
                                    icon={<Image source={item.icon} style={{ width: 70, height: 70 }} />}
                                    title={item.title}
                                    backgroundColor={'#F2F2F2'}
                                    onPress={() => router.push(`/search/searchResults?category=${item.title}`)}
                                />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ columnGap: 12 }}
                        />
                    </View>

                    {renderMarginBottom(20)}

                </View>

                <FlatList
                    data={posts}
                    renderItem={({ item }) => <Post post={item} />}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ columnGap: 0, paddingLeft: 12, paddingRight: 12 }}
                />
                <Button title="Ver más" onPress={() => router.push('/screen3/screen3')} />
                <Button title="Ver más" onPress={() => router.push('/screen3/screen1')} />
            </ScrollView>

            <LocationPickerModal
                currentUser={currentUser}
                saveLocation={saveLocation}
                bottomSheetRef={bottomSheetRef}
            />
        </View>
    );
}

function NoPost() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text style={{ fontSize: 16, color: "gray", textAlign: "center" }}>
                No hay publicaciones disponibles en este momento.
            </Text>
        </View>
    );
}
