import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Navigation from "expo-navigation-bar";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig/ToastConfig";
import * as SplashScreen from 'expo-splash-screen';
import WelcomeScreen from "./welcome";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    "Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "STENCIL": require("../assets/fonts/STENCIL.ttf"),

  });

  const [showWelcome, setShowWelcome] = useState(true);

  const handleFinishWelcome = useCallback(async () => {
    await SplashScreen.hideAsync();
    setShowWelcome(false);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  console.log('CLERK KEY:', process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);
  console.log('CONVEX URL:', process.env.EXPO_PUBLIC_CONVEX_URL);
  console.log('GOOGLE API KEY:', process.env.EXPO_PUBLIC_GOOGLE_API_KEY);
  console.log('FORMSPREE URL:', process.env.EXPO_PUBLIC_FORMSPREE_URL);


  useEffect(() => {
    if (Platform.OS === "android") {
      Navigation.setBackgroundColorAsync("transparent");
      Navigation.setButtonStyleAsync("light");
    }
  }, []);



  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <View style={{ flex: 1, backgroundColor: "white" }} onLayout={onLayoutRootView}>
         
              <View style={{ flex: 1 }} onLayout={fontsLoaded ? undefined : undefined}>
                <StatusBar style="dark" backgroundColor="white" />
                
                {!fontsLoaded ? null : showWelcome ? (
                  <WelcomeScreen onAnimationFinish={handleFinishWelcome} />
                ) : (
                  <InitialLayout />
                )}
                
                <Toast config={toastConfig} />
              </View>
            </View>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}