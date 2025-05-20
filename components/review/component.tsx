import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Loader } from '../Loader';
import { styles } from './review.styles';

interface Props {
  sellerId: Id<'users'>;
  containerStyle?: ViewStyle;
}

const ReviewComponent = ({ sellerId, containerStyle }: Props) => {
  const reviews = useQuery(api.reviews.getReviewsByUser, {
    userId: sellerId,
  });

  if (!reviews) {
    return <Loader />;
  }

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={[styles.cardContainer, containerStyle]}>
          <Pressable style={styles.card}>
            {/* Cabecera */}
            <View style={styles.headerRow}>
              <View style={styles.userInfo}>
                <Image source={{ uri: item.user.image }} style={styles.avatar} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.username}>{item.user.fullname.split(' ')[0]}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <FontAwesome
                      name="star"
                      size={12}
                      color={COLORS.star}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Comentario */}
            <View style={styles.commentContainer}>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          </Pressable>
        </View>
      )}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
    />
  );
};

export default ReviewComponent;