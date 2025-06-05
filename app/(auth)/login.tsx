import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, ImageBackground, } from "react-native";
import { useRouter } from "expo-router";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { COLORS } from "@/constants/theme";
import { styles } from "@/app/(auth)/auth.styles";
import { BlurView } from "expo-blur";
export default function Login() {
  const { signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

 
  

  const handleEmailContinue = async () => {
  try {
    if (!signIn) return;

    // Intentar iniciar sesión sin contraseña para verificar si el correo existe
    const result = await signIn.create({ identifier: email });

    // Si Clerk devuelve factores de autenticación, el usuario existe
    if (Array.isArray(result.supportedFirstFactors) && result.supportedFirstFactors.length > 0) {
      
      router.push({ pathname: "/main" ,params: { email } });
    }
  } catch (err: any) {
    const code = err?.errors?.[0]?.code;

    if (code === "form_identifier_not_found") {
      // Correo no registrado → ir a registro
      router.push({ pathname: "/register", params: { email } });
    } else {
      Alert.alert("Error", err?.errors?.[0]?.message || "Error al verificar el correo.");
    }
  }
};


  const handleGoogleSignIn = async () => {
    if (isDisabled) return;
    setIsDisabled(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } finally {
      setIsDisabled(false);
    }
  };

  const handleFacebookSignIn = async () => {
    if (isDisabled) return;
    setIsDisabled(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_facebook" });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={require("@/assets/images/fondo.png")} style={{ flex: 1, justifyContent: "center" }} resizeMode="cover" >
        <Text style={styles.welcome}>Hola!</Text>
        <BlurView intensity={42} tint="light" style={styles.card} >
          

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#ccc"
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleEmailContinue}>

            <Text style={styles.loginButtonText}>Continuar</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>O continúa con</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.loginSection}>
            <TouchableOpacity style={styles.googleButton} activeOpacity={0.9} disabled={isDisabled} onPress={handleGoogleSignIn}>
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={20} color={COLORS.surface} />
              </View>
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton} activeOpacity={0.9} disabled={isDisabled} onPress={handleFacebookSignIn}>
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-facebook" size={20} color={COLORS.surface} />
              </View>
              <Text style={styles.googleButtonText}>Continuar con Facebook</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              Al continuar, aceptas nuestros Términos y Política de privacidad.
            </Text>
          </View>

          <Text style={styles.registerText}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.registerLink} onPress={() => router.push({ pathname: "/register", params: { email } })}>
              Regístrate
            </Text>
          </Text>
        </BlurView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
