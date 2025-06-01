import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import NotificationItem from "@/components/notificationItem/Notification";
import InputComponent from "@/components/input/component";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "@/styles/messages.styles";
import SingleItem from "@/components/singleItem/singleItem";
import { scale } from "@/constants/scale";
import { renderBorderBottom } from "@/constants/ui-utils";
import { useAuth } from "@clerk/clerk-expo";

export default function NotificationsAndMessages() {
  const [selectedTab, setSelectedTab] = useState<"notifications" | "messages">("notifications");

  const notifications = useQuery(api.notifications.getNotifications);
  const chats = useQuery(api.chats.getChats);
  const { userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");
  const deleteNotification = useMutation(api.notifications.deleteNotification);




  const formattedNotifications = notifications?.map((n) => ({
    ...n,
    _creationTime: new Date(n._creationTime),
  }));

  const renderContent = () => {
    if (selectedTab === "notifications") {
      if (!notifications || notifications.length === 0) return <NoNotificationsFound />;
      return (
        <FlatList
          style={{ flex: 1 }}
          data={formattedNotifications}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onDelete={async (notification) => {
                try {
                  await deleteNotification({ notificationId: notification._id });
                } catch (err) {
                  console.error("Error al eliminar notificación:", err);
                }
              }}

            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      );
    } else {
      if (!chats || chats.length === 0) return <NoMessagesFound />;
      return (
        <View style={styles.container}>
          <InputComponent
            onChangeText={(e) => console.log(e)}
            leftAction={<MaterialIcons color={COLORS.gray} name="search" size={scale(22)} />}
            placeholder="Buscar mensajes"
            containerStyle={styles.input}
          />
          <FlatList
            data={chats || []}
            renderItem={({ item: chat }) =>
              currentUser ? <SingleItem chat={chat} currentUserId={currentUser._id} /> : null
            }
            keyExtractor={(chat) => chat._id}
          />
          {renderBorderBottom(90)}
        </View>
      );
    }
  };

  if (!notifications || !chats) return <Loader />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedTab === "notifications" ? "Notificaciones" : "Mensajes"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedTab === "notifications" && styles.activeButton]}
          onPress={() => setSelectedTab("notifications")}
        >
          <Text
            style={[styles.buttonText, selectedTab === "notifications" && styles.activeButtonText]}
          >
            Notificaciones
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedTab === "messages" && styles.activeButton]}
          onPress={() => setSelectedTab("messages")}
        >
          <Text
            style={[styles.buttonText, selectedTab === "messages" && styles.activeButtonText]}
          >
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: COLORS.background,
      }}
    >
      <Ionicons
        name="notifications-off-outline"
        size={80}
        color={COLORS.main}
        style={{ marginBottom: 20 }}
      />

      <Text style={{ fontSize: 22, fontWeight: "600", color: COLORS.main, marginBottom: 8 }}>
        Sin notificaciones
      </Text>

      <Text style={{ fontSize: 16, color: "#888", textAlign: "center", marginBottom: 24 }}>
        Aún no tienes actividad reciente.
      </Text>


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

