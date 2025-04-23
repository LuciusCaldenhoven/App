import React from "react";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { View } from "react-native";
import { COLORS } from "@/constants/theme";

export default function LoaderChats() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header del chat */}
      <ContentLoader
        speed={2}
        width='100%'
        height={200}
        viewBox="0 0 400 80"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <Circle  x="40" y="0" cx="25" cy="25" r="25" />
        <Rect x="100" y="4" rx="4" ry="4" width="200" height="16" />
        <Rect x="100" y="30" rx="4" ry="4" width="150" height="12" />
      </ContentLoader>

      {/* Lista de mensajes */}
      <ContentLoader
        speed={2}
        width="100%"
        height={600}
        viewBox="0 0 400 600"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* Mensaje recibido */}
        <Rect x="10" y="20" rx="10" ry="10" width="250" height="40" />
        <Rect x="0" y="70" rx="4" ry="4" width="80" height="12" />

        {/* Mensaje enviado */}
        <Rect x="120" y="120" rx="10" ry="10" width="250" height="40" />
        <Rect x="290" y="170" rx="4" ry="4" width="80" height="12" />

        {/* Mensaje recibido */}
        <Rect x="16" y="220" rx="10" ry="10" width="200" height="40" />
        <Rect x="16" y="270" rx="4" ry="4" width="80" height="12" />

        {/* Mensaje enviado */}
        <Rect x="80" y="320" rx="10" ry="10" width="250" height="40" />
        <Rect x="290" y="370" rx="4" ry="4" width="80" height="12" />
      </ContentLoader>

      {/* Input de mensaje */}
      <ContentLoader
        speed={2}
        width="100%"
        height={60}
        viewBox="0 0 400 60"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <Rect x="16" y="10" rx="10" ry="10" width="300" height="40" />
        <Circle cx="340" cy="30" r="20" />
      </ContentLoader>
    </View>
  );
}