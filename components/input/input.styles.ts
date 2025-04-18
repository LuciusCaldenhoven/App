import { COLORS, FontSize, SIZES, } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";
import {scale} from '@/constants/scale';

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
    input: {
      fontSize: FontSize.FONT_13Px,
      color: COLORS.black,
      paddingHorizontal: scale(12),
      fontFamily: "Regular",
      paddingVertical: scale(12),
      flex: 1,
      
    },
    eye: {
      height: scale(22),
      width: scale(22),
      
    },
  });