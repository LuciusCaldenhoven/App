import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ToastConfig } from "react-native-toast-message";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react-native";

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.toastBox, { backgroundColor: "#e9f9f0" }]}>
      <CheckCircle color="#2ecc71" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1 || "¡Éxito!"}</Text>
        {text2 && <Text style={styles.toastText}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.toastBox, { backgroundColor: "#fdecea" }]}>
      <XCircle color="#e74c3c" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1 || "¡Error!"}</Text>
        {text2 && <Text style={styles.toastText}>{text2}</Text>}
      </View>
    </View>
  ),
  warning: ({ text1, text2 }) => (
    <View style={[styles.toastBox, { backgroundColor: "#fff4e5" }]}>
      <AlertTriangle color="#f39c12" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1 || "Advertencia"}</Text>
        {text2 && <Text style={styles.toastText}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={[styles.toastBox, { backgroundColor: "#e8f4fd" }]}>
      <Info color="#3498db" size={26} />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1 || "Información"}</Text>
        {text2 && <Text style={styles.toastText}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
     paddingVertical: 5,
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
    fontFamily: "SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 3,
  },
  toastText: {

    fontFamily: "Medium",
    fontSize: 12,
    color: "#555",
  },
});
