import React from 'react';
import { View } from 'react-native';

export default function CenterMarkerSmall() {
  return (
    <>
      {/* Punto azul intenso */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -6,
          marginTop: -6,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "rgb(5, 118, 247)",
          zIndex: 101,
        }}
      />

      {/* Contorno más suave */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -9,
          marginTop: -9,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: "rgba(182, 203, 227, 0.71)",
          zIndex: 100,
        }}
      />

      {/* Círculo fijo al centro */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -75,
          marginTop: -75,
          width: 150,
          height: 150,
          borderRadius: 125,
          backgroundColor: "rgba(0,122,255,0.2)",
          borderWidth: 2,
          borderColor: "rgba(0,122,255,0.6)",
          zIndex: 99,
        }}
      />
    </>
  );
}
