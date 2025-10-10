import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import moneda from "@/assets/precio/precio.data";
import condicion from "@/assets/condicion/condicion.data";
import { useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/ImageCarosel/ImageCarosel";
import {
  Banknote,
  ChevronLeft,
  DollarSign,
  FileSliders,
  FileText,
  Images,
  MapPinCheck,
  Pencil,
  Tag,
  Truck,
} from "lucide-react-native";
import { useAuth } from "@clerk/clerk-expo";
import InputLocation from "@/components/InputLocation/InputLocation";
import Toast from "react-native-toast-message";
import InputSelect from "@/components/InputSelect";
import InputText from "@/components/InputText";
import CategorySelect from "@/components/CategorySelect";


export default function CreateScreen() {
  const { userId } = useAuth();
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [nivel2, setNivel2] = useState<string | undefined>(undefined);
  const [nivel3, setNivel3] = useState<string | undefined>(undefined);
  const [nivel4, setNivel4] = useState<string | undefined>(undefined);
  const [subcategory, setSubcategory] = useState("");

  const [condition, setCondition] = useState("");
  const [currency, setCurrency] = useState("");
  const [sold, setSold] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { tipo } = useLocalSearchParams();

  const [location, setLocation] = useState(currentUser?.location || "");
  const [lat, setLat] = useState<number>(currentUser?.lat ?? 0);
  const [lng, setLng] = useState<number>(currentUser?.lng ?? 0);

  // — Novedades para envío (estilo "Opciones de envío" de la imagen)
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(false);
  const weightRanges = [
    { key: "0-1", label: "0 a 1 kg", cost: 6.0 },
    { key: "1-2", label: "1 a 2 kg", cost: 8.0 },
    { key: "2-5", label: "2 a 5 kg", cost: 12.0 },
    { key: "5-10", label: "5 a 10 kg", cost: 20.0 },
    { key: "10-20", label: "10 a 20 kg", cost: 35.0 },
    { key: "20-30", label: "20 a 30 kg", cost: 60.0 },
  ];
  const [selectedWeightKey, setSelectedWeightKey] = useState<string | null>(null);

  // Animated image state
  const enabledImage = require("@/assets/images/box.png");
  const disabledImage = require("@/assets/images/boxsad.png"); // asegúrate de tenerla
  const [currentIllustration, setCurrentIllustration] = useState<any>(
    deliveryEnabled ? enabledImage : disabledImage
  );

  const animOpacity = useRef(new Animated.Value(1)).current;
  const animScale = useRef(new Animated.Value(1)).current;

  const animateImageChange = (nextImage: any) => {
    // fade out -> swap -> pop in (scale + fade in)
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.4,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      setSelectedImages((prev) => {
        const combined = [...prev, ...result.assets.map((asset) => asset.uri)];
        return combined.slice(0, 10);
      });
    }
  };

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handleShare = async () => {
    const requiredFields = [
      { value: selectedImages.length > 0, name: "imágenes" },
      { value: title.trim(), name: "título" },
      { value: price.trim(), name: "precio" },
      { value: currency.trim(), name: "moneda" },
      { value: category.trim(), name: "categoría" },
      { value: location.trim(), name: "ubicación" },
      { value: condition.trim(), name: "condición" },
      { value: caption.trim(), name: "descripción" },
    ];

    const emptyField = requiredFields.find((field) => !field.value);

    if (emptyField) {
      Toast.show({
        type: "warning",
        position: "top",
        visibilityTime: 3000,
        text1: `Falta completar: ${emptyField.name}`,
        text2: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    // si delivery está activado, aseguramos que haya un peso seleccionado
    if (deliveryEnabled && !selectedWeightKey) {
      Toast.show({
        type: "warning",
        position: "top",
        text1: "Completa el tramo de peso",
        text2: "Selecciona el tramo de peso para habilitar envío.",
      });
      return;
    }

    try {
      setIsSharing(true);
      let uploadedImages: string[] = [];

      for (const image of selectedImages) {
        const uploadUrl = await generateUploadUrl();
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, image, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        });

        const { storageId } = JSON.parse(uploadResult.body);
        uploadedImages.push(storageId);
      }

      // payload con info de delivery si está activado
      const deliveryWeightRange = deliveryEnabled
        ? selectedWeightKey
        : null;
      const deliveryCost = deliveryEnabled
        ? (weightRanges.find((w) => w.key === selectedWeightKey)?.cost ?? 6.0)
        : 0;

      await createPost({
        tipo: Array.isArray(tipo) ? tipo[0] : tipo,
        storageId: uploadedImages[0],
        imageUrls: uploadedImages,
        caption,
        title,
        price: parseFloat(price.replace(/,/g, "")),
        category,
        nivel2,
        nivel3,
        nivel4,
        subcategory,
        location,
        condition,
        currency,
        sold,
        lat: Number(lat),
        lng: Number(lng),
        // NUEVO: envío
        deliveryEnabled,
        deliveryWeightRange,
        deliveryCost,
      });

      // limpiar campos
      setSelectedImages([]);
      setCaption("");
      setTitle("");
      setPrice("");
      setCategory("");
      setLocation("");
      setCondition("");
      setCurrency("");
      setNivel2(undefined);
      setNivel3(undefined);
      setNivel4(undefined);
      setSubcategory("");
      setDeliveryEnabled(false);
      setSelectedWeightKey(null);

      // animar a imagen desactivada si estaba activado
      animateImageChange(disabledImage);

      Toast.show({
        type: "success",
        position: "top",
        text1: "¡Producto publicado!",
        text2: "Tu publicación se ha guardado con éxito.",
      });

      router.replace("/(tabs)");
    } catch (error) {
      console.log("Error sharing post", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error al publicar",
        text2: "Intenta nuevamente más tarde.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCategoryPath = (path: string[]) => {
    const [l1, l2, l3, l4, l5] = path;

    setCategory(l1 ?? "");
    setNivel2(l2 || undefined);
    setNivel3(l3 || undefined);
    setNivel4(l4 || undefined);

    const last = path[path.length - 1] ?? "";
    setSubcategory(path.length > 1 ? last : "");
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const handleFocus = (y: number) => {
    scrollViewRef.current?.scrollTo({
      y: y,
      animated: true,
    });
  };

  function formatNumberWithCommas(value: string) {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handlePriceChange = (text: string) => {
    const formatted = formatNumberWithCommas(text);
    setPrice(formatted);
  };

  // Toggle simple para delivery (con animación de imagen)
  const toggleDelivery = () => {
    setDeliveryEnabled((prev) => {
      const next = !prev;

      // animación: cambiar la ilustración con efecto
      const nextImage = next ? enabledImage : disabledImage;
      animateImageChange(nextImage);

      Toast.show({
        type: next ? "success" : "info",
        position: "top",
        text1: next ? "Delivery activado" : "Delivery desactivado",
        text2: next ? "Los compradores podrán elegir envío." : "El envío ya no estará disponible.",
      });
      if (!next) setSelectedWeightKey(null);
      return next;
    });
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={32} color={COLORS.black} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
          disabled={isSharing}
          onPress={handleShare}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.shareText}>Publicar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 500 }}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={[styles.content, isSharing && styles.contentDisabled]}>
          {/* Carrusel de imágenes */}
          <View style={styles.imageCarousel}>
            {selectedImages.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyImageContainer}
                onPress={pickImage}
              >
                <Images size={50} color={COLORS.grey} />
                <Text style={styles.emptyImageText}>Selecciona imágenes</Text>
              </TouchableOpacity>
            ) : (
              <ImageCarousel
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />
            )}
          </View>
        </View>

        {/* Texto fotos */}
        <Text
          style={{
            fontFamily: "Medium",
            fontSize: 12,
            color: COLORS.black,
            paddingLeft: 10,
            paddingBottom: 20,
          }}
        >
          Fotos: {selectedImages.length}/10 selecciona tus imagenes principales
        </Text>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <InputText
            label="Título del producto"
            iconComponent={<Pencil size={20} />}
            value={title}
            onChangeText={setTitle}
            onFocus={() => handleFocus(100)}
          />
        </View>

        <View
          style={[
            styles.inputSection,
            { flexDirection: "row", paddingLeft: 20, paddingRight: 10 },
          ]}
        >
          <View style={{ flex: 2.5 }}>
            <InputText
              label="Precio"
              iconComponent={<Banknote size={20} />}
              keyboardType="numeric"
              value={price}
              onChangeText={handlePriceChange}
            />
          </View>
          <View style={{ flex: 1.7 }}>
            <InputSelect
              label="Moneda"
              iconComponent={<DollarSign size={18} />}
              value={currency}
              onChangeText={setCurrency}
              data={moneda}
              onFocus={() => handleFocus(100)}
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <CategorySelect
            label="Categoría"
            iconComponent={<Tag size={20} />}
            valueCategory={category}
            onChangeTextCategory={setCategory}
            valueSub={subcategory}
            onChangeTextSub={setSubcategory}
            onChangePath={handleCategoryPath}
          />
        </View>

        <View style={styles.inputSection}>
          <InputLocation
            label="Ubicación"
            iconComponent={<MapPinCheck size={20} />}
            value={location}
            onChangeText={setLocation}
            onFocus={() => handleFocus(400)}
            onLocationSelected={({ description, lat: newLat, lng: newLng }) => {
              setLocation(description);
              setLat(Number(newLat));
              setLng(Number(newLng));
            }}
          />
        </View>

        <View style={styles.inputSection}>
          <InputSelect
            label="Condición"
            iconComponent={<FileSliders size={18} />}
            value={condition}
            onChangeText={setCondition}
            data={condicion}
          />
        </View>

        <View style={styles.inputSection}>
          <InputText
            label="Descripción"
            iconComponent={<FileText size={18} />}
            value={caption}
            onChangeText={setCaption}
            onFocus={() => handleFocus(500)}
            minHeight={120}
            multiline
          />
        </View>

        {/* ---------- NUEVA SECCIÓN: Opciones de envío (AHORA AL FINAL) ---------- */}
        <View style={shippingStyles.shippingCard}>
          <Text style={shippingStyles.shippingTitle}>Opciones de envío</Text>

          {/* ilustración animated */}
          <View style={shippingStyles.illustrationWrap}>
            <Animated.Image
              source={currentIllustration}
              style={[
                shippingStyles.illustration,
                { opacity: animOpacity, transform: [{ scale: animScale }] },
              ]}
              resizeMode="contain"
            />
          </View>

          <View style={shippingStyles.bullets}>
            <Text style={shippingStyles.bulletItem}>✓ Vende más rápido.</Text>
            <Text style={shippingStyles.bulletItem}>✓ Sin necesidad de quedar con nadie.</Text>
            <Text style={shippingStyles.bulletItem}>✓ Es gratis. Todo lo que ganes, para ti.</Text>
            <Text style={shippingStyles.bulletItem}>✓ Tus ventas están protegidas.</Text>
          </View>

          <TouchableOpacity
            style={shippingStyles.faqLinkWrap}
          >
            <Text style={shippingStyles.faqLink}>¿Dudas? Consulta las preguntas frecuentes</Text>
          </TouchableOpacity>

          {/* Toggle activación */}
          <View style={shippingStyles.toggleRow}>
            <Text style={shippingStyles.toggleLabel}>Activar envío</Text>
            <TouchableOpacity
              onPress={toggleDelivery}
              style={[
                shippingStyles.toggleButton,
                deliveryEnabled ? shippingStyles.toggleOn : shippingStyles.toggleOff,
              ]}
              accessibilityRole="switch"
              accessibilityState={{ checked: deliveryEnabled }}
            >
              <View
                style={[
                  shippingStyles.toggleThumb,
                  deliveryEnabled ? shippingStyles.toggleThumbOn : shippingStyles.toggleThumbOff,
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Si está activo, mostrar selección de peso */}
          {deliveryEnabled && (
            <>
              <View style={shippingStyles.sectionDivider} />

              <Text style={shippingStyles.sectionLabel}>¿Cuánto pesa?</Text>
              <Text style={shippingStyles.sectionHelp}>
                Elige el tramo de peso correspondiente a tu producto. Ten en cuenta el peso del envoltorio.
              </Text>

              <View style={shippingStyles.weightList}>
                {weightRanges.map((range) => {
                  const selected = selectedWeightKey === range.key;
                  return (
                    <TouchableOpacity
                      key={range.key}
                      style={shippingStyles.weightRow}
                      onPress={() => setSelectedWeightKey(range.key)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                    >
                      <View style={shippingStyles.weightLabelWrap}>
                        <Text style={shippingStyles.weightLabel}>{range.label}</Text>
                        <Text style={shippingStyles.weightCost}>S/ {range.cost.toFixed(2)}</Text>
                      </View>

                      <View style={[shippingStyles.radioOuter, selected && shippingStyles.radioOuterSelected]}>
                        {selected && <View style={shippingStyles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
        {/* ---------- FIN seccion envío (AL FINAL) ---------- */}
      </ScrollView>
    </View>
  );
}

/* -------------------- estilos de la sección envío (inline para conveniencia) -------------------- */
const shippingStyles = StyleSheet.create({
  shippingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFF3F5",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  shippingTitle: {
    fontFamily: "SemiBold",
    fontSize: 18,
    color: COLORS.black,
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
  bulletItem: { fontFamily: "Regular", fontSize: 13, color: COLORS.black, marginBottom: 6 },
  faqLinkWrap: { marginTop: 6, marginBottom: 10 },
  faqLink: { fontFamily: "Medium", color: COLORS.primary, textDecorationLine: "underline" },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F6F8",
  },
  toggleLabel: { fontFamily: "Medium", fontSize: 15, color: COLORS.black },

  toggleButton: {
    width: 56,
    height: 34,
    borderRadius: 999,
    justifyContent: "center",
    padding: 4,
  },
  toggleOff: { backgroundColor: "#F3F6F8", borderWidth: 1, borderColor: "#E8EEF0" },
  toggleOn: { backgroundColor: COLORS.primary, borderWidth: 0 },

  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  toggleThumbOff: { marginLeft: 4 },
  toggleThumbOn: { marginLeft: 26 },

  sectionDivider: { height: 1, backgroundColor: "#F3F6F8", marginVertical: 12 },

  sectionLabel: { fontFamily: "SemiBold", fontSize: 15, color: COLORS.black, marginBottom: 6 },
  sectionHelp: { fontFamily: "Regular", fontSize: 13, color: COLORS.grey, marginBottom: 12 },

  weightList: { marginBottom: 6 },
  weightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F6F8",
  },
  weightLabelWrap: { flexDirection: "row", alignItems: "center" },
  weightLabel: { fontFamily: "Regular", fontSize: 14, color: COLORS.black },
  weightCost: { fontFamily: "Medium", fontSize: 13, color: COLORS.grey, marginLeft: 12 },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 1.6,
    borderColor: "#D6DEE4",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 10, backgroundColor: COLORS.primary },
});
