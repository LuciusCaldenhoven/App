import React from "react";
import { View, Text, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import styles from "@/styles/messages.styles";
import SingleItem from "@/components/singleItem/singleItem";
import InputComponent from "@/components/input/component";
import { MaterialIcons } from "@expo/vector-icons";
import { scale } from "@/constants/scale";
import { renderBorderBottom } from "@/constants/ui-utils";
import { useAuth } from "@clerk/clerk-expo";
import LottieView from "lottie-react-native";
import snap from "@/assets/animations/Chasquido.json";

export default function MessagesScreen() {
  const chats = useQuery(api.chats.getChats);
  const { userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mensajes</Text>

      <InputComponent
        onChangeText={(e) => console.log(e)}
        leftAction={<MaterialIcons color={COLORS.gray} name="search" size={scale(22)} />}
        placeholder="Buscar mensajes"
        containerStyle={styles.input}
      />

      {/* Animación de carga si chats aún no ha llegado */}
      {chats === undefined ? (
        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 200 }}>
          <LottieView
            source={snap}
            autoPlay
            loop
            style={{
              width: 240,
              height: 240,
            }}
          />
        </View>
      ) : chats.length === 0 ? (
        <NoMessagesFound />
      ) : (
        <FlatList
          data={[...chats].sort((a, b) => (b.lastTime || 0) - (a.lastTime || 0))}
          renderItem={({ item: chat }) =>
            currentUser ? <SingleItem chat={chat} currentUserId={currentUser._id} /> : null
          }
          keyExtractor={(chat) => chat._id}
        />
      )}

    
    </View>
  );
}


function NoMessagesFound() {
  return (
    <View style={styles.centered}>
      <Text style={{ fontSize: 20, color: COLORS.black }}>No hay mensajes aún</Text>
    </View>
  );
}
