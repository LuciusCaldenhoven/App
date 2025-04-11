import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Login() { 
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false); 

  const handleGoogleSignIn = async () => {
    if (isDisabled) return; 
    setIsDisabled(true); 
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });

      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("OAuth error:", error);
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
    } catch (error) {
      console.error("OAuth Facebook error:", error);
    } finally {
      setIsDisabled(false); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="globe" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>ReVende</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/auth-bg-1.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginSection}>
        {/* Google SignIn */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
          disabled={isDisabled} 
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Facebook SignIn */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleFacebookSignIn}
          activeOpacity={0.9}
          disabled={isDisabled} 
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-facebook" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}