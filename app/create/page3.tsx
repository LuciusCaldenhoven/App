// app/create/step/3.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react-native";
import CategorySelect from "@/components/category";
import { useCreatePostStore } from "@/stores/createPostStore";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import DiunaMarker from "@/components/CenterMarker/DiunaMarket";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CenterMarkerSmall from "@/components/CenterMarker/CenterMarkerSmall";

const APP_PRIMARY = "#adc92b";
const GREY = "#8F9BA6";
const BG = "#FAFAFB";

/* small progress */
function SmallProgress({ total = 4, current = 3 }: { total?: number; current?: number }) {
  const prog = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = Math.max(0, Math.min(1, (current - 1) / (total - 1)));
    Animated.timing(prog, { toValue: t, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [current, total, prog]);

  return (
    <View style={localStyles.progressSmallWrap}>
      <View style={localStyles.progressSmallBg} />
      <Animated.View
        style={[
          localStyles.progressSmallFill,
          { width: prog.interpolate({ inputRange: [0, 1], outputRange: [24, 280] }), backgroundColor: APP_PRIMARY },
        ]}
      />
    </View>
  );
}

/* ------------------ Screen 3: Categoría + Ubicación ------------------ */
export default function CreateStepCategoryLocation() {
  const router = useRouter();
  const totalSteps = 4;
  const currentStep = 3;

  // current user (optional)
  const { userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  // store selectors (granulares para evitar re-renders innecesarios)
  const storeCategory = useCreatePostStore((s) => (s as any).category ?? "");
  const storeNivel2 = useCreatePostStore((s) => (s as any).nivel2 ?? "");
  const storeNivel3 = useCreatePostStore((s) => (s as any).nivel3 ?? "");
  const storeNivel4 = useCreatePostStore((s) => (s as any).nivel4 ?? "");
  const storeSubcategory = useCreatePostStore((s) => s.subcategory ?? "");
  const storeLocation = useCreatePostStore((s) => s.location ?? "");
  const storePreviewLat = useCreatePostStore((s) => (s as any).previewLat ?? null);
  const storePreviewLng = useCreatePostStore((s) => (s as any).previewLng ?? null);

  const setField = useCreatePostStore((s) => s.setField);
  const setMany = useCreatePostStore((s) => s.setMany);

  // local UI states for category inputs (we keep these local for responsiveness)
  const [category, setCategory] = useState<string>(storeCategory || "");
  const [nivel2, setNivel2] = useState<string>(storeNivel2 || "");
  const [nivel3, setNivel3] = useState<string>(storeNivel3 || "");
  const [nivel4, setNivel4] = useState<string>(storeNivel4 || "");
  const [subcategory, setSubcategory] = useState<string>(storeSubcategory || "");

  // region for MapView: prefer preview coords > currentUser coords > defaults
  const [region, setRegion] = useState({
    latitude: storePreviewLat ?? currentUser?.lat ?? -12.0464,
    longitude: storePreviewLng ?? currentUser?.lng ?? -77.0428,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012 * 50,
  });

  // ---- sync from currentUser into store once (if available) ----
  useEffect(() => {
    if (!currentUser) return;

    // If currentUser has a textual location, populate the store's location (only once)
    if (currentUser.location) {
      try {
        setField("location", currentUser.location);
      } catch (err) {
        // ignore
      }
    }

    // If currentUser has coords and we want to preview them, set preview coords
    if (typeof currentUser.lat === "number" && typeof currentUser.lng === "number") {
      try {
        setField("previewLat", currentUser.lat);
        setField("previewLng", currentUser.lng);
      } catch (err) {
        // ignore
      }
    }
    // run this effect when currentUser changes
  }, [currentUser, setField]);

  // ---- keep local category fields in sync with store (if store changes externally) ----
  useEffect(() => {
    setCategory(storeCategory || "");
  }, [storeCategory]);

  useEffect(() => {
    setNivel2(storeNivel2 || "");
  }, [storeNivel2]);

  useEffect(() => {
    setNivel3(storeNivel3 || "");
  }, [storeNivel3]);

  useEffect(() => {
    setNivel4(storeNivel4 || "");
  }, [storeNivel4]);

  useEffect(() => {
    setSubcategory(storeSubcategory || "");
  }, [storeSubcategory]);

  // ---- when preview coords change in the store, move the map region ----
  useEffect(() => {
    if (typeof storePreviewLat === "number" && typeof storePreviewLng === "number") {
      setRegion((prev) => ({
        ...prev,
        latitude: storePreviewLat,
        longitude: storePreviewLng,
      }));
    }
  }, [storePreviewLat, storePreviewLng]);

  // validation: use storeLocation (reactive) — no local location state used
  const canProceed = category.trim().length > 0 && storeLocation.trim().length > 0;

  // debug
  // console.log("category, storeLocation:", category, storeLocation);

  /**
   * handleCategoryPath
   * recibe path: ['deporte','futbol','pelota']...
   */
  const handleCategoryPath = (path: string[]) => {
    const lvl1 = path[0] ?? "";
    const lvl2 = path[1] ?? "";
    const lvl3 = path[2] ?? "";
    const lvl4v = path[3] ?? "";
    const last = path.length > 0 ? path[path.length - 1] : "";

    // actualizar estados locales (UI inmediata)
    setCategory(lvl1);
    setNivel2(lvl2);
    setNivel3(lvl3);
    setNivel4(lvl4v);
    setSubcategory(last);

    // parche atómico en store
    const patch: Record<string, any> = {
      category: lvl1,
      nivel2: lvl2 || "",
      nivel3: lvl3 || "",
      nivel4: lvl4v || "",
      subcategory: last || "",
      categoryPath: path,
    };

    try {
      setMany?.(patch as any);
    } catch (err) {
      // fallback granular
      try {
        (setField as any)?.("category", lvl1);
        (setField as any)?.("nivel2", lvl2 || "");
        (setField as any)?.("nivel3", lvl3 || "");
        (setField as any)?.("nivel4", lvl4v || "");
        (setField as any)?.("subcategory", last || "");
        (setField as any)?.("categoryPath", path);
      } catch {
        // noop
      }
    }
  };

  const handleNext = () => {
    if (!canProceed) return;

    const path = category ? [category, ...(nivel2 ? [nivel2] : []), ...(nivel3 ? [nivel3] : []), ...(nivel4 ? [nivel4] : [])] : [];
    const last = path.length > 0 ? path[path.length - 1] : "";

    // build patch WITHOUT previewLat/previewLng ni lat/lng (no deben formar parte del post final)
    const patch: Record<string, any> = {
      category,
      nivel2: nivel2 || "",
      nivel3: nivel3 || "",
      nivel4: nivel4 || "",
      subcategory: last || "",
      categoryPath: path,
      location: storeLocation, // textual location from store
      // intentionally not adding previewLat/previewLng or lat/lng here
    };

    try {
      setMany?.(patch as any);
    } catch {
      try {
        (setField as any)?.("category", category);
        (setField as any)?.("nivel2", nivel2 || "");
        (setField as any)?.("nivel3", nivel3 || "");
        (setField as any)?.("nivel4", nivel4 || "");
        (setField as any)?.("subcategory", last || "");
        (setField as any)?.("categoryPath", path);
        (setField as any)?.("location", storeLocation);
      } catch {
        // noop
      }
    }

    router.push("/create/page4");
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#222" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Publicar producto</Text>
          <Text style={styles.headerSub}>
            Paso {currentStep} de {totalSteps}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
        <SmallProgress total={totalSteps} current={currentStep} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoría</Text>

          <CategorySelect
            label="Seleccionar categoría"
            valueCategory={category}
            onChangeTextCategory={(v) => {
              setCategory(v);
              try {
                (setField as any)?.("category", v);
              } catch {}
            }}
            valueSub={subcategory}
            onChangeTextSub={(v) => {
              setSubcategory(v);
              try {
                (setField as any)?.("subcategory", v);
              } catch {}
            }}
            onChangePath={handleCategoryPath}
          />

          <Text style={styles.hintText}>Elige la categoría principal y subcategoría.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => router.push("/create/location")}
            activeOpacity={0.9}
          >
            <MapView
              style={styles.map}
              showsUserLocation
              showsMyLocationButton
              region={region}
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              loadingEnabled={true}
              provider={PROVIDER_GOOGLE}
            />
            <CenterMarkerSmall />
            <View style={styles.mapBadge}>
              <MapPin size={18} />
              <Text style={styles.mapBadgeText}>{storeLocation || "Confirmar ubicación"}</Text>
              <ChevronRight size={16} />
            </View>
          </TouchableOpacity>
          <Text style={styles.hintText}>Indica la ciudad donde se verá el producto.</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.backBtnMain]} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]} disabled={!canProceed} onPress={handleNext}>
            <Text style={styles.nextBtnText}>{canProceed ? "Siguiente" : "Falta completar"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* estilos */
const localStyles = StyleSheet.create({
  inputWrap: { marginTop: 6, backgroundColor: "#fff", borderRadius: 12, padding: 8, position: "relative" },
  label: { position: "absolute", top: 8, left: 10, fontFamily: "Medium", fontSize: 13, color: GREY },
  textInput: {
    fontFamily: "Regular",
    paddingTop: Platform.OS === "ios" ? 22 : 20,
    paddingBottom: 8,
    paddingHorizontal: 6,
    fontSize: 15,
    color: "#111",
  },
  underlineBg: { position: "absolute", left: 6, right: 6, bottom: 0, height: 2, backgroundColor: "#F0F4F6", borderRadius: 4 },
  underlineFill: { position: "absolute", left: 6, bottom: 0, height: 2, borderRadius: 4 },

  progressSmallWrap: { height: 20, marginBottom: 12 },
  progressSmallBg: { position: "absolute", left: 0, right: 0, top: 6, height: 6, borderRadius: 999, backgroundColor: "#EEF3F6" },
  progressSmallFill: { position: "absolute", left: 0, top: 6, height: 6, borderRadius: 999 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: Platform.OS === "android" ? 24 : 40 },
  header: { height: 72, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontFamily: "SemiBold", fontSize: 16, color: "#111" },
  headerSub: { fontFamily: "Regular", fontSize: 12, color: GREY },
  mapContainer: { marginTop: 40, height: "70%" },
  mapCard: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eaeef6",
    marginTop: 12,
    justifyContent: "center",
    elevation: 2,
  },
  map: { flex: 1 },
  mapBadge: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 102,
  },
  mapBadgeText: { marginLeft: 8, flex: 1, fontFamily: "Medium", color: "#222" },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  section: { marginBottom: 18 },
  sectionTitle: { fontFamily: "SemiBold", fontSize: 14, color: "#222", marginBottom: 8 },
  hintText: { marginTop: 8, fontFamily: "Regular", fontSize: 12, color: GREY },

  footer: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", gap: 12 },
  backBtnMain: { flex: 1, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#E7EEF0" },
  backBtnText: { color: "#333", fontFamily: "SemiBold" },
  nextBtn: { flex: 1, backgroundColor: APP_PRIMARY, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  nextBtnDisabled: { backgroundColor: "#DDE7DA" },
  nextBtnText: { color: "#fff", fontFamily: "SemiBold" },
});
