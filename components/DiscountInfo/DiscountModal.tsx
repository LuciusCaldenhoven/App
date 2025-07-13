import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PiggyBank, Leaf, Recycle } from "lucide-react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

type DiscountInfoProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

const DiscountModal = ({ bottomSheetRef }: DiscountInfoProps) => {
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={["55%"]}
      backgroundStyle={{ borderRadius: 20 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.3}
        />
      )}
    >
      <BottomSheetView style={styles.modalContent}>
        <Text style={styles.modalTitle}>Ahorra comprando de segunda mano</Text>
        <Text style={styles.modalParagraph}>
          Comprar productos de segunda mano como este es genial para tu bolsillo y el planeta.
        </Text>

        <View style={styles.benefitContainer}>
          <View style={styles.benefitItem}>
            <PiggyBank size={26} color="#adc92b" style={styles.icon} />
            <Text style={styles.benefitText}>
              Ahorra dinero: Es un 46% más barato que comprar uno nuevo.
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Leaf size={26} color="#7ea437" style={styles.icon} />
            <Text style={styles.benefitText}>
              Ayudas al planeta: Reduciendo el desperdicio y el uso de recursos.
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Recycle size={26} color="#f3e203" style={styles.icon} />
            <Text style={styles.benefitText}>
              Dale una segunda vida al producto, evitando más residuos.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.additionalInfo}>
          <Text style={styles.kpiText}>
            🌱 Evita la emisión de <Text style={styles.bold}>40kg de CO₂</Text> (equivalente a conducir 187 km en coche).
          </Text>
          <Text style={styles.kpiText}>
            💧 Ahorra <Text style={styles.bold}>328 litros de agua</Text> (equivalente a lo que bebe un adulto en 8 meses).
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => bottomSheetRef.current?.dismiss()}
          activeOpacity={0.8}
        >
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 19,
    fontFamily: "SemiBold",
    color: "#adc92b",
    marginBottom: 6,
    textAlign: "center",
  },
  modalParagraph: {
    fontSize: 13,
    color: "#333",
    marginVertical: 6,
    fontFamily: "Regular",
    textAlign: "center",
    marginBottom: 12,
  },
  benefitContainer: {
    marginVertical: 4,
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  icon: {
    marginRight: 12,
    marginTop: 1,
  },
  benefitText: {
    fontSize: 13,
    color: "#1B4D3E",
    fontFamily: "Regular",
    flex: 1,
    lineHeight: 18,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginVertical: 14,
  },
  additionalInfo: {
    marginBottom: 10,
  },
  kpiText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
    fontFamily: "Regular",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#7ea437",
  },
  closeButton: {
    marginTop: 4,
    backgroundColor: "#adc92b",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    alignSelf: "center",
    width: 120,
    shadowColor: "#adc92b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  closeText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default DiscountModal;
