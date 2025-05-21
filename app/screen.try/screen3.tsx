import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, ImageBackground, } from "react-native";
import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { COLORS } from "@/constants/theme";
import { styles } from "@/app/(auth)/auth.styles";
import { BlurView } from "expo-blur";
export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={require("@/assets/images/fondo.png")} style={{ flex: 1, justifyContent: "center" }} resizeMode="cover" >
        
        <BlurView intensity={42} tint="light" style={styles.card} >
          <Text style={styles.welcome}>Hola!</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#ccc"
          />

          <TouchableOpacity style={styles.loginButton} >
            <Text style={styles.loginButtonText}>Continuar</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>O continúa con</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.loginSection}>
            <TouchableOpacity style={styles.googleButton} activeOpacity={0.9} disabled={isDisabled} >
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={20} color={COLORS.surface} />
              </View>
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton} activeOpacity={0.9} disabled={isDisabled} >
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
            <Text style={styles.registerLink} onPress={() => router.push("/register")}>
              Regístrate
            </Text>
          </Text>
        </BlurView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
