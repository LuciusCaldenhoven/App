import { StyleSheet, useWindowDimensions } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";
const { width } = useWindowDimensions();

export const styles = StyleSheet.create({
  container: {
    width: (width - 36) / 2,
    height: 250,
    borderRadius: 18,
    
    overflow: "hidden",
  },
  tipo: {
    position: "absolute",
    top: 8,
    left: 8,
    color: "white",
    fontSize: 12,
    fontFamily: "Medium",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12, 
    overflow: "hidden",
    zIndex: 1,
  },
  imageContainer: {
    flex: 0.9,
    width: "100%",
    marginTop: SIZES.small / 2,
    borderRadius: scale(15),
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  details: {
    paddingHorizontal: 5,
    paddingTop: 5,
    marginLeft: -2,
  },

  title: {
    fontFamily: "Regular",
    fontSize: scale(15),
    marginBottom: 4,
    color: COLORS.black,
  },

  supplier: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4, // Espaciado entre el proveedor y el precio
  },

  price: {
    fontFamily: "SemiBold",
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
});
