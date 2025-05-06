import { COLORS, SIZES, } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";
import {scale} from '@/constants/scale';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16; // 🔹 Ajusta el ancho de los posts en una vista de dos columnas


export const styles = StyleSheet.create({
    
    typeView: {
      paddingVertical: scale(12),
    },
    tabContainer: {
      
      flexDirection: 'row',
      columnGap: scale(12),
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: COLORS.btnBorder,
      marginVertical: scale(12),
      borderRadius : scale(30),
    },
    
    tab: {
      paddingHorizontal: scale(20),
      paddingVertical: scale(12),
      borderRadius : scale(30),
    },
    activeTab: {
      backgroundColor: COLORS.main,
    },

    tabText: {
      fontSize: SIZES.small + 2,
      color: COLORS.black,
      fontFamily: "Medium",
    },
    text: {
      fontFamily: "Medium",
      fontSize: SIZES.medium + 4,
      color : COLORS.black,
    },
    contentContainerStyle: {
      justifyContent: 'space-between',
      flex : 1,
    },
    tabTextActive: {
      color: COLORS.white,
    }
    
  });
  