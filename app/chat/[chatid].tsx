import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
import ChatCard from '@/components/chatCard/component';
import InputComponent from '@/components/input/component';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { scale } from '@/constants/scale';
import styles from '../chat/chats.styles'
const ChatPage = () => {
    const { chatid } = useLocalSearchParams(); // Obtener el ID del chat desde la URL
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const listRef = useRef<FlatList>(null);

    // Mutaciones y consultas
    const sendMessage = useMutation(api.mensajes.sendMessage);
    const messages = useQuery(api.mensajes.getMessages, { chatId: chatid as Id<'chats'> }) || [];
    const chats = useQuery(api.chats.getChats);
    // Desplazar automáticamente al final cuando se agregan nuevos mensajes
    useEffect(() => {
        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 300);
    }, [messages]);

    // Enviar un mensaje
    const handleSendMessage = async () => {
        Keyboard.dismiss();

        if (selectedImage) {
            setUploading(true);

            // Convertir URI a blob
            const response = await fetch(selectedImage);
            const blob = await response.blob();

            // Subir imagen al almacenamiento de Convex
            const fileId = await sendMessage({
                chatId: chatid as Id<'chats'>,
                content: newMessage,
                // file: blob, // Enviar el archivo como parte del mensaje
            });

            setSelectedImage(null);
            setNewMessage('');
            setUploading(false);
        } else {
            // Enviar mensaje de texto
            await sendMessage({
                chatId: chatid as Id<'chats'>,
                content: newMessage,
                file: undefined,
            });
            setNewMessage('');
        }
    };

    // Abrir el selector de imágenes
    const captureImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setSelectedImage(uri);
        }
    };
    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");
    const chat = chats?.find((c) => c._id === chatid);
    const isSeller = chat?.seller?._id === currentUser?._id;
    const otherUser = isSeller ? chat?.buyer : chat?.seller;


    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                {/* Lista de mensajes */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10, marginTop: 23, }}>
                        <Ionicons name="chevron-back" size={scale(28)} color={'black'} />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: otherUser?.image || 'https://via.placeholder.com/150' }}
                        style={styles.image} />
                    <Text numberOfLines={1} style={styles.text}> {otherUser?.fullname || "Usuario Desconocido"} </Text>

                </View>
                <View style={styles.main}>
                    <FlatList
                        ref={listRef}
                        data={messages}
                        inverted={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const isSelf = item.senderId === currentUser?._id; // Verificar si el mensaje es del usuario actual
                            const message = item.content; // Contenido del mensaje
                            const time = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', });
                            return <ChatCard message={message} time={time} isSelf={isSelf} />;
                        }}
                        keyExtractor={(item) => item._id.toString()}
                        
                    />
                </View>
                {/* Entrada de mensaje */}
                <View style={styles.sendMessageContainer}>
                    {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, margin: 10 }} />}
                    <View style={{ flexDirection: 'row' }}>
                        <InputComponent containerStyle={styles.sendInput} value={newMessage} onChangeText={setNewMessage} placeholder={'Envia un mensaje'} />
                        <TouchableOpacity onPress={captureImage} >
                            <Feather name="camera" size={scale(24)} color={COLORS.placeholder} style={styles.icon} />
                        </TouchableOpacity>
                        <MaterialIcons onPress={handleSendMessage} name="send" color={COLORS.placeholder} size={scale(24)} disabled={newMessage === ''} style={styles.icon} />
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Indicador de carga mientras se sube una imagen */}
            {uploading && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            )}
        </View>
    );
};


export default ChatPage;