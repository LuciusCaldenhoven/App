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
    paddingBottom: 15,

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
  slider: {
    width: 300,
    height: 40,

  },
  sliderContainer: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
},
  kmLabel: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },

  kmValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },

  secondaryButtonText: {
    color: '#222',
    fontSize: 15,
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  containerDown: {
    width: '95%',
    paddingVertical: 10,
    alignSelf: 'center',
    gap: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationTextContainer: {
    marginLeft: 10,
  },
  kmText: {
    fontSize: 13,
    fontFamily: 'Regular',
    color: '#444',
    marginTop: 2,
  },



});

export default styles;
