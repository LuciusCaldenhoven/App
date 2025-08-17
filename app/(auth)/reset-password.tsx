import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";
import { Mail } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

// ⚠️ Mismos estilos S que compartiste (copiados tal cual)
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

  viewText: { color: "#adc92b", fontFamily: "Medium", fontSize: 14 },

  loginBtn: {
    height: 54,
    borderRadius: 25,
    backgroundColor: "#adc92b",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
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
   leftIcon: { marginRight: 14, color: "black" },
  rightIconBtn: { paddingHorizontal: 4, paddingVertical: 6 },
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { signIn, setActive } = useSignIn();

  // Etapas: primero email → luego código+password
  const [stage, setStage] = useState<"email" | "code">("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [sendingCode, setSendingCode] = useState(false);
  const [submittingReset, setSubmittingReset] = useState(false);

  const otpRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendCode = async () => {
    try {
      if (!signIn) throw new Error("Clerk no está listo");
      if (!EMAIL_RE.test(email)) {
        Toast.show({ type: "error", position: "top", text1: "Correo inválido", text2: "Ingresa un correo válido." });
        return;
      }
      setSendingCode(true);

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      Toast.show({
        type: "info",
        position: "top",
        visibilityTime: 3000,
        text1: "Código enviado",
        text2: "Revisa tu correo e ingresa el código de 6 dígitos.",
      });

      setStage("code");
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      if (code === "form_identifier_not_found") {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Correo no encontrado",
          text2: "No existe una cuenta con ese correo.",
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "No se pudo enviar el código",
          text2: err?.errors?.[0]?.message || "Intenta de nuevo.",
        });
      }
    } finally {
      setSendingCode(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    const d = val.replace(/\D/g, "").slice(-1); // solo 1 dígito
    const next = [...otp];
    next[idx] = d;
    setOtp(next);
    if (d && idx < 5) otpRefs[idx + 1].current?.focus();
  };

  const handleResetPassword = async () => {
    try {
      if (!signIn) throw new Error("Clerk no está listo");
      const code = otp.join("");

      if (code.length < 6) {
        Toast.show({ type: "error", position: "top", text1: "Código incompleto", text2: "Ingresa los 6 dígitos." });
        return;
      }
      if (newPassword.length < 6) {
        Toast.show({ type: "error", position: "top", text1: "Contraseña muy corta", text2: "Mínimo 6 caracteres." });
        return;
      }

      setSubmittingReset(true);

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        Toast.show({
          type: "success",
          position: "top",
          visibilityTime: 3000,
          text1: "Contraseña cambiada con éxito",
          text2: "Ahora puedes iniciar sesión con tu nueva contraseña.",
        });
        router.replace("/(tabs)");
      } else {
        Toast.show({
          type: "warning",
          position: "top",
          visibilityTime: 3000,
          text1: "Falta completar",
          text2: "Revisa el código y la contraseña.",
        });
      }
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      if (code === "form_code_incorrect" || code === "form_param_code_invalid") {
        Toast.show({
          type: "error",
          position: "top",
          visibilityTime: 3000,
          text1: "Código incorrecto",
          text2: "Por favor verifica el código ingresado.",
        });
      } else if (code === "form_password_pwned") {
        Toast.show({
          type: "warning",
          position: "top",
          visibilityTime: 3000,
          text1: "Contraseña insegura",
          text2: "Esa contraseña es demasiado común. Elige otra.",
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          visibilityTime: 3000,
          text1: "No se pudo restablecer",
          text2: err?.errors?.[0]?.message || "Intenta de nuevo.",
        });
      }
    } finally {
      setSubmittingReset(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={S.container}>
        <Image
          source={require("@/assets/images/icon-all.png")}
          style={S.logo}
          resizeMode="contain"
        />
        <Text style={S.brand}>DiUna</Text>

        <Text style={S.subtitle}>
          {stage === "email" ? "Ingresa tu correo para enviarte un código" : "Ingresa el código y tu nueva contraseña"}
        </Text>

        {stage === "email" ? (
          <>
            {/* Email */}
            <View style={S.inputWrap}>
              <Mail size={24} style={S.leftIcon} strokeWidth={1.65}/>
              <TextInput
                style={S.input}
                placeholder="Email"
                placeholderTextColor="#A0A6B1"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Enviar código */}
            <TouchableOpacity style={S.loginBtn} onPress={handleSendCode} disabled={sendingCode} activeOpacity={0.8}>
              {sendingCode ? (
                <LottieView
                                  source={require('@/assets/animations/Loading.json')}
                                  autoPlay
                                  loop
                                  style={{ width: 220, height: 220 }}
                                />
              ) : (
                <Text style={S.loginBtnText}>Enviar código</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Email mostrado */}
            <Text style={S.introText}>
              Te enviamos un código a <Text style={S.emailText}>{email}</Text>
            </Text>

            {/* OTP 6 casillas */}
            <View style={S.otpContainer}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={otpRefs[idx]}
                  style={S.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, idx)}
                />
              ))}
            </View>

            {/* Nueva contraseña */}
            <View style={S.inputWrap}>
              <Ionicons name="lock-closed-outline" size={24} style={S.leftIcon} />
              <TextInput
                style={S.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#A0A6B1"
                secureTextEntry={!passwordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
               <TouchableOpacity style={S.rightIconBtn} onPress={() => setPasswordVisible((v) => !v)}>
                  <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} />
                </TouchableOpacity>
            </View>

            {/* Restablecer */}
            <TouchableOpacity
              style={S.loginBtn}
              onPress={handleResetPassword}
              disabled={submittingReset}
              activeOpacity={0.8}
            >
              {submittingReset ? (
                <LottieView
                  source={require('@/assets/animations/Loading.json')}
                  autoPlay
                  loop
                  style={{ width: 220, height: 220 }}
                />
              ) : (
                <Text style={S.loginBtnText}>Restablecer contraseña</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
