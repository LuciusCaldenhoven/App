import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS, FontSize, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // --- Layout base del modal ---
  overlay: {
    flex: 1,
    backgroundColor: '#F4F4F8',
    justifyContent: "flex-end",
    paddingTop: Platform.OS === "ios" ? 30 : 0,
  },
  sheet: {
    maxHeight: "100%",
  },

  // --- Header del modal ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 21,
    fontFamily: "SemiBold",
    color: "black",
    paddingLeft: 30,
  },
  closeButton: {
    paddingRight: 10,
  },

  // --- Contenedores ---
  box: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  frsb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: scale(12),
  },

  // --- Texto y etiquetas ---
  text: {
    fontFamily: "Medium",
    fontSize: SIZES.medium + 4,
    color: COLORS.black,
  },
  label: {
    fontFamily: "Medium",
    fontSize: SIZES.medium + 4,
    color: COLORS.black,
  },

  // --- Input personalizado ---
  inputContainer: {
    flex: 1,
  },

  // --- Slider ---
  mark: {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderColor: COLORS.black,
    borderWidth: 2,
    backgroundColor: COLORS.white,
  },
  pressed: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderColor: COLORS.black,
    borderWidth: 2,
    backgroundColor: COLORS.white,
  },

  // --- Tab Switcher estilos externos ---
  tabContainerStyle: {
    borderWidth: 1,
  },
  tabStyle: {
    borderWidth: 1,
    borderColor: COLORS.btnBorder,
  },
  tabTextStyle: {
    color: COLORS.placeholder,
    fontFamily: "Medium",
    fontSize: FontSize.FONT_12Px,
  },

  // --- Botones ---
  btnContainerStyle: {
 
    height: 48,
    width: 180,
    backgroundColor: "#adc92b",
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',

  },
  btnTextStyle: {
    fontSize: FontSize.FONT_12Px,
    fontFamily: "SemiBold",
    color: COLORS.white,
    width: 135,
    height: 23,
    textAlign: "center",
  },
  clearAll: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: "Medium",
  },

  // --- Footer ---
  footer: {
    position: "absolute",
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: COLORS.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
