import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, ViewStyle, TouchableOpacity, } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ReviewSkeleton } from '../loaders/ReviewSkeleton';
import { styles } from './review.styles';
interface Props {
  sellerId: Id<'users'>;
  containerStyle?: ViewStyle;
}
const formatDateShort = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2); // últimos 2 dígitos
  return `${day} - ${month} - ${year}`;
};

const ReviewComponent = ({ sellerId, containerStyle }: Props) => {
  const reviews = useQuery(api.reviews.getReviewsByUser, {
    userId: sellerId,
  });
  const sortedReviews = reviews ? [...reviews].sort(
    (a, b) => b._creationTime - a._creationTime
  ) : [];
  if (!reviews ) return (
  <>
    <ReviewSkeleton />
    <ReviewSkeleton />
    <ReviewSkeleton />
    <ReviewSkeleton />
  </>
);


  return (
    <View>
      <FlatList
        data={sortedReviews}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.card, containerStyle]}>
            {/* Header row: avatar + name + stars | date */}
            <View style={styles.header}>
              <View style={styles.avatarNameSection}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: item.user.image }} style={styles.avatar} />

                </View>
                <View>
                  <Text style={styles.username}>{item.user.fullname}</Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FontAwesome
                        key={index}
                        name="star"
                        size={14}
                        color={index < item.rating ? '#E8B179' : '#E0E0E0'}
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.dateText}>
                {formatDateShort(item._creationTime)}
              </Text>
            </View>

            {/* Comment */}
            <View style={{ paddingLeft: 50 }}>
              <Text numberOfLines={2} style={styles.comment}>
                {item.comment}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ReviewComponent;
