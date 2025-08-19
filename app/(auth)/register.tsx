import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { Mail, User } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const S: Record<string, any> = {
  container: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 37, paddingTop: 80 },

  logo: { width: 70, height: 70, alignSelf: "center" },
  brand: { textAlign: "center", fontSize: 38, fontFamily: "Bold", marginTop: 6, color: "#adc92b" },
  subtitle: { textAlign: "center", marginTop: 30, color: "black", fontFamily: "Medium", fontSize: 16, marginBottom: 12 },

  inputWrap: {
    height: 54,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  
  input: { flex: 1, fontSize: 16, color: "#101828", fontFamily: "Regular" },
  rightIconBtn: { paddingHorizontal: 4, paddingVertical: 6 },
  viewText: { color: "#adc92b", fontFamily: "Medium", fontSize: 14 },

  loginBtn: {
    height: 54,
    borderRadius: 25,
    backgroundColor: "#adc92b",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  leftIcon: { marginRight: 14, color: "black" },
  loginBtnText: { color: "#fff", fontSize: 17, fontFamily: "Medium" },

  introText: { marginTop: 18, fontSize: 15, fontFamily: "Regular", color: "#344054" },
  emailText: { color: "#101828", fontFamily: "Medium" },

  legalText: { marginTop: 14, color: "#667085", fontFamily: "Regular", fontSize: 14, textAlign: "center" },
  link: { color: "#adc92b", textDecorationLine: "underline" },

  otpContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Medium",
    color: "#101828",
  },
};

