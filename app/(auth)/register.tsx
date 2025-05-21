import { styles } from "@/app/(auth)/auth.styles";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function Register() {
  const { signUp, setActive } = useSignUp();
  const router = useRouter();
  const rawParams = useLocalSearchParams();
    const email = Array.isArray(rawParams.email) ? rawParams.email[0] : rawParams.email;    

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!signUp) throw new Error("Clerk signUp not ready");

      await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert("Error de registro", err.errors?.[0]?.message || "Error al registrarse.");
    }
  };

  const handleVerify = async () => {
    try {
      if (!signUp) throw new Error("Clerk signUp not ready");

      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert("Error de verificación", err.errors?.[0]?.message || "Código incorrecto.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("@/assets/images/fondo.png")}
        style={{ flex: 1, justifyContent: "center" }}
        resizeMode="cover"
      >
        <Text style={styles.welcome}>Registro</Text>
        <BlurView intensity={42} tint="light" style={styles.card}>
          {!pendingVerification ? (
            <>
              <Text style={styles.introText}>
                Parece que no tienes una cuenta.{"\n"}
                Vamos a crear una nueva cuenta para{"\n"}
                <Text style={styles.emailText}>{email}</Text>
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#ccc"
              />

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

              <Text style={styles.legalText}>
                Al seleccionar "Aceptar y continuar" abajo,{"\n"}
                acepto los <Text style={styles.link}>Términos de servicio</Text> y la{" "}
                <Text style={styles.link}>Política de privacidad</Text>.
              </Text>

              <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                <Text style={styles.loginButtonText}>Aceptar y continuar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.introText}>
                Te enviamos un código de verificación a{"\n"}
                <Text style={styles.emailText}>{email}</Text>
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Código de verificación"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                placeholderTextColor="#ccc"
              />

              <TouchableOpacity style={styles.loginButton} onPress={handleVerify}>
                <Text style={styles.loginButtonText}>Verificar código</Text>
              </TouchableOpacity>
            </>
          )}
        </BlurView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
