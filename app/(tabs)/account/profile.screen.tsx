import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "../account/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import ReviewComponent from "@/components/review/component";
import { renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import { router } from "expo-router";
import { scale } from "@/constants/scale";
import SingleList from "@/components/singleList/component";
import Button from "@/components/button/component";




export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
  });


  const posts = useQuery(api.posts.getPostsByUser, {});

  const updateProfile = useMutation(api.users.updateProfile);

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };


  if (!currentUser || posts === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title_first}>Perfil</Text>
        <View style={styles.profileContainer}>
          <View style={styles.frcg}>
            <Image source={currentUser.image} style={styles.profileImage} />
            <View>
              <Text style={styles.title}>{currentUser.fullname}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
          </View>
          <View style={styles.aic}>
            <MaterialCommunityIcons name="chevron-right" color={COLORS.gray} size={scale(24)} />
          </View>
        </View>

        {renderMarginBottom(12)}

        <View style={styles.rowBetween}>
          <Text style={styles.title}>Review ({currentUser.reviewCount})</Text>
          <Text
            onPress={() => router.push(`/review.screen/${currentUser._id}`)}
            style={styles.text}
          >
            See All
          </Text>
        </View>

        {renderMarginTop(8)}
        <ReviewComponent sellerId={currentUser._id} horizontal={true} />

        {renderMarginBottom(8)}
        <Text style={styles.title}>General</Text>
        {renderMarginBottom(6)}
        <SingleList
          component={<AntDesign name="user" size={scale(24)} color={COLORS.gray} />}
          text="Informacion Personal" />
        <SingleList
          component={<AntDesign name="inbox" size={scale(24)} color={COLORS.gray} />}
          text="Mis Productos"
          onPress={() => router.push("/My_products/myproducts")}
        />
        <SingleList
          component={<Ionicons name="megaphone-outline" size={scale(24)} color={COLORS.gray} />}
          text="Publicitar"
          onPress={() => router.push("/booking.screen/booking/booking")}
        />
        <SingleList
          component={<Ionicons name="megaphone-outline" size={scale(24)} color={COLORS.gray} />}
          text="Mas" />
        {renderMarginBottom(12)}
        <Text style={styles.title}>Ayuda</Text>
        {renderMarginBottom(6)}
        <SingleList
          component={<Ionicons name="megaphone-outline" size={scale(24)} color={COLORS.gray} />}
          text="Mas" />
        <SingleList
          component={<Ionicons name="megaphone-outline" size={scale(24)} color={COLORS.gray} />}
          text="Mas" />
        <SingleList
          component={<Ionicons name="megaphone-outline" size={scale(24)} color={COLORS.gray} />}
          text="Mas" />
        <SingleList
          component={<Ionicons name="megaphone-outline" size={scale(24)} color={COLORS.gray} />}
          text="Mas" />

        <Button
          onPress={() => signOut()}
          text="chau"
          
        />
      </ScrollView>
    </View>
  );
};




function NoPostsFound() {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="images-outline" size={48} color={COLORS.primary} />
      <Text style={{ fontSize: 20, color: COLORS.white }}>No posts yet</Text>
    </View>
  );
}
