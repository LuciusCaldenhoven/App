import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const createStyles = () =>
    StyleSheet.create({
        card: {
            backgroundColor: '#fff',


            borderRadius: scale(10),
            paddingHorizontal: scale(12),
            paddingVertical: scale(12),
            width: scale(260),
            marginRight: scale(18),

            // Sombra en iOS
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: {
                width: 1,
                height: 2,
            },
            height: scale(140),
            // Elevación en Android
            elevation: 4,
            marginTop: scale(10),
            marginLeft: scale(10),

        },
        container:{
            height: scale(160),
        },
        person: {
            width: scale(32),
            height: scale(32),
            borderRadius: scale(16),
        },
        reviewTitle: {
            fontSize: FontSize.FONT_14Px,
            color: COLORS.black,
            fontFamily: "SemiBold",
        },
        frcg: {
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: scale(150),
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
