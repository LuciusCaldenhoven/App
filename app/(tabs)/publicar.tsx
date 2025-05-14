// app/ofrecer.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function OfrecerScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>MiMercado</Text>
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

      </ScrollView>
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
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  select: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16
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
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  textBox: {
    flex: 1
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600'
  },
  cardDesc: {
    fontSize: 13,
    color: '#777',
    marginTop: 2
  }
});
