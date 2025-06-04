import React from "react";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { Dimensions, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function LoaderProductDetail() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <ContentLoader
        speed={2}
        width={screenWidth - 32}
        height={700}
        viewBox={`0 0 ${screenWidth - 32} 700`}
        backgroundColor="#f3f3f3"
        foregroundColor="#e0e0e0"
      >
        {/* Imagen principal */}
        <Rect x="0" y="0" rx="10" ry="10" width={screenWidth - 32} height="220" />

        {/* Botones flotantes sobre la imagen (opcional: pueden omitirse) */}
        <Circle cx="30" cy="20" r="12" />
        <Circle cx={screenWidth - 90} cy="20" r="12" />
        <Circle cx={screenWidth - 50} cy="20" r="12" />

        {/* Título */}  
        <Rect x="0" y="240" rx="6" ry="6" width="60%" height="22" />

        {/* Estado (nuevo/usado) */}
        <Rect x={screenWidth - 130} y="240" rx="12" ry="12" width="80" height="22" />

        {/* Fecha y ubicación */}
        <Rect x="0" y="270" rx="4" ry="4" width="40%" height="16" />
        <Rect x="0" y="295" rx="4" ry="4" width="50%" height="16" />

        {/* Etiquetas: tipo y categoría */}
        <Rect x="0" y="330" rx="10" ry="10" width="100" height="28" />
        <Rect x="120" y="330" rx="10" ry="10" width="120" height="28" />

        {/* Descripción título */}
        <Rect x="0" y="380" rx="4" ry="4" width="40%" height="18" />

        {/* Texto de descripción */}
        <Rect x="0" y="410" rx="4" ry="4" width="100%" height="16" />
        <Rect x="0" y="435" rx="4" ry="4" width="95%" height="16" />
        <Rect x="0" y="460" rx="4" ry="4" width="90%" height="16" />

        {/* Precio */}
        <Rect x="0" y="510" rx="6" ry="6" width="120" height="28" />

        {/* Botón de mensaje */}
        <Rect x={screenWidth - 170} y="505" rx="12" ry="12" width="160" height="36" />
      </ContentLoader>
    </View>
  );
}
