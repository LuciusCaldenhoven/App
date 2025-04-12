import { View, Text, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { styles } from '../editProfile/editProfile.styles';
import { COLORS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { renderBorderBottom } from '@/constants/ui-utils';
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
    const { currentUser } = useLocalSearchParams(); 

    const parsedUser = typeof currentUser === 'string' ? JSON.parse(currentUser) : currentUser;

    const [editedProfile, setEditedProfile] = useState({
        fullname: parsedUser?.fullname || "",
        image: parsedUser?.image || "",
    });

    const updateProfile = useMutation(api.users.updateProfile);

    const handleSaveProfile = async () => {
        await updateProfile({
            fullname: editedProfile.fullname,
            image: editedProfile.image, // Incluye la imagen si se ha cambiado
        });
    };

    const handlePickImage = async () => {
        // Solicitar permisos para acceder a la galería
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Se requiere acceso a la galería para cambiar la foto de perfil.");
            return;
        }

        // Abrir la galería para seleccionar una imagen
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Mantener la imagen cuadrada
            quality: 1, // Calidad máxima
        });

        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;
    
            // Actualizar el estado local
            setEditedProfile({ ...editedProfile, image: newImageUri });
    
            // Llamar a la mutación para actualizar la imagen en la base de datos
            await updateProfile({
                fullname: editedProfile.fullname,
                image: newImageUri, // Enviar la nueva URI de la imagen
            });
        }
    };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <AntDesign name="arrowleft" size={25} />
                    </TouchableOpacity>

                    <Text style={styles.text} >Editar</Text>
                </View>

                <ScrollView
                    contentContainerStyle={[styles.card]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: editedProfile.image }} style={styles.avatar} />
                        <TouchableOpacity style={styles.addButton} onPress={handlePickImage}>
                            <View style={styles.addButtonContent}>
                                <Entypo name="camera" size={15} color={COLORS.black} />
                                <Text style={styles.addButtonText}>Cambiar</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>{editedProfile.fullname}</Text>
                    {renderBorderBottom(10)}
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
};

export default EditProfile;
