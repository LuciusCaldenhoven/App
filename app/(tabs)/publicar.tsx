import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
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
    image: require("@/assets/images/prueba1.png"),
  },
  {
    title: "Alquiler",
    description: "Alquila objetos o propiedades.",
    image: require("@/assets/images/prueba2.png"),
  },
  {
    title: "Servicio",
    description: "Ofrece tus habilidades, tiempo o conocimiento.",
    image: require("@/assets/images/prueba1.png"),
  },
];

export default function OfrecerScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const [sheetContent, setSheetContent] = useState<{ title: string } | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleCardPress = (idx: number) => {
    if (selected === idx) {
      setSheetContent({
        title: OPTIONS[idx].title,
 
      });
      bottomSheetRef.current?.present();
    } else {
      setSelected(idx);
    }
  };

  const snapPoints = ['36%'];

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
        <TouchableOpacity style={[ styles.btn, { backgroundColor: selected === null ? PALETTE.grisBtn : PALETTE.marca, }, ]}
          disabled={selected === null}
          activeOpacity={selected === null ? 1 : 0.82}
          onPress={() => {
            if (selected !== null) {
              router.push(`/InfoProducto/infoProducto?tipo=${OPTIONS[selected].title}`);
            }
          }}
        >
          <Text style={{ color: "#fff", fontFamily: "SemiBold", fontSize: 17, letterSpacing: 0.1, opacity: selected === null ? 0.62 : 1, }} >
            Continuar
          </Text>
        </TouchableOpacity>
        <View style={{ height: 34 }} />
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "#fff", borderRadius: 24 }}
        backdropComponent={props => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.28} />
        )}
        handleIndicatorStyle={{ backgroundColor: "#e3e3e3", width: 60 }}
      >
        <BottomSheetView style={{ flex: 1, padding: 26, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 21, fontFamily: "SemiBold", color: PALETTE.marca, marginBottom: 10 }}>
            {sheetContent?.title}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 30,
              backgroundColor: PALETTE.marca,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 35,
            }}
            onPress={() => bottomSheetRef.current?.dismiss()}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#fff", fontFamily: "SemiBold", fontSize: 16 }}>Cerrar</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
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
