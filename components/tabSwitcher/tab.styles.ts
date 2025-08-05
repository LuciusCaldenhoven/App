import { COLORS, SIZES, } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { scale } from '@/constants/scale';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16; // 🔹 Ajusta el ancho de los posts en una vista de dos columnas


export const styles = StyleSheet.create({

  typeView: {
    marginVertical: 10,

  },
  text: {
    fontSize: 22,
    fontFamily: "Medium",
    marginBottom: 8,

  },
  tabContainer: {
    flexDirection: 'row',
    position: 'relative',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    backgroundColor: '#fff', // blanco, sin gris
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    color: '#444',
    fontSize: 15,
    fontFamily: "Medium"
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    backgroundColor: '#adc92b',
    borderRadius: 10,
    marginHorizontal: 2,
    zIndex: 0,
  },
  divider: {
    width: 1.5,
    backgroundColor: '#ccc',
    opacity: 0.7,
    alignSelf: 'center',
    height: '80%',
  },



});
