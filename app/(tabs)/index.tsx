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
import MultiSlider from "@ptomasroos/react-native-multi-slider";



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


    const GOOGLE_API_KEY = 'AIzaSyA6acFNK1uCyE4_g2n0DwY0ok9k4LIs8AM';

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const ubicacion = await Location.getCurrentPositionAsync({});
                setRegion((prev) => ({
                    ...prev,
                    latitude: ubicacion.coords.latitude,
                    longitude: ubicacion.coords.longitude,
                }));
            }
        })();
    }, []);

    const [region, setRegion] = useState({
        latitude: currentUser?.lat ?? 0,
        longitude: currentUser?.lng ?? 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    async function guardarUbicacion({ latitude, longitude }: { latitude: number, longitude: number }) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=es`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                Alert.alert('Error', 'No se pudo determinar la ubicación.');
                return;
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
            });

            Alert.alert('Éxito', 'Ubicación actualizada correctamente');
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al guardar la ubicación.');
            console.error(error);
        }
    }

    function kmToDelta(km: number) {
        return km / 111; // 1 grado ≈ 111km
    }
    const [km, setKm] = useState(5);






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
                            {currentUser?.location || 'Establecer ubicación'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>







            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >


                <View style={{ paddingBottom: 10 }}>


                    {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 25, paddingBottom: 16, }} >
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
                            icon={<Image source={requir e('@/assets/index/electronica.png')} style={{ width: 100, height: 100 }} />}
                            title="Electrónica"
                            backgroundColor={'rgba(0, 230, 118, 0.25)'}
                            onPress={() => router.push(`/search/searchResults?category=Electrónica`)}
                            width={160}
                            height={140}

                        />
                    </View> */}

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
                        />

                        <CenterMarker />

                    </View>

                    <View style={{ width: '95%', alignItems: 'flex-start', paddingVertical: 15, flexDirection: "row", }}>
                        <MapPin size={30} strokeWidth={2} />
                        <Text style={{ paddingTop: 5, fontSize: 15, fontFamily: 'Medium' }}> {currentUser?.location}</Text>
                    </View>


                    <MultiSlider
                        values={[km]}
                        min={1}
                        max={500}
                        step={0.1}
                        onValuesChange={([value]) => setKm(value)}
                        onValuesChangeFinish={([value]) => {
                            const delta = kmToDelta(value);
                            setRegion((prev) => ({
                                ...prev,
                                latitudeDelta: delta,
                                longitudeDelta: delta,
                            }));
                        }}
                    />
                    <Text style={{ marginTop: 8, fontSize: 14, color: "#333" }}>
                        Radio: {km.toFixed(1)} km
                    </Text>

                    <TouchableOpacity
                        onPress={async () => {
                            const { status } = await Location.requestForegroundPermissionsAsync();
                            if (status !== 'granted') {
                                Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación.');
                                return;
                            }
                            const ubicacion = await Location.getCurrentPositionAsync({});
                            // Solo centra el mapa, NO guarda
                            setRegion((prev) => ({
                                ...prev,
                                latitude: ubicacion.coords.latitude,
                                longitude: ubicacion.coords.longitude,
                            }));
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>
                            Ver ubicación actual
                        </Text>
                    </TouchableOpacity>



                    <TouchableOpacity style={styles.button} onPress={async () => {
                        await guardarUbicacion({
                            latitude: region.latitude,
                            longitude: region.longitude,
                        });
                    }}
                    >
                        <CircleCheck size={20} color="#fff" />
                        <Text style={styles.buttonText}>Guardar cambios</Text>
                    </TouchableOpacity>

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
