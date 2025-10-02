import React from "react";
import { View, Text } from "react-native";

export default function DiunaMarker() {
  return (
    <View
      pointerEvents="none" // importante: no bloquea el mapa al tocar
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: -24, // la mitad del ancho
        marginTop: -48,  // la altura total (círculo + triángulo)
        alignItems: "center",
      }}
    >
      {/* Burbuja principal */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#adc92b",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>★</Text>
      </View>

      {/* Punta del marcador */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 10,
          borderRightWidth: 10,
          borderTopWidth: 12,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "#adc92b",
          marginTop: -2,
        }}
      />
    </View>
  );
}
