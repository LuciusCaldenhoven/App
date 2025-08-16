import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ImageView from 'react-native-image-viewing';
import { scale } from '@/constants/scale';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';

interface IChatCardProps {
  isSelf: boolean;
  message?: string;
  time?: string;
  file?: string;
  product?: Id<'posts'>;
}

const ChatCard = ({ isSelf = false, message = '', time, file, product }: IChatCardProps) => {
  const styles = createStyles(isSelf);

  const exists = useQuery(api.posts.existsPost, product ? { postId: product } : 'skip');
  const productData = useQuery(api.posts.getPostIdById, exists && product ? { postId: product } : 'skip');
  const imageUrl = useQuery(
    api.posts.getImageUrl,
    exists && productData?.post?.storageId ? { storageId: productData.post.storageId } : 'skip'
  );

  const [visible, setIsVisible] = useState(false);

  const priceLabel =
    productData?.post?.price != null ? `$${productData.post.price}.00` : undefined;

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        {/* PRODUCT CARD */}
        {exists === true && productData?.post && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.productCard}
            onPress={() => router.push(`/product/${productData.post._id}`)}
          >
            {/* Thumb */}
            <Image
              source={{ uri: imageUrl || undefined }}
              style={styles.productThumb}
            />

            {/* Info */}
            <View style={styles.productInfo}>
              <Text numberOfLines={2} style={styles.productTitle}>
                {productData.post.title}
              </Text>

              <View style={styles.productMetaRow}>
                {priceLabel && (
                  <View style={styles.priceChip}>
                    <Text style={styles.priceChipText}>{priceLabel}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Arrow */}
            <View style={styles.arrowWrap}>
              <ChevronRight size={18} color={'#111'} />
            </View>
          </TouchableOpacity>
        )}

        {/* PRODUCTO ELIMINADO */}
        {exists === false && (
          <View style={styles.deletedCard}>
            <Text style={styles.deletedText}>Producto eliminado</Text>
          </View>
        )}

        {/* MENSAJE */}
        {message !== '' && <Text style={styles.messageText}>{message}</Text>}

        {/* IMAGEN ADJUNTA */}
        {file && (
          <View>
            <TouchableOpacity activeOpacity={1} onPress={() => setIsVisible(true)}>
              <Image source={{ uri: file }} style={styles.messageImage} />
            </TouchableOpacity>
            <ImageView
              images={[{ uri: file }]}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          </View>
        )}
      </View>

      {!!time && <Text style={styles.timestamp}>{time}</Text>}
    </View>
  );
};

export default ChatCard;

const createStyles = (isSelf: boolean) =>
  StyleSheet.create({
    cardWrapper: {
      marginVertical: 2,
      flexDirection: 'column',
      alignItems: 'flex-end',
      maxWidth: '100%',
    },
    card: {
      backgroundColor: isSelf ? '#403c3c' : '#F5F5F5',
      paddingVertical: scale(12),
      paddingHorizontal: scale(12),
      borderRadius: scale(18),
      borderBottomRightRadius: isSelf ? 0 : scale(18),
      borderBottomLeftRadius: !isSelf ? 0 : scale(18),
      minWidth: scale(50),
      maxWidth: scale(270),
      alignSelf: isSelf ? 'flex-end' : 'flex-start',
      marginTop: 10,
      marginHorizontal: 10,
      marginBottom: 3,
      // sombra sutil
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },

    /** ---------- PRODUCT STYLES (mejorado) ---------- */
    productCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      backgroundColor: '#FFFFFF',
      borderRadius: scale(12),
      padding: scale(8),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
      width: scale(220),
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
      marginBottom: 6,
    },
    productThumb: {
      width: scale(56),
      height: scale(56),
      borderRadius: scale(10),
      backgroundColor: '#F3F4F6',
    },
    productInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    productTitle: {
      fontFamily: 'Medium',
      fontSize: 14,
      color: '#111827',
      lineHeight: 18,
    },
    productMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
      marginTop: 6,
    },
    priceChip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: '#F0F6D9', // tono suave del verde principal
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E3EDC1',
      alignSelf: 'flex-start',
    },
    priceChipText: {
      fontFamily: 'SemiBold',
      fontSize: 12,
      color: COLORS.main, // mantiene tu color de marca
    },
    arrowWrap: {
      width: scale(28),
      height: scale(28),
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F3F4F6',
    },

    /** ---------- ELIMINADO ---------- */
    deletedCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      borderRadius: scale(12),
      paddingVertical: scale(10),
      paddingHorizontal: scale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#E5E7EB',
      marginBottom: 6,
    },
    deletedText: {
      fontFamily: 'Medium',
      fontSize: 13,
      color: '#9CA3AF',
    },

    /** ---------- MENSAJE & TIMESTAMP ---------- */
    messageText: {
      fontSize: 15,
      flexWrap: 'wrap',
      color: isSelf ? '#fff' : '#222',
      fontFamily: 'light',
    },
    messageImage: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginTop: 6,
      alignSelf: 'flex-start',
    },
    timestamp: {
      fontSize: 12,
      color: '#c7c7c7',
      alignSelf: isSelf ? 'flex-end' : 'flex-start',
      marginHorizontal: 18,
      marginTop: 2,
    },
  });
