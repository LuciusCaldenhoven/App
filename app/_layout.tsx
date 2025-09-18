// app/_layout.tsx
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
import { Stack, useRouter } from "expo-router";
import * as Sentry from "@sentry/react-native";

// 👇 Notificaciones y haptics
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";

// (opcional) si quieres token de push sin warnings en EAS
// import Constants from "expo-constants";

SplashScreen.preventAutoHideAsync().catch(console.warn);

Sentry.init({
  dsn: "https://72764997257966ae36443d94dd37d6e4@o4509735474495488.ingest.us.sentry.io/4509735477116928",
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

// iOS: handler global (alerta/sonido/badge)
// En Android no afecta vibración: eso lo define el canal abajo.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default Sentry.wrap(function RootLayout() {
  const router = useRouter();

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
    // UI de barra Android
    if (Platform.OS === "android") {
      Navigation.setBackgroundColorAsync("#ffffff");
      Navigation.setButtonStyleAsync("dark");
    }

    // ANDROID: canal con vibración (nombre debe coincidir con channelId del payload)
    const setupChannels = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Mensajes",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 100, 250], // vibra, pausa, vibra
          enableVibrate: true,
          sound: "default",
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }
    };

    // Permisos iOS (en Android no hace falta pedir explícito)
    const requestPerms = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

    };

    setupChannels();
    requestPerms();

    // Foreground: vibra (haptics) cuando llega notificación con app abierta
    const subReceived = Notifications.addNotificationReceivedListener(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });

    // Al tocar la notificación: leer data y navegar al chat
    const subResponse = Notifications.addNotificationResponseReceivedListener((resp) => {
      try {
        const data = resp.notification.request.content.data as any;
        const chatId = data?.chatId;
        if (chatId) {
          router.push({ pathname: "/chat/[chatid]", params: { chatid: chatId } });
        }
      } catch (e) {
        // Puedes loguear en Sentry si deseas
        // Sentry.captureException(e);
      }
    });

    return () => {
      subReceived.remove();
      subResponse.remove();
    };
  }, [router]);

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
              </Stack>
              <Toast config={toastConfig} />
              <StatusBar style="dark" />
            </View>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
});
