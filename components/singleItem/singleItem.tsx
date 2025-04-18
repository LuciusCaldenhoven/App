import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStyles } from '@/components/singleItem/message.styles';
import { Id } from '@/convex/_generated/dataModel';

interface ISingleItemProps {
  chat: {
    _id: Id<"chats">;
    buyer: {
      _id: Id<"users"> | null;
      fullname: string;
      image: string | null;
    };
    seller: {
      _id: Id<"users"> | null;
      fullname: string;
      image: string | null;
    };
    _creationTime: number;
    lastMessage?: string | undefined;
    badge?: number;
    lastTime?: number;
  };
}

const SingleItem = ({ chat }: ISingleItemProps) => {
  const bool = !!(chat.badge && chat.badge > 0); // Corrige la lógica aquí
  const styles = createStyles(bool);

  return (
    <TouchableOpacity style={styles.singleItem}>
      {/* Imagen del vendedor */}
      <Image
        source={{ uri: chat.seller.image || 'https://via.placeholder.com/150' }}
        style={styles.person}
      />

      {/* Información del mensaje */}
      <View style={styles.messageContainer}>
        <Text numberOfLines={1} style={styles.name}>{chat.seller.fullname || "Vendedor Desconocido"}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.message}>
          {chat.lastMessage || "Sin mensajes aún"}
        </Text>
      </View>

      {/* Información adicional */}
      <View style={styles.timeContainer}>
        {bool && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{chat.badge}</Text>
          </View>
        )}
        <Text style={styles.time}>
            {new Date(chat.lastTime || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SingleItem;