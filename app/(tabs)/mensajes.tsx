import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import NotificationItem from "@/components/notificationItem/Notification";
import InputComponent from "@/components/input/component";
import { MaterialIcons } from "@expo/vector-icons";
import { createStyles } from '@/components/singleItem/message.styles';
import SingleItem from "@/components/singleItem/singleItem";
import { scale } from "@/constants/scale";
import { renderBorderBottom } from "@/constants/ui-utils";
import { useAuth } from "@clerk/clerk-expo";


export default function NotificationsAndMessages() {
  const [selectedTab, setSelectedTab] = useState<"notifications" | "messages">( "notifications" );

  const estilos = createStyles();

  const notifications = useQuery(api.notifications.getNotifications);
  const chats = useQuery(api.chats.getChats);
  const { userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  const renderContent = () => {
    if (selectedTab === "notifications") {
      if (!notifications || notifications.length === 0) return <NoNotificationsFound />;
      return (
        <FlatList
          style={{ flex: 1 }}
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem item={{ ...item, _creationTime: new Date(item._creationTime) }}
              onDelete={(notification) => console.log("Eliminar:", notification)} /> )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer} />
      );
    } 
    else {
      if (!chats || chats.length === 0) return <NoMessagesFound />;
      return (
        <View style={styles.container}>
          <View style={estilos.main}>
            <InputComponent onChangeText={e => console.log(e)} leftAction={ <MaterialIcons color={COLORS.gray} name="search" size={scale(22)} />}
              placeholder="Search...."
              containerStyle={estilos.input} />
            <FlatList
              data={chats || []} 
              renderItem={({ item: chat }) => (
                currentUser ? <SingleItem chat={chat} currentUserId={currentUser._id} /> : null
              )}
              keyExtractor={(chat) => chat._id} />
            {renderBorderBottom(90)}
          </View>
        </View>
      );
    }
  };

  if (!notifications || !chats) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[ styles.button, selectedTab === "notifications" && styles.activeButton, ]} onPress={() => setSelectedTab("notifications")} >
          <Text style={[ styles.buttonText, selectedTab === "notifications" && styles.activeButtonText, ]} >
            Notificaciones 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ styles.button, selectedTab === "messages" && styles.activeButton, ]} onPress={() => setSelectedTab("messages")} >
          <Text style={[ styles.buttonText, selectedTab === "messages" && styles.activeButtonText, ]} >
            Mensajes
          </Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
}

function NoNotificationsFound() {
  return (
    <View style={styles.centered}>
      <Text style={{ fontSize: 20, color: COLORS.black }}>
        No hay notificaciones aún
      </Text>
    </View>
  );
}

function NoMessagesFound() {
  return (
    <View style={styles.centered}>
      <Text style={{ fontSize: 20, color: COLORS.black }}>
        No hay mensajes aún
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 120,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 30,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    alignItems: "center",

  },
  activeButton: {
    backgroundColor: COLORS.black,
  },
  buttonText: {
    fontSize: 12,
    color: COLORS.black,
    fontFamily: "Regular",
  },
  activeButtonText: {
    color: "#fff",
    fontFamily: "Regular",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});

