import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image as RNImage, StyleSheet, } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import styles from "./ImageCarosel.styles";

type Props = {
  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function ImageCarousel({ selectedImages, setSelectedImages }: Props) {
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: number }>({});

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

  useEffect(() => {
    selectedImages.forEach((uri) => {
      RNImage.getSize(
        uri,
        (width, height) => {
          setImageDimensions((prev) => ({
            ...prev,
            [uri]: width / height,
          }));
        },
        (error) => console.error("Error fetching image size:", error)
      );
    });
  }, [selectedImages]);

  return (
    <View style={styles.imageCarousel}>
      <FlatList
        data={selectedImages}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const aspectRatio = imageDimensions[item] || 1;
          const imageWidth = 100 * aspectRatio;

          return (
            <View style={styles.imageWrapper}>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={17} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={() => setSelectedImages((prev) => prev.filter((image) => image !== item)) } >
                <Feather name="x" size={17} color={COLORS.white} />
              </TouchableOpacity>

              <Image
                source={{ uri: item }}
                style={{
                  width: imageWidth > 70 ? imageWidth : 70,
                  height: 100,
                  borderRadius: 5,
                }}
                resizeMode={imageWidth > 70 ? "contain" : "cover"}
              />
            </View>
          );
        }}
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

