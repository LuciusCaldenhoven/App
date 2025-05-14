import { Tabs } from "expo-router";
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme"
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarActiveTintColor: COLORS.red,
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
            <Octicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favoritos"
        options={{
          tabBarLabel: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-heart-outline" size={size + 3} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="publicar"
        options={{
          tabBarLabel: "Subir",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-outline" size={size + 3} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="mensajes"
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-square" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile.screen"
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
