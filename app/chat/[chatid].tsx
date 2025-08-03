import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator,  } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { scale } from '@/constants/scale';
import styles from '../chat/chats.styles';
import ChatInputBar from '@/components/Chats/ChatInputBar';
import ChatCard from '@/components/Chats/ChatCard';
import { ChevronLeft } from 'lucide-react-native';




const ChatPage = () => {
    const { chatid, Prod, text } = useLocalSearchParams();

    const [newMessage, setNewMessage] = useState( typeof text === 'string' ? text : Array.isArray(text) ? text[0] ?? '' : '' );
    const [selectedImage, setSelectedImage] = useState<Id<'_storage'> | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showProductBar, setShowProductBar] = useState(!!Prod);
    const listRef = useRef<FlatList>(null);

    const productId = useQuery(api.posts.getPostIdById, Prod ? { postId: Prod as Id<'posts'> } : 'skip');
    const imageUrl = useQuery(api.posts.getImageUrl, productId && productId.post?.storageId ? { storageId: productId.post.storageId } : 'skip');
    const generateUploadUrl = useMutation(api.mensajes.generateUploadUrl);
    const sendMessage = useMutation(api.mensajes.sendMessage);
    const messages = useQuery(api.mensajes.getMessages, { chatId: chatid as Id<'chats'> }) || [];
    const messagesSorted = [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    const chats = useQuery(api.chats.getChats);
    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
    const chat = chats?.find((c) => c._id === chatid);
    const isSeller = chat?.seller?._id === currentUser?._id;
    const otherUser = isSeller ? chat?.buyer : chat?.seller;



    function getMessagesWithDateSeparators(messages: any[]) {
        const result: any[] = [];
        let lastDate: string | null = null;

        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            const msgDate = new Date(msg.createdAt);
            const dayString = msgDate.toLocaleDateString();

            if (lastDate !== dayString) {
                result.unshift({
                    type: 'date',
                    id: `date-${dayString}`,
                    date: dayString,
                });
                lastDate = dayString;
            }
            result.unshift({ ...msg, type: 'message' });
        }

        return result;
    }
    const messagesWithSeparators = getMessagesWithDateSeparators(messagesSorted);


    const handleSendMessage = async () => {
        
        if (!newMessage.trim() && !selectedImage) return;

        try {
            await sendMessage({
                chatId: chatid as Id<'chats'>,
                content: newMessage,
                file: selectedImage || undefined,
                product: showProductBar ? productId?.post._id : undefined,
            });

            if (otherUser?.pushToken?.startsWith('ExponentPushToken')) {
                await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: otherUser.pushToken,
                        title: currentUser?.fullname || 'Nuevo mensaje',
                        body: selectedImage ? '📷 ' + newMessage : newMessage,
                    }),

                });
            }

            setNewMessage('');
            setSelectedImage(null);
            setImagePreview(null);
            if (showProductBar) setShowProductBar(false);
        } catch (err) {
            console.error('Error enviando mensaje o notificación:', err);
        } finally {
            setUploading(false);
        }
    };

    const captureImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
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
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.icon2}>
                        <ChevronLeft  size={30} color={'black'} strokeWidth={1.7}/>
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <Image source={{ uri: otherUser?.image || '' }} style={styles.image} />
                        <Text numberOfLines={1} style={styles.text}>
                            {otherUser?.fullname || 'Usuario Desconocido'}
                        </Text>
                       
                    </View>
                    <TouchableOpacity onPress={() => router.push({ pathname: '../product/Profile_2', params: { authorId: otherUser?._id }, })} style={styles.icon2}>
                        <Ionicons name="ellipsis-horizontal" size={25} color={'black'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.main}>
                    <FlatList
                        ref={listRef}
                        data={messagesWithSeparators}
                        showsVerticalScrollIndicator={false}
                        inverted={true}
                        keyExtractor={item =>
                            item.type === 'date' ? item.id : item._id.toString()
                        }
                        renderItem={({ item }) => {
                            if (item.type === 'date') {
                                return (
                                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                                        <Text style={styles.date}> {item.date} </Text>
                                    </View>
                                );
                            }
                            const isSelf = item.senderId === currentUser?._id;
                            const time = new Date(item.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            });
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
                />
            </KeyboardAvoidingView>


        </View>
    );
};

export default ChatPage;
