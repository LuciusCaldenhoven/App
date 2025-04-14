import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Platform, StatusBar, StyleSheet } from "react-native";

export const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40, 
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
      paddingHorizontal: scale(12),
    },
    selectPaymentText: {
      fontSize: FontSize.FONT_13Px,
      color: COLORS.placeholder,

      fontFamily: "Regular",
      paddingVertical: scale(12),


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
    rg: {
      flexDirection: 'row',
      columnGap: scale(8),
      alignItems: 'center',
    },
    paymentContainer: {
      flex: 0.3,
      backgroundColor: COLORS.white,
      borderTopLeftRadius : scale(10),
      borderTopRightRadius : scale(10),
      paddingHorizontal : scale(12),
      paddingVertical : scale(12),
    },
    paymentText:{
      fontSize: FontSize.FONT_15Px,
      color: COLORS.placeholder,
      textAlign: 'center',
      fontFamily: "Regular",
      paddingVertical: scale(12),
    },
    lableText: {
      fontSize: FontSize.FONT_16Px,
      fontFamily: "SemiBold",
    },
    inputStyle: {
      flex: 1,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(10),
    },
    borderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: scale(12),
      marginTop: scale(18),
    },
    orText: {
      fontSize: FontSize.FONT_12Px,
      fontFamily: "Regular",	
      color: COLORS.placeholder,
    },
    orBorder: {
      height: 1,
      flex: 1,
      backgroundColor: COLORS.divider,
      marginVertical: scale(18),
    },
    outlineButtonText: {
      color: COLORS.black,
      fontFamily: "Bold",
      fontSize: FontSize.FONT_14Px,
    },
    iconButtonStyle: {
      backgroundColor: COLORS.outlineButtonBg,
      borderWidth: 1,
      borderColor: COLORS.btnBorder,
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(8),
      paddingVertical: scale(10),
    },
    checkBoxText: {
      fontSize: FontSize.FONT_14Px,
      color: COLORS.placeholder,
      fontFamily: "Regular",
    },
  });
