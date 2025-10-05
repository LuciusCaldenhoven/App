import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { CreditCard, Plus, Check, Trash2 } from "lucide-react-native";
import { router } from "expo-router";

export default function PaymentMethodsScreenAlt() {
  // App color (user preference)
  const COLORS = useMemo(
    () => ({
      main: "#adc92b", // <- user color
      bg: "#F6F9FF",
      card: "#FFFFFF",
      accent: "#F0F7E6",
      text: "#1C274C",
      subtext: "#6C7A9C",
    }),
    []
  );

  const [methods, setMethods] = useState([
    { id: "1", brand: "VISA", last4: "4242", expiry: "12/26", isPrimary: true },
    { id: "2", brand: "MASTERCARD", last4: "1881", expiry: "03/27" },
  ]);

  type PendingAction = { type: "delete" | "primary"; id: string } | null;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null); // controls Modal visibility

  const openConfirm = (type: "delete" | "primary", id: string) => {
    setPendingAction({ type, id });
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "delete") {
      setMethods((s) => s.filter((m) => m.id !== pendingAction.id));
    } else if (pendingAction.type === "primary") {
      setMethods((s) => s.map((m) => ({ ...m, isPrimary: m.id === pendingAction.id })));
    }
    setPendingAction(null);
  };

  const cancelAction = () => {
    setPendingAction(null);
  };


  const renderItem = ({ item }: { item: any }) => (
    <View>
      <TouchableOpacity
        style={[styles.methodCard, { backgroundColor: item.isPrimary ? COLORS.main : COLORS.card }]}
        activeOpacity={0.95}
      >
        <View style={styles.leftCol}>
          <View style={[styles.logoWrap, { backgroundColor: item.isPrimary ? "rgba(255,255,255,0.18)" : COLORS.accent }]}>
            <CreditCard size={20} color={item.isPrimary ? "#fff" : COLORS.main} />
          </View>

          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.brand, { color: item.isPrimary ? "#fff" : COLORS.text }]}>
              {item.brand} •••• {item.last4}
            </Text>
            <Text style={[styles.meta, { color: item.isPrimary ? "rgba(255,255,255,0.9)" : COLORS.subtext }]}>
              Expira {item.expiry}
            </Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          {item.isPrimary ? (
            <View style={[styles.primaryPill, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
              <Check size={12} color="#fff" />
              <Text style={[styles.primaryText, { color: "#fff" }]}>Principal</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => openConfirm("primary", item.id)} style={{ marginRight: 10 }}>
              <Text style={[styles.actionTextLabel, { color: COLORS.main }]}>Usar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconBtn} onPress={() => openConfirm("delete", item.id)}>
            <Trash2 size={16} color={item.isPrimary ? "#fff" : COLORS.subtext} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.text }]}>Métodos de pago</Text>
        <Text style={[styles.hint, { color: COLORS.subtext }]}>Sencillo • seguro • rápido</Text>
      </View>

      <FlatList
        data={methods}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyTitle, { color: COLORS.text }]}>No hay métodos</Text>
            <Text style={[styles.emptyDesc, { color: COLORS.subtext }]}>Agrega uno para pagar más rápido</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addContainer} onPress={() => router.push("/pay/tarjeta")} activeOpacity={0.9}>
        <View style={[styles.fab, { backgroundColor: COLORS.main }]}>
          <Plus size={20} color="#fff" />
        </View>
        <View style={styles.addLabel} >
          <Text style={[styles.addLabelText, { color: COLORS.main }]}>Agregar método</Text>
        </View>
      </TouchableOpacity>

      {/* Simple centered Modal (replaces bottom sheet) */}
      <Modal
        visible={!!pendingAction}
        animationType="fade"
        transparent
        onRequestClose={cancelAction}
      >
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.sheet}>
            <Text style={modalStyles.sheetTitle}>Confirmar acción</Text>
            <Text style={modalStyles.sheetMessage}>
              {pendingAction?.type === "delete"
                ? "¿Estás seguro de que deseas eliminar este método de pago?"
                : "¿Deseas usar este método como principal?"}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 18 }}>
              <TouchableOpacity style={[modalStyles.sheetBtn, { backgroundColor: "#f3f4f6", marginRight: 8 }]} onPress={cancelAction}>
                <Text style={{ color: "#111", fontFamily: "Medium" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.sheetBtn, { backgroundColor: COLORS.main }]} onPress={confirmAction}>
                <Text style={{ color: "#fff", fontFamily: "Medium" }}>{pendingAction?.type === "delete" ? "Eliminar" : "Confirmar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  title: { fontSize: 22, fontFamily: "SemiBold" },
  hint: { fontSize: 13, marginTop: 4 },
  methodCard: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  leftCol: { flexDirection: "row", alignItems: "center", flex: 1 },
  logoWrap: { width: 46, height: 46, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  brand: { fontSize: 15, fontFamily: "Medium" },
  meta: { fontSize: 12, marginTop: 4 },
  rightCol: { flexDirection: "row", alignItems: "center" },
  primaryPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginRight: 8 },
  primaryText: { marginLeft: 6, fontSize: 12, fontFamily: "Medium" },
  actionTextLabel: { fontSize: 13, fontFamily: "Medium" },
  iconBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  addContainer: { position: "absolute", right: 20, bottom: 28, alignItems: "center" },
  fab: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 8 },
  addLabel: { marginTop: 10 },
  addLabelText: { fontFamily: "Medium" },
  emptyBox: { padding: 36, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontFamily: "SemiBold" },
  emptyDesc: { marginTop: 6 },
});

/* Modal styles */
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sheet: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  sheetTitle: { fontSize: 18, fontFamily: "SemiBold", marginBottom: 8 },
  sheetMessage: { color: "#6b7280", fontSize: 14 },
  sheetBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
