import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ImageBackground, Alert, Image } from "react-native";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { styles } from "@/styles/auth.style";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { ChevronLeft, MoveLeft } from "lucide-react-native";

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

  const handleForgotPassword = async () => {
  try {
    if (!signIn) throw new Error("Clerk no está listo");
    if (!email) throw new Error("No se encontró el correo.");

    // Inicia el proceso de recuperación con Clerk
    await signIn.create({
      strategy: "reset_password_email_code",
      identifier: email,
    });

    Alert.alert(
      "Revisa tu correo",
      "Te hemos enviado un código para restablecer tu contraseña."
    );

    // Redirige a la pantalla de reset de password, o muestra un input para el código + nueva contraseña
    // Por ejemplo:
    router.push({
      pathname: "/reset-password",
      params: { email }
    });

  } catch (err: any) {
    const code = err?.errors?.[0]?.code;
    if (code === "form_identifier_not_found") {
      Alert.alert("Correo no encontrado", "No existe una cuenta asociada a este correo.");
    } else {
      Alert.alert("Error", err?.errors?.[0]?.message || "Ocurrió un error.");
    }
  }
};




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
            <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
            <Text style={styles.subtitle}>Ingresa tu contrasena para iniciar</Text>

          </View>
          <Text style={styles.titleLogin}>Estás iniciando sesión con:{"\n"}</Text>
          <Text style={styles.emailText}>{email}</Text>



          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
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
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        </BlurView>
      </View>
    </TouchableWithoutFeedback>
  );
}
