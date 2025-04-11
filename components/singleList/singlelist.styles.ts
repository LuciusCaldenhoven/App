import { scale } from '@/constants/scale';
import { COLORS, FontSize } from '@/constants/theme';
import {StyleSheet} from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: scale(8),
    },
    frcg: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(12),
    },
    iconContainer: {
      height: scale(40),
      width: scale(40),
      borderRadius: scale(100),
      borderWidth: 1,
      borderColor: COLORS.btnBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: FontSize.FONT_14Px,
      color: COLORS.primary,
      fontFamily: "Regular",
    },
  });