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
      columnGap: scale(20),
      marginBottom: scale(8),
    },
    
    text: {
      fontSize: FontSize.FONT_14Px,
      color: COLORS.gray,
      fontFamily: "Regular",
    },
    component:{
      color: COLORS.black,
    }
  });