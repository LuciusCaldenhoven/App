import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PiggyBank, Leaf, Recycle } from "lucide-react-native"; // Asegúrate de tener estos iconos disponibles
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

type DiscountInfoProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

const DiscountModal = ({ bottomSheetRef }: DiscountInfoProps) => {
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={["70%"]}
      backgroundStyle={{ borderRadius: 24 }}
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
            <PiggyBank size={30} color="#adc92b" />
            <Text style={styles.benefitText}>
              Ahorra dinero: Es un 46% más barato que comprar uno nuevo.
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Leaf size={30} color="#7ea437" />
            <Text style={styles.benefitText}>
              Ayudas al planeta: Reduciendo el desperdicio y el uso de recursos.
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Recycle size={30} color="#f3e203" />
            <Text style={styles.benefitText}>
              Dale una segunda vida al producto, evitando más residuos.
            </Text>
          </View>
        </View>

        <View style={styles.additionalInfo}>
          <Text style={styles.kpiText}>
            Evita la emisión de 40kg de CO2 (equivalente a conducir 187 km en coche).
          </Text>
          <Text style={styles.kpiText}>
            Ahorra 328 litros de agua (equivalente a lo que bebe un adulto en 8 meses).
          </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={() => bottomSheetRef.current?.dismiss()}>
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Medium",
    color: "#adc92b",
  },
  modalParagraph: {
    fontSize: 14,
    color: "black",
    marginVertical: 12,
    fontFamily: "Regular",
  },
  benefitContainer: {
    marginVertical: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: "#1B4D3E",
    paddingHorizontal: 15,
    fontFamily: "Regular",
  },
  additionalInfo: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
  },
  kpiText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    fontFamily: "Regular",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#adc92b", 
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default DiscountModal;
