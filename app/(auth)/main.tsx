import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert,
} from "react-native";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { styles } from "@/app/(auth)/auth.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

export default function LoginScreen() {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawParams = useLocalSearchParams();
  const email = Array.isArray(rawParams.email) ? rawParams.email[0] : rawParams.email;

  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  if (!email || typeof email !== "string") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 16 }}>Correo no válido</Text>
      </View>
    );
  }

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      if (!signIn) throw new Error("Clerk no está listo");

      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.log("Se requiere verificación adicional:", result);
      }
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      if (code === "form_password_incorrect") {
        Alert.alert("Contraseña incorrecta", "La contraseña ingresada no es válida.");
      } else if (code === "form_identifier_not_found") {
        Alert.alert("Cuenta no encontrada", "Este correo no está registrado.");
      } else {
        Alert.alert("Error", err?.errors?.[0]?.message || "Ocurrió un error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("@/assets/images/fondo.png")}
        style={{ flex: 1, justifyContent: "center" }}
        resizeMode="cover"
      >
        <Text style={styles.welcome}>Inicio de sesión</Text>
        <BlurView intensity={42} tint="light" style={styles.card}>
          <Text style={styles.introText}>
            ¡Bienvenido de nuevo!{"\n"}
            Estás iniciando sesión con:{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {/* Campo de contraseña */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor="#ccc"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={styles.viewText}>
                {passwordVisible ? "Ocultar" : "Ver"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón continuar */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isSubmitting}>
            <Text style={styles.loginButtonText}>
              {isSubmitting ? "Cargando..." : "Continuar"}
            </Text>
          </TouchableOpacity>

          {/* Link olvidó contraseña */}
          <TouchableOpacity>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </BlurView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
