import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const createStyles = () =>
    StyleSheet.create({
      card: {
        width: width * 0.9,
        height: scale(190),
        borderRadius: scale(20),
        padding: scale(20),
        justifyContent: 'space-between',
        shadowColor: COLORS.black,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
      },
      rowG20: {
        rowGap: scale(20),
      },
      nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(36),
      },
      expireRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(10),
      },
      visaText: {
        color: COLORS.white,
        fontSize: FontSize.FONT_24Px,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
      },
      cardNumber: {
        color: COLORS.black,
        fontSize: FontSize.FONT_18Px,
        letterSpacing: 2,
        marginBottom: scale(4),
      },
      bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      label: {
        fontSize: FontSize.FONT_12Px,
        color: COLORS.black,
      },
      info: {
        color: COLORS.black,
        fontSize: FontSize.FONT_16Px,
        fontFamily: "Regular",
      },
      topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(20), // Espacio entre la parte superior y el número de tarjeta
      },
    });
