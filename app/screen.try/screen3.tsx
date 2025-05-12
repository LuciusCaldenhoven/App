import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
  primary: "#007AFF",
  black: "#000",
  grey: "#666",
  white: "#FFF",
  background: "#FAFAFA",
};

export default function PostTypeScreen() {
  const [postType, setPostType] = useState<"venta" | "alquiler" | "servicio">("venta");
  const router = useRouter();

  const postTypeDescriptions = {
    venta: "Publica un producto que deseas vender.",
    alquiler: "Publica un producto que deseas alquilar temporalmente.",
    servicio: "Ofrece un servicio que puedes brindar a otros usuarios.",
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecciona el tipo de publicación</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.selectorContainer}>
        {["venta", "alquiler", "servicio"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setPostType(type as "venta" | "alquiler" | "servicio")}
            style={[
              styles.optionButton,
              postType === type && styles.optionButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                postType === type && styles.optionTextSelected,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.description}>
        {postTypeDescriptions[postType]}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Medium",
    color: COLORS.black,
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#eee",
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.black,
    fontFamily: "Medium",
    fontSize: 14,
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  description: {
    textAlign: "center",
    fontSize: 13,
    color: COLORS.grey,
    fontFamily: "Regular",
    paddingHorizontal: 10,
  },
});
