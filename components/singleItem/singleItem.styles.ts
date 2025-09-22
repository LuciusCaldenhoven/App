import { COLORS, FontSize } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (isHighlighted?: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    rowWrapper: {
      backgroundColor: COLORS.white,
    },

    singleItem: {
      backgroundColor: COLORS.white,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
      minHeight: 60,
    },
    pressed: { opacity: 0.85 },

    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#E6E6E6',
      marginLeft: 72, // avatar (44) + gap (12) + margen
      marginVertical: 4,
    },

    avatarWrap: {
      height: 44,
      width: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    person: {
      height: 44,
      width: 44,
      borderRadius: 22,
      backgroundColor: '#F2F2F2',
    },

    messageContainer: {
      flex: 1,
      rowGap: 2,
      minHeight: 44,
      justifyContent: 'center',
    },
    name: {
      fontSize: FontSize.FONT_15Px,
      fontFamily: 'SemiBold',
      color: COLORS.black,
    },
    nameUnread: {
      fontFamily: 'Bold',
    },
    message: {
      fontSize: FontSize.FONT_12Px,
      fontFamily: 'Regular',
      color: COLORS.gray,
    },
    messageUnread: {
      color: COLORS.black,
      fontFamily: 'Medium',
    },

    timeContainer: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      rowGap: 6,
      minHeight: 44,
      marginLeft: 6,
      width: 64,
    },
    time: {
      fontSize: FontSize.FONT_11Px ?? 11,
      fontFamily: 'Regular',
      color: COLORS.placeholder,
    },
    timeUnread: {
      fontFamily: 'SemiBold',
      color: COLORS.black,
    },

    badge: {
      backgroundColor: "#adc92b",
      minHeight: 18,
      minWidth: 18,
      paddingHorizontal: 6,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontFamily: 'Bold',
      fontSize: FontSize.FONT_11Px ?? 11,
      color: COLORS.white,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
  });