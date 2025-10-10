// screens/CreateStepPrice.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, CheckCircle2 } from "lucide-react-native";
import { useCreatePostStore } from "@/stores/createPostStore";
import condicion from "@/assets/condicion/condicion.data";

const APP_PRIMARY = "#adc92b";
const GREY = "#8F9BA6";
const BG = "#FAFAFB";

/* ------------------------- AnimatedTextInput ------------------------- */
function AnimatedTextInput({ label, value, onChangeText, placeholder }: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value]);

  const labelStyle = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [6, -16] }) },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] }) },
    ],
    color: APP_PRIMARY,
    left: 6,
  };

  const underlineScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={local.inputWrap}>
      <Animated.Text style={[local.label, labelStyle]}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.3)"
        keyboardType="numeric"
        style={local.textInput}
      />
      <View style={local.underlineBg} />
      <Animated.View
        style={[
          local.underlineFill,
          { transform: [{ scaleX: underlineScale }], backgroundColor: APP_PRIMARY },
        ]}
      />
    </View>
  );
}

/* ------------------------- Progress bar ------------------------- */
function SmallProgress({ total = 4, current = 2 }) {
  const prog = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = Math.max(0, Math.min(1, (current - 1) / (total - 1)));
    Animated.timing(prog, {
      toValue: t,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [current, total]);

  return (
    <View style={styles.progressSmallWrap}>
      <View style={styles.progressSmallBg} />
      <Animated.View
        style={[
          styles.progressSmallFill,
          {
            width: prog.interpolate({
              inputRange: [0, 1],
              outputRange: [24, 280],
            }),
            backgroundColor: APP_PRIMARY,
          },
        ]}
      />
    </View>
  );
}

/* ------------------------- Main Screen ------------------------- */
export default function CreateStepPrice() {
  const router = useRouter();
  const totalSteps = 4;
  const currentStep = 2;

  const price = useCreatePostStore((s) => s.price);
  const currency = useCreatePostStore((s) => s.currency);
  const condition = useCreatePostStore((s) => s.condition);
  const setField = useCreatePostStore((s) => s.setField);

  const formatWithCommas = (text: string) => {
    const nums = text.replace(/[^0-9]/g, "");
    if (!nums) return "";
    return nums.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const priceDisplay = price ? price.toLocaleString("es-PE") : "";
  const handlePriceChange = (text: string) => {
    const numeric = Number(text.replace(/[^0-9]/g, ""));
    setField("price", numeric);
  };

  const numericPrice = Number(priceDisplay.replace(/[^0-9]/g, ""));
  const canProceed = numericPrice > 0 && Boolean(currency) && Boolean(condition);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={26} color="#222" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Publicar producto</Text>
          <Text style={styles.headerSub}>
            Paso {currentStep} de {totalSteps}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <SmallProgress total={totalSteps} current={currentStep} />
      </View>

      {/* Scroll */}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          {/* Precio */}
          <AnimatedTextInput
            label="Precio"
            value={priceDisplay}
            onChangeText={handlePriceChange}
            placeholder="Ej. 1,200"
          />

          {/* Moneda */}
          <View style={{ marginTop: 22 }}>
            <Text style={styles.fieldLabel}>Moneda</Text>
            <View style={styles.pickerRow}>
              {["PEN", "USD"].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.currencyBtn, currency === c && styles.currencyBtnActive]}
                  onPress={() => setField("currency", c)}
                >
                  <Text style={[styles.currencyText, currency === c && styles.currencyTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Condición */}
          <View style={{ marginTop: 24 }}>
            <Text style={styles.fieldLabel}>Condición del producto</Text>
            <View style={{ gap: 10 }}>
              {condicion.map((item: { id: string | number; title: string; description: string }) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setField("condition", item.title)}
                  style={[
                    styles.conditionCard,
                    condition === item.title && styles.conditionCardActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.conditionTitle,
                        condition === item.title && styles.conditionTitleActive,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.conditionDesc,
                        condition === item.title && styles.conditionDescActive,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                  {condition === item.title && <CheckCircle2 color="#fff" size={20} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.helpText}>
            Tip: Un precio y descripción claros aumentan las probabilidades de venta.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backBtnMain} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
            disabled={!canProceed}
            onPress={() => router.push("/create/page3")}
          >
            <Text style={styles.nextBtnText}>
              {canProceed ? "Siguiente" : "Completar datos"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------- Styles ------------------------- */
const local = StyleSheet.create({
  inputWrap: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    position: "relative",
  },
  label: {
    position: "absolute",
    top: 10,
    left: 12,
    fontFamily: "Medium",
    fontSize: 13,
    color: GREY,
  },
  textInput: {
    fontFamily: "Regular",
    paddingTop: Platform.OS === "ios" ? 22 : 20,
    paddingBottom: 8,
    paddingHorizontal: 6,
    fontSize: 15,
    color: "#111",
  },
  underlineBg: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 0,
    height: 2,
    backgroundColor: "#F0F4F6",
    borderRadius: 4,
  },
  underlineFill: {
    position: "absolute",
    left: 8,
    bottom: 0,
    height: 2,
    borderRadius: 4,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: 40 },
  header: {
    height: 72,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontFamily: "SemiBold", fontSize: 16, color: "#111" },
  headerSub: { fontFamily: "Regular", fontSize: 12, color: GREY },

  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  section: { marginBottom: 18 },
  fieldLabel: { fontFamily: "Medium", fontSize: 14, color: "#333", marginBottom: 8 },

  pickerRow: { flexDirection: "row", gap: 10 },
  currencyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E7EEF0",
    minWidth: 72,
    alignItems: "center",
  },
  currencyBtnActive: { backgroundColor: APP_PRIMARY, borderColor: APP_PRIMARY },
  currencyText: { fontFamily: "SemiBold", color: "#333" },
  currencyTextActive: { color: "#fff" },

  conditionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7EEF0",
    padding: 12,
    alignItems: "center",
  },
  conditionCardActive: {
    backgroundColor: APP_PRIMARY,
    borderColor: APP_PRIMARY,
  },
  conditionTitle: { fontFamily: "SemiBold", fontSize: 14, color: "#111" },
  conditionTitleActive: { color: "#fff" },
  conditionDesc: { fontFamily: "Regular", fontSize: 12, color: "#666", marginTop: 2 },
  conditionDescActive: { color: "#f8fff4" },

  helpText: { marginTop: 18, fontFamily: "Regular", fontSize: 12, color: GREY },

  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  backBtnMain: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7EEF0",
  },
  backBtnText: { color: "#333", fontFamily: "SemiBold" },
  nextBtn: {
    flex: 1,
    backgroundColor: APP_PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  nextBtnDisabled: { backgroundColor: "#DDE7DA" },
  nextBtnText: { color: "#fff", fontFamily: "SemiBold" },

  progressSmallWrap: { height: 10, marginBottom: 12 },
  progressSmallBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#EEF3F6",
  },
  progressSmallFill: { position: "absolute", left: 0, height: 6, borderRadius: 999 },
});
