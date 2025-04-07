import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { StyleSheet } from "react-native";



export const createStyles = () =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: scale(10),
      backgroundColor: COLORS.white,
      paddingVertical: scale(2),
      marginTop: scale(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: scale(10),
      height: scale(50),
    },
    text: {
      fontSize: FontSize.FONT_14Px,
      color: COLORS.placeholder,
      paddingHorizontal: scale(4),
      fontFamily: "Regular",
      paddingVertical: scale(7),
      flex: 1,
      marginLeft: scale(10),
    },
    bottomSheet: {
      backgroundColor: COLORS.white,
      flex: 0.35,
      borderRadius: scale(12),
      paddingTop: scale(12),
    },
    itemContainer: {
      paddingVertical: scale(2),
      paddingHorizontal: scale(12),
    },
    eye: {
      height: scale(22),
      width: scale(22),
    },
  });