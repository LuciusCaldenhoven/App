import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import NotificationItem from "@/components/notificationItem/Notification";
import { COLORS } from "@/constants/theme";
import styles from "@/styles/messages.styles"; // crea uno si quieres
import LottieView from "lottie-react-native";
import snap from "@/assets/animations/Chasquido.json";
import { router } from "expo-router";

export default function NotificationsScreen() {
  const notifications = useQuery(api.notifications.getNotifications);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const formattedNotifications = notifications?.map((n) => ({
    ...n,
    _creationTime: new Date(n._creationTime),
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="chevron-left" size={35} color={"black"} style={{ paddingLeft: 7 }} />
      </TouchableOpacity>

      <Text style={styles.title}>Notificaciones</Text>

   
      {notifications === undefined ? (
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
      ) : notifications.length === 0 ? (
        <NoNotificationsFound />
      ) : (
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
      )}
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
      <Text style={{ fontSize: 22, color: COLORS.main, marginBottom: 8, fontFamily: "Medium" }}>
        Sin notificaciones
      </Text>
      <Text style={{ fontSize: 16, color: "#888", textAlign: "center", marginBottom: 24, fontFamily: "Medium"  }}>
        Aún no tienes actividad reciente.
      </Text>
    </View>
  );
}
