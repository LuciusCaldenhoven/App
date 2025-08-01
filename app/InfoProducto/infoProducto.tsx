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
import NewInput from "@/components/newInput/newInput";
import product from "@/assets/index/data";
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

export default function CreateScreen() {

    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

    const router = useRouter();
    const [caption, setCaption] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");

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
            <View>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} >
                    <ChevronLeft size={35} color={COLORS.black} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.title}>Nuevo Producto</Text>
                    <TouchableOpacity style={[styles.shareButton, isSharing && styles.shareButtonDisabled]} disabled={isSharing} onPress={handleShare} >
                        {isSharing ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Text style={styles.shareText}>Publicar</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
                    <InputSelect label="Categoría" iconComponent={<Tag size={20} />} value={category} onChangeText={setCategory} data={product.products} />
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



