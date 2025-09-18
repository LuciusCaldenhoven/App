import { View, Text, Pressable, Alert, Platform } from 'react-native';
import React, { useMemo } from 'react';
import { createStyles } from '@/components/singleItem/singleItem.styles';
import { Id } from '@/convex/_generated/dataModel';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { format, isThisWeek, isThisYear, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface ISingleItemProps {
  chat: {
    _id: Id<"chats">;
    buyer: { _id: Id<"users"> | null; fullname: string; image: string | null; pushToken: string | null; };
    seller: { _id: Id<"users"> | null; fullname: string; image: string | null; pushToken: string | null; };
    _creationTime: number;
    lastMessage?: string | undefined;
    badge?: number;
    lastTime?: number;
  };
  currentUserId: Id<"users">;
  onDeleteChat?: (chatId: Id<"chats">) => void;
  showSeparator?: boolean;
}

const SingleItem = ({ chat, currentUserId, onDeleteChat, showSeparator = true }: ISingleItemProps) => {
  const isSeller = chat.seller._id === currentUserId;
  const otherUser = isSeller ? chat.buyer : chat.seller;

  const unread = !!(chat.badge && chat.badge > 0);
  const styles = useMemo(() => createStyles(unread), [unread]);

  const formatearFechaMensaje = (timestamp?: number): string => {
    if (!timestamp) return '';
    const fecha = new Date(timestamp);
    if (isToday(fecha)) return format(fecha, 'HH:mm', { locale: es });
    if (isThisWeek(fecha, { weekStartsOn: 1 })) return format(fecha, 'EEE', { locale: es });
    if (isThisYear(fecha)) return format(fecha, 'dd/MM', { locale: es });
    return format(fecha, 'dd/MM/yy', { locale: es });
  };

  const lastMsgText = useMemo(() => {
    const raw = chat.lastMessage?.trim() || 'Sin mensajes aún';
    const looksLikeImage = raw.startsWith('📷') || /imagen|photo|foto/i.test(raw);
    return looksLikeImage ? `📷 ${raw.replace(/^📷\s?/, '')}` : raw;
  }, [chat.lastMessage]);

  const handleLongPress = () => {
    Alert.alert(
      'Eliminar chat',
      `¿Quieres eliminar la conversación con "${otherUser?.fullname || 'Usuario'}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDeleteChat?.(chat._id) },
      ]
    );
  };

  return (
    <View style={styles.rowWrapper}>
      <Pressable
        onPress={() => router.push({ pathname: "/chat/[chatid]", params: { chatid: chat._id } })}
        onLongPress={handleLongPress}
        delayLongPress={Platform.select({ ios: 300, android: 350 })}
        style={({ pressed }) => [styles.singleItem, pressed && styles.pressed]}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        hitSlop={8}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: otherUser?.image || 'https://via.placeholder.com/150' }}
            style={styles.person}
            cachePolicy="memory"
          />
        </View>

        {/* Centro: Nombre + mensaje */}
        <View style={styles.messageContainer}>
          <Text numberOfLines={1} style={[styles.name, unread && styles.nameUnread]}>
            {otherUser?.fullname || "Usuario Desconocido"}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.message, unread && styles.messageUnread]}>
            {lastMsgText}
          </Text>
        </View>

        {/* Derecha: hora + badge */}
        <View style={styles.timeContainer}>
          {chat.lastTime ? (
            <Text style={[styles.time, unread && styles.timeUnread]}>
              {formatearFechaMensaje(chat.lastTime)}
            </Text>
          ) : <View style={{ height: 18 }} />}

          {unread ? (
            <View style={styles.badge}>
            
            </View>
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>
      </Pressable>

      {showSeparator && <View style={styles.separator} />}
    </View>
  );
};

export default SingleItem;
