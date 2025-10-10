// OrderProgressScreen.tsx
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

const ACCENT = "#adc92b";
const BACKGROUND = "#F7F9FB";
const CARD = "#FFFFFF";
const MUTED = "#7B8896";
const TEXT = "#0B1220";

type Stage = { key: string; title: string; subtitle?: string };
const STAGES: Stage[] = [
  { key: "confirmed", title: "Pago confirmado", subtitle: "Hemos recibido el pago" },
  { key: "preparing", title: "Preparando", subtitle: "Vendedor empacando" },
  { key: "warehouse", title: "En almacén", subtitle: "Listo para despacho" },
  { key: "inhand", title: "En reparto", subtitle: "En manos del repartidor" },
  { key: "verified", title: "Entregado", subtitle: "Entrega verificada" },
];

export default function OrderProgressScreen() {
  const [stage, setStage] = useState<number>(0);

  const { id } = useLocalSearchParams();
  const post = useQuery(
    api.posts.getBookmarkedPostById,
    id ? { postId: id as Id<"posts"> } : "skip"
  );
  const imageUrl = useQuery(
    api.posts.getImageUrl,
    post?.storageId ? { storageId: post.storageId } : "skip"
  );

 

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.h1}>Seguimiento</Text>
            <Text style={styles.h2}>Estado de tu pedido</Text>
          </View>

          <View style={styles.headerRight}>
            {/* help button */}
            <TouchableOpacity style={styles.helpButton} onPress={() => router.push("/soporte/ContactarSoporte")}>
              <Text style={styles.helpIcon}>?</Text>
              <Text style={styles.helpText}>Ayuda</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* MAIN CARD */}
        <View style={styles.mainCard}>
          <View style={styles.topRow}>
            <Image source={{ uri: imageUrl }} style={styles.topImage} />
            <View style={styles.topInfo}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {post?.title ?? "Producto"}
              </Text>
              <Text style={styles.productPrice}>
                {post?.currency === "Dolares" ? "$" : "S/"}{post?.price ?? "0.00"}
              </Text>
            </View>
          </View>

          {/* STEPS */}
          <View style={styles.stepsRow}>
            {STAGES.map((s, i) => {
              const done = i <= stage;
              return (
                <View key={s.key} style={styles.stepWrap}>
                  <View style={[styles.bubble, done ? styles.bubbleDone : styles.bubblePending]}>
                    <Text
                      style={[
                        styles.bubbleText,
                        done ? styles.bubbleTextDone : styles.bubbleTextPending,
                      ]}
                    >
                      {done ? "✓" : String(i + 1)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepTitle,
                      done ? styles.stepTitleActive : styles.stepTitleInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {s.title}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* STATUS */}
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>{STAGES[Math.min(stage, STAGES.length - 1)].title}</Text>
            <Text style={styles.statusSubtitle}>
              {STAGES[Math.min(stage, STAGES.length - 1)].subtitle}
            </Text>

            <Text style={styles.statusBody}>
              {stage === 0 && "Hemos recibido tu pedido y confirmado la transacción."}
              {stage === 1 && "El vendedor está preparando tu paquete con cuidado."}
              {stage === 2 && "El pedido está en el almacén listo para salir."}
              {stage === 3 && "El repartidor lo tiene y está en camino."}
              {stage >= 4 && "Entrega confirmada. ¡Gracias por comprar con nosotros!"}
            </Text>

            <View style={styles.breakdown}>
              <View style={styles.breakRow}>
                <Text style={styles.breakLabel}>Subtotal</Text>
                <Text style={styles.breakValue}>S/ 135.00</Text>
              </View>
              <View style={styles.breakRow}>
                <Text style={styles.breakLabel}>Servicio</Text>
                <Text style={styles.breakValue}>S/ 0.00</Text>
              </View>
              <View style={styles.breakRow}>
                <Text style={styles.breakLabel}>Delivery</Text>
                <Text style={styles.breakValue}>S/ 6.00</Text>
              </View>
              <View style={[styles.breakRow, styles.breakTotal]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>S/ 141.00</Text>
              </View>
            </View>

            {/* ACTIONS */}
            {/* <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => setStage(Math.max(0, stage - 1))}
              >
                <Text style={styles.btnSecondaryText}>Anterior</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => setStage(Math.min(STAGES.length - 1, stage + 1))}
              >
                <Text style={styles.btnPrimaryText}>Siguiente</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            ¿Necesitas ayuda? Contacta al vendedor o a soporte.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  h1: { fontSize: 22, fontFamily: "Bold", color: TEXT },
  h2: { fontSize: 13, fontFamily: "Regular", color: MUTED, marginTop: 4 },

  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },

  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E6EEF2",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  helpIcon: {
    fontFamily: "Bold",
    fontSize: 14,
    color: ACCENT,
    backgroundColor: "#F1F5F1",
    borderRadius: 99,
    textAlign: "center",
    width: 18,
    height: 18,
    lineHeight: 18,
    marginRight: 6,
  },
  helpText: { fontFamily: "Medium", color: TEXT, fontSize: 15 },

  progressBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8EFF0",
  },
  progressBadgeText: { fontFamily: "SemiBold", color: TEXT },

  mainCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#EEF3F4",
  },

  topRow: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 12 },
  topImage: { width: 88, height: 64, borderRadius: 12, backgroundColor: "#F1F5F6" },
  topInfo: { flex: 1 },
  productTitle: { fontFamily: "SemiBold", fontSize: 16, color: TEXT },
  productPrice: { fontFamily: "Medium", fontSize: 14, color: MUTED, marginTop: 6 },

  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  stepWrap: { alignItems: "center", flex: 1 },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  bubbleDone: {
    backgroundColor: ACCENT,
  },
  bubblePending: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E6EEF2",
  },
  bubbleText: { fontFamily: "SemiBold", fontSize: 14 },
  bubbleTextDone: { color: "#fff" },
  bubbleTextPending: { color: MUTED },

  stepTitle: { fontSize: 11, fontFamily: "Medium", textAlign: "center" },
  stepTitleActive: { color: TEXT },
  stepTitleInactive: { color: MUTED },

  statusCard: { marginTop: 8 },
  statusTitle: { fontFamily: "Bold", fontSize: 18, color: TEXT },
  statusSubtitle: { fontFamily: "Regular", fontSize: 13, color: MUTED, marginTop: 6 },
  statusBody: { marginTop: 12, fontFamily: "Regular", fontSize: 14, color: "#334155", lineHeight: 20 },

  breakdown: { marginTop: 16, borderRadius: 12, paddingTop: 4 },
  breakRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  breakLabel: { fontFamily: "Regular", color: MUTED },
  breakValue: { fontFamily: "Medium", color: TEXT },
  breakTotal: { borderTopWidth: 1, borderTopColor: "#F1F5F7", marginTop: 8, paddingTop: 8 },
  totalLabel: { fontFamily: "SemiBold", fontSize: 15 },
  totalValue: { fontFamily: "SemiBold", fontSize: 15 },

  actions: { flexDirection: "row", gap: 12, marginTop: 16 },
  btnPrimary: {
    flex: 1,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnPrimaryText: { fontFamily: "SemiBold", color: "#fff", fontSize: 15 },

  btnSecondary: {
    minWidth: 120,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EEF2",
    backgroundColor: "#FFF",
  },
  btnSecondaryText: { fontFamily: "Medium", color: MUTED },

  footerRow: { marginTop: 18, alignItems: "center" },
  footerText: { fontFamily: "Regular", color: MUTED, fontSize: 13 },
});
