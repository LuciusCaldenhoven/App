import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/app/(tabs)/main/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import Review from "./Review";
import { Loader } from "./Loader";

type ReviewsModal = {
  postId: Id<"posts">;
  sellerId: Id<"users">;
  visible: boolean;
  onClose: () => void;
};

export default function ReviewsModal({ onClose, postId, sellerId, visible }: ReviewsModal) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(5);
  const addReview = useMutation(api.reviews.addReview);
  const reviews = useQuery(api.reviews.getReviewsByUser, { userId: sellerId });

  const handleAddReview = async () => {
    if (!content.trim()) return;

    try {
      await addReview({
        content,
        postId,
        sellerId,
        rating,
      });

      setContent("");
    } catch (error) {
      console.log("Error adding review:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Reseñas</Text>
          <View style={{ width: 24 }} />
        </View>

        {reviews === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={reviews}
            renderItem={({ item }) => <Review review={item} />}
            contentContainerStyle={styles.commentsList}
          />
        )}

        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu reseña..."
            placeholderTextColor={COLORS.grey}
            value={content}
            onChangeText={setContent}
            multiline
          />

          <TouchableOpacity onPress={handleAddReview} disabled={!content.trim()}>
            <Text style={[styles.postButton, !content.trim() && styles.postButtonDisabled]}>
              Enviar!
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
