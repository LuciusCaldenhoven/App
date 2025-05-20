import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, SHADOWS } from "@/constants/theme";

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
  soldOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF5A5F",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    transform: [{ rotate: "-10deg" }],
  },
  soldText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
