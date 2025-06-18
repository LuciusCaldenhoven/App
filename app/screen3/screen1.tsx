import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* <Image
        source={require('@/assets/images/background-balls.png')} // Cambia la ruta si está en otra carpeta
        style={styles.backgroundImage}
        resizeMode="cover"
      /> */}

      <BlurView intensity={0} tint="light" style={styles.blurOverlay}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Welcome Back,{'\n'}Listener!</Text>
          <Text style={styles.subtitle}>Your favorite podcasts are waiting.</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} style={styles.icon} />
          <TextInput placeholder="Username" style={styles.input} placeholderTextColor="#666" />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
          <TextInput placeholder="Password" secureTextEntry style={styles.input} placeholderTextColor="#666" />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.orContinue}>Or continue with</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('@/assets/images/Google.png')} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('@/assets/images/facebook.png')} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaedf7',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: '#E1F0FF',
  },
  blurOverlay: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'SemiBold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 32,
    fontFamily: 'Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    elevation: 3,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16, // Si estás en RN >= 0.71
    marginTop: 12,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 24,
    height: 24,
  },

  input: {
    flex: 1,
    color: '#000',
  },
  forgotText: {
    color: '#007BFF',
    textAlign: 'right',
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#3A72E8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orContinue: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#444',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 8,
    elevation: 4,
  },
});
