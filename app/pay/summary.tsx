import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {ArrowLeft, ChevronRight, Crown, DoorOpen, FileText, MapPin, MoveLeft, } from "lucide-react-native";
import { COLORS, SIZES } from "@/constants/theme";
import MapView from "react-native-maps";
import CenterMarker from "@/components/CenterMarker/CenterMarker";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useCallback, useRef, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SeguridadGarantizada from "@/components/pay/seguridadGarantizada";
import TrashComponent from "@/components/pay/trash";

export default function CheckoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termine y pague</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TouchableOpacity
          style={{ height: 160, overflow: "hidden" }}
          onPress={() => router.push("/pay/location")}
        >
          <MapView
            style={{ flex: 1 }}
            showsUserLocation
            showsMyLocationButton
            zoomEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            loadingEnabled={true}
          />
          <CenterMarker />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 25 }}>
          {/* Row 1 */}
          <TouchableOpacity activeOpacity={0.8} style={styles.cuadro}>
            <View style={styles.component}>
              <MapPin size={22} style={{ marginRight: 20 }} strokeWidth={2.5} />
              <View style={{ flex: 1 }}>
                <Text style={styles.negrita}>Direccion</Text>
                <Text style={styles.normal}>
                  Victor Raúl Haya de la Torre # 101
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="black" strokeWidth={3.5} />
          </TouchableOpacity>

          <View style={styles.line} />

          {/* Row 2 */}
          <TouchableOpacity activeOpacity={0.8} style={styles.cuadro} onPress={() => router.push("/pay/detalles")}>
            <View style={styles.component}>
              <FileText
                size={22}
                style={{ marginRight: 20 }}
                strokeWidth={2.5}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.negrita}>Detalles</Text>
                <Text style={styles.normal}>
                  Ingrese los detalles de su direccion
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="black" strokeWidth={3.5} />
          </TouchableOpacity>

          <View style={styles.line} />

          {/* Row 3 */}
          <TouchableOpacity activeOpacity={0.8} style={styles.cuadro}>
            <View style={styles.component}>
              <DoorOpen
                size={22}
                style={{ marginRight: 20 }}
                strokeWidth={2.5}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.negrita}>Detalles de entrega</Text>
                <Text style={styles.normal}>
                  Agregue instrucciones para la entrega
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="black" strokeWidth={3.5} />
          </TouchableOpacity>

          <View style={styles.line} />
          <View style={{ backgroundColor: "#fff", paddingVertical: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: "Medium" }}>
                Método de pago
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.TextContainer}
                onPress={() => router.push("/pay/metodoPago")}
              >
                <Text style={{ fontSize: 14, fontFamily: "Medium" }}>
                  {" "}
                  Cambiar{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line} />
          <View style={{ backgroundColor: "#fff", paddingVertical: 16 }}>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: "Medium" }}>
                Resumen
              </Text>
              <View style={styles.sellerContainer}>
                <Image source={{ uri: imageUrl }} style={styles.sellerAvatar} />
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName} numberOfLines={1}>
                    {post?.title}
                  </Text>
                  <Text style={styles.footerShipping}>
                    {post?.currency === "Dolares" ? "$" : "S/"}
                    {post?.price}.00
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.line} />
            <SeguridadGarantizada />
            <View style={styles.PrecioContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Producto</Text>
                <Text style={styles.value}>S/ 135.00</Text>
              </View>

              {/* Servicio */}
              <View style={styles.row}>
                <Text style={styles.label}>Servicio</Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <TouchableOpacity onPress={openBottomSheet}>
                    <TrashComponent enabled={active} setActive={setActive} />
                  </TouchableOpacity>
                  {active ? (
                    <Text style={styles.value}>S/ 6.75</Text>
                  ) : (
                    <Text style={styles.value}>S/ 0.00</Text>
                  )}
                </View>
              </View>

              {/* Delivery */}
              <View style={styles.row}>
                <Text style={styles.label}>Delivery</Text>
                <Text style={styles.value}>S/ 6.00</Text>
              </View>

              {/* Total */}
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total a pagar</Text>
                <Text style={styles.totalValue}>S/ 142.75</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.85} style={styles.footerLeft}>
          <Text style={styles.footerShipping}>Total</Text>
          <Text style={styles.footerPrice}>
            {post?.currency === "Dolares" ? "$" : "S/"}
            142.75
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={styles.btnn}>
          <Text style={styles.btnText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { width: 40 },
  backText: { fontSize: 20 },
  headerTitle: { fontSize: 18, fontFamily: "SemiBold" },

  body: { flex: 1 },

  footer: {
    position: "absolute",
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingBottom: 20,
    paddingHorizontal: 30,
    borderTopColor: COLORS.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  price: {
    paddingVertical: 10,
    fontFamily: "SemiBold",
    fontSize: SIZES.large,
    color: COLORS.main,
  },
  btnn: {
    backgroundColor: "#adc92b",
    height: 58,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SemiBold",
  },
  footerLeft: {
    flex: 1,
    flexDirection: "column", // columna
    justifyContent: "center",
  },
  sellerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "white",
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 14,
  },
  sellerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  sellerName: {
    fontSize: 16,
    fontFamily: "Regular",
    color: COLORS.main,
  },
  sellerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  sellerRatingText: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: "Regular",
  },
  footerPrice: {
    fontSize: 28,
    fontFamily: "Medium",
    marginBottom: 4,
  },

  footerShipping: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Regular",
  },

  footerCancel: {
    fontSize: 13,
    color: COLORS.main,
    fontFamily: "Medium",
  },
  cancelTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",

    paddingHorizontal: 8, // 🔹 lo agrego para que tenga aire a los lados
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start", // 🔹 hace que el contenedor se ajuste al contenido
  },
  line: {
    height: 1,
    backgroundColor: "#eee",
  },
  cuadro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  negrita: { fontSize: 14, fontFamily: "Medium" },
  normal: { fontSize: 12, color: "#555", fontFamily: "Regular" },
  TextContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",

    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 118,
  },
  component: { flexDirection: "row", alignItems: "center", flex: 1 },
  PrecioContainer: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: "#555",
    fontFamily: "Regular",
  },
  value: {
    fontSize: 15,
    color: "black",
    fontFamily: "Regular",
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Medium",
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "Medium",
  },
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    paddingVertical: 10,
    paddingLeft: 5,
    paddingRight: 12,
    marginTop: 18,
    marginBottom: 5,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  crownIcon: {
    height: 60,
    width: 60,
    marginRight: 4,
  },
  textBlock: {
    // Contains both lines of text
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Medium",
  },

  renewText: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Regular",
  },
  arrowButton: {
    backgroundColor: "#adc92b",
    width: 32,
    height: 32,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
