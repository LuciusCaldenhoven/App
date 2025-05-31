import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react-native";

export default function ToastStyledScreen() {
  const show = (type: "success" | "error" | "warning" | "info") => {
    Toast.show({
      type,
      text1: "",
      text2: "",
      position: "top",
      visibilityTime: 3000,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Demo de Toasts Estéticos</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#2ecc71" }]} onPress={() => show("success")}>
        <Text style={styles.buttonText}>Éxito ✅</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#e74c3c" }]} onPress={() => show("error")}>
        <Text style={styles.buttonText}>Error ❌</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#f39c12" }]} onPress={() => show("warning")}>
        <Text style={styles.buttonText}>Advertencia ⚠️</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#3498db" }]} onPress={() => show("info")}>
        <Text style={styles.buttonText}>Información ℹ️</Text>
      </TouchableOpacity>

      <Toast config={toastConfig} />
    </ScrollView>
  );
}

// 🎨 Config: cada tipo con ícono, colores e identidad visual
const toastConfig: ToastConfig = {
  success: () => (
    <View style={[styles.toastBox, { backgroundColor: "#e9f9f0" }]}>
      <CheckCircle color="#2ecc71" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>¡Éxito!</Text>
        <Text style={styles.toastText}>Tu acción fue completada correctamente.</Text>
      </View>
    </View>
  ),
  error: () => (
    <View style={[styles.toastBox, { backgroundColor: "#fdecea" }]}>
      <XCircle color="#e74c3c" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>¡Error!</Text>
        <Text style={styles.toastText}>Algo salió mal. Intenta de nuevo.</Text>
      </View>
    </View>
  ),
  warning: () => (
    <View style={[styles.toastBox, { backgroundColor: "#fff4e5" }]}>
      <AlertTriangle color="#f39c12" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>Advertencia</Text>
        <Text style={styles.toastText}>Verifica bien antes de continuar.</Text>
      </View>
    </View>
  ),
  info: () => (
    <View style={[styles.toastBox, { backgroundColor: "#e8f4fd" }]}>
      <Info color="#3498db" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>Info</Text>
        <Text style={styles.toastText}>Este es un mensaje informativo.</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  toastBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 15,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  toastContent: {
    marginLeft: 15,
    flex: 1,
  },
  toastTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 3,
  },
  toastText: {
    fontSize: 14,
    color: "#555",
  },
});
