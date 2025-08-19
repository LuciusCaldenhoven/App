import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import React from 'react';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import moneda from "@/assets/precio/precio.data";
import condicion from "@/assets/condicion/condicion.data";
import { useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/ImageCarosel/ImageCarosel";
import { Banknote, ChevronLeft, DollarSign, FileSliders, FileText, Images, MapPinCheck, Pencil, Tag } from "lucide-react-native";
import { useAuth } from "@clerk/clerk-expo";
import InputLocation from "@/components/InputLocation/InputLocation";
import Toast from "react-native-toast-message";
import InputSelect from "@/components/InputSelect";
import InputText from "@/components/InputText";
import CategorySelect from "@/components/CategorySelect";

export default function CreateScreen() {

    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.01,
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

        try {
            setIsSharing(true);
            let uploadedImages = [];

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
    // path: [L1, L2, L3, L4, L5?]  (el último siempre es la hoja seleccionada)
    const [l1, l2, l3, l4, l5] = path;

    setCategory(l1 ?? "");
    setNivel2(l2 || undefined);
    setNivel3(l3 || undefined);
    setNivel4(l4 || undefined);

    // subcategory = último elemento si hay >1 nivel; si solo hay 1, la dejamos vacía
    const last = path[path.length - 1] ?? "";
    setSubcategory(path.length > 1 ? last : "");
    };

    const scrollViewRef = useRef<ScrollView>(null);

    const handleFocus = (y: number) => {
        scrollViewRef.current?.scrollTo({
            y: y,
            animated: true
        });
    };

    function formatNumberWithCommas(value: string) {

        const numericValue = value.replace(/\D/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const handlePriceChange = (text: string) => {
        const formatted = formatNumberWithCommas(text);
        setPrice(formatted);
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
            {/* Contenido */}
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 500 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} >
                <View style={[styles.content, isSharing && styles.contentDisabled]}>
                    {/* Carrusel de imágenes */}
                    <View style={styles.imageCarousel}>
                        {selectedImages.length === 0 ? (
                            <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage}>
                                <Images size={50} color={COLORS.grey} />
                                <Text style={styles.emptyImageText}>Selecciona imágenes</Text>
                            </TouchableOpacity>
                        ) : (
                            <ImageCarousel selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
                        )}
                    </View>
                </View>

                {/* Texto fotos */}
                <Text style={{ fontFamily: "Medium", fontSize: 12, color: COLORS.black, paddingLeft: 10, paddingBottom: 20 }}>
                    Fotos: {selectedImages.length}/10 selecciona tus imagenes principales
                </Text>



                {/* Inputs */}
                <View style={styles.inputSection}>
                    <InputText label="Título del producto" iconComponent={<Pencil size={20} />} value={title} onChangeText={setTitle} onFocus={() => handleFocus(100)} />
                    
                </View>

                <View style={[styles.inputSection, { flexDirection: "row", paddingLeft: 20, paddingRight: 10 }]}>
                    <View style={{ flex: 2.5 }}>
                        <InputText label="Precio" iconComponent={<Banknote size={20} />} keyboardType="numeric" value={price} onChangeText={handlePriceChange} />
                    </View>
                    <View style={{ flex: 1.7 }}>
                        <InputSelect label="Moneda" iconComponent={<DollarSign size={18} />} value={currency} onChangeText={setCurrency} data={moneda} onFocus={() => handleFocus(100)} />
                    </View>
                </View>

                <View style={styles.inputSection}>
                    <CategorySelect label="Categoría" iconComponent={<Tag size={20} />} valueCategory={category} onChangeTextCategory={setCategory} valueSub={subcategory} onChangeTextSub={setSubcategory} onChangePath={handleCategoryPath}/>
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
                    <InputSelect label="Condición" iconComponent={<FileSliders size={18} />} value={condition} onChangeText={setCondition} data={condicion} />
                </View>

                <View style={styles.inputSection}>
                    <InputText label="Descripción" iconComponent={<FileText size={18} />} value={caption} onChangeText={setCaption} onFocus={() => handleFocus(500)} minHeight={120} multiline />
                </View>

            </ScrollView>
        </View>

    );
}



