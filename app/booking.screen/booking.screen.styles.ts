import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F8F8F8',

        },
        main: {
            flex: 1,
            paddingHorizontal: scale(18),
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: scale(12),
            paddingVertical: scale(12),
            borderRadius: scale(10),
            
            overflow: 'hidden',
            backgroundColor: COLORS.white,
        },
        bookTitle: {
            fontFamily: "SemiBold",
            color: COLORS.black,
        },
        bookText: {
            color: COLORS.placeholder,
        },

        tabContainerStyle: {
            borderWidth: 0,

        },
        tabStyle: {
            borderWidth: 1,
            borderColor: COLORS.btnBorder,
            flexDirection : 'row',
            columnGap : scale(4),
            paddingRight : scale(16),
            paddingLeft : scale(12),
        },
        ph : {
            paddingRight : scale(18),
            paddingLeft : scale(18),
        },
        tabTextStyle: {
            color: COLORS.placeholder,
            fontFamily: "Regular",
            fontSize: FontSize.FONT_12Px,
        },
        buttonStyles :{
            marginHorizontal : scale(18),
        }
    });
