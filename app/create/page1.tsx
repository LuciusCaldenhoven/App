import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft } from "lucide-react-native";
import ImageCarousel from "@/components/ImageCarosel/ImageCarosel";
import { useCreatePostStore } from "@/stores/createPostStore"; // <- store

// Color principal (según tu preferencia)
const APP_PRIMARY = "#adc92b";
const GREY = "#8F9BA6";
const BG = "#FAFAFB";

/**
 * AnimatedTextInput
 * - label animado que sube al hacer focus / si tiene valor
 * - underline que crece con animación
 * - admite multiline
 */
type AnimatedTextInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  style?: any;
};

function AnimatedTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  onFocus: externalOnFocus,
  onBlur: externalOnBlur,
  style,
}: AnimatedTextInputProps) {
  const focused = useRef(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current; // 0 = blurred(empty), 1 = focused/filled

  useEffect(() => {
    // si value cambia desde afuera, actualizamos anim
    Animated.timing(anim, {
      toValue: value && value.length > 0 ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const handleFocus = (e: any) => {
    focused.current = true;
    Animated.timing(anim, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    externalOnFocus && externalOnFocus(e);
  };

  const handleBlur = (e: any) => {
    focused.current = false;
    if (!value || value.length === 0) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
    externalOnBlur && externalOnBlur(e);
  };

  const labelStyle = {
    transform: [
      {
        translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [6, -18] }),
      },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.88] }) },
    ],
    color: APP_PRIMARY,
    left: 6,
  };

  const underlineWidth = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={[localStyles.inputWrap, style]}>
      <Animated.Text style={[localStyles.label, labelStyle]} numberOfLines={1}>
        {label}
      </Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={focused.current ? placeholder : ""}
        placeholderTextColor={"rgba(0,0,0,0.25)"}
        style={[localStyles.textInput, multiline && { minHeight: 96, textAlignVertical: "top" }]}
        multiline={multiline}
      />

      {/* underline background */}
      <View style={localStyles.underlineBg} />
      {/* animated underline */}
      <Animated.View
        style={[
          localStyles.underlineFill,
          {
            transform: [{ scaleX: underlineWidth }],
            backgroundColor: APP_PRIMARY,
          },
        ]}
      />
    </View>
  );
}

/**
 * NewProgressBar
 * - estilo diferente: track suave + indicador de pasos (4 nodos)
 * - animación: relleno de track + "thumb" que se desliza
 */
