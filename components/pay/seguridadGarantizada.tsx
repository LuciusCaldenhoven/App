import React, { useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, ShieldCheck, Percent, Clock, X } from "lucide-react-native";

export default function SeguridadGarantizada() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["70%", "92%"], []);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
  ), []);

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity activeOpacity={0.85} onPress={openBottomSheet}>
        <LinearGradient colors={["#373737", "#050505"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.containerInfo}>
          <View style={styles.contentContainer}>
            <Image source={require("@/assets/images/escudo.png")} style={styles.crownIcon} />
            <View style={styles.textBlock}>
              <Text style={styles.saveText}>Seguridad Garantizada</Text>
              <Text style={styles.renewText}>Protección total contra fraudes</Text>
            </View>
          </View>

          <View style={styles.arrowButton}>
            <ChevronRight size={20} color="#0B0B0B" strokeWidth={2.5} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom sheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          {/* top row: handle + close */}
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.closeButton} onPress={() => bottomSheetRef.current?.dismiss()}>
              <X size={22} strokeWidth={3} color="#444" />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Protección garantizada</Text>
            <Text style={styles.subtitle}>Reembolso garantizado y cobertura total en cada pedido</Text>


            {/* Promo card */}
            <View style={styles.promoCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.promoTitle}>Compra con total seguridad</Text>
                <Text style={styles.promoDesc}>Protección antifraude por un % extra del producto</Text>
                <View style={styles.promoTag}>
                  <Text style={styles.promoTagText}>Con un pequeño % del producto</Text>
                </View>
              </View>
              <Image source={require("@/assets/images/porcentaje.png")} style={styles.promoIcon} />
            </View>
          </View>

          {/* Benefits */}
          <Text style={styles.sectionTitle}>Beneficios de Protección</Text>
          <View style={styles.benefits}>
            <View style={styles.benefitRow}>
           <Image source={require("@/assets/images/billete.png")} style={styles.iconImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>Reembolso garantizado</Text>
                <Text style={styles.benefitDesc}>Recupera tu dinero si el producto no llega.</Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
            <Image source={require("@/assets/images/escudo.png")} style={styles.iconImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>Protección antifraude</Text>
                <Text style={styles.benefitDesc}>El pago solo se libera cuando confirmas</Text>
              </View>
            </View>

            <View style={styles.benefitRow}>
             <Image source={require("@/assets/images/mano.png")} style={styles.iconImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>Tranquilidad total</Text>
                <Text style={styles.benefitDesc}>Si hay problemas, intervenimos por ti.</Text>
              </View>
            </View>
          </View>


          <Text style={styles.smallNote}>
            Al usar la Protección Garantizada, aceptas los términos y tu pago se retiene solo hasta confirmar tu pedido.
          </Text>

          <View style={{ height: Platform.OS === "ios" ? 36 : 20 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    paddingVertical: 10,
    paddingLeft: 8,
    paddingRight: 12,
    marginTop: 18,
    marginBottom: 5,
  },
  contentContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  crownIcon: { height: 56, width: 56, marginRight: 8 },
  textBlock: {},
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  renewText: { color: "#ddd", fontSize: 13 },

  arrowButton: {
    backgroundColor: "#adc92b",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sheetBackground: { backgroundColor: "#fff", borderRadius: 20 },
  sheetContent: { paddingHorizontal: 24, paddingTop: 12 },

  topRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  handle: { width: 56, height: 6, borderRadius: 999, backgroundColor: "#eee", marginVertical: 8 },
  closeButton: { position: "absolute", right: 0, top: 8,  borderRadius: 20 },

  header: { marginTop: 4, marginBottom: 10 },
  title: { fontSize: 22, fontFamily: "Bold", color: "#111" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 6, marginBottom: 12, fontFamily: "Medium" },

  promoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f1e9d8",
  },
  promoTitle: { fontSize: 16, fontFamily: "SemiBold", marginBottom: 6 },
  promoDesc: { fontSize: 13, color: "#666", marginBottom: 8, fontFamily: "Regular" },
  promoTag: { backgroundColor: "#e6f2b3", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: "flex-start" },
  promoTagText: { color: "#556b00", fontSize: 13, fontFamily: "Regular" },
  promoIcon: { height: 52, width: 52, marginLeft: 12 },

  sectionTitle: { fontSize: 18, fontFamily:"Medium", marginTop: 18, marginBottom: 10, color: "#111" },

  benefits: { marginBottom: 18 },
  benefitRow: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 12 },

  benefitTitle: { fontSize: 15, fontFamily:"Medium", color: "#222" },
  benefitDesc: { fontSize: 13, color: "#666", fontFamily:"Regular",},

  paymentRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 12 },
  cardPill: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: "#eee", flex: 1 },
  cardIcon: { width: 36, height: 24, resizeMode: "contain", marginRight: 12 },
  cardText: { flex: 1, fontSize: 15, fontWeight: "700", color: "#333" },

  renewButton: { marginLeft: 12, backgroundColor: "#f4c15b", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999, justifyContent: "center", alignItems: "center", minWidth: 140 },
  renewButtonText: { color: "#111", fontSize: 15, fontWeight: "800" },

  smallNote: { marginTop: 12, color: "#999", fontSize: 12, textAlign: "center", marginHorizontal: 6 },
  iconImage: { width: 50, height: 50, resizeMode: "contain" },  
});
