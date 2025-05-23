import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "./EditProduct.styles";
import { COLORS } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Entypo, Feather } from "@expo/vector-icons";

import ImageCarousel from "@/components/ImageCarosel/ImageCarosel";
import { Loader } from "@/components/Loader";

export default function EditPostScreen() {
  const { editProductId } = useLocalSearchParams();
  const postId = Array.isArray(editProductId) ? editProductId[0] : editProductId;
  const markAsSold = useMutation(api.posts.markAsSold);

  const post = useQuery(
    api.posts.getPostById,
    postId ? { postId: postId as Id<"posts"> } : "skip"
  );

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);




  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setPrice(post.price.toString());
      setLocation(post.location);
      setCategory(post.category);
      setCondition(post.condition);
      setSelectedImages([post.storageId, ...(post.imageUrls || [])]);
    }
  }, [post]);

  const handleSave = () => {
    console.log("Guardar cambios...");

  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.Text entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          Editar publicación
        </Animated.Text>
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ImageCarousel selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
        </Animated.View>
        <View style={{ paddingHorizontal: 15 }}>
          {[
            { label: "Título", value: title, setter: setTitle },
            { label: "Precio", value: price, setter: setPrice, keyboardType: "numeric" as const },
            { label: "Ubicación", value: location, setter: setLocation },
            { label: "Categoría", value: category, setter: setCategory },
            { label: "Condición", value: condition, setter: setCondition },
          ].map((item, index) => (
            <Animated.View key={item.label} entering={FadeInDown.delay(200 + index * 100).duration(400)}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                value={item.value}
                onChangeText={item.setter}
                style={styles.input}
                placeholder={`Escribe ${item.label.toLowerCase()}`}
                placeholderTextColor="#999"
                keyboardType={item.keyboardType}
              />
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.delay(800).duration(400)}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Feather name="check-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(900).duration(400)}>
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

