
import { COLORS, FontSize, SIZES, } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";
import {scale} from '@/constants/scale';
export const createStyles = () =>
  StyleSheet.create({
    container: {
      backgroundColor: COLORS.black,
      borderRadius: scale(30),
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scale(14),
    },
    text: {
      color: COLORS.white,
      fontSize: FontSize.FONT_16Px,
      fontWeight: '400',
    },
  });