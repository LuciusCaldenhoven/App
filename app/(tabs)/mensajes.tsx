import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import styles from "@/styles/messages.styles";
import SingleItem from "@/components/singleItem/singleItem";
import { useAuth } from "@clerk/clerk-expo";
import LottieView from "lottie-react-native";
import snap from "@/assets/animations/Chasquido.json";
import { MessageSquareText } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function MessagesScreen() {
  const chats = useQuery(api.chats.getChats);
  const { userId } = useAuth();
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const insets = useSafeAreaInsets();

  // Mantener orden estable sin recrear en cada render (evita saltos)
  const sortedChats = useMemo(() => {
    if (!chats) return [];
    return [...chats].sort((a, b) => (b.lastTime || 0) - (a.lastTime || 0));
  }, [chats]);

  return (
    // SafeArea solo abajo; la UI visual se mantiene igual
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Mensajes</Text>

        {chats === undefined ? (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 200 }}>
            <LottieView source={snap} autoPlay loop style={{ width: 240, height: 240 }} />
          </View>
        ) : sortedChats.length === 0 ? (
          <NoMessagesFound />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={sortedChats}
            renderItem={({ item: chat }) =>
              currentUser ? <SingleItem chat={chat} currentUserId={currentUser._id} /> : null
            }
            keyExtractor={(chat) => chat._id}
            // Espacio inferior real según safe area para que NO se corte el último ítem
            contentContainerStyle={{
              paddingBottom: insets.bottom + 20,
            }}
            ListFooterComponent={<View style={{ height: 4 }} />}
            showsVerticalScrollIndicator={false}
            // Evita recortes que en listas pueden producir "saltos" al renderizar
            removeClippedSubviews={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function NoMessagesFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 36,
      }}
    >
      <MessageSquareText size={40} color={COLORS.black} />
      <Text
        style={{
          fontSize: 18,
          color: COLORS.black,
          fontFamily: "Medium",
          marginTop: 18,
          marginBottom: 4,
          textAlign: "center",
        }}
      >
        No tienes ningún mensaje
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: COLORS.gray,
          fontFamily: "Regular",
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        Cuando recibas un nuevo mensaje, aparecerá acá
      </Text>
    </View>
  );
}
