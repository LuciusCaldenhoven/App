import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;


export default function CustomLocationSearch() {
  const [query, setQuery] = useState('');
  type Suggestion = { place_id: string; description: string };
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const fetchSuggestions = async (text: string) => {
    setQuery(text);
    setSelectedPlace(null); // resetea ubicación seleccionada

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      text
    )}&language=es&components=country:pe&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      setSuggestions(json.predictions || []);
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error);
    }
  };

  const fetchPlaceDetails = async (placeId: string, description: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.result?.geometry?.location) {
        const location = json.result.geometry.location;
        setSelectedPlace({
          description,
          lat: location.lat,
          lng: location.lng,
        });
        setSuggestions([]);
        setQuery(description);
      } else {
        Alert.alert('Error', 'No se pudo obtener detalles de la ubicación.');
      }
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar ubicación"
        style={styles.input}
        value={query}
        onChangeText={fetchSuggestions}
      />

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              fetchPlaceDetails(item.place_id, item.description)
            }
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedPlace && (
        <View style={styles.resultBox}>
          <Text style={styles.label}>Ubicación seleccionada:</Text>
          <Text>{selectedPlace.description}</Text>
          <Text>Lat: {selectedPlace.lat}</Text>
          <Text>Lng: {selectedPlace.lng}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff',paddingTop:100  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  resultBox: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
});
