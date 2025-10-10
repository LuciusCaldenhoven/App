// app/create/step/4.tsx  (o CreateStepExtrasReview.tsx según tu estructura)
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
  Image,
  Platform,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useCreatePostStore } from "@/stores/createPostStore";
import * as FileSystem from "expo-file-system";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Toast from "react-native-toast-message";
import { Id } from "@/convex/_generated/dataModel";

const APP_PRIMARY = "#adc92b";
const GREY = "#8F9BA6";
const BG = "#FAFAFB";

/* Small animated text input (multiline-ready) */
function AnimatedTextInput({ label, value, onChangeText, multiline = false, placeholder = "" }: any) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: value && value.length > 0 ? 1 : 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [value, anim]);

  const labelStyle = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [6, -18] }) },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.88] }) },
    ],
    color: APP_PRIMARY,
    left: 6,
  };

  const underlineScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={localStyles.inputWrap}>
      <Animated.Text style={[localStyles.label, labelStyle]}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={"rgba(0,0,0,0.25)"}
        style={[localStyles.textInput, multiline && { minHeight: 120, textAlignVertical: "top" }]}
        multiline={multiline}
      />
      <View style={localStyles.underlineBg} />
      <Animated.View style={[localStyles.underlineFill, { transform: [{ scaleX: underlineScale }], backgroundColor: APP_PRIMARY }]} />
    </View>
  );
}

