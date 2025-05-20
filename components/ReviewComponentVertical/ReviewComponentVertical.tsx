import React, { useState } from 'react';
import { Modal, View, Text, FlatList, Pressable, Image, TouchableOpacity, TextInput, } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader } from '../Loader';
import { styles } from './ReviewComponent.styles';
import { useAuth } from '@clerk/clerk-expo';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    sellerId: Id<'users'>;
}

export default function ReviewComponentVertical({ visible, onClose, sellerId }: Props) {
    const reviews = useQuery(api.reviews.getReviewsByUser, { userId: sellerId, });
    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

    const createReview = useMutation(api.reviews.addReview);

    const [rating, setRating] = useState(0);
    const [content, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSendReview = async () => {
        if (!rating || !content.trim()) return;
        try {
            setSubmitting(true);
            await createReview({
                content,
                sellerId: sellerId,
                rating,
            });
            setRating(0);
            setComment('');
        } finally {
            setSubmitting(false);
        }
    };

    if (!reviews) return <Loader />;

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose} >
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0} >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <AntDesign name="close" size={22} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Todas las reseñas</Text>

                    {reviews.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#777', fontSize: 16, textAlign: 'center' }}>
                                Aún no hay reseñas.
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={reviews}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <View style={styles.headerRow}>
                                        <Image source={{ uri: item.user.image }} style={styles.avatar} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={styles.username}>
                                                {item.user.fullname.split(' ')[0]}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                <FontAwesome name="star" size={14} color={COLORS.star} />
                                                <Text style={styles.ratingText}> {item.rating.toFixed(1)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={styles.comment}>{item.comment}</Text>
                                </View>
                            )}
                        />
                    )}

                    {sellerId !== currentUser?._id && (
                        <View style={{ paddingTop: 16, borderTopWidth: 1, borderColor: '#eee', paddingBottom: 24 }}>
                            <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 12, color: '#222' }}>
                                Deja tu reseña
                            </Text>

                            {/* Estrellas */}
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <TouchableOpacity key={num} onPress={() => setRating(num)} activeOpacity={0.8}>
                                        <FontAwesome name="star" size={28} color={num <= rating ? COLORS.star : '#D3D3D3'} style={{ marginRight: 6 }} />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Campo de texto */}
                            <TextInput placeholder="Escribe algo sobre tu experiencia..." value={content} onChangeText={setComment} multiline style={ styles.input } placeholderTextColor="#999" />

                            {/* Botón enviar */}
                            <TouchableOpacity
                                onPress={handleSendReview}
                                disabled={submitting || !rating || !content.trim()}
                                style={{
                                    marginTop: 16,
                                    backgroundColor: !rating || !content.trim() ? '#ddd' : COLORS.main,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                }}
                                activeOpacity={0.85}
                            >
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                                    {submitting ? 'Enviando...' : 'Enviar reseña'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}



                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