export default function Register() {
  const { signUp, setActive } = useSignUp();
  const router = useRouter();
  

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const otpRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // -----------------------
  // ANIMACIONES (solo UI)
  // -----------------------
  const screenFade = useRef(new Animated.Value(0)).current;
  const screenTransY = useRef(new Animated.Value(16)).current;
  const logoBob = useRef(new Animated.Value(0)).current;

  const emailScale = useRef(new Animated.Value(1)).current;
  const nameScale = useRef(new Animated.Value(1)).current;
  const pwdScale = useRef(new Animated.Value(1)).current;

  const btnScale = useRef(new Animated.Value(1)).current;
  const verifyBtnScale = useRef(new Animated.Value(1)).current;

  const otpShake = useRef(new Animated.Value(0)).current;
  const sectionFade = useRef(new Animated.Value(1)).current; // fade entre secciones

  // scale por cada otpInput
  const otpScales = useRef(Array.from({ length: 6 }, () => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(screenTransY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // logo bobbing
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBob, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(logoBob, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // fade cuando cambiamos de formulario a OTP
  useEffect(() => {
    sectionFade.setValue(0);
    Animated.timing(sectionFade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [pendingVerification]);

  const pressIn = (val: Animated.Value) =>
    Animated.spring(val, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = (val: Animated.Value) =>
    Animated.spring(val, { toValue: 1, useNativeDriver: true }).start();

  const triggerOtpShake = () => {
    otpShake.setValue(0);
    const seq = [10, -10, 8, -8, 4, -4, 0];
    Animated.sequence(seq.map(x => Animated.timing(otpShake, { toValue: x, duration: 40, useNativeDriver: true }))).start();
  };

  const onFocusScale = (val: Animated.Value) =>
    Animated.spring(val, { toValue: 1.03, useNativeDriver: true }).start();
  const onBlurScale = (val: Animated.Value) =>
    Animated.spring(val, { toValue: 1, useNativeDriver: true }).start();

  // -----------------------
  // LÓGICA (como tu código)
  // -----------------------
  const handleSignUp = async () => {
    try {
      if (!signUp) throw new Error("Clerk signUp no listo");

      if (!email || !password || !name) {
        Toast.show({ type: "error", position: "top", text1: "Faltan datos", text2: "Completa todos los campos." });
        return;
      }
      if (!EMAIL_RE.test(email)) {
        Toast.show({ type: "error", position: "top", text1: "Correo inválido", text2: "Ingresa un correo válido." });
        return;
      }
      if (password.length < 8) {
        Toast.show({ type: "error", position: "top", text1: "Contraseña muy corta", text2: "Mínimo 8 caracteres." });
        return;
      }

      setLoading(true);

      await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      Toast.show({
        type: "info",
        position: "top",
        text1: "Código enviado",
        text2: `Te enviamos un código a ${email}`,
      });

      setPendingVerification(true);
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      const msg = err?.errors?.[0]?.message || "Error al registrarse.";
      if (code === "form_identifier_exists") {
        Toast.show({ type: "error", position: "top", text1: "Correo en uso", text2: "Ya existe una cuenta con este correo." });
      } else if (code === "form_password_pwned") {
        Toast.show({ type: "warning", position: "top", text1: "Contraseña insegura", text2: "Elige otra contraseña más segura." });
      } else {
        Toast.show({ type: "error", position: "top", text1: "Error de registro", text2: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      if (!signUp) throw new Error("Clerk signUp no listo");
      const code = otp.join("");
      if (code.length < 6) {
        Toast.show({ type: "error", position: "top", text1: "Código incompleto", text2: "Ingresa los 6 dígitos." });
        return;
      }

      setVerifying(true);

      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        Toast.show({ type: "success", position: "top", text1: "Cuenta verificada", text2: "¡Bienvenido!" });
        router.replace("/(tabs)");
      } else {
        Toast.show({ type: "warning", position: "top", text1: "Falta completar", text2: "Revisa el código ingresado." });
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "Código incorrecto.";
      triggerOtpShake(); // anim: shake cuando falla verificación
      Toast.show({ type: "error", position: "top", text1: "Error de verificación", text2: msg });
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    const d = val.replace(/\D/g, "").slice(-1); // solo 1 carácter numérico
    const next = [...otp];
    next[idx] = d;
    setOtp(next);

    if (d && idx < 5) {
      otpRefs[idx + 1].current?.focus();
    }
  };

  const logoY = logoBob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={[S.container, { opacity: screenFade, transform: [{ translateY: screenTransY }] }]}>
        <Animated.Image
          source={require("@/assets/images/icon-all.png")}
          style={[S.logo, { transform: [{ translateY: logoY }] }]}
          resizeMode="contain"
        />
        <Text style={S.brand}>DiUna</Text>

        <Text style={S.subtitle}>Creamos tu nueva cuenta</Text>

        <Animated.View style={{ opacity: sectionFade }}>
          {!pendingVerification ? (
            <>
              
              <Animated.View style={[S.inputWrap, { transform: [{ scale: emailScale }] }]}>
                <Mail size={24} style={S.leftIcon} strokeWidth={1.65}/>
                <TextInput
                  style={S.input}
                  placeholder="Email"
                  placeholderTextColor="#A0A6B1"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => onFocusScale(emailScale)}
                  onBlur={() => onBlurScale(emailScale)}
                />
              </Animated.View>
              

              <Animated.View style={[S.inputWrap, { transform: [{ scale: nameScale }] }]}>
                <User size={24} style={S.leftIcon} strokeWidth={1.65}/>
                <TextInput
                  style={S.input}
                  placeholder="Nombre"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#A0A6B1"
                  onFocus={() => onFocusScale(nameScale)}
                  onBlur={() => onBlurScale(nameScale)}
                />
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: pwdScale }] }}>
                <View style={S.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={24} style={S.leftIcon} />
                  <TextInput
                    style={S.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#A0A6B1"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => onFocusScale(pwdScale)}
                    onBlur={() => onBlurScale(pwdScale)}
                  />
                  <TouchableOpacity style={S.rightIconBtn} onPress={() => setPasswordVisible((v) => !v)}>
                    <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Text style={S.legalText}>
                Al continuar aceptás nuestros <Text style={S.link}>Términos</Text> y{" "}
                <Text style={S.link}>Política de privacidad</Text>.
              </Text>

              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <TouchableOpacity
                  style={S.loginBtn}
                  onPressIn={() => pressIn(btnScale)}
                  onPressOut={() => pressOut(btnScale)}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <LottieView
                      source={require('@/assets/animations/Loading.json')}
                      autoPlay
                      loop
                      style={{ width: 220, height: 220 }}
                    />
                  ) : (
                    <Text style={S.loginBtnText}>Aceptar y continuar</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <>
              <Text style={S.introText}>
                Te enviamos un código a <Text style={S.emailText}>{email}</Text>
              </Text>

              <Animated.View style={[S.otpContainer, { transform: [{ translateX: otpShake }] }]}>
                {otp.map((digit, idx) => (
                  <Animated.View key={idx} style={{ transform: [{ scale: otpScales[idx] }] }}>
                    <TextInput
                      ref={otpRefs[idx]}
                      style={S.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onFocus={() => onFocusScale(otpScales[idx])}
                      onBlur={() => onBlurScale(otpScales[idx])}
                      onChangeText={(val) => handleOtpChange(val, idx)}
                    />
                  </Animated.View>
                ))}
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: verifyBtnScale }] }}>
                <TouchableOpacity
                  style={S.loginBtn}
                  onPressIn={() => pressIn(verifyBtnScale)}
                  onPressOut={() => pressOut(verifyBtnScale)}
                  onPress={handleVerify}
                  disabled={verifying}
                >
                  {verifying ? (
                    <LottieView
                      source={require('@/assets/animations/Loading.json')}
                      autoPlay
                      loop
                      style={{ width: 220, height: 220 }}
                    />
                  ) : (
                    <Text style={S.loginBtnText}>Verificar código</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
