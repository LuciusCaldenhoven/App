import { Tabs } from "expo-router";
import { useEffect } from "react";
import { COLORS } from "@/constants/theme";
import { Heart, House, MessageCircle, Plus, User } from "lucide-react-native";
import { usePushRegistration } from "@/lib/usePushRegistration";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { registerPush } = usePushRegistration();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      registerPush(); // solo si ya estás autenticado
    }
  }, [isSignedIn]);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarActiveTintColor: '#7ea437',
        tabBarInactiveTintColor: COLORS.black,
        tabBarStyle: {
          position: "absolute",
          right: 10,
          left: 10,
          borderTopWidth: 0,
          elevation: 5,
          height: 90,
          backgroundColor: COLORS.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Medium",
        },
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Explorar",
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          tabBarLabel: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publicar"
        options={{
          tabBarLabel: "Subir",
          tabBarIcon: ({ color, size }) => (
            <Plus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mensajes"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile.screen"
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
