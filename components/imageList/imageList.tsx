import React from "react";
import { View, FlatList, Image } from "react-native";

import { styles } from "./imageList.styles"; 
interface ImageListProps {
  images: string[]; // Array de URLs de las imágenes
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <FlatList
      data={images}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />

      )}
    />
  );
};

export default ImageList;