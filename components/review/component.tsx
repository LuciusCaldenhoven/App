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
import { formatDistanceToNow } from 'date-fns';
import { scale } from '@/constants/scale';
import { COLORS, FontSize } from '@/constants/theme';
import { createStyles } from "@/styles/review.styles";
import { FontAwesome } from '@expo/vector-icons';
import { renderBorderBottom, renderPaddingBottom } from '@/constants/ui-utils';


interface Props {
    sellerId: Id<"users">;
    containerStyle?: ViewStyle;
}
const ReviewComponent = ({ sellerId, containerStyle }: Props) => {
    const reviews = useQuery(api.reviews.getReviewsByUser, {
        userId: sellerId,
    });
    const styles = createStyles();
    if (!reviews) return <Text>Cargando reseñas...</Text>;

    return (
        <>
            {reviews.map((item) => (
                <Pressable key={item._id} style={[styles.card, containerStyle]}>
                    <View style={styles.frsb}>
                        <View style={styles.frcg}>
                            <Image source={{ uri: item.user.image }} style={styles.person} />
                            <Text
                                style={styles.reviewTitle}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item.user.fullname}
                            </Text>
                        </View>
                        <View style={styles.frcg}>
                            <Text style={styles.textBold}>{item.rating}</Text>
                            <FontAwesome
                                name="star"
                                size={scale(18)}
                                color={COLORS.star}
                            />
                        </View>
                    </View>
                    {renderPaddingBottom(5)}
                    <Text style={styles.text}>{item.comment}</Text>
                </Pressable>
            ))}
        </>
    );
};





export default ReviewComponent;
