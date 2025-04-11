import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import InputComponent from "@/components/input/component";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createStyles } from "../review.screen/review.screen.styles";
import ReviewComponent from "@/components/review/component";

export default function SellerReviewsScreen() {
  const { sellerId } = useLocalSearchParams();
  const reviews = useQuery(api.reviews.getReviewsByUser, {
    userId: sellerId as Id<"users">,
  });

  const styles = createStyles();
  if (!reviews) return <Loader />;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={30} />
      </TouchableOpacity>
      <View style={styles.header}>
        <InputComponent
          onChangeText={(e) => console.log(e)}
          leftAction={
            <MaterialIcons
              color={COLORS.gray}
              name="search"
              size={scale(22)}
            />
          }
          placeholder="Find Reviews..."
        />
      </View>

      
      <ReviewComponent sellerId={sellerId as Id<"users">} containerStyle={styles.reviewCard} />
        
        
    
    </View>
  );
}




