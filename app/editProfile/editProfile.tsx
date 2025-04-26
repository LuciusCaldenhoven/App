import { View, Text, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import  styles  from '../editProfile/editProfile.styles';
import { COLORS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { renderBorderBottom } from '@/constants/ui-utils';
import * as ImagePicker from "expo-image-picker";
import SingleList from '@/components/singleList/component';
import { scale } from '@/constants/scale';
import { BottomSheetFix } from '@/components/bottomSheetFix/bottomSheetFix';
import * as FileSystem from "expo-file-system";


const EditProfile = () => {
    const { currentUser } = useLocalSearchParams();

    const parsedUser = typeof currentUser === 'string' ? JSON.parse(currentUser) : currentUser;

    const [editedProfile, setEditedProfile] = useState({
        fullname: parsedUser?.fullname || "",
        image: parsedUser?.image || "",
    });

    const [activeBottomSheet, setActiveBottomSheet] = useState<string | null>(null); // Controla cuál BottomSheet está visible

    const updateProfile = useMutation(api.users.updateProfile);

    

    const generateUploadUrl = useMutation(api.posts.generateUploadUrl); // puedes moverlo a /users también
    

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Se requiere acceso a la galería para cambiar la foto de perfil.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;

            try {
                // 1. Obtener URL de subida desde Convex
                const uploadUrl = await generateUploadUrl();

                // 2. Subir la imagen usando FileSystem.uploadAsync
                const uploadResult = await FileSystem.uploadAsync(uploadUrl, newImageUri, {
                    httpMethod: "POST",
                    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
                    mimeType: "image/jpeg",
                });

              

                // 3. Obtener el storageId del resultado de la subida
                const { storageId } = JSON.parse(uploadResult.body);

                // 4. Actualizar el perfil del usuario con el storageId
                await updateProfile({
                    fullname: editedProfile.fullname,
                    storageId,
                });

                // 5. Obtener la URL pública para mostrarla de inmediato
                const imageUrl = `https://your-storage-service.com/${storageId}`; // Replace with your actual logic to generate the image URL
                setEditedProfile({ ...editedProfile, image: imageUrl });
            } catch (error) {
                console.error("Error al subir la imagen:", error);
                alert("Error al subir la imagen. Inténtalo de nuevo.");
            }
        }
    };


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <AntDesign name="arrowleft" size={25} />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <ScrollView contentContainerStyle={[styles.card]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
                    <View style={styles.cont}>
                        <Text style={styles.titleProfile}>Tu perfil</Text>
                        <Text style={styles.titleText}>
                            La informacion de tu perfil sera usada para ayudar a que los compradores te conozcan y confien en ti.
                        </Text>

                        {/* Mi nombre */}
                        <SingleList
                            component={<AntDesign name="user" size={scale(24)} color={COLORS.black} />}
                            text="Mi nombre"
                            onPress={() => setActiveBottomSheet("fullname")}
                        />
                        {activeBottomSheet === "fullname" && (
                            <BottomSheetFix
                                visible={activeBottomSheet === "fullname"}
                                setVisible={() => setActiveBottomSheet(null)}
                                title="¿Cómo quieres que te llamen?"
                                description="Este nombre se mostrará en tu perfil y en lo que publiques"

                                placeholder="Nombre completo"
                                OnPress={() => setActiveBottomSheet(null)}
                            />
                        )}

                        {/* Mi número */}
                        <SingleList
                            component={<AntDesign name="phone" size={scale(24)} color={COLORS.black} />}
                            text="Mi número"
                            onPress={() => setActiveBottomSheet("phone")}
                        />
                        {activeBottomSheet === "phone" && (
                            <BottomSheetFix
                                visible={activeBottomSheet === "phone"}
                                setVisible={() => setActiveBottomSheet(null)}
                                title="Tu número de contacto?"
                                description="Tu número les da seguridad a los que están interesados en tus productos."

                                placeholder="Número de teléfono"
                                OnPress={() => setActiveBottomSheet(null)}
                            />
                        )}

                        {/* Mi biografía */}
                        <SingleList
                            component={<AntDesign name="edit" size={scale(24)} color={COLORS.black} />}
                            text="Mi biografía"
                            onPress={() => setActiveBottomSheet("bio")}
                        />
                        {activeBottomSheet === "bio" && (
                            <BottomSheetFix
                                visible={activeBottomSheet === "bio"}
                                setVisible={() => setActiveBottomSheet(null)}
                                title="Cuéntanos algo sobre ti"
                                description="Agrega una pequeña bio para conectar mejor con otros compradores."

                                placeholder="Biografía"
                                OnPress={() => setActiveBottomSheet(null)}
                            />
                        )}

                        {/* Mi ubicación */}
                        <SingleList
                            component={<Feather name="map-pin" size={scale(24)} color={COLORS.black} />}
                            text="Mi ubicación"
                            onPress={() => setActiveBottomSheet("location")}
                        />
                        {activeBottomSheet === "location" && (
                            <BottomSheetFix
                                visible={activeBottomSheet === "location"}
                                setVisible={() => setActiveBottomSheet(null)}
                                title="¿Dónde te encuentras?"
                                description="Esto se mostrará en tus productos para que sepan desde dónde vendes."

                                placeholder="Ubicación"
                                OnPress={() => setActiveBottomSheet(null)}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
};

export default EditProfile;
