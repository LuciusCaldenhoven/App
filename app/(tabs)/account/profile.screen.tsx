import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "../account/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import ReviewComponent from "@/components/review/component";
import { renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import { router } from "expo-router";
import { scale } from "@/constants/scale";
import SingleList from "@/components/singleList/component";




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
      <ScrollView style={styles.main}>
        <View style={styles.profileContainer}>
          <View style={styles.frcg}>
            <Image source={currentUser.image} style={styles.profileImage} />
            <View>
              <Text style={styles.title}>{currentUser.fullname}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
          </View>
          <View style={styles.aic}>
            <Feather name="edit-3" size={scale(18)} color={COLORS.gray} />
            <Text style={styles.editProfile}>Edit Profile</Text>
          </View>
        </View>
        {renderMarginBottom(12)}
        <Text style={styles.title}>General</Text>
        {renderMarginBottom(6)}
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Favourite Cars"
        />
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Previous Rent"
        />
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Notification"
        />
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Partnership"
        />
        {renderMarginBottom(12)}
        <Text style={styles.title}>Support</Text>
        {renderMarginBottom(6)}
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Settings"
        />
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Languages"
        />
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Invite Friends"
        />
        <SingleList
          component={
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={scale(24)}
              color={COLORS.gray}
            />
          }
          text="Privacy Policy"
        />
      </ScrollView>
    </View>
  );
};














//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <View style={styles.headerRight}>
          
//         </View>
//       </View>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.profileInfo}>
//           {/* AVATAR & STATS */}
//           <View style={styles.avatarAndStats}>
//             <View style={styles.avatarContainer}>
//               <Image
//                 source={currentUser.image}
//                 style={styles.avatar}
//                 contentFit="cover"
//                 transition={200}
//               />
//             </View>
//           </View>
      

//         </View>
//         {posts.length === 0 && <NoPostsFound />}
//       </ScrollView>


//     </View>
//   );

// }

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
