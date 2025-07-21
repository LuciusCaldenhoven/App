// components/LocationPickerModal.tsx

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import MapView from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { MapPin, CircleCheck } from "lucide-react-native";
import styles from "@/styles/feed.styles";
import CenterMarker from "@/components/CenterMarker/CenterMarker";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

export default function LocationPickerModal({ 
    currentUser, 
    saveLocation, 
    bottomSheetRef 
}: { 
    currentUser: any, 
    saveLocation: Function, 
    bottomSheetRef: React.RefObject<BottomSheetModal | null>
}) {

    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const [km, setKm] = useState(currentUser?.km || 10);

    useEffect(() => {
        const getDeviceLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return false;
            const deviceLocation = await Location.getCurrentPositionAsync({});
            setRegion(prev => ({
                ...prev,
                latitude: deviceLocation.coords.latitude,
                longitude: deviceLocation.coords.longitude,
            }));
            return true;
        };

        const getSavedLocation = () => {
            if (typeof currentUser?.lat === "number" && typeof currentUser?.lng === "number") {
                setRegion(prev => ({
                    ...prev,
                    latitude: currentUser.lat,
                    longitude: currentUser.lng,
                }));
            }
        };

        getDeviceLocation().then(success => {
            if (!success) getSavedLocation();
        });
    }, []);

    function kmToDelta(km: number) {
        return Number((km / 111).toFixed(4));
    }

    async function guardarUbicacion({ latitude, longitude }: { latitude: number, longitude: number }) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=es`;
            const response = await fetch(url);
            const data = await response.json();

            const components = data.results?.[0]?.address_components || [];
            const departamento = components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name || '';
            const provincia = components.find((c: any) => c.types.includes('administrative_area_level_2'))?.long_name || '';

            await saveLocation({
                location: `${provincia}, ${departamento}`,
                lat: latitude,
                lng: longitude,
                km,
            });

            bottomSheetRef.current?.dismiss();
        } catch (error) {
            console.error('Error al guardar ubicación:', error);
        }
    }

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={['90%']}
            backgroundStyle={{ borderRadius: 24 }}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />
            )}
        >
            <BottomSheetView style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontFamily: "Medium", alignItems: 'center' }}>Ubicación</Text>

                <View style={{ width: '95%', height: 290, marginTop: 12 }}>
                    <MapView
                        style={{ flex: 1, borderRadius: 12 }}
                        initialRegion={region}
                        region={region}
                        onRegionChangeComplete={setRegion}
                        showsUserLocation
                        showsMyLocationButton
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
                                setRegion(prev => ({
                                    ...prev,
                                    latitude: ubicacion.coords.latitude,
                                    longitude: ubicacion.coords.longitude,
                                }));
                            }}
                            style={styles.secondaryButton}
                        >
                            <Text style={styles.secondaryButtonText}>Ver ubicación actual</Text>
                        </TouchableOpacity>

                        <View style={styles.sliderContainer} >

                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={100}
                                value={km}
                                step={1}
                                onValueChange={(value: number) => {
                                    const roundedKm = Number(value.toFixed(0));
                                    setKm(roundedKm);
                                    const delta = kmToDelta(value);
                                    setRegion(prev => ({
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
                                await guardarUbicacion({ latitude: region.latitude, longitude: region.longitude });
                            }}
                        >
                            <CircleCheck size={20} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.primaryButtonText}>Guardar cambios</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}
