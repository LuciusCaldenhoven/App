import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Leaf, PiggyBank, Recycle, Star } from "lucide-react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { Doc, Id } from "@/convex/_generated/dataModel";
import MapView, { Circle, Marker } from "react-native-maps";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import DiscountInfo from "../DiscountInfo/DiscountInfo ";
import { router } from "expo-router";
import { useChatNavigation } from "@/lib/useChatNavigation";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

interface SellerInfoProps {
  author: Doc<"users">;
  post: Doc<"posts"> & { isBookmarked: boolean };
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  openBottomSheet: () => void;
}

const ProductSellerInfo = ({ author, post,bottomSheetRef,openBottomSheet}: SellerInfoProps) => {
  const [textLines, setTextLines] = useState(0);
  const [showAll, setShowAll] = useState(false);
 



  const { goToChat } = useChatNavigation();
  const shouldShowMore = textLines > 10;





  return (
    <View style={styles.details}>
      <View style={styles.titleRow}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10 }}>
          <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.priceText}>
              {post.currency === "USD" ? "$" : "S/"} {post.price}
            </Text>
        </View>
      </View>

      <View style={{ paddingLeft: 16 }}>
        <Text style={styles.infoText}>
          {" "}
          Publicado{" "}
          {formatDistanceToNow(new Date(post._creationTime), {
            addSuffix: true,
            locale: es,
          })}{" "}
        </Text>
        <Text style={styles.infoText}> en {post.location} </Text>
      </View>

      <View style={styles.infoTagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Tipo:</Text>
          <Text style={styles.tagValue}>{post.tipo}</Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Categoría:</Text>
          <Text style={styles.tagValue}>{post.category}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Condicion:</Text>
          <Text style={styles.tagValue}>{post.condition}</Text>
        </View>
      </View>

      <View style={styles.line} />
      <View style={styles.boxFast}>
        <View style={styles.headerFast}>
          <Text style={styles.titleFast}>
            ⚡️ Envía un mensaje rápido al vendedor
          </Text>
        </View>
        <View style={styles.rowFast}>
          <View style={styles.inputFast}>
            <Text style={styles.placeholderFast}>Hola. ¿Sigue disponible?</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonFast}
            activeOpacity={0.8}
            onPress={() =>
              goToChat({
                postUserId: post.userId,
                postId: post._id,
                text: "Hola. ¿Sigue disponible?",
              })
            }
          >
            <Text style={styles.buttonTextFast}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
      {/* Descripcion  */}
      <View style={styles.descriptionWrapper}>
        <Text style={styles.description}>Descripción</Text>
        <View>
          <Text
            style={[
              styles.descText,
              { position: "absolute", opacity: 0, zIndex: -1 },
            ]}
            onTextLayout={(e) => setTextLines(e.nativeEvent.lines.length)}
          >
            {post.caption}
          </Text>

          <Text
            style={styles.descText}
            numberOfLines={showAll ? undefined : 10}
          >
            {post.caption}
          </Text>
        </View>

        {shouldShowMore && (
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => setShowAll(!showAll)}>
              <Text style={styles.toggleButton}>
                {showAll ? "Ver menos" : "Ver más"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.line} />
      <View style={{ paddingHorizontal: 15 }}>
        <DiscountInfo bottomSheetRef={bottomSheetRef} openBottomSheet={openBottomSheet}/>
      </View>

      {/* Info vendedor */}
      <View style={styles.line} />
      <Text style={[styles.description, { paddingLeft: 16 }]}>
        Informacion del vendedor
      </Text>
      <TouchableOpacity
        style={styles.sellerContainer}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "./Profile",
            params: { authorId: author._id },
          })
        }
      >
        <Image source={{ uri: author.image }} style={styles.sellerAvatar} />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName} numberOfLines={1}>
            {author.fullname}
          </Text>
          <View style={styles.sellerRatingRow}>
            <Star size={16} color={COLORS.main} />
            <Text style={styles.sellerRatingText}>
              {author.averageRating.toFixed(1)} • {author.reviewCount} reseñas
            </Text>
          </View>
        </View>
      </TouchableOpacity>
            <TouchableOpacity
        style={styles.sellerContainer}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "./Profile_2",
            params: { authorId: author._id },
          })
        }
      >
        <Image source={{ uri: author.image }} style={styles.sellerAvatar} />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName} numberOfLines={1}>
            {author.fullname}
          </Text>
          <View style={styles.sellerRatingRow}>
            <Star size={16} color={COLORS.main} />
            <Text style={styles.sellerRatingText}>
              {author.averageRating.toFixed(1)} • {author.reviewCount} reseñas
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.line} />

      {/* Mapa */}

      <Text style={[styles.description, { paddingLeft: 16 }]}>
        Ubicacion disponible
      </Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: post.lat,
          longitude: post.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}
      >
        <Circle
          center={{ latitude: post.lat, longitude: post.lng }}
          radius={6000}
          strokeWidth={3}
          strokeColor="#0066cc"
          fillColor="rgba(0, 102, 204, 0.2)"
        />
      </MapView>

    </View>
  );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  details: {
    marginTop: -SIZES.large,
    backgroundColor: COLORS.white,
    width: width,
    borderTopLeftRadius: SIZES.medium + 5,
    borderTopRightRadius: SIZES.medium + 5,
    paddingVertical: 12,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 21,
    fontFamily: "SemiBold",
    color: COLORS.main,
    flexShrink: 1,
  },
  conditionTag: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 12,
  },
  conditionText: {
    fontSize: 14,
    color: COLORS.main,
    fontWeight: "600",
  },
  infoText: {
    fontFamily: "Regular",
    fontSize: 13,
    color: "grey",

    paddingTop: 2,
  },
  infoTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  tag: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  tagLabel: {
    fontFamily: "Medium",
    color: COLORS.gray,
    marginRight: 4,
    fontSize: 13,
  },
  tagValue: {
    fontFamily: "SemiBold",
    color: COLORS.main,
    fontSize: 13,
  },
  line: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  descriptionWrapper: {
    paddingHorizontal: 20,
  },
  description: {
    fontFamily: "Medium",
    fontSize: 20,
    paddingBottom: 12,
    color: COLORS.main,
  },
  descText: {
    fontFamily: "Regular",
    fontSize: 15,
    textAlign: "justify",
    marginBottom: SIZES.small,
    lineHeight: 22,
  },
  toggleContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  toggleButton: {
    marginTop: 8,
    fontSize: 13,
    color: "#007AFF",
    fontFamily: "Medium",
  },
  sellerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "white",
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  sellerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  sellerName: {
    fontSize: 16,
    fontFamily: "SemiBold",
    color: COLORS.main,
  },
  sellerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  sellerRatingText: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: "Regular",
  },
  map: {
    width: "90%",
    height: 100,
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
  },
  boxFast: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerFast: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  titleFast: {
    fontSize: 16,
    fontFamily: "Medium",
    color: "#181C32",
  },
  rowFast: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputFast: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 8,
    minHeight: 44,
    justifyContent: "center",
  },
  placeholderFast: {
    color: "#4B5563",
    fontSize: 13,
    fontFamily: "Regular",
  },
  buttonFast: {
    backgroundColor: "#7ea437",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
    elevation: 1,
  },
  buttonTextFast: {
    color: "#fff",
    fontFamily: "SemiBold",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  link: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: "Medium",
    color: "#1B4D3E",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B4D3E",
  },
  modalParagraph: {
    fontSize: 14,
    color: "#444",
    marginVertical: 12,
  },
  benefitContainer: {
    marginVertical: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: "#1B4D3E",
    marginLeft: 10,
  },
  additionalInfo: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
  },
  kpiText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#1B4D3E",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeText: {
    color: "#FFF",
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    fontSize: 13,
    color: "#1B4D3E",
    textDecorationLine: "underline",
  },
  priceText:{
    fontSize: 22,
    fontFamily: "SemiBold",
  }

});

export default ProductSellerInfo;
