import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function UbicacionConDistrito() {
  const [loading, setLoading] = useState(false);
  const [ciudad, setCiudad] = useState<string | null>(null);
  const [distrito, setDistrito] = useState<string | null>(null);

  const obtenerDistritoDesdeGoogle = async (lat: number, lng: number) => {
    const apiKey = 'AIzaSyA6acFNK1uCyE4_g2n0DwY0ok9k4LIs8AM'; // ⬅️ reemplaza esto con tu clave de API real
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    let ciudadComp = null;
    let distritoComp = null;

    for (const result of data.results) {
      for (const comp of result.address_components) {
        if (!ciudadComp && comp.types.includes('locality')) {
          ciudadComp = comp;
        }
        if (!distritoComp && comp.types.includes('administrative_area_level_3')) {
          distritoComp = comp;
        }
      }
    }

    return {
      ciudad: ciudadComp?.long_name || null,
      distrito: distritoComp?.long_name || null,
    };
  } catch (error) {
    console.error('Error obteniendo distrito:', error);
    return null;
  }
};


  const solicitarUbicacionConDistrito = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación.');
      setLoading(false);
      return;
    }

    const ubicacion = await Location.getCurrentPositionAsync({});
    const resultado = await obtenerDistritoDesdeGoogle(
      ubicacion.coords.latitude,
      ubicacion.coords.longitude
    );

    if (resultado) {
      setCiudad(resultado.ciudad);
      setDistrito(resultado.distrito);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Podemos usar tu ubicación?</Text>
      <Button title="Sí, obtener ubicación" onPress={solicitarUbicacionConDistrito} />

      {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />}

      {ciudad && distrito && (
        <View style={{ marginTop: 30 }}>
          <Text style={styles.resultado}>Ciudad: {ciudad}</Text>
          <Text style={styles.resultado}>Distrito: {distrito}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultado: {
    fontSize: 16,
    marginVertical: 4,
    fontWeight: '500',
  },
});
