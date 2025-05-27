import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Tv, Shirt, Dumbbell, Sofa, BookOpen
} from 'lucide-react-native'; // Iconos de lucide

const categories = [
  { id: '1', title: 'Electrónica', icon: Tv },
  { id: '2', title: 'Ropa', icon: Shirt },
  { id: '3', title: 'Deportes', icon: Dumbbell },
  { id: '4', title: 'Muebles', icon: Sofa },
  { id: '5', title: 'Libros', icon: BookOpen },
];

export default function CategoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explora por categoría</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity style={styles.card}>
              <View style={styles.iconWrapper}>
                <Icon size={28} color="#111" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  carousel: {
    paddingRight: 16,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    width: 90,
  },
  iconWrapper: {
    backgroundColor: '#f3f3f3',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
  },
});
