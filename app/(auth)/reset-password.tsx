import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image, Alert } from "react-native";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { styles } from "@/app/(auth)/auth.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { ChevronLeft, MoveLeft } from "lucide-react-native";

export default function ResetPasswordScreen() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawParams = useLocalSearchParams();
  const email = Array.isArray(rawParams.email) ? rawParams.email[0] : rawParams.email;

  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      setIsSubmitting(true);
      if (!signIn) throw new Error("Clerk no está listo");
      if (!email) throw new Error("No se encontró el correo.");

      // Intenta completar el flujo de reset con el código + nueva contraseña
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        Alert.alert("Listo", "¡Contraseña cambiada con éxito!");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Atención", "Se requiere verificación adicional.");
      }
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      if (code === "form_code_incorrect" || code === "form_param_code_invalid") {
        Alert.alert("Código incorrecto", "El código ingresado no es válido.");
      } else if (code === "form_password_pwned") {
        Alert.alert("Contraseña insegura", "Esa contraseña es demasiado común. Elige otra.");
      } else {
        Alert.alert("Error", err?.errors?.[0]?.message || "Ocurrió un error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/background-balls.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <BlurView intensity={100} tint="light" style={styles.blurOverlayRegister}>
        <TouchableOpacity onPress={() => router.back()} style={{ paddingBottom: 120,paddingTop: 80 }}>
          <ChevronLeft size={35} color={"black"}  />
        </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>Restablecer contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa el código enviado a tu correo y tu nueva contraseña
            </Text>
          </View>
          <Text style={styles.titleLogin}>Correo asociado:</Text>
          <Text style={styles.emailText}>{email}</Text>

          {/* Código de verificación */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Código de verificación"
              placeholderTextColor="#ccc"
              value={code}
              onChangeText={setCode}
              autoCapitalize="none"
              keyboardType="number-pad"
            />
          </View>

          {/* Nueva contraseña */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor="#ccc"
              secureTextEntry={!passwordVisible}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={styles.viewText}>
                {passwordVisible ? "Ocultar" : "Ver"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón confirmar */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleResetPassword}
            disabled={isSubmitting}
          >
            <Text style={styles.loginButtonText}>
              {isSubmitting ? "Cambiando..." : "Restablecer contraseña"}
            </Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </TouchableWithoutFeedback>
  );
}
