import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { StyleSheet } from "react-native";

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
    inputContainer: {
      paddingVertical: scale(12),
    },
    labelText: {
      fontSize: FontSize.FONT_16Px,
      fontFamily: "SemiBold",
    },
    selectPayment: {
      borderRadius: scale(10),
      padding: scale(12),
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.white,
      paddingVertical: scale(2),
      marginTop: scale(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: scale(10),
      height: scale(50),
      paddingHorizontal : scale(12), 
    },
    selectPaymentText: {
      fontSize: FontSize.FONT_13Px,
      color: COLORS.placeholder,
      
      fontFamily: "Regular",
      paddingVertical: scale(12),
      flex: 1,
      
    },
    buttonStyles: {
      backgroundColor: COLORS.btnBorder,
      borderRadius: scale(8),
      paddingHorizontal: scale(12),
      paddingVertical: scale(8),
      borderWidth: 1,
      borderColor: COLORS.btnBorder,
    },
    buttonText: {
      fontSize: FontSize.FONT_12Px,
      color: COLORS.placeholder,
    },
    
  });
