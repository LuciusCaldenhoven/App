import { COLORS, FontSize, SIZES, } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";
import {scale} from '@/constants/scale';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16; // 🔹 Ajusta el ancho de los posts en una vista de dos columnas


export const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "#000000aa",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: COLORS.background,
      padding: 15,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "90%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      color: COLORS.primary,
      fontSize: 18,
      fontFamily: "Bold",
      marginBottom: 8,
    },
    option: {
      paddingHorizontal: SIZES.medium,
  

    },
    applyBtn: {
      marginTop: 20,
      backgroundColor: COLORS.primary,
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    applyBtnText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: "bold",
    },
    text: {
      fontFamily: "Bold",
      fontSize: SIZES.medium + 4,
      color : COLORS.primary,
    },
    separator: {
      height: 1,
      backgroundColor: COLORS.grey,
      marginHorizontal: 2,
      marginTop: 8,
     
      opacity: 0.9,
    },
    slider: {
      width : '100%',
      height : scale(40),
    },
    frsb: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: scale(12),
    },
    inputContainer: {
      flex : 1,
    },
    tabContainerStyle: {
      borderWidth: 0,
    },
    tabStyle: {
      borderWidth: 1,
      borderColor: COLORS.btnBorder,
    },
    tabTextStyle:{
      color: COLORS.placeholder,
      fontFamily: "Regular",
      fontSize: FontSize.FONT_12Px,
    },
    clearAll: {
      color: COLORS.black,
      fontSize: FontSize.FONT_12Px,
      fontFamily: "Regular",
    },
    
    btnContainerStyle: {
      paddingVertical: scale(10),
      paddingHorizontal: scale(12),
      backgroundColor: COLORS.black,
      
    },
    
    btnTextStyle: {
      fontSize: FontSize.FONT_12Px,
      fontFamily: "SemiBold",

    },
    
  });
  