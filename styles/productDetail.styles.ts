import { COLORS, SIZES } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.grey,
    position: "absolute",
    top: SIZES.xxLarge,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
    marginTop: -44,
  },
  headerButtonsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    zIndex: 20,
    marginTop: 24,
  },
  roundButton: {
    marginTop: 44,
    width: 37,
    height: 37,
    borderRadius: 50,
    backgroundColor: "rgba(179, 178, 178, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  rightButtons: {
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width,
    height: 380,
    position: "relative",
  },

  soldStamp: {
    position: "absolute",
    // Centra el sello en la tarjeta usando top/left/right/bottom y margin
    top: "40%",
    left: "5%",
    width: "90%",
    aspectRatio: 5, // Más fino
    borderWidth: 2,
    borderColor: "#FF5A5F",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.5)", // Más suave, ajusta la opacidad si quieres
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-20deg" }],
    zIndex: 20,
  },
  soldStampText: {
    color: "#FF5A5F",
    fontFamily: "STENCIL",
    fontSize: 32,
    textTransform: "uppercase",
    letterSpacing: 3,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    width: width,
    height: 380,
    position: "relative",
  },
  imageIndicator: {
    position: "absolute",
    top: 310,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
  },

  footerLeft: {
    flex: 1,
    flexDirection: "column", // columna
    justifyContent: "center",
  },

  footerPrice: {
    fontSize: 18,
    fontFamily: "SemiBold",
    marginBottom: 4,
    textDecorationLine: "underline",
  },

  footerShipping: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Medium",
  },

  footerCancel: {
    fontSize: 13,
    color: COLORS.main,
    fontFamily: "Medium",
  },

  cancelTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",

    paddingHorizontal: 8, // 🔹 lo agrego para que tenga aire a los lados
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start", // 🔹 hace que el contenedor se ajuste al contenido
  },

  imageIndicatorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Regular",
  },
  footer: {
    position: "absolute",
    height: 120,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingBottom: 20,
    paddingHorizontal: 30,
    borderTopColor: COLORS.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row", // 🔹 elementos en fila
    justifyContent: "space-between", // 🔹 separa izquierda y derecha
    alignItems: "center",
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  price: {
    paddingVertical: 10,
    fontFamily: "SemiBold",
    fontSize: SIZES.large,
    color: COLORS.main,
  },
  btnn: {
    backgroundColor: "#adc92b",
    height: 58,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SemiBold",
  },
});
