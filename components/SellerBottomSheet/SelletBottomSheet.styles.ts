import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";


export const styles = StyleSheet.create({
  bottomContainer: {
    flex: 0.9,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    paddingVertical: scale(12),
  },
  closeButton: {
    position: "relative",
    top: 3,
    left: 8,
    zIndex: 20,
    padding: 10,

  },
  shareButton:{
    position: "relative",
    top: 2,
    left: 280,
    zIndex: 20,
    padding: 10,
  },
  card: {
    
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  
  number: {
    fontSize: 20,
    fontFamily: "Bold",
    marginLeft: 200,
    marginBottom : -16,
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
    width: 120,
    height: 120,
    borderRadius: 80,
    backgroundColor: COLORS.grey,
  },
  textReview: {
    fontFamily: "SemiBold",
    fontSize: 20,
    color: COLORS.black,
    marginTop: 10,
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
   
    zIndex: 10, // Asegúrate de que los botones estén al frente
  },
});