function SmallProgress({ total = 4, current = 2 }) {
  const prog = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = Math.max(0, Math.min(1, (current - 1) / (total - 1)));
    Animated.timing(prog, { toValue: t, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [current, total, prog]);

  return (
    <View style={styles.progressSmallWrap}>
      <View style={styles.progressSmallBg} />
      <Animated.View
        style={[
          styles.progressSmallFill,
          { width: prog.interpolate({ inputRange: [0, 1], outputRange: [24, 280] }), backgroundColor: APP_PRIMARY },
        ]}
      />
    </View>
  );
}

// ------------------- CreateStepImages (screen) -------------------
export default function CreateStepImages() {
  const router = useRouter();
  const totalSteps = 4;
  const currentStep = 1; // este archivo era step 1 en nuestra organización
  const { tipo } = useLocalSearchParams();
  
  // ===== store bindings =====
  const images = useCreatePostStore((s) => s.images);
  const title = useCreatePostStore((s) => s.title);
  
  const addImage = useCreatePostStore((s) => s.addImage);
  const removeImageAt = useCreatePostStore((s) => s.removeImageAt);
  const setField = useCreatePostStore((s) => s.setField);
  const setMany = useCreatePostStore((s) => s.setMany);
  const clear = useCreatePostStore((s) => s.clear);
  // local UI state
  const [isPicking, setIsPicking] = useState(false);
  useEffect(() => {
  if (tipo) {
    setField("tipo", tipo as string);
  }
}, [tipo]);
  // pick images (galería) -> agrega al store
  const pickImage = async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.4,
        selectionLimit: 10,
      });

      if (!result.canceled) {
        // añade cada uri al store con addImage
        result.assets.forEach((a) => {
          // evita duplicados simples (por URI)
          if (!images.includes(a.uri)) addImage(a.uri);
        });
      }
    } catch (err) {
      console.log("pick image error", err);
    } finally {
      setIsPicking(false);
    }
  };

  // wrapper para mantener compatibilidad con ImageCarousel (que espera setSelectedImages(array))
  type ImageArray = (string | any)[]; // `any` aquí para cubrir Id<"_storage"> sin tocar ImageCarousel

  const setSelectedImages: React.Dispatch<React.SetStateAction<ImageArray>> = (action) => {
    if (typeof action === "function") {
      // action es (prev) => next
      const next = (action as (prev: ImageArray) => ImageArray)(images as ImageArray);
      setMany({ images: next.slice(0, 10) });
    } else {
      // action es un array nuevo
      setMany({ images: (action as ImageArray).slice(0, 10) });
    }
  };


  const canProceed = images.length > 0 && title.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    // navegar al siguiente paso — ajusta la ruta según tu estructura
    router.push({ pathname: "/create/page2" });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { router.back(); clear(); }} style={styles.backBtn}>
          <ChevronLeft size={28} color="#222" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Publicar producto</Text>
          <Text style={styles.headerSub}>
            Paso {currentStep} de {totalSteps}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* NEW PROGRESS BAR */}
      <View style={{ paddingHorizontal: 16, }}>
        <SmallProgress total={totalSteps} current={currentStep} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* IMAGE CAROUSEL / SELECTOR */}
        <View style={styles.section}>
          {images.length === 0 ? (
            <View style={{ paddingHorizontal: 16,}}>
            <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage} disabled={isPicking}>
              {isPicking ? <ActivityIndicator /> : <Text style={styles.emptyImageText}>Selecciona imágenes (máx 10)</Text>}
            </TouchableOpacity>
          </View>
          ) : (
            <ImageCarousel
              selectedImages={images}
              setSelectedImages={setSelectedImages}
            />
          )}
          <View style={{ paddingHorizontal: 16,}}>  
            <Text style={styles.photosCounter}>Fotos: {images.length}/10 selecciona tus imágenes principales</Text>
          </View>
        </View>

        {/* TITLE INPUT usando AnimatedTextInput */}
        <View style={[  styles.section, { paddingHorizontal: 16 }]}>
          <AnimatedTextInput
            label={"Título del producto"}
            value={title}
            onChangeText={(t) => setField("title", t)}
            placeholder={"Ej. Zapatos deportivos Niño - Talla 38"}
          />
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]} disabled={!canProceed} onPress={handleNext}>
            <Text style={styles.nextBtnText}>{canProceed ? "Siguiente" : "Completar título y fotos"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  inputWrap: { marginTop: 6, backgroundColor: "#fff", borderRadius: 12, padding: 8, position: "relative" },
  label: { position: "absolute", top: 8, left: 10, fontFamily: "Medium", fontSize: 13, color: GREY },
  textInput: {
    fontFamily: "Regular",
    paddingTop: Platform.OS === "ios" ? 22 : 20,
    paddingBottom: 8,
    paddingHorizontal: 6,
    fontSize: 15,
    color: "#111",
  },
  underlineBg: { position: "absolute", left: 6, right: 6, bottom: 0, height: 2, backgroundColor: "#F0F4F6", borderRadius: 4 },
  underlineFill: { position: "absolute", left: 6, bottom: 0, height: 2, borderRadius: 4 },

  progressContainer: { paddingVertical: 8 },
  stepRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, marginBottom: 6 },
  stepWrap: { flex: 1, alignItems: "center" },
  stepDot: { width: 10, height: 10, borderRadius: 10, backgroundColor: "#E6ECE0" },

  trackWrap: { height: 28, justifyContent: "center", paddingHorizontal: 12 },
  trackBg: { position: "absolute", left: 12, right: 12, height: 8, borderRadius: 999, backgroundColor: "#EEF3F6" },
  trackFill: { position: "absolute", left: 12, top: 0, bottom: 0, height: 8, borderRadius: 999, backgroundColor: APP_PRIMARY },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: APP_PRIMARY,
    position: "absolute",
    left: 12 - 2,
    top: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
    borderBottomWidth: 0,
  },
  backBtn: {
    width: 40,
    alignItems: "flex-start",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontFamily: "SemiBold", fontSize: 16, color: "#111" },
  headerSub: { fontFamily: "Regular", fontSize: 12, color: GREY },

  scroll: {  paddingTop: 8, paddingBottom: 40 },
  section: { marginBottom: 18, },

  emptyImageContainer: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8EEF0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyImageText: { fontFamily: "Medium", color: GREY },
  photosCounter: { marginTop: 8, fontFamily: "Regular", fontSize: 12, color: GREY },

  footer: { paddingVertical: 12, paddingHorizontal: 16 },
  nextBtn: {
    backgroundColor: APP_PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextBtnDisabled: { backgroundColor: "#DDE7DA" },
  nextBtnText: { color: "#fff", fontFamily: "SemiBold", fontSize: 16 },
  progressSmallWrap: { height: 0, marginBottom: 12 },
  progressSmallBg: { position: "absolute", left: 0, right: 0,  height: 6, borderRadius: 999, backgroundColor: "#EEF3F6" },
  progressSmallFill: { position: "absolute", left: 0,  height: 6, borderRadius: 999 },
});
