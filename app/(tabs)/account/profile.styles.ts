import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    
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
    alignItems: 'center',
  },
  title_first:{
    fontSize: FontSize.FONT_24Px,
    color: COLORS.black,
    fontFamily: "JetBrainsMono-Medium",
    marginBottom: scale(12),
  },
  title: {
    fontSize: FontSize.FONT_16Px,
    color: COLORS.black,
    fontFamily: "JetBrainsMono-Medium",
  },
  email: {
    fontSize: FontSize.FONT_14Px,
    color: COLORS.placeholder,
    fontFamily: "JetBrainsMono-Medium",
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
  
  
});