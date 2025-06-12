import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, Pressable } from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { styles } from "../SellerBottomSheet/SelletBottomSheet.styles";
import { Image } from "expo-image";
import ReviewComponent from "@/components/review/component";
import PostBig from "@/components/postBig/postBig";
import { router } from "expo-router";
import Animated, { useAnimatedStyle, interpolate, useSharedValue } from "react-native-reanimated";
import { Loader } from "../Loader";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ReviewComponentVertical from "../ReviewComponentVertical/ReviewComponentVertical";
import { Doc } from "@/convex/_generated/dataModel";
import { EllipsisVertical, MapPin } from "lucide-react-native";
import { TabSwitcherr } from "../TabSwitcherr";
import ProductSkeleton from "../loaders/ProductSkeleton";
import Post from "../Post";

type SellerBottomSheetProps = {
  author: Doc<"users">;
  posts: Doc<"posts">[];
  visible: boolean;
  onClose: () => void;
};


export default function SellerBottomSheet({ author, posts, visible, onClose }: SellerBottomSheetProps) {
  const scrollOffset = useSharedValue(0);
  const postsSold = useQuery(api.posts.getSoldPostsByUser, {});
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState('Productos');
  

  if (!author || !posts) return <Loader />;
  const displayName = (typeof author.fullname === 'string' && author.fullname.length > 0) ? (author.fullname.includes(' ') ? author.fullname.split(' ')[0] : author.fullname) : 'User';



  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => { onClose() }} >




      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} style={styles.closeButton} />
            </TouchableOpacity>
            <Text style={styles.title}>Perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <EllipsisVertical size={24} style={styles.closeButton} />
            </TouchableOpacity>
          </View>



          <View style={[styles.card, { flexDirection: "row", alignItems: "center" }]}>
            {/* Avatar + Rating a la izquierda */}
            <View style={{ alignItems: "center", marginRight: 16 }}>
              <View style={styles.avatarContainer}>
                {author?.image && (
                  <Image source={{ uri: author.image }} style={styles.avatar} />
                )}
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    {(author.averageRating ?? 0).toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Info textual a la derecha */}
            <View style={{ flex: 1 }}>
              <Text style={styles.textName}>{displayName}</Text>

              {author.location && (
                <View style={[styles.locationContainer, { marginTop: 4 }]}>
                  <MapPin size={20} color="black" strokeWidth={2.2}/>
                  <Text style={styles.textLocation}> {author.location}</Text>
                </View>
              )}

              {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <View style={styles.ventasContainer} />
                <Text style={{ fontSize: 15, color: "#555" }}>
                  {postsSold?.length} ventas
                </Text>
              </View> */}
            </View>
          </View>


          <View style={{alignItems:'center', paddingBottom:10 }}>
            <TabSwitcherr activeTab={activeTab} setActiveTab={setActiveTab} />
          </View>


          {activeTab === 'Productos' ? (
            !posts ? (
              <FlatList
                data={Array.from({ length: 8 })}
                numColumns={2}
                keyExtractor={(_, index) => `skeleton-${index}`}
                renderItem={() => <ProductSkeleton />}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  paddingHorizontal: 12,
                  marginBottom: 16,
                }}
                contentContainerStyle={{ paddingTop: 20 }}
              />
            ) : posts.length === 0 ? (
              <Text> no hay </Text>
            ) : (
              <FlatList
                data={posts}
                numColumns={2}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Post post={item} isBookmarked={false} />}
                columnWrapperStyle={{ justifyContent: "space-between", }}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingHorizontal: 12, }}
              />
            )
          ) : (
             author && <ReviewComponent sellerId={author._id} />
          )}



        </View >


      </View >










    </Modal>
  );
}
