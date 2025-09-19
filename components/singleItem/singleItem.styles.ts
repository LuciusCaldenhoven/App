import { scale } from '@/constants/scale';
import { COLORS, FontSize } from '@/constants/theme';
import {StyleSheet} from 'react-native';


export const createStyles = (isHighlighted?: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    headerAction: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(10),
    },
    person: {
      height: scale(40),
      width: scale(40),
      borderRadius: 100,
    },
    title: {
      fontSize: FontSize.FONT_20Px,
      fontFamily: "Bold",
      color: COLORS.black,
    },
    input: {
      marginHorizontal: scale(18),
    },
    main: {
      flex: 1,
    },
    singleItem: {
      backgroundColor: isHighlighted ? COLORS.white : 'tranparent',
      paddingVertical: scale(10),
      marginVertical: scale(10),
      flexDirection: 'row',
      alignItems: 'flex-end',
      columnGap: scale(10),
      paddingHorizontal: scale(18),
    },
    messageContainer: {
      flex: 1,
      rowGap: scale(4),
    },
    name: {
      fontSize: FontSize.FONT_15Px,
      fontFamily: "SemiBold",
      color: COLORS.black,
    },
    message: {
      fontSize: FontSize.FONT_12Px,
      fontFamily: "Regular",
      color: COLORS.gray,
    },
    time: {
      fontSize: FontSize.FONT_12Px,
      fontFamily: "Regular",
      color: COLORS.placeholder,
    },
    timeContainer: {
      columnGap: scale(10),
      alignItems: 'center',
      rowGap: scale(4),
    },
    badge: {
      backgroundColor: COLORS.badgeBg,
      height: scale(20),
      width: scale(20),
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontFamily: "Bold",
      fontSize: FontSize.FONT_12Px,
      color: COLORS.white,
    },
  });