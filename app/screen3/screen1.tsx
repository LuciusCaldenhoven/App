import React, { useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { RangeSlider } from "@react-native-assets/slider";
import Svg, { Path } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const chartHeight = 60;

export default function FilterModalExample() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["75%"], []);
  const [range, setRange] = useState<[number, number]>([0, 15000]);

  const mockPrices = [1000, 2000, 3000, 3000, 4000, 5000, 7000, 10000, 15000];
  const bins = generateBins(mockPrices, 20);
  const path = getSmoothPath(bins, chartHeight);

  return (
    <BottomSheetModalProvider>
      <View style={styles.screen}>
        <TouchableOpacity style={styles.triggerButton} onPress={() => sheetRef.current?.present()}>
          <Text style={styles.triggerText}>Abrir filtros</Text>
        </TouchableOpacity>

        <BottomSheetModal
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          )}
          backgroundStyle={styles.sheet}
          handleIndicatorStyle={{ backgroundColor: "#ccc" }}
        >
          <BottomSheetView style={styles.scroll}>
            <Text style={styles.title}>Filtrar búsqueda</Text>

            <View style={styles.box}>
              <Text style={styles.label}>Precio</Text>
              <Svg height={chartHeight} width={screenWidth - 60} style={{ alignSelf: "center" }}>
                <Path d={path} fill="rgba(144, 238, 144, 0.6)" />
              </Svg>

              <RangeSlider
                minimumValue={0}
                maximumValue={15000}
                step={100}
                range={range}
                onValueChange={(val) => setRange(val)}
                trackHeight={4}
                thumbSize={20}
               
                
                style={{ marginTop: 16 }}
              />

              <View style={styles.inputRow}>
                <TextInput style={styles.input} keyboardType="numeric" value={range[0].toString()} />
                <Text style={{ marginHorizontal: 6 }}>-</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={range[1].toString()} />
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => setRange([0, 15000])}>
                <Text style={styles.clearText}>Limpiar todo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.showBtn} onPress={() => sheetRef.current?.dismiss()}>
                <Text style={styles.showText}>Mostrar {range[0]}–{range[1]}</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const generateBins = (prices: any[], count: number) => {
  const bins = Array(count).fill(0);
  const max = Math.max(...prices);
  const binSize = max / count;
  prices.forEach((p) => {
    const i = Math.min(count - 1, Math.floor(p / binSize));
    bins[i]++;
  });
  const maxBin = Math.max(...bins);
  return bins.map((c, i) => [
    (i * (screenWidth - 60)) / (count - 1),
    chartHeight - (c / maxBin) * chartHeight,
  ]);
};

const getSmoothPath = (points: string | any[], baseY: number) => {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${baseY} L ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const xc = (x1 + x2) / 2;
    const yc = (y1 + y2) / 2;
    d += ` Q ${x1} ${y1}, ${xc} ${yc}`;
  }
  d += ` L ${points[points.length - 1][0]} ${baseY} Z`;
  return d;
};

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  triggerButton: { backgroundColor: "#000", padding: 12, borderRadius: 10 },
  triggerText: { color: "#fff", fontWeight: "600" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  scroll: { paddingBottom: 80, paddingHorizontal: 20 },
  title: { fontSize: 18, fontWeight: "600", textAlign: "center", marginVertical: 12 },
  box: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginVertical: 8, elevation: 2 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  inputRow: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  input: { backgroundColor: "#f9f9f9", borderColor: "#ddd", borderWidth: 1, borderRadius: 8, padding: 8, width: 100, textAlign: "center" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, paddingHorizontal: 10 },
  clearBtn: { backgroundColor: "#f0f0f0", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  clearText: { color: "#666", fontWeight: "500" },
  showBtn: { backgroundColor: "#000", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 },
  showText: { color: "#fff", fontWeight: "600" },
});
