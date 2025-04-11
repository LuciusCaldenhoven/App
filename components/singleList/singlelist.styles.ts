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
    
    text: {
      fontSize: FontSize.FONT_14Px,
      color: COLORS.black,
      fontFamily: "Regular",
    },
  });