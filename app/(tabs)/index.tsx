import { FlatList, ScrollView, Text, View, Image, Button, TouchableOpacity, Alert, TextInput } from "react-native";
import styles from "@/styles/feed.styles";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CategoryBox } from "@/components/categoryBox/categoryBox";
import { renderMarginBottom } from "@/constants/ui-utils";
import products from "@/assets/index/data"
import { useRouter } from "expo-router";;
import * as Location from 'expo-location';
import { useAuth } from "@clerk/clerk-expo";
import { CircleCheck, LocationEdit, MapPin, Search } from "lucide-react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import MapView from 'react-native-maps';
import CenterMarker from "@/components/CenterMarker/CenterMarker";
import Slider from '@react-native-community/slider';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;


export default function Index() {

    const router = useRouter();
    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");
    const posts = useQuery(api.posts.getFeedPosts);
    const saveLocation = useMutation(api.users.saveLocation);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const openBottomSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);




    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    // 2. Separate location initialization effect
    useEffect(() => {
        const getDeviceLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return false;

                const deviceLocation = await Location.getCurrentPositionAsync({});
                setRegion(prev => ({
                    ...prev,
                    latitude: deviceLocation.coords.latitude,
                    longitude: deviceLocation.coords.longitude,
                }));
                return true;
            } catch (error) {
                console.error('Error getting device location:', error);
                return false;
            }
        };

        // Only try to get saved location if device location fails
        const getSavedLocation = () => {
            if (
                typeof currentUser?.lat === "number" &&
                typeof currentUser?.lng === "number"
            ) {
                setRegion(prev => ({
                    ...prev,
                    latitude: currentUser.lat as number,
                    longitude: currentUser.lng as number,
                }));
            }
        };

        // Try device location first, then fallback to saved location
        getDeviceLocation().then(success => {
            if (!success) {
                getSavedLocation();
            }
        });
    }, []);

    async function guardarUbicacion({ latitude, longitude }: { latitude: number, longitude: number }) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=es`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                return; // No mostrar alerta
            }

            const components = data.results[0].address_components;
            const departamentoComp = components.find((c: any) =>
                c.types.includes('administrative_area_level_1')
            );
            const provinciaComp = components.find((c: any) =>
                c.types.includes('administrative_area_level_2')
            );

            const departamento = departamentoComp?.long_name || '';
            const provincia = provinciaComp?.long_name || '';

            await saveLocation({
                location: `${provincia}, ${departamento}`,
                lat: latitude,
                lng: longitude,
                km: km,
            });

            // ✅ Cierra el BottomSheet
            bottomSheetRef.current?.dismiss();
        } catch (error) {
            console.error('Error al guardar ubicación:', error);
            // No mostrar alerta
        }
    }


    function kmToDelta(km: number) {
        return Number((km / 111).toFixed(4));
    }

    const [km, setKm] = useState(currentUser?.km || 10);






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
                    <TouchableOpacity style={styles.searchBtn} onPress={() => router.push({ pathname: "../search/searchResults" })}>
                        <Search size={20} color={'grey'} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={"Que quieres comprar"}
                            placeholderTextColor={'grey'}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={openBottomSheet} activeOpacity={0.8} style={styles.locationButton}>
                    <View style={styles.locationButton2}>
                        <LocationEdit size={16} />
                        <Text style={styles.locationText}>
                            {currentUser?.location && currentUser?.km
                                ? `${currentUser.location} - ${currentUser.km} km`
                                : 'Establecer ubicación'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>







            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >


                <View style={{ paddingBottom: 10 }}>


                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 25, paddingBottom: 16, }} >
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
                            data={products}
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
                    <Text style={styles.titulo}>Las Novedadessss paa</Text>
                </View>

                <FlatList
                    data={posts}
                    renderItem={({ item }) => <Post post={item} />}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ columnGap: 0, paddingLeft: 12, paddingRight: 12 }}
                />
                <Button title="Ver más" onPress={() => router.push('/screen.try/screen3')} />
                <Button title="Ver más" onPress={() => router.push('/screen.try/screen1')} />
            </ScrollView>
            <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={['90%']}
                backgroundStyle={{ borderRadius: 24 }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1}
                        appearsOnIndex={0}
                        opacity={0.3}
                    />
                )}
            >
                <BottomSheetView style={{ alignItems: 'center' }}>

                    <Text style={{ fontSize: 16, fontFamily: "Medium", alignItems: 'center' }}>Ubicacion</Text>


                    <View style={{ width: '95%', height: 290, marginTop: 12 }}>
                        <MapView
                            style={{ flex: 1, borderRadius: 12 }}
                            initialRegion={region}
                            region={region}
                            onRegionChangeComplete={setRegion}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            zoomEnabled={false}

                        />

                        <CenterMarker />

                    </View>
                    <View style={styles.containerDown}>
                        <View style={styles.locationRow}>
                            <MapPin size={30} strokeWidth={2} color="#111" />
                            <View style={styles.locationTextContainer}>
                                <Text style={styles.locationText}>{currentUser?.location}</Text>
                                <Text style={styles.kmText}>{currentUser?.km} km</Text>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 15 }}>
                            <TouchableOpacity
                                onPress={async () => {
                                    const { status } = await Location.requestForegroundPermissionsAsync();
                                    if (status !== 'granted') {
                                        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación.');
                                        return;
                                    }
                                    const ubicacion = await Location.getCurrentPositionAsync({});
                                    setRegion((prev) => ({
                                        ...prev,
                                        latitude: ubicacion.coords.latitude,
                                        longitude: ubicacion.coords.longitude,
                                    }));
                                }}
                                style={styles.secondaryButton}
                            >
                                <Text style={styles.secondaryButtonText}>Ver ubicación actual</Text>
                            </TouchableOpacity>

                            <View style={styles.sliderContainer}>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={100}
                                    value={km}
                                    onValueChange={(value: number) => {
                                        const roundedKm = Number(value.toFixed(0));
                                        setKm(roundedKm);
                                        const delta = kmToDelta(value);
                                        setRegion((prev) => ({
                                            ...prev,
                                            latitudeDelta: delta,
                                            longitudeDelta: delta,
                                        }));
                                    }}
                                    minimumTrackTintColor="#333"
                                    maximumTrackTintColor="#ccc"
                                    thumbTintColor="#555"
                                />
                            </View>

                            <Text style={styles.kmLabel}>
                                Radio: <Text style={styles.kmValue}>{km} km</Text>
                            </Text>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={async () => {
                                    await guardarUbicacion({
                                        latitude: region.latitude,
                                        longitude: region.longitude,
                                    });
                                }}
                            >
                                <CircleCheck size={20} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.primaryButtonText}>Guardar cambios</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </BottomSheetView>
            </BottomSheetModal>


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
