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
        height={800}
        viewBox={`0 0 ${screenWidth - 32} 800`}
        backgroundColor="#f3f3f3"
        foregroundColor="#e0e0e0"
      >
        {/* Imagen principal más grande */}
        <Rect x="0" y="0" rx="10" ry="10" width={screenWidth - 32} height="300" />

        {/* Botones flotantes sobre la imagen */}
        <Circle cx="30" cy="40" r="15" />
        <Circle cx={screenWidth - 90} cy="40" r="15" />
        <Circle cx={screenWidth - 50} cy="40" r="15" />

        {/* Ajustar todo lo demás hacia abajo (imagen creció +80px) */}
        <Rect x="0" y="330" rx="6" ry="6" width="60%" height="22" />
        <Rect x={screenWidth - 130} y="330" rx="12" ry="12" width="80" height="22" />
        <Rect x="0" y="365" rx="4" ry="4" width="40%" height="16" />
        <Rect x="0" y="390" rx="4" ry="4" width="50%" height="16" />
        <Rect x="0" y="425" rx="10" ry="10" width="100" height="28" />
        <Rect x="120" y="425" rx="10" ry="10" width="120" height="28" />
        <Rect x="0" y="470" rx="4" ry="4" width="40%" height="18" />
        <Rect x="0" y="500" rx="4" ry="4" width="100%" height="16" />
        <Rect x="0" y="525" rx="4" ry="4" width="95%" height="16" />
        <Rect x="0" y="550" rx="4" ry="4" width="90%" height="16" />
        <Rect x="0" y="600" rx="6" ry="6" width="120" height="28" />
        <Rect x={screenWidth - 170} y="595" rx="12" ry="12" width="160" height="36" />
      </ContentLoader>
    </View>
  );
}
