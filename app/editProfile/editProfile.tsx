import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import styles from '../editProfile/editProfile.styles';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { renderBorderBottom } from '@/constants/ui-utils';
import * as ImagePicker from 'expo-image-picker';
import { scale } from '@/constants/scale';
import * as FileSystem from 'expo-file-system';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import ReusableSheet from '@/components/ReusableSheet/ReusableSheet';
import { useAuth } from '@clerk/clerk-expo';
import { Id } from '@/convex/_generated/dataModel';

const EditProfile = () => {
    const { userId } = useAuth();
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

    const [editedProfile, setEditedProfile] = useState({
        fullname: currentUser?.fullname || '',
        phone: currentUser?.phone || '',
        bio: currentUser?.bio || '',
        image: currentUser?.image || '',
    });

    const updateProfile = useMutation(api.users.updateProfile);
    const generateUploadUrl = useMutation(api.posts.generateUploadUrl);

    const handleSave = async () => {
        try {
            const result = await updateProfile({
                fullname: editedProfile.fullname,
                phone: editedProfile.phone,
                bio: editedProfile.bio,
                ...(editedProfile.image.startsWith('http') ? {} : { storageId: editedProfile.image as Id<'_storage'> }),
            });

            if (result) {
                setEditedProfile({ ...editedProfile, image: result }); // Actualiza con URL pública
            }

            alert('Perfil actualizado correctamente.');
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            alert('Error al actualizar el perfil.');
        }
    };

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Se requiere acceso a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1,
        });

        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;

            try {
                const uploadUrl = await generateUploadUrl();
                const uploadResult = await FileSystem.uploadAsync(uploadUrl, newImageUri, {
                    httpMethod: "POST",
                    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
                    mimeType: "image/jpeg",
                });

                const { storageId } = JSON.parse(uploadResult.body);

                const newImageUrl = await updateProfile({
                    fullname: editedProfile.fullname,
                    storageId,
                });

                setEditedProfile({ ...editedProfile, image: newImageUrl });
            } catch (error) {
                console.error("Error subiendo imagen:", error);
                alert("No se pudo subir la imagen.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={25} />
                </TouchableOpacity>
            </View>


            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.card}>
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
                </View>

                <View style={styles.cont}>
                    <Text style={styles.titleProfile}>Tu perfil</Text>
                    <Text style={styles.titleText}>
                        La información de tu perfil será usada para ayudar a que los compradores te conozcan y confíen en ti.
                    </Text>

                    {/* Mi nombre */}
                    <ReusableSheet
                        icon={<AntDesign name="user" size={scale(24)} color={COLORS.black} />}
                        title="Mi nombre"
                        onSave={handleSave}
                    >
                        <Text style={styles.sheetTitle}>¿Cómo quieres que te llamen?</Text>
                        <Text style={styles.sheetDescription}>
                            Este nombre se mostrará en tu perfil y en lo que publiques.
                        </Text>
                        <BottomSheetTextInput
                            placeholder="Nombre completo"
                            placeholderTextColor={COLORS.main}
                            style={styles.inputField}
                            value={editedProfile.fullname}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, fullname: text })}

                        />
                    </ReusableSheet>


                    {/* Mi número */}
                    <ReusableSheet
                        icon={<AntDesign name="phone" size={scale(24)} color={COLORS.black} />}
                        title="Mi número"
                        onSave={handleSave}
                    >
                        <Text style={styles.sheetTitle}>Tu número de contacto</Text>
                        <Text style={styles.sheetDescription}>
                            Tu número les da seguridad a los que están interesados en tus productos.
                        </Text>
                        <BottomSheetTextInput
                            placeholder="Número de teléfono"
                            placeholderTextColor={COLORS.main}
                            style={styles.inputField}
                            keyboardType="phone-pad"
                            value={editedProfile.phone}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}

                        />
                    </ReusableSheet>

                    
                    <ReusableSheet
                        icon={<AntDesign name="edit" size={scale(24)} color={COLORS.black} />}
                        title="Mi biografía"
                        onSave={handleSave}
                    >
                        <Text style={styles.sheetTitle}>Cuéntanos algo sobre ti</Text>
                        <Text style={styles.sheetDescription}>
                            Agrega una pequeña bio para conectar mejor con otros compradores.
                        </Text>
                        <BottomSheetTextInput
                            placeholder="Biografía"
                            placeholderTextColor={COLORS.main}
                            style={[styles.inputField, { height: 100, textAlignVertical: 'top' }]}
                            multiline
                            value={editedProfile.bio}
                            onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}

                        />

                    </ReusableSheet>



                </View>
            </ScrollView>

        </View>
    );
};

export default EditProfile;
