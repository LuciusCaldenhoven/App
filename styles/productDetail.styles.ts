import { COLORS, SIZES } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";
import { scale } from "@/constants/scale";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  productImage: {
    width: width,
    height: 350,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.primary,
    marginVertical: 8,
  },
  bookmarkButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.grey,
    marginVertical: 10,
  },
  additionalInfo: {
    marginTop: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  rightButtons: {
    flexDirection: "row",
    gap: 12,

  },
  image: {
    width,
    height: 380,
    position: "relative",
  },
  roundButton: {
    marginTop : 44,
    width: 37,
    height: 37,
    borderRadius: 50,
    backgroundColor: "rgba(179, 178, 178, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    marginTop: -SIZES.large,
    backgroundColor: COLORS.white,
    width: width,
    borderTopLeftRadius: SIZES.medium + 5,
    borderTopRightRadius: SIZES.medium + 5,
  },
  titleRow: {
    paddingBottom: SIZES.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 20,
    alignSelf: "center",
  },
  title: {
    fontFamily: "SemiBold",
    fontSize: SIZES.xLarge + 5,
  },
  price: {
    padding: 10,
    fontFamily: "SemiBold",
    fontSize: SIZES.large,
  },
  priceWrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.large,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: COLORS.gray,
    fontFamily: "medium",
  },
  descriptionWrapper: {
    marginTop: SIZES.large * 2,
    marginHorizontal: SIZES.large,
  },
  description: {
    fontFamily: "Medium",
    fontSize: SIZES.large - 2,
  },
  descText: {
    fontFamily: "Regular",
    fontSize: SIZES.small,
    textAlign: "justify",
    marginBottom: SIZES.small,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    marginHorizontal: 12,
    padding: 5,
    borderRadius: SIZES.large,
    marginBottom: SIZES.small,
  },
  person: {
    height: scale(42),
    width: scale(42),
    borderRadius: scale(21),
    marginLeft: scale(12),
  },
  ownerName: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontFamily: "SemiBold",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(12),
  },
  iconBorder: {
    borderWidth: 1,
    borderColor: COLORS.btnBorder,
    borderRadius: scale(100),
    height: scale(40),
    width: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  cg14: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(14),
  },
  btn: {
    marginHorizontal: scale(18),
  },
  footer: {
    position: "absolute",
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: COLORS.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "Regular",
  },
  btnText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Regular",
  },
  btnn: {
    backgroundColor: COLORS.secondary,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageIndicator: {
    position: "absolute",
    top: 310,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
  },
  imageIndicatorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Regular",
  },
  imageContainer: {
    width: width,
    height: 380,
    position: "relative",
  },

  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.grey,
    position: "absolute",
    top: SIZES.xxLarge,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
    marginTop: -44,
  },
  headerButtonsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    zIndex: 20, 
    marginTop: 24,
    
},
});
