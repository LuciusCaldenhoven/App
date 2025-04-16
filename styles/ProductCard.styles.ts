import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";

export const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 300,
    borderRadius: SIZES.medium,
    marginBottom: 12,
    marginHorizontal: 5,
    backgroundColor: COLORS.red, // Cambié a blanco para un fondo más neutral
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
    padding: SIZES.small, // Agrega un padding para separar el contenido
  },

  title: {
    fontFamily: "bold",
    fontSize: SIZES.large,
    marginBottom: 4, // Ajusta el margen inferior para mejor separación
    color: COLORS.black, // Asegura que el texto sea legible
  },

  supplier: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4, // Espaciado entre el proveedor y el precio
  },

  price: {
    fontFamily: "bold",
    fontSize: SIZES.medium,
    color: COLORS.primary, // Usa el color primario para destacar el precio
  },
});
