import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";


export const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: COLORS.white,
    paddingTop: 40,
  },
  closeButton: {
    position: "relative",
    top: 3,
    left: 8,
    zIndex: 20,
    padding: 10,
  },

  shareButton: {
    position: "relative",
    top: 2,
    left: 280,
    zIndex: 20,
    padding: 10,
  },
  card: {
    marginTop: 24,
    alignItems: "center",

  },

  number: {
    fontSize: 20,
    fontFamily: "Bold",
    marginLeft: 200,
    marginBottom: -16,
  },
  txtRating: {
    fontSize: 11,
    fontFamily: "SemiBold",
  },
  ratingRow: {
    marginLeft: 350,
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    gap: 4,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 80,

  },
  textReview: {
    fontFamily: "Medium",
    fontSize: 18,
    color: COLORS.black,
    marginVertical: 20,
    marginLeft: 10,

  },
  textName: {
    fontFamily: "SemiBold",
    fontSize: 20,
    color: COLORS.black,

    marginLeft: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Asegúrate de que esté detrás de los botones
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    borderRadius: 24,
  },

  headerButtonsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 10,

    zIndex: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },
  textLocation: {
    fontFamily: "Regular",
    fontSize: 14,
  },
  ventasContainer: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "center",

  },
});