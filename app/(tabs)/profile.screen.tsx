import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import styles from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import ReviewComponent from "@/components/review/component";
import { renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import { router } from "expo-router";
import { scale } from "@/constants/scale";
import SingleList from "@/components/singleList/component";
import Button from "@/components/button/component";
import LoaderPosts from "@/components/loaders/loaderPosts";
import ReviewComponentVertical from "@/components/ReviewComponentVertical/ReviewComponentVertical";
import { LogOut, Mail, Megaphone, MessageCircleQuestion, PackageSearch, Star } from "lucide-react-native";

function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  // Obtener las publicaciones del usuario


  // Mutación para actualizar el perfil
  const updateProfile = useMutation(api.users.updateProfile);

  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
  });

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };

  // Mostrar un loader si los datos aún no están disponibles
  if (!currentUser) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <View style={{ transform: [{ scale: 1.5 }] }}>
          <LoaderPosts />
        </View>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 200 }}>
        <Text style={styles.title_first}>Perfil</Text>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.frcg}
            onPress={() =>
              router.push({
                pathname: "/editProfile/editProfile",
                params: { currentUser: JSON.stringify(currentUser) },
              })
            }
          >
            <Image source={currentUser.image} style={styles.profileImage} />
            <View style={{ paddingRight: 250 }}>
              <Text numberOfLines={1} style={styles.title}>
                {currentUser.fullname}
              </Text>
              <Text numberOfLines={1} style={styles.email}>
                {currentUser.email}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              color={COLORS.gray}
              size={scale(24)}
              style={{ marginLeft: 60 }}
            />
          </TouchableOpacity>
        </View>

        {renderMarginBottom(12)}

        {renderMarginTop(8)}


        {renderMarginBottom(8)}
        <Text style={styles.title}>General</Text>
        {renderMarginBottom(6)}
        <SingleList
          component={<AntDesign name="user" size={scale(24)} color={COLORS.black} />}
          text="Informacion Personal"
        />
        <SingleList
          component={<PackageSearch size={scale(24)} color={COLORS.black} />}
          text="Mis Productos"
          onPress={() => router.push("/general/My_products/myproducts")}
        />
        <SingleList
          component={<Star size={scale(24)} color={COLORS.black} />}
          text="Mis Reviews"
          onPress={() => router.push("/general/reviews")}
        />
        <SingleList
          component={<Megaphone size={scale(24)} color={COLORS.black} />}
          text="Publicitar"
          onPress={() => router.push("/working/working")}
        />
        {renderMarginBottom(12)}
        <Text style={styles.title}>Soporte</Text>
        {renderMarginBottom(6)}
        <SingleList
          component={<MessageCircleQuestion size={scale(24)} color={COLORS.black} />}
          text="Preguntas frecuentes"
          onPress={() => router.push("/soporte/PreguntasFrecuentes")}
        />
        <SingleList
          component={<Feather name="tool" size={scale(24)} color={COLORS.black} />}
          text="Reportar un problema"
          onPress={() => router.push("/soporte/ReportarProblema")}
        />
        <SingleList
          component={<Mail size={scale(22)} color={COLORS.black} />}
          text="Contactar soporte"
          onPress={() => router.push("/soporte/ContactarSoporte")}
        />
        <View style={{paddingTop: 10}}>
          <Button
            text="Cerrar Sesion"
            textStyles={styles.outlineButtonText}
            buttonStyles={styles.iconButtonStyle}
            component={<LogOut size={scale(20)} />}
            onPress={() => signOut()}
          />
        </View>

      </ScrollView>
    </View>
  );
}

export default Profile;


