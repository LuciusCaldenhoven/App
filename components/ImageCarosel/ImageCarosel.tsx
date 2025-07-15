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
import ImageCropperModal from "./ImageCropperModal";
import { useConvex } from "convex/react";


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
  
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [cropImageUri, setCropImageUri] = useState<string | null>(null);

const convex = useConvex();

const editImageAtIndex = async (index: number) => {
  let uri: string | undefined = undefined;
  const img = selectedImages[index];

  if (typeof img === "string" && (img.startsWith("file://") || img.startsWith("http"))) {
    uri = img;
  } else {
    const id = img as Id<"_storage">;
    uri = await convex.query(api.posts.getImageUrl, { storageId: id });
  }

  if (uri) {
    setCropImageUri(uri);
    setCropIndex(index);
    setCropModalVisible(true);
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
            <TouchableOpacity style={styles.editButton} onPress={() => editImageAtIndex(index)} >
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

      {cropModalVisible && cropImageUri && (
      <ImageCropperModal
        visible={cropModalVisible}
        imageUri={cropImageUri}
        onClose={() => setCropModalVisible(false)}
        onCrop={(croppedUri) => {
          if (cropIndex !== null) {
            setSelectedImages((prev) => {
              const updated = [...prev];
              updated[cropIndex] = croppedUri;
              return updated;
            });
          }
          setCropModalVisible(false);
        }}
      />
    )}

    </View>
  );
}

function ResolvedImage({ item }: { item: string | Id<"_storage"> }) {
  // Si es string con file:// o http(s), es una URI directa
  const isUri = typeof item === "string" && (item.startsWith("file://") || item.startsWith("http"));
  // Solo busca el URL si NO es una URI directa
  const imageUrl = useQuery(
    api.posts.getImageUrl,
    !isUri ? { storageId: item as Id<"_storage"> } : "skip"
  );
  
  // Solo muestra imagen si hay URI válida
  const uri: string | null =
    isUri
      ? (item as string)
      : typeof imageUrl === "string" && (imageUrl.startsWith("http") || imageUrl.startsWith("file://"))
        ? imageUrl
        : null;

  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!uri) return;
    RNImage.getSize(
      uri,
      (width, height) => setAspectRatio(width / height),
      (error) => setAspectRatio(1)
    );
  }, [uri]);

  if (!uri) {
    return (
      <View style={{
        width: 70, height: 100, borderRadius: 5, backgroundColor: "#eee",
        justifyContent: "center", alignItems: "center"
      }}>
        <Text style={{ color: "#aaa" }}>...</Text>
      </View>
    );
  }

  if (!aspectRatio) {
    return (
      <View style={{
        width: 70, height: 100, borderRadius: 5, backgroundColor: "#eee",
        justifyContent: "center", alignItems: "center"
      }}>
        <Text style={{ color: "#aaa" }}>...</Text>
      </View>
    );
  }

  const width = aspectRatio * 100;
  const displayWidth = width > 70 ? width : 70;
  const display = displayWidth < 250 ? displayWidth : 250;

  return (
    <Image
      source={{ uri }}
      style={{
        width: display,
        height: 100,
        borderRadius: 5,
      }}
      contentFit="cover"
      transition={200}
      cachePolicy="memory"
    />
  );
}
