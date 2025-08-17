import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Check, Mail } from "lucide-react-native";
import LottieView from "lottie-react-native";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const loginDisabled = useMemo(
    () => !EMAIL_RE.test(email) || password.length < 6 || !agreed || loading || !isLoaded,
    [email, password, agreed, loading, isLoaded]
  );

  const handleLogin = async () => {
    if (!signIn || loginDisabled) return;
    setLoading(true);
    try {
      // 1) Inicializa el intento con el identificador
      await signIn.create({ identifier: email });

      // 2) Intenta el primer factor con contraseña
      const attempt = await signIn.attemptFirstFactor({
        strategy: "password",
        password,
      });

      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive?.({ session: attempt.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      // Estados alternos (OTP, MFA, etc.)
      Toast.show({
        type: "info",
        text1: "Se requiere verificación adicional",
        text2: "Completa el flujo de autenticación.",
      });
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      const msg = err?.errors?.[0]?.message || "No se pudo iniciar sesión.";
      if (code === "form_identifier_not_found") {
        // Email no existe → vamos a registro precargando email
        router.push({ pathname: "/register", params: { email } });
      } else if (code === "form_password_incorrect") {
        Toast.show({ type: "error", text1: "Contraseña incorrecta" });
      } else {
        Toast.show({ type: "warning", text1: `Error`, text2: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    router.push({ pathname: "/reset-password", params: { email } });
  };

  const handleGoogle = async () => {
    if (loadingGoogle) return;
    setLoadingGoogle(true);
    try {
      const { createdSessionId, setActive: setActiveFromSSO } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActiveFromSSO && createdSessionId) {
        await setActiveFromSSO({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error con Google",
        text2: e?.errors?.[0]?.message || "Intenta de nuevo.",
      });
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   


        <View style={S.container}>
          <Image
            source={require("@/assets/images/icon-all.png")} // pon tu logo
            style={S.logo}
            resizeMode="contain"
          />
          <Text style={S.brand}>DiUna</Text>

          <Text style={S.subtitle}>¿Ya tienes una cuenta?</Text>

          {/* Email */}
          <View style={S.inputWrap}>
            <Mail size={24} style={S.leftIcon} strokeWidth={1.65}/>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#A0A6B1"
              style={S.input}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={S.inputWrap}>
            <Ionicons name="lock-closed-outline" size={24} style={S.leftIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              placeholderTextColor="#A0A6B1"
              secureTextEntry={!showPwd}
              style={S.input}
              returnKeyType="done"
            />
            <TouchableOpacity style={S.rightIconBtn} onPress={() => setShowPwd((v) => !v)}>
              <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={20} />
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity onPress={handleForgot} style={S.forgotBtn}>
            <Text style={S.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Check de términos */}
          <TouchableOpacity style={S.termsRow} onPress={() => setAgreed((v) => !v)} activeOpacity={1} >
            <View style={[S.checkbox, agreed && S.checkboxOn]}>
              {agreed && <Check size={14} color="#fff" strokeWidth={3.5} />}
            </View>
            <Text style={S.termsText}>
              Confirmo que he leído y acepto los{" "}
              <Text
                style={S.link}
              >
                Términos y la Política
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Login */}
          <TouchableOpacity
            style={[S.loginBtn, loginDisabled && { opacity: 0.6 }]}
            disabled={loginDisabled}
            onPress={handleLogin}
          >
            {loading ? (
              <LottieView
                  source={require('@/assets/animations/Loading.json')}
                  autoPlay
                  loop
                  style={{ width: 220, height: 220 }}
                />
            ) : (
              <Text style={S.loginBtnText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={S.divider}>
            <View style={S.line} />
            <Text style={S.or}>o</Text>
            <View style={S.line} />
          </View>

          {/* Google */}
          <TouchableOpacity style={S.googleBtn} onPress={handleGoogle} disabled={loadingGoogle}>
            <Image
              source={require("@/assets/images/Google.png")}
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
              <Text style={S.googleText}>Continuar con Google</Text>
        
          </TouchableOpacity>

          {/* Register */}
          <Text style={S.bottomText}>
            ¿No tienes una cuenta?{" "}
            <Text style={S.link} onPress={() => router.push({ pathname: "/register", params: { email } })}>
              Regístrate aquí
            </Text>
          </Text>
        </View>

    </TouchableWithoutFeedback>
  );
}

const S: Record<string, any> = {
  container: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 37, paddingTop: 70 },
  bg: { position: "absolute", width: "100%", height: "100%", opacity: 0.35 },
  
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
  leftIcon: { marginRight: 14, color: "black" },
  rightIconBtn: { paddingHorizontal: 4, paddingVertical: 6 },

  forgotBtn: { alignSelf: "flex-end", marginTop: 14, marginBottom: 10 },
  forgotText: { color: "#F97066", textDecorationLine: "underline", fontFamily: "Regular" },

  termsRow: { flexDirection: "row", marginTop: 16, alignItems: "flex-start", gap: 10},
  checkbox: {
    width: 20, height: 20, borderRadius: 20,
    borderWidth: 1, borderColor: "#98A2B3", alignItems: "center", justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxOn: { backgroundColor: "#adc92b", borderColor: "#adc92b" },
  termsText: { flex: 1, color: "#344054", fontFamily:"Regular" },
  link: { color: "#adc92b", textDecorationLine: "underline" },

  loginBtn: {
    height: 54, borderRadius: 25, backgroundColor: "#adc92b",
    alignItems: "center", justifyContent: "center", marginTop: 22,
  },
  loginBtnText: { color: "#fff", fontSize: 17, fontFamily:"Medium" },

  divider: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: "#E4E7EC" },
  or: { marginHorizontal: 10, color: "#98A2B3" },

  googleBtn: {
    height: 52, borderRadius: 25, backgroundColor: "#eff4d5",
    flexDirection: "row", alignItems: "center", justifyContent: "center",
  },
  googleText: { color: "#344054", fontFamily: "Medium", fontSize: 17 },

  bottomText: { textAlign: "center", marginTop: 60, color: "#667085", fontFamily: "Regular" },
};
