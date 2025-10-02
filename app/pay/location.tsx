// screens/MapDeliveryScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import DiunaMarker from "@/components/CenterMarker/DiunaMarket";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = -12.0453;
const LONGITUDE = -77.0311;

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function MapDeliveryScreen() {
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012 * 10000,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // pedir permiso y centrar en la ubicación del dispositivo si se concede
    const getDeviceLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const ubicacion = await Location.getCurrentPositionAsync({});
        setRegion((prev) => ({
          ...prev,
          latitude: ubicacion.coords.latitude,
          longitude: ubicacion.coords.longitude,
        }));
      } catch (error) {
        console.warn("Error al obtener ubicación del dispositivo:", error);
      }
    };

    getDeviceLocation();
  }, []);

  async function reverseGeocode(lat: number, lng: number) {
    if (!GOOGLE_API_KEY) return null;

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=es`;
      const res = await fetch(url);
      const data = await res.json();
      const result = data.results?.[0];
      return result || null;
    } catch (err) {
      console.warn("Reverse geocode error:", err);
      return null;
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const { latitude, longitude } = region;

      // si hay API KEY, intentamos obtener dirección legible
      const geocode = await reverseGeocode(latitude, longitude);

      if (geocode) {
        const formatted =
          geocode.formatted_address || "Dirección no disponible";
        // obtener componentes útiles (opcional)
        const components = geocode.address_components || [];
        const departamento = components.find((c: any) =>
          c.types.includes("administrative_area_level_1")
        )?.long_name;
        const provincia = components.find((c: any) =>
          c.types.includes("administrative_area_level_2")
        )?.long_name;

        Alert.alert(
          "Ubicación seleccionada",
          `${formatted}\n\nCoordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}${
            departamento || provincia
              ? `\n\n${provincia || ""}${departamento ? `, ${departamento}` : ""}`
              : ""
          }`
        );
      } else {
        // sin API key o fallo en geocoding: mostrar solo coords
        Alert.alert(
          "Ubicación seleccionada",
          `Coordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\n(Activa EXPO_PUBLIC_GOOGLE_API_KEY para mostrar la dirección).`
        );
      }
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      Alert.alert(
        "Error",
        "No se pudo obtener la dirección. Intenta de nuevo."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuste su ubicación</Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer} pointerEvents="box-none">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          region={region}
          onRegionChangeComplete={(r) => setRegion(r)}
          showsUserLocation={true}
          zoomEnabled={true}
          scrollEnabled={true}
        />
        <DiunaMarker />
      </View>

      {/* Bottom sheet mimic */}
      <View style={styles.sheet}>
        <Text style={styles.title}>Consejos para fijar tu ubicación</Text>

        <Text style={styles.hint}>
          Coloca el pin en la{" "}
          <Text style={{ fontWeight: "600" }}>entrada principal</Text> de tu
          casa o edificio.
        </Text>
        <Text style={styles.hint}>
          Evita ubicarlo dentro del terreno; colócalo en la puerta visible
          desde la calle.
        </Text>
        <Text style={styles.hint}>
          Esto ayudará al repartidor a encontrarte sin retrasos.
        </Text>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.9}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.saveText}>Obteniendo ubicación...</Text>
            </View>
          ) : (
            <Text style={styles.saveText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    height: 56,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    marginRight: 8,
  },
  backArrow: { fontSize: 18 },
  headerTitle: { fontSize: 16, fontFamily: "SemiBold" },

  mapContainer: { marginTop: 40, height: "70%" },
  map: { ...StyleSheet.absoluteFillObject },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingTop: 14,
    paddingBottom: 26,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    textAlign: "left",
  },
  hint: { marginTop: 6, color: "#666", fontSize: 14, lineHeight: 20 },

  saveButton: {
    marginTop: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#adc92b",
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
