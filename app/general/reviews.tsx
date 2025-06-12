import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, Platform, } from 'react-native';
import { ThumbsUp, MessageCircle, Loader } from 'lucide-react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { formatDistanceToNow } from 'date-fns';
import { COLORS } from '@/constants/theme';


const filters = ['Most recent', 'Highest rating', 'Lowest rating'];

export default function ReviewsScreen() {
    const [selectedFilter, setSelectedFilter] = useState('Most recent');
    const { userId } = useAuth();

    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");
    const reviews = useQuery(
        api.reviews.getReviewsByUser,
        currentUser?._id ? { userId: currentUser._id } : "skip"
    );
    if (!reviews) return <Loader />;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reseñas</Text>

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
                    renderItem={({ item }) => (
                        <View style={styles.reviewCard}>
                            <View style={styles.headerRow}>
                                <Image source={{ uri: item.user.image }} style={styles.avatar} />
                                <View>
                                    <Text style={styles.name}>{item.user.fullname.split(' ')[0]}</Text>
                                    <Text style={styles.date}>{formatDistanceToNow(item._creationTime, { addSuffix: true })}</Text>
                                </View>
                            </View>

                            <View style={styles.stars}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Text key={i} style={{ fontSize: 16 }}>
                                        {i < item.rating ? '★' : '☆'}
                                    </Text>
                                ))}
                            </View>

                            <Text style={styles.comment}>{item.comment}</Text>

                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 80,
    },
    title: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        marginBottom: 15,

    },
    sortLabel: {
        fontSize: 14,
        marginBottom: 8
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#f1f1f1',
    },
    filterSelected: {
        backgroundColor: '#111',
    },
    filterText: {
        fontSize: 13,
        color: '#333',
    },
    filterTextSelected: {
        color: '#fff',
    },
    reviewCard: {
        backgroundColor: '#fafafa',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 999,
        marginRight: 10,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    stars: {
        flexDirection: 'row',
        marginVertical: 6,
    },
    comment: {
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 20,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 13,
        color: '#666',
    },
});
