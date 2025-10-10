// screens/LocationPickerScreen.tsx
import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, SafeAreaView, ScrollView, Pressable, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, CircleCheck } from "lucide-react-native";
import CenterMarker from "@/components/CenterMarker/CenterMarker";
import { useCreatePostStore } from "@/stores/createPostStore";
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

export default function LocationPickerScreen() {
  const [region, setRegion] = useState({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const { userId } = useAuth();

  // read from store
  const storeLocation = useCreatePostStore((s) => s.location);
  const storePreviewLat = useCreatePostStore((s) => (s as any).previewLat ?? null);
  const storePreviewLng = useCreatePostStore((s) => (s as any).previewLng ?? null);
  const setField = useCreatePostStore((s) => s.setField);

  const [currentName, setCurrentName] = useState(storeLocation || "Establecer ubicación");

  // if the store already has preview coords (e.g. coming back), center map there
  useEffect(() => {
    if (typeof storePreviewLat === "number" && typeof storePreviewLng === "number") {
      setRegion((prev) => ({
        ...prev,
        latitude: storePreviewLat,
        longitude: storePreviewLng,
      }));
    }
  }, [storePreviewLat, storePreviewLng]);

  // keep the displayed name in sync with the store (if storeLocation changes elsewhere)
  useEffect(() => {
    setCurrentName(storeLocation || "Establecer ubicación");
  }, [storeLocation]);

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
    getDeviceLocation();
  }, []);

  async function guardarUbicacion({ latitude, longitude }: { latitude: number, longitude: number }) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=es`;
      const response = await fetch(url);
      const data = await response.json();

      const components = data.results?.[0]?.address_components || [];
      const departamento = components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name || '';
      const provincia = components.find((c: any) => c.types.includes('administrative_area_level_2'))?.long_name || '';

      const locationName = `${provincia}, ${departamento}`;

      // Guardar en store para que step/3 se actualice automáticamente
      setField("location", locationName);

      // <-- NUEVO: guardar preview coords en el store (solo para centrar mapas / preview)
      setField("previewLat", latitude);
      setField("previewLng", longitude);

      // También actualizar el estado local para reflejar en UI inmediata
      setCurrentName(locationName);

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
          Arrastra el mapa o muévete hasta el punto deseado.
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
            provider={PROVIDER_GOOGLE}
          />
          <CenterMarker />
        </View>

        <View style={{ width: "95%", marginTop: 20, backgroundColor: "#fff", borderRadius: 12, padding: 14, elevation: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ backgroundColor: "#eef6df", borderRadius: 10, padding: 8, marginRight: 12 }}>
              <MapPin size={22} strokeWidth={1.6} color="#6b8e23" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: "Medium", color: "#111" }}>{currentName}</Text>
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

          {/* Save button */}
          <View style={{ marginTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: "#2a6f2a", paddingVertical: 12, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              onPress={async () => {
                await guardarUbicacion({ latitude: region.latitude, longitude: region.longitude });
                router.back();
              }}
            >
              <CircleCheck size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontFamily: "Medium" }}>Guardar ubicación</Text>
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
