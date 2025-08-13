import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: COLORS.background,
  },
  main: {
    paddingTop: scale(80),
    paddingHorizontal: scale(18),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(12),

  },
  profileImage: {
    height: scale(55),
    width: scale(55),
    borderRadius: scale(100),
  },
  frcg: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(12),

  },
  aic: {
    marginRight: 10,


  },
  title_first: {
    fontSize: FontSize.FONT_24Px,
    color: COLORS.black,
    fontFamily: "Regular",
    marginBottom: scale(12),
  },
  title: {
    fontSize: FontSize.FONT_16Px,
    color: COLORS.black,
    fontFamily: "Regular",
  },
  email: {
    fontSize: FontSize.FONT_14Px,
    color: COLORS.placeholder,
    fontFamily: "Regular",
  },
  text: {
    color: COLORS.primary,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(12), // Espaciado inferior opcional
  },

  outlineButtonText: {
    color: COLORS.black,
    fontFamily: "Medium",
    fontSize: 15,
  },
  iconButtonStyle: {
    backgroundColor: COLORS.outlineButtonBg,
    borderWidth: 1,
    borderColor: COLORS.btnBorder,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(8),
    paddingVertical: scale(10),
  },

});

export default styles;