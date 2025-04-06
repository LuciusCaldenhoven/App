import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import { SplashScreen } from "expo-router";
import * as Navigation from "expo-navigation-bar";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";

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
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS === "android") {
      Navigation.setBackgroundColorAsync("#000000");
      Navigation.setButtonStyleAsync("light");
    }
  }, []);


  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} onLayout={onLayoutRootView}>
          <InitialLayout />
            
          {/* Capa negra solo en la parte inferior */}
          <View style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 34, // Altura típica del área segura en iOS
            backgroundColor: "white",
          }} />
        </SafeAreaView>
      </SafeAreaProvider>
    
    </ClerkAndConvexProvider>
  );
}
