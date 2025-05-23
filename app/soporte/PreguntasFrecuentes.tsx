import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, LayoutAnimation, Platform, UIManager, StyleSheet, StatusBar, } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const faqs = [
    {
        id: '1',
        question: 'Nos hacemos responsable por las transacciones?',
        answer:
            'No. ReVende es una plataforma de conexión entre personas. No participamos ni garantizamos los pagos ni entregas. Te recomendamos reunirte en lugares públicos y verificar los productos antes de concretar una compra.',
    },
    {
        id: '2',
        question: 'Puedo pagar directamente desde la app?',
        answer:
            'Por ahora no. Las transacciones se realizan fuera de la app. Sin embargo, estamos trabajando para integrar pagos seguros en futuras versiones y hacer que comprar y vender sea más confiable para todos.',
    },
    {
        id: '3',
        question: 'Qué pasa si alguien no responde mis mensajes?',
        answer:
            'Cada usuario decide con quién conversar o cerrar tratos. Si alguien no responde, probablemente ya no esté interesado o haya cerrado la venta. Te recomendamos seguir buscando otras opciones similares.',
    },
    {
        id: '4',
        question: 'Cómo puedo destacar mi publicación?',
        answer:
            'Actualmente todas las publicaciones se muestran por igual, pero estamos evaluando ofrecer funciones premium como destacar productos o aparecer en búsquedas priorizadas.',
    },
    {
        id: '5',
        question: 'Qué tipo de productos o servicios no están permitidos?',
        answer:
            'No se permite publicar armas, sustancias ilegales, productos falsificados, ni servicios que violen nuestras políticas. Si detectamos contenido inapropiado, lo eliminaremos y podríamos suspender cuentas.',
    },
    {
        id: '6',
        question: 'Qué pasa si alquilo algo y no me lo devuelven?',
        answer:
            'Te recomendamos conversar claramente antes de concretar un alquiler. Por ahora, ReVende no interviene ni actúa como intermediario. Más adelante podríamos añadir garantías o contratos digitales.',
    },
];


export default function FaqScreen() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        
        <ScrollView style={styles.container}>


            <TouchableOpacity onPress={() => router.back()} >
                <Ionicons name="chevron-back" size={26} color={COLORS.black} style={{paddingBottom: 20}} />
            </TouchableOpacity>

            <View style={{paddingHorizontal:10}}>
                <Text style={styles.title}>Preguntas frecuentes</Text>

                {faqs.map((faq) => (
                <View key={faq.id} style={styles.item}>
                    <TouchableOpacity onPress={() => toggleExpand(faq.id)} style={styles.questionRow}>
                        <Text style={styles.questionText}>{faq.question}</Text>
                        {expandedId === faq.id ? (
                            <ChevronUp size={18} color="gray" />
                        ) : (
                            <ChevronDown size={18} color="gray" />
                        )}
                    </TouchableOpacity>
                    {expandedId === faq.id && (
                        <Text style={styles.answerText}>{faq.answer}</Text>
                    )}
                </View>
            ))}
            </View>
            

            

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 80,
    },
    title: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        marginBottom: 15,

    },
    searchInput: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 20,
        fontSize: 14,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    item: {
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        paddingVertical: 15,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 15,
        fontFamily: 'Medium',
        flex: 1,
        marginRight: 10,
        color: '#111',
    },
    answerText: {
        marginTop: 8,
        fontFamily: 'Regular',
        fontSize: 14,
        color: '#555',
    },
});
