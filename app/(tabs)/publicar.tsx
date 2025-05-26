// app/ofrecer.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';

export default function OfrecerScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>

        {/* Banner visual */}

        <Text style={styles.title}>ReVende</Text>
        <Text style={styles.subtitle}>¿Qué deseas ofrecer hoy?</Text>
        <Text style={styles.select}>Selecciona una opción</Text>

        <OptionCard
          title="Venta"
          description="Ofrece tus productos nuevos o usados"
          iconComponent={<FontAwesome6 name="box" size={20} color="#4F8EF7" />}
          bgColor="#DCEEFF"
        />

        <OptionCard
          title="Alquiler"
          description="Alquila tus propiedades o artículos"
          iconComponent={<FontAwesome5 name="calendar-alt" size={20} color="#30C04F" />}
          bgColor="#DFF5E5"
        />

        <OptionCard
          title="Servicio"
          description="Ofrece tus habilidades y servicios"
          iconComponent={<MaterialCommunityIcons name="briefcase-variant" size={20} color="#A86AEF" />}
          bgColor="#F0E9FF"
        />


        {/* Beneficios o motivador */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>¿Por qué publicar en ReVende?</Text>
          <Text style={styles.infoText}>✔ Llega a miles de personas en tu zona</Text>
          <Text style={styles.infoText}>✔ Comparte, gana o ayuda a otros</Text>
          <Text style={styles.infoText}>✔ Publicar es rápido y gratuito</Text>
        </View>

        {/* Recomendaciones */}


      </View>
      <Text style={styles.note}>
        📌 Recuerda subir imágenes claras y describir bien tu producto o servicio.
      </Text>
    </View>
  );
}

function OptionCard({ title, description, iconComponent, bgColor }: any) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/InfoProducto/infoProducto?tipo=${title}`)}
    >
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        {iconComponent}
      </View>
      <View style={styles.textBox}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#777" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  banner: {
    width: '100%',
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SemiBold',
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  select: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  infoBox: {
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  note: {
    bottom: 5,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
