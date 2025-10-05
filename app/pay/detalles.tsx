import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronRight,
  Crown,
  DoorOpen,
  FileSliders,
  FileText,
  House,
  MapPin,
  Tag,
} from "lucide-react-native";
import condicion from "@/assets/condicion/condicion.data";
import { COLORS, SIZES } from "@/constants/theme";
import MapView from "react-native-maps";
import CenterMarker from "@/components/CenterMarker/CenterMarker";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useCallback, useRef, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import CategorySelect from "@/components/CategorySelect";
import InputSelect from "@/components/InputSelect";
import InputText from "@/components/InputText";
import DiunaMarker from "@/components/CenterMarker/DiunaMarket";

export default function CheckoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [condition, setCondition] = useState("");
  const [caption, setCaption] = useState("");
  const post = useQuery(
    api.posts.getBookmarkedPostById,
    id ? { postId: id as Id<"posts"> } : "skip"
  );
  const imageUrl = useQuery(
    api.posts.getImageUrl,
    post?.storageId ? { storageId: post.storageId } : "skip"
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const [active, setActive] = useState(true);

  // UI-friendly fallbacks / computed values
  const productPrice = post?.price ? Number(post.price) : 135.0;
  const servicePrice = active ? 6.75 : 0.0;
  const deliveryPrice = 6.0;
  const totalPrice = productPrice + servicePrice + deliveryPrice;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Detalles de entrega</Text>
          <Text style={styles.headerSubtitle}>
            Confirma dirección y detalles
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => router.push("/pay/location")}
            activeOpacity={0.9}
          >
            <MapView
              style={styles.map}
              showsUserLocation
              showsMyLocationButton
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              loadingEnabled={true}
            />
            <DiunaMarker />
            <View style={styles.mapBadge}>
              <MapPin size={18} />
              <Text style={styles.mapBadgeText}>Confirmar ubicación</Text>
              <ChevronRight size={16} />
            </View>
          </TouchableOpacity>

          {/* ADDRESS CARD */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.addressTitle}>
                Victor Raul Haya de la Torre #101
              </Text>

              <TouchableOpacity style={styles.changeBtn} activeOpacity={0.85}>
                <Text style={styles.changeText}>Cambiar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.addressSubtitle}>Arequipa, Perú </Text>
            <View style={{ marginTop: 12 }}>
              <Text style={styles.normal}>
                Ingrese los detalles de su dirección (piso, referencia,
                teléfono)
              </Text>
            </View>
          </View>
        </View>
        {/* FORM / INPUTS */}

        <View style={styles.formSection}>
          <InputText
            label="Detalles adicionales (opcional)"
            iconComponent={<FileText size={18} />}
            value={caption}
            onChangeText={setCaption}
            multiline
          />
        </View>
        <View style={styles.formSection}>
          <InputSelect
            label="Tipo de vivienda"
            iconComponent={<House size={18} strokeWidth={2.5} />}
            value={condition}
            onChangeText={setCondition}
            data={condicion}
          />
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.tipBox}>
            <MapPin size={20} strokeWidth={2.5} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.tipTitle}>Protege tu entrega</Text>
              <Text style={styles.tipText}>
                Agrega una referencia clara para que el repartidor encuentre el
                lugar más rápido.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER SUMMARY */}

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.btnn}
        onPress={() => router.back()}
      >
        <Text style={styles.btnText}>Guardar y continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7fa" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 10,
  },
  backBtn: { width: 40 },
  backText: { fontSize: 20 },
  headerTitle: { fontSize: 18, fontFamily: "Medium" },
  headerSubtitle: { fontSize: 12, color: COLORS.gray },

  body: { flex: 1 },

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
  },
  mapBadgeText: { marginLeft: 8, flex: 1, fontFamily: "Medium" },

  card: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: "#eee" },
  addressTitle: { fontSize: 15, fontFamily: "Medium" },
  addressSubtitle: { fontSize: 12, color: COLORS.gray, fontFamily: "Regular" },
  changeBtn: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  changeText: { fontFamily: "Medium" },

  formSection: { marginTop: 18, paddingBottom: 20, alignItems: "center" },

  tipBox: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  tipTitle: { fontFamily: "Medium" },
  tipText: { fontSize: 12, color: COLORS.gray, marginTop: 2, fontFamily: "Regular" },
  tipAction: { paddingVertical: 6, paddingHorizontal: 10 },
  tipActionText: { color: COLORS.main, fontFamily: "Medium" },

  footer: {
    position: "absolute",
    height: 96,
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopColor: COLORS.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
  },
  footerPrice: { fontSize: 20, fontFamily: "SemiBold" },

  footerShipping: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Regular",
  },

  btnn: {
    backgroundColor: "#adc92b",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  btnText: { color: "white", fontSize: 16, fontFamily: "SemiBold" },

  normal: { fontSize: 13, color: "#555", fontFamily: "Regular" },
});
