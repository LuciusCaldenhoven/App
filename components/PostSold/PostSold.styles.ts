import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, SHADOWS } from "@/constants/theme";

const screenWidth = Dimensions.get('window').width;


export const styles = StyleSheet.create({
    card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },


soldStamp: {
  position: "absolute",
  // Centra el sello en la tarjeta usando top/left/right/bottom y margin
  top: "30%",
  left: "10%",
  width: "80%",
  aspectRatio: 5, // Más fino
  borderWidth: 2,
  borderColor: "#FF5A5F",
  borderRadius: 10,
  backgroundColor: "rgba(255,255,255,0.5)", // Más suave, ajusta la opacidad si quieres
  justifyContent: "center",
  alignItems: "center",
  transform: [{ rotate: "-10deg" }], 
  zIndex: 20,
},
soldStampText: {
  color: "#FF5A5F",
  fontFamily:"STENCIL",
  fontSize: 28,
  textTransform: "uppercase",
  letterSpacing: 3,
  textShadowColor: "rgba(0,0,0,0.15)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},


  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    zIndex: 10,
  },
  overlayText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },



});
