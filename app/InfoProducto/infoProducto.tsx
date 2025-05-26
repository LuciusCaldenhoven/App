import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, Image as RNImage, Keyboard } from "react-native";
import React from 'react';
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import NewInput from "@/components/newInput/newInput";
import { renderMarginBottom } from "@/constants/ui-utils";
import products from "@/assets/index/data";
import moneda from "@/assets/precio/precio.data";
import condicion from "@/assets/condicion/condicion.data";
import { useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/ImageCarosel/ImageCarosel";
import { Images } from "lucide-react-native";

export default function CreateScreen() {
    const router = useRouter();
    const [caption, setCaption] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [condition, setCondition] = useState("");
    const [currency, setCurrency] = useState("");
    const [sold, setSold] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const { tipo } = useLocalSearchParams();
    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
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
        if (selectedImages.length === 0) return;

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
                price: parseFloat(price),
                category,
                location,
                condition,
                currency,
                sold,
            });

            setSelectedImages([]);
            setCaption("");
            setTitle("");
            setPrice("");
            setCategory("");
            setLocation("");
            setCondition("");
            setCurrency("");
            
            router.replace("/(tabs)");
        } catch (error) {
            console.log("Error sharing post", error);
        } finally {
            setIsSharing(false);
        }
    };



    return (
        <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { setSelectedImages([]); setCaption(""); }} disabled={isSharing}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.black} style={{ paddingLeft: 7 }} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Nuevo Producto</Text>
                <TouchableOpacity style={[styles.shareButton, isSharing && styles.shareButtonDisabled]} disabled={isSharing || selectedImages.length === 0} onPress={handleShare} >
                    {isSharing ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                        <Text style={styles.shareText}>Publicar</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Contenido */}
            <ScrollView contentContainerStyle={{ paddingBottom: 600 }} keyboardShouldPersistTaps="handled" >
                <View style={[styles.content, isSharing && styles.contentDisabled]}>
                    {/* Carrusel de imágenes */}
                    <View style={styles.imageCarousel}>
                        {selectedImages.length === 0 ? (
                            <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage}>
                                <Images   size={50} color={COLORS.grey} />
                                <Text style={styles.emptyImageText}>Selecciona imágenes</Text>
                            </TouchableOpacity>
                        ) : (
                            <ImageCarousel selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
                        )}
                    </View>
                </View>

                {/* Texto fotos */}
                <Text style={{ fontFamily: "Medium", fontSize: 12, color: COLORS.black, paddingLeft: 10 }}>
                    Fotos: {selectedImages.length}/10 selecciona tus imagenes principales
                </Text>

                {renderMarginBottom(20)}

                {/* Inputs */}
                <View style={styles.inputSection}>
                    <NewInput label="Título del producto" value={title} onChangeText={setTitle} />
                </View>

                <View style={[styles.inputSection, { flexDirection: "row", paddingLeft: 20, paddingRight: 10 }]}>
                    <View style={{ flex: 3 }}>
                        <NewInput label="Precio" keyboardType="numeric" value={price} onChangeText={setPrice} />
                    </View>
                    <View style={{ flex: 1.2 }}>
                        <NewInput label="Moneda" value={currency} onChangeText={setCurrency} data={moneda} />
                    </View>
                </View>

                <View style={styles.inputSection}>
                    <NewInput label="Categoría" value={category} onChangeText={setCategory} data={products} />
                </View>

                <View style={styles.inputSection}>
                    <NewInput label="Condición" value={condition} onChangeText={setCondition} data={condicion} />
                </View>

                <View style={styles.inputSection}>
                    <NewInput label="Descripción" minHeight={120} multiline={true} value={caption} onChangeText={setCaption} />
                </View>

            </ScrollView>
        </View>
    );
}



