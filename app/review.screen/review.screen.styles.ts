import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingHorizontal: scale(16),
      paddingTop: scale(20),
    },
    header: {
      marginBottom: scale(12),
    },
    scroll: {
      flex: 1,
    },
    reviewList: {
      gap: scale(12),
    },
    reviewCard: {
      width: '94%',
      backgroundColor: COLORS.white,
      borderRadius: scale(10),
      padding: scale(12),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      marginTop: scale(14),

    },
      
  });

  export default createStyles;