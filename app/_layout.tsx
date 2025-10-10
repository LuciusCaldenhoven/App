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
import { router, Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Regular: require("../assets/fonts/Poppins-Regular.ttf"),
    Light: require("../assets/fonts/Poppins-Light.ttf"),
    Bold: require("../assets/fonts/Poppins-Bold.ttf"),
    Medium: require("../assets/fonts/Poppins-Medium.ttf"),
    ExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    STENCIL: require("../assets/fonts/STENCIL.ttf"),
  });

  useEffect(() => {
    // Evitar side-effects en import; llamar aquí es más predecible
    SplashScreen.preventAutoHideAsync().catch(console.warn);

    if (Platform.OS === "android") {
      Navigation.setBackgroundColorAsync("#ffffff").catch(console.warn);
      Navigation.setButtonStyleAsync("dark").catch(console.warn);
    }

    const setupChannels = async () => {
      try {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Mensajes",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 100, 250],
            enableVibrate: true,
            sound: "default",
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          });
        }
      } catch (e) {
        console.warn("Error creando canal de notificaciones:", e);
      }
    };

    const requestPerms = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          await Notifications.requestPermissionsAsync();
        }
      } catch (e) {
        console.warn("Error pidiendo permisos de notificación:", e);
      }
    };

    setupChannels();
    requestPerms();

    const subReceived = Notifications.addNotificationReceivedListener(async () => {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        console.warn("Haptics fallo:", e);
      }
    });

    const subResponse = Notifications.addNotificationResponseReceivedListener((resp) => {
      try {
        const data = resp.notification.request.content.data as Record<string, any>;
        const chatId = data?.chatId;
        if (typeof chatId === "string" && chatId.length) {
          // ruta simple y robusta
          router.push(`/chat/${chatId}`);
        }
      } catch (e) {
        console.warn("Error manejando respuesta de notificación:", e);
        // Aquí podrías enviar a Sentry si lo integras
      }
    });

    return () => {
      subReceived.remove();
      subResponse.remove();
    };
  }, [router]); // si eslint te pide cambio, puedes usar [] si sabes que router es estable

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <View style={{ flex: 1, backgroundColor: "white" }} onLayout={onLayoutRootView}>
              <InitialLayout />
              <Stack screenOptions={{ headerShown: false, animation: "default" }}>
                <Stack.Screen name="(auth)/login" options={{ animation: "fade" }} />
                <Stack.Screen name="(auth)/register" />
                <Stack.Screen name="(auth)/reset-password" />
                <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
                <Stack.Screen name="product/[productId]" />
                <Stack.Screen name="InfoProducto/infoProducto" />
                <Stack.Screen name="editProfile/editProfile" />
                <Stack.Screen name="general/My_products/myproducts" />
                <Stack.Screen name="general/EditProduct/[editProductId]" />
                <Stack.Screen name="search/searchResults" />
                <Stack.Screen name="search/searchCategory" />
                <Stack.Screen name="search/searchOverlay" />
                <Stack.Screen name="chat/[chatid]" />
                <Stack.Screen name="product/Profile_2" />
                <Stack.Screen name="search/filter" />
                <Stack.Screen name="soporte/ContactarSoporte" />
                <Stack.Screen name="soporte/PreguntasFrecuentes" />
                <Stack.Screen name="soporte/ReportarProblema" />
                <Stack.Screen name="notificaciones/notificaciones" />
                <Stack.Screen name="working/working" />
                 <Stack.Screen name="location/LocationPickerScreen" options={{ animation: "slide_from_bottom" }} />
                  <Stack.Screen name="pay/detalles" />
                  <Stack.Screen name="pay/summary" />
                  <Stack.Screen name="pay/tarjeta" />
                  <Stack.Screen name="pay/metodoPago" />
                  <Stack.Screen name="pay/PaymentProcessingOverlay" />
              </Stack>
              <Toast config={toastConfig} />
              <StatusBar style="dark" />
            </View>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}


