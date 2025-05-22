import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';

export default function FaqScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handlePress = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const faqs = [
    {
      id: '1',
      question: '¿Cómo publico un producto?',
      answer:
        'Ve a la pestaña de "Vender", llena los detalles del producto y presiona "Publicar".',
    },
    {
      id: '2',
      question: '¿Es gratis usar la app?',
      answer:
        'Sí, publicar productos es completamente gratis. Solo pagas si eliges opciones premium.',
    },
    {
      id: '3',
      question: '¿Cómo contacto a un vendedor?',
      answer:
        'Desde el detalle del producto, pulsa "Enviar mensaje" y podrás chatear directamente.',
    },
    {
      id: '4',
      question: '¿Puedo editar o borrar una publicación?',
      answer:
        'Sí. Ve a tu perfil, luego a "Mis publicaciones", elige una y selecciona editar o eliminar.',
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Preguntas Frecuentes </Text>
        </View>
        {faqs.map((faq) => (
          <View key={faq.id}>
            <List.Accordion
              title={faq.question}
              expanded={expanded === faq.id}
              onPress={() => handlePress(faq.id)}
              left={(props) => <List.Icon {...props} icon="help-circle" />}
            >
              <List.Item title={faq.answer} titleNumberOfLines={10} />
            </List.Accordion>
            <Divider />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
