import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

export const createStyles = () =>
    StyleSheet.create({
        checkMark: {
            height: scale(50),
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkMarkText: {
            marginTop: scale(6),
            fontSize: FontSize.FONT_10Px,
            fontFamily: "SemiBold",
        },
        check: {
            height: scale(20),
            width: scale(20),
            backgroundColor: COLORS.black,
            borderRadius: scale(100),
            alignItems: 'center',
            justifyContent: 'center',
        },
        active: {
            height: scale(10),
            width: scale(10),
            backgroundColor: COLORS.white,
            borderRadius: scale(100),
        },
        checkMarkContainer: {
            flexDirection: "row",
            alignItems: "center",
            columnGap: scale(12),
            justifyContent: 'space-between',
            paddingVertical: scale(12),
        },
        line: {
            height: scale(1),
            width: '73%',
            left: '16%',
            backgroundColor: 'black',
            top: '53%',
            position: 'absolute',
        },
        inActiveText:{
            color : COLORS.placeholder,
            
        }
    });
