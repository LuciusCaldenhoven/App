import { Tabs } from "expo-router";
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme"
import { Heart, House, MessageCircle, Plus, User } from "lucide-react-native";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: COLORS.black,
        tabBarStyle: {
          position: "absolute",
          right: 10, // Espaciado para bordes redondeados
          left: 10,  // Espaciado para bordes redondeados
          borderTopWidth: 0,
          elevation: 5, // Sombra en Android
          height: 90,
          backgroundColor: COLORS.white, // Fondo blanco
          borderRadius: 30, // Bordes redondeados
          shadowColor: "#000", // Sombra en iOS
          shadowOffset: { width: 0, height: 5 }, // Dirección de la sombra
          shadowOpacity: 0.25, // Opacidad de la sombra
          shadowRadius: 5, // Radio de la sombra
        },
      tabBarLabelStyle: {
        fontSize: 9,
        fontFamily: "Regular",
      },

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
            <Plus  size={size } color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="mensajes"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle  size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile.screen"
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <User  size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
