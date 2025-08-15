// ChatPage.tsx
import { View, Text, TouchableOpacity, FlatList, Image, Platform, Keyboard, Animated } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import styles from '../chat/chats.styles';
import ChatInputBar from '@/components/Chats/ChatInputBar';
import ChatCard from '@/components/Chats/ChatCard';
import { ChevronLeft } from 'lucide-react-native';
import { Easing } from 'react-native';


const ChatPage = () => {
  const { chatid, Prod, text } = useLocalSearchParams();

  const [newMessage, setNewMessage] = useState(
    typeof text === 'string' ? text : Array.isArray(text) ? text[0] ?? '' : ''
  );
  const [selectedImage, setSelectedImage] = useState<Id<'_storage'> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showProductBar, setShowProductBar] = useState(!!Prod);

  // optimista + control envío
  const [isSending, setIsSending] = useState(false);
  const [optimistic, setOptimistic] = useState<any[]>([]);
  const lastSendRef = useRef(0);
  const KEYBOARD_ANIM_MS = 2500;
  // --- AUTOSCROLL ---
  const listRef = useRef<FlatList>(null);
  const stickToBottomRef = useRef(false);
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, []);

  // --- ANIMACIÓN DE TECLADO (suave) ---
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
  Animated.timing(keyboardOffset, {
    toValue: e?.endCoordinates?.height ?? 0,
    duration: e?.duration ?? KEYBOARD_ANIM_MS,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  }).start();
};
const onHide = (e: any) => {
  Animated.timing(keyboardOffset, {
    toValue: 0,
    duration: e?.duration ?? KEYBOARD_ANIM_MS,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false,
  }).start();
};


    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [keyboardOffset]);

  const productId = useQuery(api.posts.getPostIdById, Prod ? { postId: Prod as Id<'posts'> } : 'skip');
  const imageUrl = useQuery(
    api.posts.getImageUrl,
    productId && productId.post?.storageId ? { storageId: productId.post.storageId } : 'skip'
  );
  const generateUploadUrl = useMutation(api.mensajes.generateUploadUrl);
  const sendMessage = useMutation(api.mensajes.sendMessage);
  const messages = useQuery(api.mensajes.getMessages, { chatId: chatid as Id<'chats'> }) || [];

  const chats = useQuery(api.chats.getChats);
  const { userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
  const chat = chats?.find((c) => c._id === chatid);
  const isSeller = chat?.seller?._id === currentUser?._id;
  const otherUser = isSeller ? chat?.buyer : chat?.seller;

  const messagesSorted = useMemo(
    () => [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [messages]
  );

  // dedup optimistas cuando llega el real
  const combinedMessages = useMemo(() => {
    const dedupedOptimistic = optimistic.filter((o) => {
      return !messagesSorted.some((m) => {
        const closeInTime =
          Math.abs(new Date(m.createdAt).getTime() - new Date(o.createdAt).getTime()) < 30_000;
        return m.senderId === o.senderId && m.content === o.content && closeInTime;
      });
    });
    return [...dedupedOptimistic, ...messagesSorted];
  }, [messagesSorted, optimistic]);

  const getMessagesWithDateSeparators = useCallback((arr: any[]) => {
    const result: any[] = [];
    let lastDate: string | null = null;

    for (let i = arr.length - 1; i >= 0; i--) {
      const msg = arr[i];
      const msgDate = new Date(msg.createdAt);
      const dayString = msgDate.toLocaleDateString();

      if (lastDate !== dayString) {
        result.unshift({ type: 'date', id: `date-${dayString}`, date: dayString });
        lastDate = dayString;
      }
      result.unshift({ ...msg, type: 'message' });
    }
    return result;
  }, []);

  const messagesWithSeparators = useMemo(
    () => getMessagesWithDateSeparators(combinedMessages),
    [combinedMessages, getMessagesWithDateSeparators]
  );

  const handleSendMessage = useCallback(async () => {
    if (isSending || uploading) return;

    const trimmed = newMessage.trim();
    if (!trimmed && !selectedImage) return;

    const nowMs = Date.now();
    if (nowMs - lastSendRef.current < 600) return; // throttle
    lastSendRef.current = nowMs;

    // optimista
    const tempId = `temp-${nowMs}`;
    const optimisticMsg = {
      _id: tempId,
      createdAt: new Date().toISOString(),
      content: trimmed,
      file: selectedImage || undefined,
      senderId: currentUser?._id,
      product: showProductBar ? productId?.post._id : undefined,
    };

    setIsSending(true);
    setOptimistic((prev) => [optimisticMsg, ...prev]);
    setNewMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    if (showProductBar) setShowProductBar(false);

    // autoscroll al fondo
    stickToBottomRef.current = true;
    scrollToBottom();

    try {
      await sendMessage({
        chatId: chatid as Id<'chats'>,
        content: trimmed,
        file: optimisticMsg.file,
        product: optimisticMsg.product,
      });

      if (otherUser?.pushToken?.startsWith('ExponentPushToken')) {
        fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: otherUser.pushToken,
            title: currentUser?.fullname || 'Nuevo mensaje',
            body: optimisticMsg.file ? '📷 ' + trimmed : trimmed,
          }),
        }).catch(() => {});
      }

      setTimeout(() => {
        setOptimistic((prev) => prev.filter((m) => m._id !== tempId));
      }, 5000);
    } catch (err) {
      console.error('Error enviando mensaje o notificación:', err);
      setOptimistic((prev) => prev.filter((m) => m._id !== tempId));
      setNewMessage(trimmed);
      if (optimisticMsg.file) setSelectedImage(optimisticMsg.file);
    } finally {
      setIsSending(false);
    }
  }, [
    isSending,
    uploading,
    newMessage,
    selectedImage,
    currentUser?._id,
    showProductBar,
    productId?.post?._id,
    sendMessage,
    chatid,
    otherUser?.pushToken,
    currentUser?.fullname,
    scrollToBottom,
  ]);


  const captureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        const uri = result.assets[0].uri;
        setImagePreview(uri);

        const response = await fetch(uri);
        const blob = await response.blob();

        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': blob.type || 'image/jpeg' },
          body: blob,
        });

        const { storageId } = await uploadResponse.json();
        setSelectedImage(storageId);
      } catch (err) {
        console.error('Error subiendo imagen:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.icon2}>
          <ChevronLeft size={30} color={'black'} strokeWidth={1.7} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image source={{ uri: otherUser?.image || '' }} style={styles.image} />
          <Text numberOfLines={1} style={styles.text}>
            {otherUser?.fullname || 'Usuario Desconocido'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '../product/Profile_2', params: { authorId: otherUser?._id } })}
          style={styles.icon2}
        >
          <Ionicons name="ellipsis-horizontal" size={25} color={'black'} />
        </TouchableOpacity>
      </View>

      {/* Chat list */}
      <View style={styles.main}>
        <FlatList
          ref={listRef}
          data={messagesWithSeparators}
          inverted
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => (item.type === 'date' ? item.id : String(item._id))}
          windowSize={7}
          initialNumToRender={20}
          maxToRenderPerBatch={12}
          removeClippedSubviews
          maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: 20 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            if (stickToBottomRef.current) {
              scrollToBottom();
              stickToBottomRef.current = false;
            }
          }}
          renderItem={({ item }: any) => {
            if (item.type === 'date') {
              return (
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <Text style={styles.date}> {item.date} </Text>
                </View>
              );
            }
            const isSelf = item.senderId === currentUser?._id;
            const time = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <ChatCard
                message={item.content}
                time={time}
                isSelf={isSelf}
                file={item.file}
                product={item.product}
              />
            );
          }}
        />
      </View>

      {/* Barra de input con desplazamiento animado */}
      <Animated.View style={{ paddingBottom: keyboardOffset }}>
        <ChatInputBar
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          showProductBar={showProductBar}
          setShowProductBar={setShowProductBar}
          productId={productId}
          imageUrl={imageUrl}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          captureImage={captureImage}
          handleSendMessage={handleSendMessage}
          isSending={isSending}
          uploading={uploading}
        />
      </Animated.View>
    </View>
  );
};

export default ChatPage;
