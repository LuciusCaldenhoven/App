import { Tabs } from "expo-router";
import { useEffect } from "react";
import { COLORS } from "@/constants/theme";
import { Heart, House, MessageCircle, Plus, Search, User } from "lucide-react-native";
import { usePushRegistration } from "@/lib/usePushRegistration";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { registerPush } = usePushRegistration();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      try {
        registerPush(); // solo si ya estás autenticado
      } catch (error) {
        console.error("Failed to register push token", error);
      }
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
          fontSize: 10 ,
          fontFamily: "Medium",
        },
        // animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Explorar",
          tabBarIcon: ({ color, size, focused }) => (
            <Search size={size} strokeWidth={focused ? 2.4 : 1.8} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          tabBarLabel: "Favoritos",
          tabBarIcon: ({ color, size, focused }) => (
            <Heart size={size} strokeWidth={focused ? 2.4 : 1.8} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publicar"
        options={{
          tabBarLabel: "Subir",
          tabBarIcon: ({ color, size, focused }) => (
            <Plus size={size} strokeWidth={focused ? 2.4 : 1.8} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mensajes"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: ({ color, size, focused }) => (
            <MessageCircle size={size} strokeWidth={focused ? 2.4 : 1.8} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile.screen"
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size, focused }) => (
            <User size={size} strokeWidth={focused ? 2.4 : 1.8} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
