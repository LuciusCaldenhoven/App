import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
import { COLORS, FontSize } from '@/constants/theme';
import { scale } from '@/constants/scale';
const { width } = Dimensions.get('window');

const createStyles = () =>
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
    image: { width: width - scale(40), height: scale(180) },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      columnGap: scale(12),
      flex: 1,
    },
    flex: {
      width: '70%',
    },
    title: {
      fontSize: FontSize.FONT_16Px,
      fontFamily: "SemiBold",
    },
    reviewContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      columnGap: scale(4),
    },
    textBox: {},
    text: {
      fontSize: FontSize.FONT_12Px,
      color: COLORS.placeholder,
      fontFamily: "Regular",
    },
    textBold: {
      fontFamily: "Bold",
      fontSize: FontSize.FONT_14Px,
    },
    key: {
      fontSize: FontSize.FONT_14Px,
      color: COLORS.placeholder,
      fontFamily: "SemiBold",
    },
    value: {
      fontSize: FontSize.FONT_14Px,
      color: COLORS.placeholder,
      fontFamily: "Regular",
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scale(12),
    },
    bold: {
      fontFamily: "SemiBold",
      color: COLORS.black,
    },
    btn: {
      marginHorizontal: scale(18),
    },
  });
export default createStyles;