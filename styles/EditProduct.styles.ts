import { scale } from "@/constants/scale";
import { COLORS } from "@/constants/theme";
import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {

   
        backgroundColor: "#fff",
    },
    header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1, 
    borderColor: "#e0e0e0" 

  },
  backBtn: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: "Medium",
    paddingLeft: 50,
  },
  contentDisabled: {
    opacity: 0.7, 
  },
  shareButton: {
    paddingHorizontal: 12,
    
    minWidth: 60, 
    alignItems: "center", 
    justifyContent: "center", // Centra el contenido dentro del botón
  },
  shareButtonDisabled: {
    opacity: 0.5, 
    color: 'red'
  },
  shareText: {
    fontSize: 17, // Tamaño del texto
    fontFamily: "Medium", // Fuente del texto

  },
  shareTextDisabled: {
    color: COLORS.grey, // Color del texto cuando está deshabilitado
  },

    title: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        paddingTop: 20,
        paddingHorizontal: scale(18),
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        marginBottom: 6,
        marginTop: 16,
    },
      value: {
    fontSize: 16,
    color: "#222", // Un color oscuro pero no puro negro, más amigable a la vista
    fontFamily: "Medium", // Cambia según tu fuente
    marginBottom: 10,
    marginTop: 3,
    paddingHorizontal: 2,
    // Si quieres que destaque en touchable, puedes ponerle un fondo suave al presionar
    // backgroundColor: "#f6f6f6",
    // borderRadius: 6,
    // paddingVertical: 6,
  },

    input: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        borderColor: "#ddd",
        borderWidth: 1,
        fontSize: 15,
        color: "#222",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: COLORS.black,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 8,
    },
    soldButton: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#adc92b", // verde tipo "éxito"
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    inputSection: {
        paddingVertical: 17,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
});
