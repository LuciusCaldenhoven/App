import { scale } from "@/constants/scale";
import { COLORS, SIZES } from "@/constants/theme";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    width: '100%',
    height: 170,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
  },
  searchContainer: {
    paddingHorizontal: 23,
    paddingBottom: 15
  },

  locationButton: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 15,
    alignItems: 'flex-end',
  },
  locationButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Medium'
  },




  titulo: {
    fontFamily: "SemiBold",
    fontSize: SIZES.xLarge,
    paddingHorizontal: 8,
  },
  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    alignItems: 'center',
    width: "100%",
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },

  },
  searchInput: {
    fontFamily: "Medium",
    width: "80%",
    height: "100%",
    paddingHorizontal: 0,
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLORS.black,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },

});

export default styles;
