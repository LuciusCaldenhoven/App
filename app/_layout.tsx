import { SafeAreaProvider } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import * as Navigation from "expo-navigation-bar";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig/ToastConfig";
import * as SplashScreen from "expo-splash-screen";
import { Slot, Stack } from "expo-router";

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

  useEffect(() => {
    if (Platform.OS === "android") {
      Navigation.setBackgroundColorAsync("transparent");
      Navigation.setButtonStyleAsync("light");
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <View style={{ flex: 1, backgroundColor: "white" }} onLayout={onLayoutRootView}>
              <StatusBar style="dark" backgroundColor="white" />
              <InitialLayout />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "default",
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="product/[productId]" />
                <Stack.Screen name="InfoProducto/infoProducto" />
                <Stack.Screen name="editProfile/editProfile" />
                <Stack.Screen name="general/My_products/myproducts" />
                <Stack.Screen name="general/EditProduct/[editProductId]" />
                <Stack.Screen name="search/searchResults" />
                <Stack.Screen name="chat/[chatid]" />
                <Stack.Screen name="product/Profile_2" />
                <Stack.Screen name="general/reviews" />
                <Stack.Screen name="search/filter" />
                <Stack.Screen name="soporte/ContactarSoporte" />
                <Stack.Screen name="soporte/PreguntasFrecuentes" />
                <Stack.Screen name="soporte/ReportarProblema" />
                <Stack.Screen name="notificaciones/notificaciones" />
              </Stack>
              <Toast config={toastConfig} />
            </View>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}