// AddCardScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CreditCard, Check, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

/** Detect card brand from number prefix (BIN ranges). */
function detectCardBrand(digits: string) {
  if (!digits) return "unknown";
  const n = digits.replace(/\D/g, "");
  if (n.startsWith("4")) return "visa";
  const firstTwo = parseInt(n.slice(0, 2) || "0", 10);
  const firstThree = parseInt(n.slice(0, 3) || "0", 10);
  const firstFour = parseInt(n.slice(0, 4) || "0", 10);
  const firstSix = parseInt(n.slice(0, 6) || "0", 10);
  if ((firstTwo >= 51 && firstTwo <= 55) || (firstSix >= 222100 && firstSix <= 272099)) {
    return "mastercard";
  }
  if (firstTwo === 34 || firstTwo === 37) return "amex";
  if (
    n.startsWith("6011") ||
    (firstThree >= 644 && firstThree <= 649) ||
    n.startsWith("65") ||
    (firstSix >= 622126 && firstSix <= 622925)
  ) {
    return "discover";
  }
  return "unknown";
}

/** Luhn algorithm */
function luhnCheck(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/** Format card number as groups; Amex uses 4-6-5 */
function formatCardNumber_forBrand(raw: string, brand: string) {
  const digits = raw.replace(/\D/g, "");
  if (brand === "amex") {
    const g1 = digits.slice(0, 4);
    const g2 = digits.slice(4, 10);
    const g3 = digits.slice(10, 15);
    return [g1, g2, g3].filter(Boolean).join(" ");
  } else {
    return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
  }
}

export default function AddCardScreen() {
  const APP_COLOR = "#adc92b";

  const [cardNumber, setCardNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saving, setSaving] = useState(false);

  const brand = useMemo(() => detectCardBrand(cardNumber), [cardNumber]);
  const formattedNumber = useMemo(() => formatCardNumber_forBrand(cardNumber, brand), [cardNumber, brand]);
  const digitsOnly = cardNumber.replace(/\D/g, "");
  const isValidLuhn = luhnCheck(cardNumber);
  const cvvLength = brand === "amex" ? 4 : 3;

  // Brand -> gradient map (visual/approximate brand colors)
    const brandGradients: Record<string, readonly [string, string]> = {
    visa: ["#0A47FF", "#0B2C7E"],
    mastercard: ["#FF5F3A", "#FFB35C"],
    amex: ["#2CA8D8", "#0B6FA6"],
    discover: ["#F79E1B", "#D96400"],
    unknown: ["#111827", "#0f1720"], // dark neutral like screenshot
  };
  const gradient = brandGradients[brand] ?? brandGradients.unknown;

  // expiry formatter
  const onChangeExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let out = cleaned;
    if (cleaned.length >= 3) out = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    setExpiry(out);
  };

  const onChangeCardNumber = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, "");
    const maxLen = brand === "amex" ? 15 : 16;
    const sliced = cleaned.slice(0, maxLen);
    setCardNumber(formatCardNumber_forBrand(sliced, brand));
  };

  const onSave = () => {
    if (!digitsOnly || digitsOnly.length < 12) {
      Alert.alert("Número inválido", "Ingresa un número de tarjeta válido.");
      return;
    }
    if (!isValidLuhn) {
      Alert.alert("Tarjeta inválida", "El número de tarjeta no pasó la validación.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Nombre requerido", "Ingresa el nombre del titular.");
      return;
    }
    
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      Alert.alert("Vencimiento inválido", "Usa el formato MM/AA.");
      return;
    }
    if (!cvv || cvv.length < cvvLength) {
      Alert.alert("CVV inválido", `Ingresa un CVV de ${cvvLength} dígitos.`);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Guardada", "Tu tarjeta fue guardada correctamente.");
      setCardNumber("");
      setFirstName("");
      setLastName("");
      setExpiry("");
      setCvv("");
    }, 900);
  };

  return (

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity onPress={() => router.back()}>
             <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.h1}>Agregar tarjeta</Text>
          </View>
       
        </View>

        {/* card preview */}
        <View style={{ alignItems: "center", marginTop: 18 }}>
            <LinearGradient colors={gradient} start={[0, 0]} end={[1, 1]} style={styles.previewCard}>
              <View style={styles.chip} />
              <Text style={styles.previewNumber}>{formattedNumber || "XXXX XXXX XXXX XXXX"}</Text>

              <View style={styles.previewRow}>
                <Text style={styles.previewName}>
                  {firstName || lastName ? `${(firstName || "").toUpperCase()} ${(lastName || "").toUpperCase()}`.trim() : "FULL NAME"}
                </Text>
                <Text style={styles.previewExpiry}>{expiry || "MM/YY"}</Text>
              </View>
            </LinearGradient>
          </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={styles.label}>Número de tarjeta</Text>
          <TextInput
            style={[styles.input, !isValidLuhn && digitsOnly.length >= 12 ? styles.inputInvalid : null]}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={(t) => onChangeCardNumber(t)}
            maxLength={24}
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 2 }}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="NOMBRE"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="APELLIDO"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>


          </View>
           <View style={{ flexDirection: "row",gap: 12  }}>


            <View style={{ flex: 2 }}>
              <Text style={styles.label}>Vencimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                keyboardType="numeric"
                value={expiry}
                onChangeText={onChangeExpiry}
                maxLength={5}
              />
            </View>

            <View style={{ flex: 2 }}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder={cvvLength === 4 ? "4 díg" : "123"}
                keyboardType="numeric"
                value={cvv}
                onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, cvvLength))}
                maxLength={cvvLength}
                secureTextEntry
              />
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: APP_COLOR, opacity: saving ? 0.6 : 1 }]}
              activeOpacity={0.9}
              onPress={onSave}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saving ? "Guardando..." : "Guardar tarjeta"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ghostBtn]}
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert("Cancelado", "Se canceló la operación.");
              }}
            >
              <Text style={styles.ghostText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {/* small helpers */}
          <View style={{ marginTop: 14 }}>
            <Text style={styles.helper}>
              Al guardar tu tarjeta se encriptará localmente y se enviará al método de pago seguro del backend (simulado).
            </Text>
            
          </View>
        </View>
      </View>

  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  container: { flex: 1, padding: 16, backgroundColor: "#fff", paddingVertical: 60 },
  header: { marginTop: 6, marginBottom: 6 },
  h1: { fontSize: 24, fontFamily: "SemiBold", color: "#111" },
  hint: { color: "#6b7280", marginTop: 4 },

  cardPreview: {
    width: "92%",
    borderRadius: 16,
    padding: 18,
    marginTop: 6,
    elevation: 4,
  },
  previewNumber: {
    color: "rgba(255,255,255,0.95)",
    letterSpacing: 2.5,
    fontSize: 18,
    fontFamily: "SemiBold",
    marginTop: 6,
  },
  previewRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  previewName: { color: "rgba(255,255,255,0.95)", fontSize: 13, fontFamily: "Medium" },
  previewExpiry: { color: "rgba(255,255,255,0.95)", fontSize: 13 },


  form: { marginTop: 18 },
  label: { fontSize: 13, color: "#334", marginBottom: 6, fontFamily: "Medium" },
  input: {
    backgroundColor: "#f7f8fb",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  inputInvalid: {
    borderWidth: 1,
    borderColor: "#f43f5e",
  },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  saveText: { color: "#fff", fontFamily: "SemiBold", fontSize: 15 },

  ghostBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e6e8ee",
  },
  ghostText: { color: "#556", fontFamily: "Medium" },

  helper: { color: "#6b7280", fontSize: 13 },
  previewCard: {
    width: "86%",
    height: 160,
    borderRadius: 14,
    padding: 18,
    justifyContent: "space-between",
    elevation: 6,
  },
  chip: {
    width: 34,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#E8C77B",
  },

});
