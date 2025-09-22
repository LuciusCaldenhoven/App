// screens/LocationPickerScreen.tsx

import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, SafeAreaView, ScrollView, Pressable, Platform } from "react-native";
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, CircleCheck } from "lucide-react-native";
import styles from "@/styles/feed.styles";
import CenterMarker from "@/components/CenterMarker/CenterMarker";
import { useSharedValue } from "react-native-reanimated";
import { Slider } from 'react-native-awesome-slider';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

export default function LocationPickerScreen() {

    const [region, setRegion] = useState({
        latitude: -12.0464,
        longitude: -77.0428,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });
    
    const { userId } = useAuth();
  const currentUser = useQuery(
      api.users.getUserByClerkId,
      userId ? { clerkId: userId } : "skip"
    );
    const [km, setKm] = useState(currentUser?.km || 10);
    
    const progress = useSharedValue(currentUser?.km || 10);
    const min = useSharedValue(10);
    const max = useSharedValue(400);
    const saveLocation = useMutation(api.users.saveLocation);

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
                    latitude: typeof currentUser.lat === "number" ? currentUser.lat : -12.0464,
                    longitude: typeof currentUser.lng === "number" ? currentUser.lng : -77.0428,
                }));
            } else {
                setRegion(prev => ({
                    ...prev,
                    latitude: -12.0464,
                    longitude: -77.0428,
                }));
            }
        };

        getDeviceLocation().then(success => {
            if (!success) getSavedLocation();
        });
    }, [currentUser]);

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

            router.back();
        } catch (error) {
            console.error('Error al guardar ubicación:', error);
        }
    }

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FB", paddingTop: Platform.OS === "android" ? 45 : 0 }}>

      {/* Header */}
      <LinearGradient
        colors={["#ffffff00", "#f6fbf2"]}
        style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontFamily: "Medium", color: "#111" }}>Seleccionar ubicación</Text>
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Text style={{ fontFamily: "Regular", color: "#666" }}>Cancelar</Text>
          </Pressable>
        </View>
        <Text style={{ marginTop: 6, color: "#666", fontFamily: "Regular", fontSize: 13 }}>
          Arrastra el mapa o muévete hasta el punto deseado. Ajusta el radio abajo.
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}>
        <View style={{ width: "95%", height: 320, marginTop: 12, borderRadius: 14, overflow: "hidden", backgroundColor: "#fff", elevation: 3 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={region}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton
          />
          <CenterMarker />
        </View>

        <View style={{ width: "95%", marginTop: 20, backgroundColor: "#fff", borderRadius: 12, padding: 14, elevation: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ backgroundColor: "#eef6df", borderRadius: 10, padding: 8, marginRight: 12 }}>
              <MapPin size={22} strokeWidth={1.6} color="#6b8e23" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: "Medium", color: "#111" }}>{currentUser?.location || "Establecer ubicación"}</Text>
            
            </View>

            <TouchableOpacity
              onPress={async () => {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                  Alert.alert("Permiso denegado", "Se necesita acceso a la ubicación.");
                  return;
                }
                const ubicacion = await Location.getCurrentPositionAsync({});
                setRegion((prev) => ({ ...prev, latitude: ubicacion.coords.latitude, longitude: ubicacion.coords.longitude }));
              }}
              style={{ padding: 8 }}
            >
              <Text style={{ color: "#2a6f2a", fontFamily: "Medium" }}>Mi ubicación</Text>
            </TouchableOpacity>
          </View>

          {/* Slider */}
          <View style={{ marginTop: 14 }}>
            <Slider
              progress={progress}
              style={{ height: 44 }}
              minimumValue={min}
              maximumValue={max}
              theme={{
                minimumTrackTintColor: "#adc92b",
                maximumTrackTintColor: "#E9E9E9",
                cacheTrackTintColor: "#f39c12",
                bubbleBackgroundColor: "#fff",
                bubbleTextColor: "#333",
                disableMinTrackTintColor: "#ddd",
              }}
              onValueChange={(progressVal: number) => {
                const roundedKm = Number(progressVal.toFixed(0));
                setKm(roundedKm);
                const delta = kmToDelta(progressVal);
                setRegion((prev) => ({ ...prev, latitudeDelta: delta, longitudeDelta: delta }));
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ fontFamily: "Regular", color: "#888" }}>10 km</Text>
              <Text style={{ fontFamily: "Regular", color: "#888" }}>400 km</Text>
            </View>

            <View style={{ marginTop: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontFamily: "Medium", color: "#333" }}>Radio: <Text style={{ color: "#2a6f2a" }}>{km} km</Text></Text>
            </View>
          </View>

          {/* Save button */}
          <View style={{ marginTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: "#2a6f2a", paddingVertical: 12, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              onPress={async () => {
                await guardarUbicacion({ latitude: region.latitude, longitude: region.longitude });
              }}
            >
              <CircleCheck size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontFamily: "Medium" }}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginLeft: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: "#e6e6e6", backgroundColor: "#fff" }}
              onPress={() => router.back()}
            >
              <Text style={{ fontFamily: "Medium", color: "#444" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
