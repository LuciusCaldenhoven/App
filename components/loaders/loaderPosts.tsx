import React from "react";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { View } from "react-native";
import { COLORS } from "@/constants/theme";

export default function LoaderPosts() {
  return (
    <View style={{ width: "100%", padding: 16 }}>
      <ContentLoader
        speed={2}
        width={400}
        height={500}
        viewBox="0 0 400 500"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <Rect x="60" y="16" rx="4" ry="4" width="80" height="24" />
        <Rect x="60" y="56" rx="8" ry="8" width="368" height="80" />
        <Circle cx="100" cy="96" r="24" />
        <Rect x="140" y="82" rx="4" ry="4" width="160" height="16" />
        <Rect x="140" y="106" rx="4" ry="4" width="120" height="12" />
        <Rect x="60" y="160" rx="4" ry="4" width="100" height="20" />
        <Rect x="300" y="160" rx="4" ry="4" width="60" height="20" />
        <Rect x="60" y="200" rx="8" ry="8" width="368" height="80" />
        <Rect x="16" y="304" rx="4" ry="4" width="80" height="20" />
        <Rect x="16" y="340" rx="8" ry="8" width="368" height="48" />
        <Rect x="16" y="396" rx="8" ry="8" width="368" height="48" />
        <Rect x="16" y="452" rx="8" ry="8" width="368" height="48" />
      </ContentLoader>
    </View>
  );
}