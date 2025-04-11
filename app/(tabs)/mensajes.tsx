import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import Notification from "@/components/Notification";


export default function NotificationsAndMessages() {
  const [selectedTab, setSelectedTab] = useState<"notifications" | "messages">(
    "notifications"
  );

  const notifications = useQuery(api.notifications.getNotifications);
 

  if (!notifications ) return <Loader />;

  const renderContent = () => {
    if (selectedTab === "notifications") {
      if (notifications.length === 0) return <NoNotificationsFound />;
      return (
        <FlatList
          data={notifications}
          renderItem={({ item }) => <Notification notification={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      );
    } else {
     
      return (
        <View>
          <Text> hola </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Botones de selección */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "notifications" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("notifications")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "notifications" && styles.activeTabText,
            ]}
          >
            Notificaciones
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "messages" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("messages")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "messages" && styles.activeTabText,
            ]}
          >
            Mensajes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      {renderContent()}
    </View>
  );
}

function NoNotificationsFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={{ fontSize: 20, color: COLORS.black }}>
        No hay notificaciones aún
      </Text>
    </View>
  );
}

function NoMessagesFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={{ fontSize: 20, color: COLORS.black }}>
        No hay mensajes aún
      </Text>
    </View>
  );
}