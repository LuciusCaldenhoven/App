import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image as RNImage, } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS } from "@/constants/theme";
import styles from "./ImageCarosel.styles";
import { Image } from "expo-image";

type Props = {
  selectedImages: (string | Id<"_storage">)[];
  setSelectedImages: React.Dispatch<React.SetStateAction<(string | Id<"_storage">)[]>>;
};

export default function ImageCarousel({ selectedImages, setSelectedImages }: Props) {
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
  
  const editImageAtIndex = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setSelectedImages((prev) => {
        const updated = [...prev];
        updated[index] = newUri;
        return updated;
      });
    }
  };

  return (
    <View style={styles.imageCarousel}>
      <FlatList
        data={selectedImages}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.imageWrapper}>
            {/* Botón editar */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editImageAtIndex(index)}
            >
              <MaterialIcons name="edit" size={17} color={COLORS.white} />
            </TouchableOpacity>

            {/* Botón eliminar */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                setSelectedImages((prev) => prev.filter((image, i) => i !== index))
              }
            >
              <Feather name="x" size={17} color={COLORS.white} />
            </TouchableOpacity>

            {/* Imagen */}
            <ResolvedImage item={item} />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Ionicons name="add-circle" size={40} color={COLORS.black} />
            <Text style={styles.addImageText}>Agregar más</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

// Mostrar imagen con tamaño dinámico
function ResolvedImage({ item }: { item: string | Id<"_storage"> }) {
  const isUri = typeof item === "string" && item.startsWith("file://");
  const imageUrl = useQuery(
    api.posts.getImageUrl,
    !isUri ? { storageId: item as Id<"_storage"> } : "skip"
  );

  const uri = isUri ? (item as string) : imageUrl;
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (uri) {
      RNImage.getSize(
        uri,
        (width, height) => setAspectRatio(width / height),
        (error) => console.warn("No se pudo obtener tamaño:", error)
      );
    }
  }, [uri]);

  if (!uri || !aspectRatio) return null;

  const width = aspectRatio * 100;
  const displayWidth = width > 70 ? width : 70;

  return (
    <Image
      source={{ uri }}
      style={{
        width: displayWidth,
        height: 100,
        borderRadius: 5,
      }}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
}
