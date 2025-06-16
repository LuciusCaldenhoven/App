import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
import ChatCard from '@/components/chatCard/component';
import { Ionicons } from '@expo/vector-icons';
import { Paperclip, Send } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { scale } from '@/constants/scale';
import styles from '../chat/chats.styles';

import LoaderChats from '@/components/loaders/loaderChats';

const ChatPage = () => {
    const { chatid } = useLocalSearchParams();
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<Id<'_storage'> | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const listRef = useRef<FlatList>(null);

    const generateUploadUrl = useMutation(api.mensajes.generateUploadUrl);
    const sendMessage = useMutation(api.mensajes.sendMessage);
    const messages = useQuery(api.mensajes.getMessages, { chatId: chatid as Id<'chats'> }) || [];
    const chats = useQuery(api.chats.getChats);
    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
    const chat = chats?.find((c) => c._id === chatid);
    const isSeller = chat?.seller?._id === currentUser?._id;
    const otherUser = isSeller ? chat?.buyer : chat?.seller;
    const posts = useQuery(api.posts.getPostsByUser, otherUser?._id ? { userId: otherUser._id } : 'skip');

    const [showBottomSheet, setShowBottomSheet] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 300);

        return () => clearTimeout(timeout);
    }, [messages]);

    useEffect(() => {
        const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                listRef.current?.scrollToEnd({ animated: true });
            }, 200);
        });

        return () => keyboardDidShow.remove();
    }, []);

    const handleSendMessage = async () => {
        
        if (!newMessage.trim() && !selectedImage) return;

        try {
            await sendMessage({
                chatId: chatid as Id<'chats'>,
                content: newMessage,
                file: selectedImage || undefined,
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
        } catch (err) {
            console.error('Error enviando mensaje o notificación:', err);
        } finally {
            setUploading(false);
        }
    };

    const captureImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: false,
        });

        if (!result.canceled) {
            try {
                setUploading(true);
                const uri = result.assets[0].uri;
                setImagePreview(uri); // ✅ para mostrar

                const response = await fetch(uri);
                const blob = await response.blob();

                const uploadUrl = await generateUploadUrl();
                const uploadResponse = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': blob.type || 'image/jpeg' },
                    body: blob,
                });

                const { storageId } = await uploadResponse.json();
                setSelectedImage(storageId); // ✅ para guardar
            } catch (err) {
                console.error('Error subiendo imagen:', err);
            } finally {
                setUploading(false);
            }
        }
    };

    if (!currentUser || !chats || !messages) {
        return <LoaderChats />;
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10, marginTop: 23 }}>
                        <Ionicons name="chevron-back" size={scale(28)} color={'black'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.headerContent}
                        onPress={() => setShowBottomSheet(true)}
                    >
                        <Image source={{ uri: otherUser?.image || '' }} style={styles.image} />
                        <Text numberOfLines={1} style={styles.text}>
                            {otherUser?.fullname || 'Usuario Desconocido'}
                        </Text>
                        <Ionicons
                            name="information-circle-outline"
                            size={scale(28)}
                            color={'grey'}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.main}>
                    <FlatList
                        ref={listRef}
                        data={messages}
                        inverted={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
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
                                />
                            );
                        }}
                        keyExtractor={(item) => item._id.toString()}
                    />
                </View>

                <View style={styles.sendMessageContainer}>
                    {imagePreview && (
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: imagePreview }} style={styles.previewImage} />
                            <TouchableOpacity onPress={() => {
                                setImagePreview(null);
                                setSelectedImage(null);
                            }} style={styles.previewCloseButton}>
                                <Text style={styles.previewCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.inputRow}>
                        <View style={styles.inputBox}>
                            <TouchableOpacity onPress={captureImage}>
                                <Paperclip size={scale(20)} color="#555" style={{ marginHorizontal: 10 }} />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.textInput}
                                value={newMessage}
                                onChangeText={setNewMessage}
                                placeholder="Escriba su mensaje"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSendMessage}
                            disabled={!newMessage.trim() && !selectedImage}
                            style={[
                                styles.sendButton,
                                { backgroundColor: newMessage.trim() || selectedImage ? '#B5F344' : '#ccc' },
                            ]}
                        >
                            <View style={{ marginRight: 2 }}>
                                <Send size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {uploading && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', },]} >
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            )}


        </View>
    );
};

export default ChatPage;
