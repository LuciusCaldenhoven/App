import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStyles } from '@/components/singleItem/singleItem.styles';
import { Id } from '@/convex/_generated/dataModel';
import { router } from 'expo-router';

import { Image } from 'expo-image';
import { format, formatDistanceToNow, isThisWeek, isThisYear, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface ISingleItemProps {
  chat: {
    _id: Id<"chats">;
    buyer: {
      _id: Id<"users"> | null;
      fullname: string;
      image: string | null;
      pushToken: string | null;
    };
    seller: {
      _id: Id<"users"> | null;
      fullname: string;
      image: string | null;
      pushToken: string | null;
    };
    _creationTime: number;
    lastMessage?: string | undefined;
    badge?: number;
    lastTime?: number;
  };
  currentUserId: Id<"users">;
}

const SingleItem = ({ chat, currentUserId }: ISingleItemProps) => {

  const isSeller = chat.seller._id === currentUserId;
  const otherUser = isSeller ? chat.buyer : chat.seller;

  const bool = !!(chat.badge && chat.badge > 0); // Corrige la lógica aquí
  const styles = createStyles(bool);

  function formatearFechaMensaje(timestamp: number): string {
    const fecha = new Date(timestamp);

    if (isToday(fecha)) {
      return format(fecha, 'HH:mm'); // 24h, ej: 14:23
    } else if (isThisWeek(fecha, { weekStartsOn: 1 })) {
      return format(fecha, 'EEEE', { locale: es }); // ej: martes
    } else if (isThisYear(fecha)) {
      return format(fecha, 'dd/MM'); // ej: 05/06
    } else {
      return format(fecha, 'dd/MM/yyyy'); // ej: 05/06/2023
    }
  }




  return (

    <TouchableOpacity style={styles.singleItem} onPress={() => router.push({ pathname: "/chat/[chatid]", params: { chatid: chat._id } })}>
      {/* Imagen del otro usuario */}
      <Image
        source={{ uri: otherUser?.image || 'https://via.placeholder.com/150' }}
        style={styles.person}
        cachePolicy="memory"
      />

      {/* Información del mensaje */}
      <View style={styles.messageContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {otherUser?.fullname || "Usuario Desconocido"}
        </Text>
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
        {chat.lastTime && (
          <Text style={styles.time}>
            {formatearFechaMensaje(chat.lastTime || 0)}
          </Text>
        )}


      </View>
    </TouchableOpacity>
  );
};

export default SingleItem;