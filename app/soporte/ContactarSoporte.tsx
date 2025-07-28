import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, StatusBar, Platform, } from 'react-native';
import { Mail, MessageCircle, FileText } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function ContactarSoporteScreen() {
    const handleEmailPress = () => {
        Linking.openURL('mailto:soporte@diuna.com').catch(() =>
            Alert.alert('Error', 'No se pudo abrir el cliente de correo.')
        );
    };

    const handleChatPress = () => {
        Toast.show({
            type: "warning",
            position: "top",
            visibilityTime: 3000,
            text1: `Próximamente`,
            text2: "El chat en la app estará disponible en una futura versión.",
        });
    };

    const handleFormPress = () => {
        Toast.show({
            type: "warning",
            position: "top",
            visibilityTime: 3000,
            text1: `Próximamente`,
            text2: "Estamos trabajando en un formulario de contacto.",
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} >
                <Ionicons name="chevron-back" size={26} color={COLORS.black} style={{ paddingBottom: 20 }} />
            </TouchableOpacity>
            <Text style={styles.title}>Contactar Soporte</Text>
            <Text style={styles.subtitle}>
                ¿Necesitas ayuda? Elige la forma que prefieras para comunicarte con nuestro equipo.
            </Text>

            <TouchableOpacity style={styles.option} onPress={handleEmailPress}>
                <Mail color="#333" size={24} />
                <View style={styles.textBox}>
                    <Text style={styles.optionTitle}>Correo electrónico</Text>
                    <Text style={styles.optionText}>soporte@diuna.com</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleChatPress}>
                <MessageCircle color="#333" size={24} />
                <View style={styles.textBox}>
                    <Text style={styles.optionTitle}>Chat en la app</Text>
                    <Text style={[styles.optionText, { color: '#2563EB' }]}>
                        Chatea con nosotros en tiempo real
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleFormPress}>
                <FileText color="#333" size={24} />
                <View style={styles.textBox}>
                    <Text style={styles.optionTitle}>Formulario de contacto</Text>
                    <Text style={[styles.optionText, { color: '#2563EB' }]}>
                        Envíanos una solicitud de asistencia
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 80,
    },
    title: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        marginBottom: 15,

    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        fontFamily: 'Regular'
    },
    option: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 28,
    },
    textBox: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
        fontFamily: 'Regular'
    },
    optionText: {
        fontSize: 14,
        color: '#444',
    },
});
