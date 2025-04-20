import { scale } from '@/constants/scale';
import { COLORS, FontSize } from '@/constants/theme';
import {StyleSheet} from 'react-native';


export const createStyles = (isSelf: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: scale(18),
      alignSelf: isSelf ? 'flex-end' : 'flex-start',
    },
    card: {
      backgroundColor: COLORS.white,
      paddingVertical: scale(12),
      paddingHorizontal: scale(12),
      borderRadius: scale(10),
      borderBottomRightRadius: isSelf ? 0 : scale(10),
      borderBottomLeftRadius: !isSelf ? 0 : scale(10),
      minWidth: scale(50),
      maxWidth: scale(270),
    },
    text: {
      color: COLORS.black,
      fontSize: FontSize.FONT_12Px,
      fontFamily: "Regular",
    },
    timeStamp: {
      fontSize: FontSize.FONT_12Px,
      color: COLORS.placeholder,
      fontFamily: "Regular",
      textAlign: isSelf ? 'left' : 'right',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
    },
    name: {
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.black,
    },
  });