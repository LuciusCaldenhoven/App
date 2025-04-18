import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, TextInput, FlatList } from "react-native";
import React from 'react';
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import SlideItem from "@/components/swiper/SlideItem";
import Pagination from "@/components/swiper/Pagination";
import swiperData from "@/components/swiper/data/index";
import { Animated, Dimensions } from "react-native";
import Slider from "@/components/swiper/Slider";

export default function CreateScreen() {
  // const router = useRouter();
  // const { user } = useUser();

  // const [caption, setCaption] = useState("");
  // const [selectedImages, setSelectedImages] = useState<string[]>([]);
  // const [isSharing, setIsSharing] = useState(false);
  // const [title, setTitle] = useState("");
  // const [price, setPrice] = useState("");
  // const [category, setCategory] = useState("");
  // const [location, setLocation] = useState("");
  // const [condition, setCondition] = useState<"new" | "used">("new");

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsMultipleSelection: true,
  //     quality: 0.8,
  //     selectionLimit: 10,
  //   });

  //   if (!result.canceled) {
  //     setSelectedImages(result.assets.map(asset => asset.uri));
  //   }
  // };

  // const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  // const createPost = useMutation(api.posts.createPost);

  // const handleShare = async () => {
  //   if (selectedImages.length === 0) return;

  //   try {
  //     setIsSharing(true);
  //     let uploadedImages = [];

  //     for (const image of selectedImages) {
  //       const uploadUrl = await generateUploadUrl();
  //       const uploadResult = await FileSystem.uploadAsync(uploadUrl, image, {
  //         httpMethod: "POST",
  //         uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  //         mimeType: "image/jpeg",
  //       });

  //       if (uploadResult.status !== 200) throw new Error("Upload failed");

  //       const { storageId } = JSON.parse(uploadResult.body);
  //       uploadedImages.push(storageId);
  //     }

  //     await createPost({
  //       storageId: uploadedImages[0],
  //       imageUrls: uploadedImages,
  //       caption,
  //       title,
  //       price: parseFloat(price),
  //       category,
  //       location,
  //       condition: condition as "new" | "used",
  //     });

  //     setSelectedImages([]);
  //     setCaption("");
  //     setTitle("");
  //     setPrice("");
  //     setCategory("");
  //     setLocation("");
  //     setCondition("new");

  //     router.push("/(tabs)");
  //   } catch (error) {
  //     console.log("Error sharing post", error);
  //   } finally {
  //     setIsSharing(false);
  //   }
  // };

  // if (selectedImages.length === 0) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <TouchableOpacity
  //         onPress={() => router.push("/slider/slider")}
  //         style={{
  //           padding: 16,
  //           backgroundColor: COLORS.primary,
  //           borderRadius: 8,
  //           alignItems: "center",
  //         }}
  //       >
  //         <Text style={{ color: COLORS.white, fontSize: 16 }}>Ir al Slider</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (

    <View style={styles.container}>
    
      <Slider />
    </View>
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   style={styles.container}
    //   keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    // >
    //   <View style={styles.contentContainer}>
    //     <View style={styles.header}>
    //       <TouchableOpacity
    //         onPress={() => {
    //           setSelectedImages([]);
    //           setCaption("");
    //         }}
    //         disabled={isSharing}
    //       >
    //         <Ionicons
    //           name="close-outline"
    //           size={28}
    //           color={isSharing ? COLORS.grey : COLORS.white}
    //         />
    //       </TouchableOpacity>
    //       <Text style={styles.headerTitle}>Nuevo Producto</Text>
    //       <TouchableOpacity
    //         style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
    //         disabled={isSharing || selectedImages.length === 0}
    //         onPress={handleShare}
    //       >
    //         {isSharing ? (
    //           <ActivityIndicator size="small" color={COLORS.primary} />
    //         ) : (
    //           <Text style={styles.shareText}>Publicar</Text>
    //         )}
    //       </TouchableOpacity>
    //     </View>

    //     <ScrollView contentContainerStyle={styles.scrollContent} bounces={true} keyboardShouldPersistTaps="handled">
    //       <View style={[styles.content, isSharing && styles.contentDisabled]}>

    //         {/* Carrusel de imágenes */}
    //         <View style={styles.imageCarousel}>
    //           <FlatList
    //             data={selectedImages}
    //             horizontal
    //             pagingEnabled
    //             showsHorizontalScrollIndicator={false}
    //             snapToAlignment="center"
    //             snapToInterval={300} // Ajusta el tamaño según las imágenes
    //             keyExtractor={(item, index) => index.toString()}
    //             renderItem={({ item }) => (
    //               <View style={styles.imageWrapper}>
    //                 <Image source={{ uri: item }} style={styles.previewImage} contentFit="cover" transition={200} />
    //               </View>
    //             )}
    //           />

    //           <TouchableOpacity
    //             style={styles.changeImageButton}
    //             onPress={pickImage}
    //             disabled={isSharing}
    //           >
    //             <Ionicons name="image-outline" size={20} color={COLORS.white} />
    //             <Text style={styles.changeImageText}>Cambiar</Text>
    //           </TouchableOpacity>
    //         </View>

    //         {/* Inputs */}
    //         <View style={styles.inputSection}>
    //           <TextInput style={styles.input} placeholder="Título del producto" value={title} onChangeText={setTitle} />
    //           <TextInput style={styles.input} placeholder="Categoría" value={category} onChangeText={setCategory} />
    //           <TextInput style={styles.input} placeholder="Ubicación" value={location} onChangeText={setLocation} />
    //           <TextInput style={styles.input} placeholder="Precio ($)" keyboardType="numeric" value={price} onChangeText={setPrice} />

    //           {/* Condición */}
    //           <View style={styles.conditionContainer}>
    //             <Text style={styles.conditionLabel}>Condición:</Text>
    //             <View style={styles.conditionOptions}>
    //               <TouchableOpacity onPress={() => setCondition("new")} style={condition === "new" ? styles.selected : styles.unselected}>
    //                 <Text>Nuevo</Text>
    //               </TouchableOpacity>
    //               <TouchableOpacity onPress={() => setCondition("used")} style={condition === "used" ? styles.selected : styles.unselected}>
    //                 <Text>Usado</Text>
    //               </TouchableOpacity>
    //             </View>
    //           </View>

    //           {/* Descripción */}
    //           <TextInput
    //             style={styles.captionInput}
    //             placeholder="Escribe una descripción..."
    //             placeholderTextColor={COLORS.grey}
    //             multiline
    //             value={caption}
    //             onChangeText={setCaption}
    //             editable={!isSharing}
    //           />
    //         </View>
    //       </View>
    //     </ScrollView>
    //   </View>
    // </KeyboardAvoidingView>
  );
}