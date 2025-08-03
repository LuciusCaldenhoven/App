import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { renderMarginBottom } from '@/constants/ui-utils';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ImageView from "react-native-image-viewing";
import { scale } from '@/constants/scale';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';

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

return (
  <View style={styles.cardWrapper}>
    <View style={styles.card}>

      {/* PRODUCT BAR */}
      {exists === true && productData?.post && (
        <TouchableOpacity style={styles.productBar} onPress={() => router.push(`/product/${productData.post._id}`)}>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          )}
          <View>
            <Text style={styles.productTitle}>{productData.post.title}</Text>
            {productData.post.price && (
              <Text style={styles.productPrice}>${productData.post.price}.00</Text>
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* PRODUCTO ELIMINADO */}
      {exists === false && (
        <View style={styles.productBar}>
          <Text style={styles.productTitle}>Producto eliminado</Text>
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

    <Text style={styles.timestamp}>{time}</Text>
  </View>
);

};

export default ChatCard;

const createStyles = (isSelf: boolean) => StyleSheet.create({
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
  },
  productBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#f3f4f7',
    padding: 5,
    borderRadius: scale(9),
    borderColor: '#dbeafe',
    maxWidth: scale(270),
  },
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginRight: 8,
  },
  productTitle: {
    fontFamily: 'Medium',
    fontSize: 13,
    color: '#222',
  },
  productPrice: {
    color: COLORS.main,
    fontSize: 13,
    fontFamily: 'SemiBold',
  },
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
