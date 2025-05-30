import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from "react-native";
import React from 'react';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import NewInput from "@/components/newInput/newInput";
import products from "@/assets/index/data";
import moneda from "@/assets/precio/precio.data";
import condicion from "@/assets/condicion/condicion.data";
import { useLocalSearchParams } from "expo-router";
import ImageCarousel from "@/components/ImageCarosel/ImageCarosel";
import { Banknote, ChevronLeft, DollarSign, FileSliders, FileText, Images, MapPinCheck, Pencil, Tag } from "lucide-react-native";
import { useAuth } from "@clerk/clerk-expo";
import NewInputt from "@/components/NewInput";

export default function CreateScreen() {
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

    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");
    const [location, setLocation] = useState(currentUser?.location || "");

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
                <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ChevronLeft size={35} color={COLORS.black} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.title}>Nuevo Producto</Text>
                    <TouchableOpacity style={[styles.shareButton, isSharing && styles.shareButtonDisabled]} disabled={isSharing || selectedImages.length === 0} onPress={handleShare} >
                        {isSharing ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Text style={styles.shareText}>Publicar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {/* Contenido */}
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 3000 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} >
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
                    <NewInput label="Título del producto" iconComponent={<Pencil size={20} />} value={title} onChangeText={setTitle} onFocus={() => handleFocus(100)} />
                </View>

                <View style={[styles.inputSection, { flexDirection: "row", paddingLeft: 20, paddingRight: 10 }]}>
                    <View style={{ flex: 2.5 }}>
                        <NewInput label="Precio" iconComponent={<Banknote size={20} />} keyboardType="numeric" value={price} onChangeText={handlePriceChange} />

                    </View>
                    <View style={{ flex: 1.7 }}>
                        <NewInput label="Moneda" iconComponent={<DollarSign size={18} />} value={currency} onChangeText={setCurrency} data={moneda} onFocus={() => handleFocus(100)} />
                    </View>
                </View>

                <View style={styles.inputSection}>
                    <NewInput label="Categoría" iconComponent={<Tag size={20} />} value={category} onChangeText={setCategory} data={products} />
                </View>
                

                <View style={styles.inputSection}>
                    <NewInputt label="Ubicacion" iconComponent={<MapPinCheck  size={20} />} value={location} onChangeText={setLocation}  />
                </View>

                <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                    {currentUser?.location ? (
                        <>
                            <Text style={{ fontSize: 16, color: '#111827', fontFamily: 'Medium' }}>
                                Ubicación: {currentUser.location}
                            </Text>
                            <TouchableOpacity onPress={() => {/* lógica para editar */ }}>
                                <Text style={{ color: '#3B82F6', fontSize: 14, marginTop: 4 }}>
                                    Editar ubicación
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => {/* lógica para ingresar ubicación */ }}>
                            <Text style={{ color: '#9CA3AF', fontSize: 16, fontFamily: 'Medium' }}>
                                Ingresa tu ubicación
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>



                <View style={styles.inputSection}>
                    <NewInput label="Condición" value={condition} iconComponent={<FileSliders size={18} />} onChangeText={setCondition} data={condicion} />
                </View>

                <View style={styles.inputSection}>
                    <NewInput label="Descripción" minHeight={120} iconComponent={<FileText size={18} />} multiline={true} value={caption} onChangeText={setCaption} onFocus={() => handleFocus(400)} />
                </View>
                
            </ScrollView>
        </View>

    );
}



