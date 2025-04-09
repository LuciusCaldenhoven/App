import { scale } from '@/constants/scale';
import { COLORS, FontSize } from '@/constants/theme';
import { StyleSheet } from 'react-native';


export const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
        },
        main: {
            flex: 1,
            paddingHorizontal: scale(18),
        },
        successImage: {
            height: scale(125),
            width: scale(125),
        },
        title: {
            fontSize: FontSize.FONT_16Px,
            color: COLORS.black,
            fontFamily: "SemiBold",
        },
        f14: {
            fontSize: FontSize.FONT_14Px,
        },
        infoText: {
            fontSize: FontSize.FONT_14Px,
            color: COLORS.placeholder,
            fontFamily: "Regular",
        },
        successContainer: {
            alignItems: 'center',
            paddingTop: scale(12),
        },
        bookingInfo: {
            backgroundColor: COLORS.white,
            paddingVertical: scale(12),
            paddingHorizontal: scale(12),
            borderRadius: scale(8),
            borderWidth: 1,
            borderColor: COLORS.btnBorder,
        },
        key: {
            fontSize: FontSize.FONT_14Px,
            color: COLORS.placeholder,
            fontFamily: "SemiBold",
        },
        value: {
            fontSize: FontSize.FONT_14Px,
            color: COLORS.placeholder,
            fontFamily: "Regular",
        },
        horizontalContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scale(12),
        },
        bold: {
            fontFamily: "SemiBold",
        },
        bl: {
            color: COLORS.black,
        },
        btn: {
            marginHorizontal: scale(18),
        },
        downloadBtn: {
            backgroundColor: COLORS.btnBorder,
            borderWidth: 1,
            borderColor: COLORS.btnBorder,
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: scale(8),
            paddingVertical: scale(10),
            
        },
        shareBtn: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.btnBorder,
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: scale(8),
            paddingVertical: scale(10),
            
        },
        outlineButtonText: {
            color: COLORS.placeholder,
            fontFamily: "Regular",
            fontSize: FontSize.FONT_14Px,
          },
    });