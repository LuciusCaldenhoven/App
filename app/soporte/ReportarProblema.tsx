import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, } from 'react-native';

export default function ReportProblemScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!title || !description || !email) {
      Alert.alert('Completa todos los campos antes de enviar.');
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/xdkgvpor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asunto: title,
          descripcion: description,
          correo: email,
        }),
      });

      if (response.ok) {
        Alert.alert('Gracias', 'Tu reporte ha sido enviado correctamente.');
        setTitle('');
        setDescription('');
        setEmail('');
      } else {
        Alert.alert('Error', 'No se pudo enviar el formulario.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al enviar tu mensaje.');
    }
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name="chevron-back" size={26} color={COLORS.black} style={{ paddingBottom: 20 }} />
        </TouchableOpacity>
        <Text style={styles.title}>Reportar un problema</Text>

        <TextInput
          style={styles.input}
          placeholder="¿Qué está pasando?"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe el problema con detalle"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 80,
  },
  title: {
    fontSize: 28,
    fontFamily: "SemiBold",
    color: COLORS.black,
    marginBottom: 15,

  },
  input: {
    backgroundColor: '#f2f4f6',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Regular',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
