// app/ofrecer.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ShoppingCart, KeyRound, Wrench } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// PALETA PRINCIPAL (solo Paleta 1)
const PALETTE = {
  marca: "#adc92b",         // principal para badge y card
  fondo: "#fafcf4",         // fondo de pantalla
  texto: "#465b17",         // texto oscuro principal
  textoClaro: "#fff",
  info: "#7ea437",
  card: "#eff4d5",          // fondo de OptionCard (puedes cambiar a #bfd156 si quieres más saturado)
};

const WIDTH = Dimensions.get('window').width;

export default function OfrecerScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: PALETTE.fondo }}>
      <View style={styles.bgCircle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>¿Qué deseas ofrecer hoy?</Text>
        <Text style={styles.subtitle}>
          Publica en <Text style={{ color: PALETTE.marca, fontFamily: 'Bold' }}>DiUna</Text> y conecta con miles de personas
        </Text>
        <View style={{ height: 20 }} />

        <OptionCard
          title="Venta"
          description="Ofrece productos nuevos o usados"
          icon={<ShoppingCart size={26} color={PALETTE.textoClaro} strokeWidth={2.2} />}
        />
        <OptionCard
          title="Alquiler"
          description="Alquila tus propiedades o artículos"
          icon={<KeyRound size={26} color={PALETTE.textoClaro} strokeWidth={2.2} />}
        />
        <OptionCard
          title="Servicio"
          description="Ofrece tus habilidades y servicios"
          icon={<Wrench size={26} color={PALETTE.textoClaro} strokeWidth={2.2} />}
        />

        {/* INFORMACIÓN AL FINAL */}
        <View style={{ height: 26 }} />
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>¿Por qué publicar en DiUna?</Text>
          <Text style={styles.infoText}>• Llega a miles de personas en tu zona</Text>
          <Text style={styles.infoText}>• Comparte, gana o ayuda a otros</Text>
          <Text style={styles.infoText}>• Publicar es rápido y gratuito</Text>
        </View>
        <Text style={styles.note}>
          📌 Recuerda subir imágenes claras y describir bien tu producto o servicio.
        </Text>
        <View style={{ height: 22 }} />
      </ScrollView>
    </View>
  );
}

// Opciones con mismo color de fondo y badge
function OptionCard({ title, description, icon }: any) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.93}
      onPress={() => router.push(`/InfoProducto/infoProducto?tipo=${title}`)}
    >
      <View style={styles.iconBadge}>
        {icon}
      </View>
      <View style={styles.cardTextBox}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={PALETTE.marca} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 88,
    alignItems: 'center',
  },
  bgCircle: {
    position: 'absolute',
    top: -WIDTH * 0.20,
    left: -WIDTH * 0.25,
    width: WIDTH * 0.65,
    height: WIDTH * 0.63,
    borderRadius: WIDTH * 0.4,
    backgroundColor: '#dfe8ab',
    zIndex: 0,
    opacity: 0.18,
 
  },
  title: {
    fontSize: 25,
    fontFamily: 'SemiBold',
    color: PALETTE.texto,
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14.3,
    fontFamily: 'Medium',
    color: PALETTE.info,
    textAlign: 'center',
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 17,
    paddingVertical: 13,
    paddingHorizontal: 13,
    marginBottom: 17,
    width: '100%',
    backgroundColor: PALETTE.card,
    borderLeftWidth: 5,
    borderLeftColor: PALETTE.marca,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
    zIndex: 1,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: PALETTE.marca,
    shadowColor: PALETTE.marca,
    shadowOpacity: 0.09,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardTextBox: {
    flex: 1,
    paddingRight: 7,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15.5,
    fontFamily: 'SemiBold',
    color: PALETTE.texto,
    marginBottom: 2,
    letterSpacing: -0.4,
  },
  cardDesc: {
    fontSize: 12.2,
    fontFamily: 'Regular',
    color: PALETTE.texto,
    lineHeight: 16,
    marginBottom: 1,
  },
  infoBox: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: PALETTE.marca,
    marginBottom: 10,
    alignSelf: 'stretch',
    shadowColor: PALETTE.marca + "22",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Bold',
    marginBottom: 6,
    color: PALETTE.info,
    letterSpacing: 0.16,
  },
  infoText: {
    fontSize: 12.3,
    fontFamily: 'Regular',
    color: '#98b65f',
    marginBottom: 1,
    letterSpacing: 0.04,
  },
  note: {
    fontSize: 11,
    fontFamily: 'Regular',
    color: '#9ca17b',
    textAlign: 'center',
    paddingHorizontal: 14,
    paddingTop: 7,
    fontWeight: '500',
    opacity: 0.82
  },
});
