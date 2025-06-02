import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import { SplashScreen, useRouter } from "expo-router";
import * as Navigation from "expo-navigation-bar";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig/ToastConfig";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    "Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),


  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  

  useEffect(() => {
    if (Platform.OS === "android") {
      Navigation.setBackgroundColorAsync("transparent");
      Navigation.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        {/* Configura el fondo blanco detrás del StatusBar */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <View style={{ flex: 1, backgroundColor: "white" }} onLayout={onLayoutRootView}>
              {/* Configura el StatusBar global */}
              <StatusBar style="dark" backgroundColor="white" />
              <InitialLayout />
              
              <Toast config={toastConfig} />
            </View>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}