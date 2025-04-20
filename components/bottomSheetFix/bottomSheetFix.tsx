import { Modal, Pressable, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { IbottomSheetFixProps } from './bottomSheetFix.props';
import styles from './bottomSheetFix.styles';
import Button from '../button/component';
import InputComponent from '../input/component';
import { MaterialIcons } from '@expo/vector-icons';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';
import { useState } from 'react';

export const BottomSheetFix = ({
    visible,
    setVisible,
    OnPress,
    title,
    description,
    placeholder,
}: IbottomSheetFixProps) => {
    const [inputValue, setInputValue] = useState(""); // Estado para almacenar el valor del campo de entrada

    return (
        <Modal
            presentationStyle="overFullScreen"
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <Pressable onPress={() => setVisible(false)} style={styles.dim} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Mueve todo el modal
                style={styles.modalOverlay}
            >
                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <View style={{ marginBottom: 30 }}>
                        <InputComponent
                            leftAction={
                                <MaterialIcons
                                    name="person-outline"
                                    size={scale(22)}
                                    color={COLORS.placeholder}
                                />
                            }
                            placeholder={placeholder}
                            onChangeText={(text) => setInputValue(text)} // Actualiza el estado con el valor ingresado
                        />
                    </View>
                </View>
                <Button
                    textStyles={{ fontFamily: 'Regular' }}
                    buttonStyles={styles.buttonStyles}
                    text="Guardar"
                    onPress={() => OnPress(inputValue)} // Pasa el valor ingresado al OnPress
                />
            </KeyboardAvoidingView>
        </Modal>
    );
};