import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const createStyles = () =>
    StyleSheet.create({
        card: {
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: scale(10),
            paddingHorizontal: scale(12),
            paddingVertical: scale(12),
            width: scale(240),
            marginRight: scale(18),

        },
        person: {
            width: scale(32),
            height: scale(32),
        },
        reviewTitle: {
            fontSize: FontSize.FONT_14Px,
            color: COLORS.black,
            fontFamily: "SemiBold",
        },
        frcg: {
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: scale(120),
            columnGap: scale(2),
        },

        frsb: {
            flexDirection: 'row',
            alignItems: 'center',

            justifyContent: 'space-between',
        },
        textBold: {
            fontFamily: "Bold",
            fontSize: FontSize.FONT_14Px,
        },
        text: {
            fontSize: FontSize.FONT_12Px,
            color: COLORS.placeholder,
            fontFamily: "Regular",

        }
    });
