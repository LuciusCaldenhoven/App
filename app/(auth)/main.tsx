import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ImageBackground, Alert, Image } from "react-native";
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
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/background-balls.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <BlurView intensity={100} tint="light" style={styles.blurOverlayRegister}>
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
          <TouchableOpacity>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </TouchableWithoutFeedback>
  );
}
