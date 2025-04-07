import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { StyleSheet } from "react-native";


export const createStyles = () =>
  StyleSheet.create({
    container: {
      backgroundColor: COLORS.checkBoxBg,
      alignSelf: 'flex-start',
      borderRadius: scale(4),
      height: scale(22),
      width: scale(22),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });