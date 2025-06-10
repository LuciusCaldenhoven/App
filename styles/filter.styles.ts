import { COLORS, FontSize, SIZES, } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { scale } from '@/constants/scale';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16; // 🔹 Ajusta el ancho de los posts en una vista de dos columnas


export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.red,
    justifyContent: "flex-end",
  },
  sheet: {
    

    maxHeight: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.gray,
  },
  line: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.btnBorder,
    
  },
    title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Medium",
    color: "black",
    paddingLeft: 30,
  },
  closeButton: {
    paddingLeft: 5,
  },

  option: {
    paddingHorizontal: SIZES.medium,


  },
  applyBtn: {
    marginTop: 20,
    backgroundColor: COLORS.black,
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
    fontFamily: "Medium",
    fontSize: SIZES.medium + 4,
    color: COLORS.black,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grey,
    marginHorizontal: 2,
    marginTop: 8,

    opacity: 0.9,
  },
  slider: {
    width: '100%',
    height: scale(40),
  },
  frsb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: scale(12),
  },
  inputContainer: {
    flex: 1,
  },
  tabContainerStyle: {
    borderWidth: 1,
  },
  tabStyle: {
    borderWidth: 1,
    borderColor: COLORS.btnBorder,
  },
  tabTextStyle: {
    color: COLORS.placeholder,
    fontFamily: "Medium",
    fontSize: FontSize.FONT_12Px,
  },
  clearAll: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: "Medium",
  },

  btnContainerStyle: {
    paddingVertical: 16,
    paddingHorizontal: scale(12),
    backgroundColor: COLORS.main,
    borderRadius: scale(10),
  },

  btnTextStyle: {
    fontSize: FontSize.FONT_12Px,
    fontFamily: "SemiBold",
    color: COLORS.white,
    width: 135,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: COLORS.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  label: {

    fontFamily: "Medium",
    fontSize: SIZES.medium + 4,
    color: COLORS.black,

  },
  dropdown: {
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 14,
    color: "#aaa",
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  dropdownContainer: {
    borderRadius: 10,
    paddingVertical: 4,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemSelected: {
    backgroundColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },


});
