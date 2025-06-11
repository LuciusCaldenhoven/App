import React, { useState } from "react";
import { View, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  prices: number[];
};

const chartHeight = 60;

const generateBins = (prices: number[], binCount = 20) => {
  const bins = Array(binCount).fill(0);
  const minPrice = 0;
  const maxPrice = Math.max(...prices);
  const binSize = (maxPrice - minPrice) / binCount || 1;

  prices.forEach(price => {
    const i = Math.min(binCount - 1, Math.floor((price - minPrice) / binSize));
    bins[i]++;
  });

  return { bins, minPrice, maxPrice };
};

const getSmoothPath = (points: [number, number][], baseY: number) => {
  if (points.length < 2) return "";

  let d = `M ${points[0][0]} ${baseY} L ${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const xc = (x1 + x2) / 2;
    const yc = (y1 + y2) / 2;
    d += ` Q ${x1} ${y1}, ${xc} ${yc}`;
  }

  const [xLast] = points[points.length - 1];
  d += ` L ${xLast} ${baseY} Z`;

  return d;
};

export default function SmoothHistogram({ prices }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  if (containerWidth === 0) {
    return <View onLayout={onLayout} style={styles.container} />;
  }

  const { bins, minPrice, maxPrice } = generateBins(prices);
  const max = Math.max(...bins);
  const stepX = containerWidth / (bins.length - 1);
  const baseY = chartHeight;

  const points: [number, number][] = bins.map((count, i) => [
    i * stepX,
    chartHeight - (count / max) * chartHeight,
  ]);

  const path = getSmoothPath(points, baseY);

  return (
    <View onLayout={onLayout} style={styles.container}>
      <Svg width={containerWidth} height={chartHeight}>
        <Path d={path} fill="rgba(144, 238, 144, 0.6)" />
      </Svg>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{minPrice}</Text>
        <Text style={styles.label}>{maxPrice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
    height: chartHeight + 20,
    justifyContent: "flex-end",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
});
