import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Leaf, PiggyBank, Recycle } from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type DiscountInfoProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  openBottomSheet: () => void;
};

const DiscountInfo = ({ bottomSheetRef,openBottomSheet }: DiscountInfoProps) => {
  

  const benefits = [
    {
      icon: <PiggyBank size={22} color="#1B4D3E" />,
      message: "Ahorras dinero al comprar hasta 43% más barato que nuevo.",
    },
    {
      icon: <Leaf size={22} color="#1B4D3E" />,
      message: "Estás ayudando al planeta y reduciendo el desperdicio.",
    },
    {
      icon: <Recycle size={22} color="#1B4D3E" />,
      message: "Das una segunda vida útil y evitas más residuos.",
    },
  ];

  const selected = useMemo(() => {
    return benefits[Math.floor(Math.random() * benefits.length)];
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{selected.icon}</View>

      <View style={{ flex: 1 }}>
        <Text style={styles.text}>
          {selected.message.includes("planeta") ? (
            <>
              Al elegir productos de segunda mano,{" "}
              <Text style={styles.bold}>estás ayudando al planeta</Text> y reduciendo el desperdicio.
            </>
          ) : selected.message.includes("vida útil") ? (
            <>
              Comprar de segunda mano te permite{" "}
              <Text style={styles.bold}>dar una segunda vida a los productos</Text> y evitar residuos innecesarios.
            </>
          ) : (
            <>
              Comprar de segunda mano te ayuda a{" "}
              <Text style={styles.bold}>ahorrar hasta un 43%</Text> comparado con productos nuevos.
            </>
          )}
        </Text>

        <TouchableOpacity onPress={openBottomSheet}>
          <Text style={styles.link}>Descubre por qué es más sostenible</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0F7E9",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 16,
    height: 110,
  },
  text: {
    fontSize: 14,
    color: "#1B4D3E",
    fontFamily: "Medium",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  bold: {
    fontWeight: "bold",
    color: "#1B4D3E",
    fontFamily: "SemiBold",
  },
  link: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: "Medium",
    color: "#1B4D3E",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B4D3E",
  },
  modalParagraph: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontFamily: "Regular",
  },
  closeButton: {
    marginTop: 14,
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#1B4D3E",
    borderRadius: 8,
  },
  closeText: {
    color: "white",
    fontWeight: "600",
  },
});


export default DiscountInfo;
