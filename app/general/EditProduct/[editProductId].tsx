import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "../../../styles/EditProduct.styles";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Entypo, Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import savingAnimation from "@/assets/animations/Loading.json";
import ImageCarousel from "@/components/ImageCarosel/ImageCarosel";
import InputText from "@/components/InputText";
import { Banknote, DollarSign, FileSliders, FileText, MapPinCheck, Pencil, Tag } from "lucide-react-native";
import InputSelect from "@/components/InputSelect";
import InputLocation from "@/components/InputLocation/InputLocation";
import moneda from "@/assets/precio/precio.data";
import product from "@/assets/categoria/data";
import condicion from "@/assets/condicion/condicion.data";
import Toast from "react-native-toast-message";
import CategorySelect from "@/components/CategorySelect";

export default function EditPostScreen() {
  const { editProductId } = useLocalSearchParams();
  const postId = Array.isArray(editProductId) ? editProductId[0] : editProductId;

  const markAsSold = useMutation(api.posts.markAsSold);
  const updatePost = useMutation(api.posts.updatePost);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const deleteFromStorage = useMutation(api.posts.deleteFromStorage);

  const post = useQuery(api.posts.getPostById, postId ? { postId: postId as Id<"posts"> } : "skip");

  // 1. Estados del formulario
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [caption, setCaption] = useState("");
  const [nivel2, setNivel2] = useState<string | undefined>(undefined);
  const [nivel3, setNivel3] = useState<string | undefined>(undefined);
  const [nivel4, setNivel4] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [condition, setCondition] = useState("");
  const [selectedImages, setSelectedImages] = useState<(string | Id<"_storage">)[]>([]);
  const [originalImageIds, setOriginalImageIds] = useState<Id<"_storage">[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 2. Carga inicial de datos
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setPrice(post.price?.toString() || "");
      setCurrency(post.currency || "");
      setLocation(post.location || "");
      setLat(post.lat ?? 0);
      setLng(post.lng ?? 0);
      setCaption(post.caption || "");
      setCategory(post.category || "");
      setNivel2(post.nivel2 || undefined);
      setNivel3(post.nivel3 || undefined);
      setNivel4(post.nivel4 || undefined);
      setSubcategory(post.subcategory || "");
      setCondition(post.condition || "");
      setSelectedImages([
        ...(post.storageId ? [post.storageId] : []),
        ...(post.imageUrls || [])
      ]);
      setOriginalImageIds([
        ...(post.storageId ? [post.storageId] : []),
        ...(post.imageUrls || [])
      ]);
    }
  }, [post]);

  // 3. Utilidad para subir imágenes locales
  async function uploadLocalImage(uri: string) {
    const uploadUrl = await generateUploadUrl();
    const blob = await fetch(uri).then(res => res.blob());
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": blob.type },
      body: blob
    });
    const { storageId } = await response.json();
    return storageId as Id<"_storage">;
  }

  // 4. Procesa el array de imágenes para que solo haya IDs
  async function processImages(images: (string | Id<"_storage">)[]) {
    const processed: Id<"_storage">[] = [];
    for (const img of images) {
      if (typeof img === "string" && img.startsWith("file://")) {
        const id = await uploadLocalImage(img);
        processed.push(id);
      } else {
        processed.push(img as Id<"_storage">);
      }
    }
    return processed;
  }

  const handleSave = async () => {
    if (!post) return;

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
    const emptyField = requiredFields.find(field => !field.value);
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

    setIsSaving(true);

    try {
      const processedImages = await processImages(selectedImages);
      const storageId = processedImages[0];
      const imageUrls = processedImages.slice(1);

      const imagesToDelete = originalImageIds.filter(
        id => !processedImages.includes(id)
      );

      const cleanPrice = Number(price.replace(/,/g, ""));

      // Fallback defensivo: si por cualquier motivo subcategory está vacío,
      // lo igualamos a category para cumplir la regla de "último nivel".
      const effectiveSubcategory = subcategory || category;

      await updatePost({
        postId: post._id,
        title,
        caption,
        price: cleanPrice,
        currency,
        location,
        nivel2,
        nivel3,
        nivel4,
        lat,
        lng,
        category,
        subcategory: effectiveSubcategory,
        condition,
        storageId,
        imageUrls,
      });

      for (const id of imagesToDelete) {
        await deleteFromStorage({ storageId: id });
      }

      setIsSaving(false);
      Toast.show({
        type: "success",
        position: "top",
        text1: "¡Producto editado!",
        text2: "Tu publicación se ha guardado con éxito.",
      });
      router.back();
    } catch (e) {
      setIsSaving(false);
      alert("Error al guardar cambios");
    }
  };

  const handleCategoryPath = (path: string[]) => {
    // path: [L1, L2, L3, L4, L5?] (el último SIEMPRE es la hoja seleccionada)
    const [l1, l2, l3, l4, l5] = path;

    setCategory(l1 ?? "");
    setNivel2(l2 || undefined);
    setNivel3(l3 || undefined);
    setNivel4(l4 || undefined);

    // subcategory SIEMPRE es el último tramo, incluso si solo hay un nivel (p. ej., "Motos")
    const last = path[path.length - 1] ?? "";
    setSubcategory(last);
  };

  function formatNumberWithCommas(value: string) {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const handlePriceChange = (text: string) => {
    const formatted = formatNumberWithCommas(text);
    setPrice(formatted);
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const handleFocus = (y: number) => {
    scrollViewRef.current?.scrollTo({
      y: y,
      animated: true
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingTop: 50 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={35} color={"black"} style={{ paddingLeft: 7 }} />
        </TouchableOpacity>
        <Animated.Text entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          Editar publicación
        </Animated.Text>
      </View>

      <ScrollView style={styles.container} ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 500 }}>
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ImageCarousel selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
        </Animated.View>

        <View>
          <View style={styles.inputSection}>
            <InputText
              label="Título del producto"
              iconComponent={<Pencil size={20} />}
              value={title}
              onChangeText={setTitle}
              onFocus={() => handleFocus(100)}
            />
          </View>

          <View style={[styles.inputSection, { flexDirection: "row", paddingLeft: 20, paddingRight: 10 }]}>
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

          <Animated.View entering={FadeInDown.delay(800).duration(400)} style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity
              style={[styles.button, isSaving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <View style={{ maxHeight: 25, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                {isSaving ? (
                  <LottieView source={savingAnimation} autoPlay loop style={{ width: 250, height: 250 }} />
                ) : (
                  <>
                    <Feather name="check-circle" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Guardar cambios</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(900).duration(400)} style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity
              style={styles.soldButton}
              onPress={() => {
                if (post) {
                  markAsSold({ postId: post._id });
                  router.back();
                }
              }}
              disabled={!post}
            >
              <Entypo name="check" size={20} color="#fff" />
              <Text style={styles.buttonText}>Vendido</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
