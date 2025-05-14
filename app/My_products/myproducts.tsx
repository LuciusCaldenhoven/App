import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import styles from "../My_products/myproducts.styles";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import PostProduct from "@/components/PostProduct/PostProduct";


export default function MyProducts() {
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"En venta" | "Vendidos">("En venta");
  // Consulta para obtener los productos del usuario
  const posts = useQuery(api.posts.getPostsByUser, {});

  // Mostrar un loader mientras se cargan los datos
  if (!posts) return <Loader />;

  // Mostrar un mensaje si no hay productos
  if (posts.length === 0) return <NoProductsFound />;

  // Función para manejar el refresco
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };


  const renderContent = () => {
    if (selectedTab === "En venta") {
      if (!posts || posts.length === 0) return <NoProductsFound />;
      return (
        <FlatList
        data={posts}
        numColumns={1}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: post }) => (
          <PostProduct
            post={{
              ...post,
              author: { _id: userId || "", username: "Tú", image: "" },
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      );
    } else {
      return <NoProductsFound />;
    }
  };

  if (!posts) return <Loader />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedTab === "En venta" ? "En venta" : "Vendidos"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedTab === "En venta" && styles.activeButton]}
          onPress={() => setSelectedTab("En venta")}
        >
          <Text style={[styles.buttonText, selectedTab === "En venta" && styles.activeButtonText]} > En venta </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedTab === "Vendidos" && styles.activeButton]}
          onPress={() => setSelectedTab("Vendidos")}
        >
          <Text style={[styles.buttonText, selectedTab === "Vendidos" && styles.activeButtonText]} > Vendidos </Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );










}

function NoProductsFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>
        No tienes productos
      </Text>
    </View>
  );
}

// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, FlatList } from "react-native";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Loader } from "@/components/Loader";
// import { COLORS } from "@/constants/theme";
// import NotificationItem from "@/components/notificationItem/Notification";
// import InputComponent from "@/components/input/component";
// import { MaterialIcons } from "@expo/vector-icons";
// import styles from "@/styles/messages.styles";
// import SingleItem from "@/components/singleItem/singleItem";
// import { scale } from "@/constants/scale";
// import { renderBorderBottom } from "@/constants/ui-utils";
// import { useAuth } from "@clerk/clerk-expo";

// export default function NotificationsAndMessages() {
//   const [selectedTab, setSelectedTab] = useState<"notifications" | "messages">("notifications");

//   const notifications = useQuery(api.notifications.getNotifications);
//   const chats = useQuery(api.chats.getChats);
//   const { userId } = useAuth();
//   const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

//   const renderContent = () => {
//     if (selectedTab === "notifications") {
//       if (!notifications || notifications.length === 0) return <NoNotificationsFound />;
//       return (
//         <FlatList
//           style={{ flex: 1 }}
//           data={notifications}
//           renderItem={({ item }) => (
//             <NotificationItem
//               item={{ ...item, _creationTime: new Date(item._creationTime) }}
//               onDelete={(notification) => console.log("Eliminar:", notification)}
//             />
//           )}
//           keyExtractor={(item) => item._id}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContainer}
//         />
//       );
//     } else {
//       if (!chats || chats.length === 0) return <NoMessagesFound />;
//       return (
//         <View style={styles.container}>
//           <InputComponent
//             onChangeText={(e) => console.log(e)}
//             leftAction={<MaterialIcons color={COLORS.gray} name="search" size={scale(22)} />}
//             placeholder="Buscar mensajes"
//             containerStyle={styles.input}
//           />
//           <FlatList
//             data={chats || []}
//             renderItem={({ item: chat }) =>
//               currentUser ? <SingleItem chat={chat} currentUserId={currentUser._id} /> : null
//             }
//             keyExtractor={(chat) => chat._id}
//           />
//           {renderBorderBottom(90)}
//         </View>
//       );
//     }
//   };

//   if (!notifications || !chats) return <Loader />;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>
//         {selectedTab === "notifications" ? "Notificaciones" : "Mensajes"}
//       </Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, selectedTab === "notifications" && styles.activeButton]}
//           onPress={() => setSelectedTab("notifications")}
//         >
//           <Text
//             style={[styles.buttonText, selectedTab === "notifications" && styles.activeButtonText]}
//           >
//             Notificaciones
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, selectedTab === "messages" && styles.activeButton]}
//           onPress={() => setSelectedTab("messages")}
//         >
//           <Text
//             style={[styles.buttonText, selectedTab === "messages" && styles.activeButtonText]}
//           >
//             Mensajes
//           </Text>
//         </TouchableOpacity>
//       </View>
//       {renderContent()}
//     </View>
//   );
// }

// function NoNotificationsFound() {
//   return (
//     <View style={styles.centered}>
//       <Text style={{ fontSize: 20, color: COLORS.black }}>No hay notificaciones aún</Text>
//     </View>
//   );
// }

// function NoMessagesFound() {
//   return (
//     <View style={styles.centered}>
//       <Text style={{ fontSize: 20, color: COLORS.black }}>No hay mensajes aún</Text>
//     </View>
//   );
// }

