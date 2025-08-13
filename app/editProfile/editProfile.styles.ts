import { scale } from "@/constants/scale";
import { COLORS } from "@/constants/theme";
import { Platform, StatusBar, StyleSheet } from "react-native";




const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
  },
  text: {
    fontSize: 16,
    fontFamily: "SemiBold",
    color: COLORS.black,
    textAlign: "center",
    textDecorationLine: "underline",

  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: scale(2),
    paddingTop:  50,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.main,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  title: {
    fontFamily: "SemiBold",
    fontSize: 20,
    alignItems: "center",
    textAlign: "center",
  },
  avatarContainer: {
    position: "relative", // Contenedor relativo para posicionar el botón sobre la imagen
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20, // Espaciado inferior
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 70, // Hace que la imagen sea circular
    backgroundColor: COLORS.grey,
  },

  addButtonText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: "bold",
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  addButton: {
    position: "absolute",
    bottom: -15,

    width: 85,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  addButtonContent: {
    flexDirection: "row", // Coloca el ícono y el texto en una fila
    alignItems: "center", // Alinea verticalmente al centro
    justifyContent: "center", // Centra horizontalmente
    gap: 5, // Espaciado entre el ícono y el texto
  },
  btnn: {
    backgroundColor: COLORS.secondary,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Regular",
  },
  cont: {
    marginLeft: 15,
    marginRight: 15,

  },
  titleProfile: {
    fontFamily: "Medium",
    fontSize: 25,

    marginTop: 20,
    marginBottom: 10,
  },
  titleText: {
    fontFamily: "Regular",
    fontSize: 14,
    marginBottom: 25,
    color: COLORS.gray,
  },
  sheetTitle: {
    fontSize: 25,
    fontFamily: 'SemiBold',
    marginBottom: 14,
    textAlign: 'left',
  },
  sheetDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'left',
    fontFamily: 'Regular',
  },

});

export default styles;