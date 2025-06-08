import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Image } from "expo-image";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Id } from "../../convex/_generated/dataModel";
import { styles } from "../PostProduct/PostProduct.styles";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

type PostProps = {
    post: {
        tipo: string;
        _id: Id<"posts">;
        userId: Id<"users">;
        storageId: Id<"_storage">;
        imageUrls: Id<"_storage">[];
        caption?: string;
        title: string;
        price: number;
        currency: string;
        category: string;
        location: string;
        condition: string;
        _creationTime: number;
        isBookmarked: boolean;
        author: {
            _id: string;
            username: string;
            image: string;
        };
    };
};

export default function PostProduct({ post }: PostProps) {
    const deletePost = useMutation(api.posts.deletePost);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        await deletePost({ postId: post._id });
        setShowModal(false);
    };
    const imageUrl = useQuery(api.posts.getImageUrl, {
            storageId: post.storageId,
        });
    return (
        <>
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/product/${post._id}`)} >
                <View style={styles.rowContainer}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        contentFit="cover"
                        cachePolicy="memory"
                    />

                    {/* Información */}

                    {/* Info a la izquierda */}
                    <View style={styles.infoContainer}>
                        <Text numberOfLines={1} style={styles.title}>
                            {post.title}
                        </Text>
                        <Text numberOfLines={1} style={styles.category}>
                            {post.category}
                        </Text>
                    </View>

                    {/* Iconos a la derecha */}
                    <View style={styles.verticalActions}>
                        <TouchableOpacity onPress={() => router.push({ pathname: "/general/EditProduct/[editProductId]", params: { editProductId: post._id }, }) } style={styles.iconButton} >
                            <Feather name="edit-3" size={20} color="#4F8EF7" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.iconButton}>
                            <Feather name="trash-2" size={20} color="#FF5A5F" />
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableOpacity>

            {/* Modal de confirmación */}
            <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)} >
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.titulo}>¿Eliminar publicación?</Text>
                        <Text style={styles.message}>
                            Esta acción no se puede deshacer.
                        </Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </>
    );
}
