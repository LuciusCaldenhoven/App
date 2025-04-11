import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  main: {
    paddingHorizontal: scale(18),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(12),
  },
  profileImage: {
    height: scale(70),
    width: scale(70),
  },
  frcg: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(12),
  },
  aic: {
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.FONT_16Px,
    color: COLORS.black,
    fontFamily: "SemiBold",
  },
  email: {
    fontSize: FontSize.FONT_14Px,
    color: COLORS.placeholder,
    fontFamily: "Regular",
  },
  editProfile: {
    fontSize: FontSize.FONT_14Px,
    color: COLORS.placeholder,
    fontFamily: "Regular",
  },
  
  
});