function SmallProgress({ total = 4, current = 4 }: { total?: number; current?: number }) {
  const prog = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = Math.max(0, Math.min(1, (current - 1) / (total - 1)));
    Animated.timing(prog, { toValue: t, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [current, total, prog]);

  return (
    <View style={localStyles.progressSmallWrap}>
      <View style={localStyles.progressSmallBg} />
      <Animated.View style={[localStyles.progressSmallFill, { width: prog.interpolate({ inputRange: [0, 1], outputRange: [24, 280] }), backgroundColor: APP_PRIMARY }]} />
    </View>
  );
}

export default function CreateStepExtrasReview() {
  const router = useRouter();

  // ===== store bindings (lectura y mutadores) =====
  const images = useCreatePostStore((s) => s.images);
  const title = useCreatePostStore((s) => s.title);
  const price = useCreatePostStore((s) => s.price);
  const currency = useCreatePostStore((s) => s.currency);
  const condition = useCreatePostStore((s) => s.condition);
  const category = useCreatePostStore((s) => s.category);
  const nivel2 = useCreatePostStore((s) => s.nivel2);
  const nivel3 = useCreatePostStore((s) => s.nivel3);
  const nivel4 = useCreatePostStore((s) => s.nivel4);
  const subcategory = useCreatePostStore((s) => s.subcategory);
  const location = useCreatePostStore((s) => s.location);
  const storeDescription = useCreatePostStore((s) => s.description);
  const storeDeliveryEnabled = useCreatePostStore((s) => s.deliveryEnabled);
  const storeNumber = useCreatePostStore((s) => s.number);
  const previewLat = useCreatePostStore((s) => (s as any).previewLat ?? null);
  const previewLng = useCreatePostStore((s) => (s as any).previewLng ?? null);
  const tipo = useCreatePostStore((s) => (s as any).tipo);
  // mutators (funciones del store — estables)
  const setField = useCreatePostStore((s) => s.setField);
  const setMany = useCreatePostStore((s) => s.setMany);
  const clear = useCreatePostStore((s) => s.clear);

  // Local fields (editable en esta pantalla)
  const [description, setDescription] = useState<string>(storeDescription || "");
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(!!storeDeliveryEnabled);
  const [number, setNumber] = useState<string>(storeNumber || "");

  // Animated image state
  const enabledImage = require("@/assets/images/box.png");
  const disabledImage = require("@/assets/images/boxsad.png");
  const [currentIllustration, setCurrentIllustration] = useState<any>(deliveryEnabled ? enabledImage : disabledImage);
  const animOpacity = useRef(new Animated.Value(1)).current;
  const animScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const next = deliveryEnabled ? enabledImage : disabledImage;
    animateImageChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryEnabled]);

  const animateImageChange = (nextImage: any) => {
    Animated.timing(animOpacity, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setCurrentIllustration(nextImage);
      animScale.setValue(0.96);
      Animated.parallel([
        Animated.timing(animOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(animScale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // sync local description/delivery with store when component mounts (in case came from store)
  useEffect(() => {
    setDescription(storeDescription || "");
    setDeliveryEnabled(!!storeDeliveryEnabled);
    setNumber(storeNumber || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isPublishing, setIsPublishing] = useState(false);

  // Convex mutations
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  // simple validation:
  // - requiere título, imágenes, precio, moneda, categoría, ubicación, condición
  // - requiere descripción (no permitir publicar sin ella)
  // - si envío activado, requiere número (no permitir publicar sin número)
  const canPublish =
    !!title &&
    images.length > 0 &&
    !!price &&
    !!currency &&
    !!category &&
    !!location &&
    !!condition &&
    description.trim().length > 0 &&
    (!deliveryEnabled || number.trim().length > 0);

  const handlePublish = async () => {
    // Actualiza store con los edits locales antes de enviar
    setField("description", description);
    setField("deliveryEnabled", deliveryEnabled);
    setField("number", number);

    if (!canPublish) {
      const missing: string[] = [];
      if (!title) missing.push("Título");
      if (images.length === 0) missing.push("Imágenes");
      if (!price) missing.push("Precio");
      if (!currency) missing.push("Moneda");
      if (!category) missing.push("Categoría");
      if (!location) missing.push("Ubicación");
      if (!condition) missing.push("Condición");
      if (description.trim().length === 0) missing.push("Descripción");
      if (deliveryEnabled && number.trim().length === 0) missing.push("Número de celular (envío)");

      Alert.alert("Falta información", `Por favor completa: ${missing.join(", ")}`);
      return;
    }

    setIsPublishing(true);

    try {
      // subir imágenes (si las hay) y obtener storageIds
      const uploadedImages: string[] = [];

      for (const uri of images) {
        // pedir url temporal al servidor
        const uploadUrl = await generateUploadUrl();
        // expo-file-system upload
        const result = await FileSystem.uploadAsync(uploadUrl, uri, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        });

        // asumir que el endpoint responde con JSON que contiene storageId
        // (igual que en tu otro screen)
        const body = result.body ? JSON.parse(result.body) : {};
        if (body.storageId) {
          uploadedImages.push(body.storageId);
        } else {
          console.warn("Upload returned no storageId", body);
        }
      }

      // price: convertir a número si está formateado con comas
      const numericPrice = typeof price === "number" ? price : parseFloat(String(price).replace(/,/g, "")) || 0;

      // crear post
      await createPost({
        // adapta keys según tu API
        storageId: uploadedImages[0] ? (uploadedImages[0] as any) : null,
        imageUrls: uploadedImages as unknown as Id<"_storage">[],
        title,
        caption: description,
        price: numericPrice,
        currency,
        category,
        nivel2,
        nivel3,
        nivel4,
        subcategory,
        location,
        condition,
        sold: false,
        lat: previewLat,
        lng: previewLng,
        deliveryEnabled,
        number: number,
        tipo,
      });

      // limpiar store y locales
      clear();

      Toast.show({
        type: "success",
        position: "top",
        text1: "¡Publicado!",
        text2: "Tu producto se publicó correctamente.",
      });

      router.replace("/(tabs)");
    } catch (err) {
      console.error("publish error", err);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error al publicar",
        text2: "Ocurrió un error al subir las imágenes o crear la publicación.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#222" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Publicar producto</Text>
          <Text style={styles.headerSub}>Paso 4 de 4</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
        <SmallProgress total={4} current={4} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <AnimatedTextInput label="Descripción" value={description} onChangeText={setDescription} multiline placeholder="Agrega detalles, estado, usos, medidas..." />
          <Text style={styles.hintText}>Incluye info útil: estado real, dimensiones y cualquier defecto. Esto reduce preguntas y mejora la venta.</Text>
        </View>

        {/* ---------- Opciones de envío ---------- */}
        <View style={styles.shippingCard}>
          <Text style={styles.shippingTitle}>Opciones de envío</Text>

          <View style={styles.illustrationWrap}>
            <Animated.Image
              source={currentIllustration}
              style={[
                styles.illustration,
                { opacity: animOpacity, transform: [{ scale: animScale }] },
              ]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bullets}>
            <Text style={styles.bulletItem}>✓ Vende más rápido.</Text>
            <Text style={styles.bulletItem}>✓ Sin necesidad de quedar con nadie.</Text>
            <Text style={styles.bulletItem}>✓ Es gratis. Todo lo que ganes, para ti.</Text>
            <Text style={styles.bulletItem}>✓ Tus ventas protegidas con Proteccion DiUna</Text>
          </View>

          <TouchableOpacity style={styles.faqLinkWrap}>
            <Text style={styles.faqLink}>¿Dudas? Consulta las preguntas frecuentes</Text>
          </TouchableOpacity>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Activar envío</Text>
            <Switch
              value={deliveryEnabled}
              onValueChange={(value) => setDeliveryEnabled(value)}
              trackColor={{ false: "#D0D4DA", true: APP_PRIMARY }}
              thumbColor={deliveryEnabled ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#E3E4E6"
            />
          </View>

          {deliveryEnabled && (
            <>
              <View style={styles.sectionDivider} />

              <Text style={styles.sectionTitle}>Celular</Text>
              <AnimatedTextInput label="Número celular" value={number} onChangeText={setNumber} placeholder="Agrega tu número celular" />
              <Text style={[styles.hintText, { marginTop: 6 }]}>Si activas envío, debes indicar un número para coordinar la entrega.</Text>
            </>
          )}
        </View>

        {/* resumen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen antes de publicar</Text>

          <View style={styles.reviewCard}>
            <View style={styles.reviewRow}>
              {images && images.length > 0 ? (
                <Image source={{ uri: images[0] }} style={styles.reviewImage} />
              ) : (
                <View style={styles.reviewImagePlaceholder}><Text style={{ color: GREY }}>Sin imagen</Text></View>
              )}

              <View style={styles.reviewMeta}>
                <Text style={styles.reviewTitle}>{title || "Título no completado"}</Text>
                <Text style={styles.reviewSub}>{price ? `${price} ${currency}` : "Precio no indicado"}</Text>
                <Text style={styles.reviewSub}>{location || "Ubicación no indicada"}</Text>
                <Text style={styles.reviewSub}>{category || "Categoría no indicada"}</Text>
              </View>
            </View>

            <Text style={styles.reviewDesc} numberOfLines={3}>{description || storeDescription || "No hay descripción"}</Text>

            <View style={styles.reviewFooterRow}>
              <Text style={styles.reviewFooterText}>Envío: {deliveryEnabled ? "Sí" : "No"}</Text>
              <Text style={styles.reviewFooterText}>{images.length} imagen(es)</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.backBtnMain]} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.publishBtn, isPublishing && styles.publishBtnDisabled]} disabled={isPublishing || !canPublish} onPress={handlePublish}>
            {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>Publicar</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  inputWrap: { marginTop: 6, backgroundColor: "#fff", borderRadius: 12, padding: 8, position: "relative" },
  label: { position: "absolute", top: 8, left: 10, fontFamily: "Medium", fontSize: 13, color: GREY },
  textInput: { fontFamily: "Regular", paddingTop: Platform.OS === "ios" ? 22 : 20, paddingBottom: 8, paddingHorizontal: 6, fontSize: 15, color: "#111" },
  underlineBg: { position: "absolute", left: 6, right: 6, bottom: 0, height: 2, backgroundColor: "#F0F4F6", borderRadius: 4 },
  underlineFill: { position: "absolute", left: 6, bottom: 0, height: 2, borderRadius: 4 },

  progressSmallWrap: { height: 20, marginBottom: 12 },
  progressSmallBg: { position: "absolute", left: 0, right: 0, top: 6, height: 6, borderRadius: 999, backgroundColor: "#EEF3F6" },
  progressSmallFill: { position: "absolute", left: 0, top: 6, height: 6, borderRadius: 999 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: Platform.OS === "android" ? 24 : 40 },
  header: { height: 72, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontFamily: "SemiBold", fontSize: 16, color: "#111" },
  headerSub: { fontFamily: "Regular", fontSize: 12, color: GREY },

  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  section: { marginBottom: 18 },
  sectionTitle: { fontFamily: "SemiBold", fontSize: 14, color: "#222", marginBottom: 8 },
  hintText: { marginTop: 8, fontFamily: "Regular", fontSize: 12, color: GREY },

  shippingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFF3F5",
    padding: 16,
    marginHorizontal: 0,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  shippingTitle: {
    fontFamily: "SemiBold",
    fontSize: 18,
    color: "#111",
    marginBottom: 12,
    paddingLeft: 4,
  },
  illustrationWrap: {
    alignItems: "center",
    marginBottom: 12,
    height: 96,
    justifyContent: "center",
  },
  illustration: { width: 180, height: 96 },

  bullets: { paddingHorizontal: 4, marginBottom: 10 },
  bulletItem: { fontFamily: "Regular", fontSize: 13, color: "#111", marginBottom: 6 },
  faqLinkWrap: { marginTop: 6, marginBottom: 10 },
  faqLink: { fontFamily: "Medium", color: APP_PRIMARY, textDecorationLine: "underline" },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F6F8",
  },
  toggleLabel: { fontFamily: "Medium", fontSize: 15, color: "#111" },

  sectionDivider: { height: 1, backgroundColor: "#F3F6F8", marginVertical: 12 },

  reviewCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#EFF3F5" },
  reviewRow: { flexDirection: "row", alignItems: "center" },
  reviewImage: { width: 84, height: 84, borderRadius: 8, marginRight: 12 },
  reviewImagePlaceholder: { width: 84, height: 84, borderRadius: 8, backgroundColor: "#F6F8F9", alignItems: "center", justifyContent: "center", marginRight: 12 },
  reviewMeta: { flex: 1 },
  reviewTitle: { fontFamily: "SemiBold", fontSize: 15, color: "#111" },
  reviewSub: { fontFamily: "Regular", fontSize: 13, color: GREY, marginTop: 4 },
  reviewDesc: { marginTop: 10, fontFamily: "Regular", fontSize: 13, color: "#222" },
  reviewFooterRow: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  reviewFooterText: { fontFamily: "Medium", fontSize: 13, color: GREY },

  footer: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", gap: 12 },
  backBtnMain: { flex: 1, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#E7EEF0" },
  backBtnText: { color: "#333", fontFamily: "SemiBold" },
  publishBtn: { flex: 1, backgroundColor: APP_PRIMARY, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  publishBtnDisabled: { backgroundColor: "#DDE7DA" },
  publishBtnText: { color: "#fff", fontFamily: "SemiBold" },
});
