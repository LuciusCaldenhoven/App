import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";

export const styles = StyleSheet.create({
  
  
  
  title: {
    fontFamily: "Regular",
    fontSize: SIZES.small+2,
    marginLeft: 23,
    textAlign: "left",
  },
  
  imageLarge: {
    width: 200, // Ocupa todo el ancho disponible
    height: 200, // Ajusta la altura según lo que necesites
    borderRadius: SIZES.small, 
    marginLeft : 20,
    marginRight : 10,
  },

  titleLarge: {
    fontFamily: "SemiBold",
    fontSize: SIZES.medium,
    marginTop: 8, 
    textAlign: "left", 
    color: COLORS.black, 
    marginLeft: 23,
    maxWidth: 180, // Limitar la altura máxima
  },
  
});
