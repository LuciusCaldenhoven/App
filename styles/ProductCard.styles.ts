import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";

export const styles = StyleSheet.create({
  container: {
    width: 185,
    height: 280,
    borderRadius: SIZES.medium,
    marginHorizontal: 5,
    overflow: "hidden", // Asegura que los bordes redondeados afecten a todo el contenido
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
    padding: SIZES.small - 3,
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
