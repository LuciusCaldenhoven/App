import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function ComingSoonScreen() {
  const slideAnim = useRef(new Animated.Value(-300)).current; 

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 12,
      speed: 8,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Botón de volver */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={28} color="#000" />
      </TouchableOpacity>

      {/* Contenido con animación de slide-down */}
      <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>¡Próximamente!</Text>

        <LottieView
          source={require('@/assets/animations/coming-soon.json')}
          autoPlay
          loop
          style={styles.lottie}
        />

        <Text style={styles.description}>
          Estamos trabajando en una función que te permitirá promocionar tus productos para que más personas los vean.
          {'\n\n'}¡Mantente atento a las actualizaciones!
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  lottie: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
    fontFamily: 'Medium',
  },
});
