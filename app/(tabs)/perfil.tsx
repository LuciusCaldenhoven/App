import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, Platform } from "react-native";
import { Image } from "expo-image";
import ReviewComponent from "@/components/review/component";
import { renderMarginTop } from "@/constants/ui-utils";
import { router } from "expo-router";




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
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          {/* AVATAR & STATS */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>
          </View>
          {renderMarginTop(18)}
          <View style={styles.profile}>
            <Text style={styles.title}>Review ({currentUser.reviewCount})</Text>
            <Text
              onPress={() => router.push(`/review.screen/${currentUser._id}`)
              }
              style={styles.text}>See All</Text>
          </View>
          {renderMarginTop(12)}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[1]} // no importa, renderizamos 1 solo bloque
            renderItem={() => (
              <ReviewComponent sellerId={currentUser._id} />
            )}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`/booking.screen/booking`)}
          >
            <Text style={styles.buttonText}>Publicita</Text>
          </TouchableOpacity>

        </View>
        {posts.length === 0 && <NoPostsFound />}
      </ScrollView>


    </View>
  );

}

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
