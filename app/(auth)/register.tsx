import { styles } from "@/app/(auth)/auth.styles";
import { useSignUp } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ImageBackground, Alert, Image } from "react-native";
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
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/background-balls.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <BlurView intensity={100} tint="light" style={styles.blurOverlayRegister}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>Creamos tu nueva cuenta</Text>
          </View>

          {!pendingVerification ? (
            <>
              <Text style={styles.introText}>
                Parece que no tenés cuenta.{"\n"}
                Vamos a crear una para {" "}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#ccc"
                />
              </View>
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
                  <Text style={styles.viewText}>{passwordVisible ? "Ocultar" : "Ver"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.legalText}>
                Al continuar aceptás nuestros <Text style={styles.link}>Términos</Text> y{" "}
                <Text style={styles.link}>Política de privacidad</Text>.
              </Text>

              <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                <Text style={styles.loginButtonText}>Aceptar y continuar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.introText}>
                Te enviamos un código a <Text style={styles.emailText}>{email}</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Código de verificación"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  placeholderTextColor="#ccc"
                />
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={handleVerify}>
                <Text style={styles.loginButtonText}>Verificar código</Text>
              </TouchableOpacity>
            </>
          )}
        </BlurView>
      </View >
    </TouchableWithoutFeedback >
  );
}
