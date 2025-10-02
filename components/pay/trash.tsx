import React, { useRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Trash, X, Plus } from "lucide-react-native";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

type Props = {
  enabled: boolean;
  setActive: (value: boolean) => void;
};

export default function TrashComponent({ enabled,setActive }: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["70%", "80%"], []);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    []
  );

  return (
    <>
      {enabled ? (
        // Bote de basura para quitar
        <TouchableOpacity onPress={openBottomSheet} activeOpacity={0.85} style={styles.iconButton}>
        
            <Trash size={20} strokeWidth={2.5} color="black" />

        </TouchableOpacity>
      ) : (
        // Línea con + para agregar
        <TouchableOpacity onPress={() => setActive(true)} activeOpacity={0.85} style={styles.addContainer}>
          <View style={styles.addLine} />
   
            <Plus size={20} strokeWidth={2.5} color="black" />
   
        </TouchableOpacity>
      )}

      {/* Bottom sheet solo aparece si enabled es true */}
      {enabled && (
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.sheetBackground}
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <View style={styles.topRow}>
              <TouchableOpacity style={styles.closeButton} onPress={() => bottomSheetRef.current?.dismiss()}>
                <X size={22} strokeWidth={3} color="#444" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>¿Estás seguro?</Text>
            <Text style={styles.subtitle}>
              Quitar este servicio tendrá las siguientes <Text style={{ fontFamily: "Bold" }}>consecuencias</Text>:
            </Text>

            <View style={styles.list}>
              <View style={styles.listRow}>
                <View style={styles.bullet} />
                <Text style={styles.listItem}>Perderás la Protección Garantizada.</Text>
              </View>
              <View style={styles.listRow}>
                <View style={styles.bullet} />
                <Text style={styles.listItem}>No podrás reclamar ante estafas o problemas con tu pedido.</Text>
              </View>
              <View style={styles.listRow}>
                <View style={styles.bullet} />
                <Text style={styles.listItem}>Tu dinero se liberará inmediatamente sin seguridad adicional.</Text>
              </View>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={() => {
                  setActive(false);
                  bottomSheetRef.current?.dismiss();
                }}
                activeOpacity={0.85}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>Quitar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.dismiss()}
                activeOpacity={0.85}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 28 }} />
          </BottomSheetScrollView>
        </BottomSheetModal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
  },
  addLine: {
    height: 2,
    flex: 1,
    backgroundColor: "red",
    borderRadius: 1,
  },
  addCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#556b00",
    justifyContent: "center",
    alignItems: "center",
  },

  sheetBackground: { backgroundColor: "#fff", borderRadius: 20 },
  sheetContent: { paddingHorizontal: 24, paddingTop: 16 },

  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, justifyContent: "center" },
  handle: { width: 56, height: 6, borderRadius: 999, backgroundColor: "#eee", marginBottom: 10 },
  closeButton: { position: "absolute", right: 0, top: 0, borderRadius: 20, padding: 6 },

  title: { fontSize: 22, fontFamily: "Bold", color: "#111", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 16, fontFamily: "Medium", lineHeight: 20 },

  list: { marginBottom: 16 },
  listRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#adc92b", marginTop: 6 },
  listItem: { flex: 1, fontSize: 14, color: "#333", lineHeight: 20, fontFamily: "Regular" },

  buttonsRow: { flexDirection: "row", justifyContent: "space-between" },
  removeButton: { flex: 1, backgroundColor: "#adc92b", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginRight: 10, shadowColor: "#adc92b", shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  removeText: { color: "#fff", fontSize: 16, fontFamily: "Bold" },
  cancelButton: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: "#f3f3f3" },
  cancelText: { color: "#333", fontSize: 16, fontFamily: "Medium" },
});
