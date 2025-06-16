import React from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

export const ReviewSkeleton = () => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.card}>
      <ContentLoader
        speed={1.5}
        width={width - 32} // same as paddingHorizontal
        height={100}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* Avatar */}
        <Circle cx="25" cy="25" r="20" />

        {/* Name */}
        <Rect x="60" y="10" rx="4" ry="4" width="120" height="12" />
        {/* Stars */}
        <Rect x="60" y="30" rx="4" ry="4" width="100" height="10" />

        {/* Date (right-aligned) */}
        <Rect x={width - 120} y="10" rx="4" ry="4" width="60" height="10" />

        {/* Comment (indented under stars) */}
        <Rect x="60" y="60" rx="4" ry="4" width={width - 120} height="10" />
      </ContentLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});


