import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import OptionCard from '@/components/publicar/OptionCard';
import { router } from 'expo-router';

const PALETTE = {
  marca: "#adc92b",
  fondo: "white",
  texto: "#222",
  grisBtn: "#bababa",
};

const OPTIONS = [
  {
    title: "Venta",
    description: "Vende tus productos nuevos o usados.",
    image: require("@/assets/images/prueba3.png"),
  },
  {
    title: "Alquiler",
    description: "Alquila objetos o propiedades.",
    image: require("@/assets/images/prueba2.png"),
  },
  {
    title: "Servicio",
    description: "Ofrece tu tiempo y conocimientos.",
    image: require("@/assets/images/prueba1.png"),
  },
];

export default function OfrecerScreen() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleCardPress = (idx: number) => {
    setSelected(idx);
  };

  return (
    <View style={{ flex: 1, backgroundColor: PALETTE.fondo }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>¿Qué deseas ofrecer hoy?</Text>
        <Text style={styles.subtitle}>
          Publica en <Text style={{ color: PALETTE.marca, fontWeight: 'bold' }}>DiUna</Text> y recibe ingresos de inmediato.
        </Text>
        <View style={{ height: 28 }} />

        {OPTIONS.map((opt, i) => (
          <OptionCard
            key={opt.title}
            title={opt.title}
            description={opt.description}
            selected={selected === i}
            onPress={() => handleCardPress(i)}
            image={opt.image}
          />
        ))}

        <View style={{ height: 38 }} />
        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: selected === null ? PALETTE.grisBtn : PALETTE.marca },
          ]}
          disabled={selected === null}
          activeOpacity={selected === null ? 1 : 0.82}
          onPress={() => {
            if (selected !== null) {
              router.push(`/create/page1?tipo=${OPTIONS[selected].title}`);
            }
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "SemiBold",
              fontSize: 17,
              letterSpacing: 0.1,
              opacity: selected === null ? 0.62 : 1,
            }}
          >
            Continuar
          </Text>
        </TouchableOpacity>
        <View style={{ height: 34 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 88,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: "SemiBold",
    color: PALETTE.texto,
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14.3,
    fontFamily: "Medium",
    color: "#7ea437",
    textAlign: 'center',
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  btn: {
    borderRadius: 16,
    alignSelf: "center",
    width: "90%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#222",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
