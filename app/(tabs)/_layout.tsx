import { Tabs } from "expo-router";
import { useEffect } from "react";
import { COLORS } from "@/constants/theme";
import { Heart, House, MessageCircle, Plus, Search, User } from "lucide-react-native";
import { usePushRegistration } from "@/lib/usePushRegistration";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { isSignedIn } = useAuth();
  const { registerPush } = usePushRegistration();


  useEffect(() => {
    if (isSignedIn) {
      registerPush();
    }
  }, [isSignedIn, registerPush]);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarActiveTintColor: '#7ea437',
        tabBarInactiveTintColor: "#6a6a6a",
        tabBarStyle: {
          position: "absolute",
          right: 10,
          left: 10,
          borderTopWidth: 0.9,
          borderTopColor: "#e0e0e0",
          height: 90,
          backgroundColor: COLORS.white,
         
         
        },
        tabBarLabelStyle: {
          fontSize: 10 ,
          fontFamily: "Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Explorar",
          tabBarIcon: ({ color, size, focused }) => (
            <Search size={size} strokeWidth={focused ? 2.2 : 1.5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          tabBarLabel: "Favoritos",
          tabBarIcon: ({ color, size, focused }) => (
            <Heart size={size} strokeWidth={focused ? 2.2 : 1.5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publicar"
        options={{
          tabBarLabel: "Subir",
          tabBarIcon: ({ color, size, focused }) => (
            <Plus size={size} strokeWidth={focused ? 2.2 : 1.5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mensajes"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: ({ color, size, focused }) => (
            <MessageCircle size={size} strokeWidth={focused ? 2.2 : 1.5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile.screen"
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size, focused }) => (
            <User size={size} strokeWidth={focused ? 2.2 : 1.5} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
