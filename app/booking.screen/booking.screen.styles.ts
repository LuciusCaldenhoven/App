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
            elevation: 10,
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
          

    });
