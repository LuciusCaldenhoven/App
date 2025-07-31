import { scale } from "@/constants/scale";
import { COLORS, SIZES } from "@/constants/theme";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const carouselHeight = Math.round(width * 0.42);
const ITEM_WIDTH = width / 2 - 16;

const HEADER_HEIGHT = 160;
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerCarousel: {
    paddingTop: 20,
    alignItems: "center",
  },
  SectionContainer: {
    paddingHorizontal: 20,

    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Medium',
    color: "#adc92b",
  },

  iconWrapper2: {
    alignItems: 'center',
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 999,
    width: 45,
  },

  item: {

    alignItems:'center',
    width: "100%",
    height: carouselHeight,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "90%",
    height: "100%",
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 15 : 0,
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#4e5443",
    fontFamily: "Regular",
  },

  iconWrapper: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2, // para Android
    zIndex: 100, 
  },
  stickyHeaderWrapper: {
  position: 'absolute',
  top: HEADER_HEIGHT,
  width: '100%',
  zIndex: 100,
  backgroundColor: 'white', // si tu fondo es blanco
  paddingBottom: 10,
},
  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 60,
    backgroundColor: "#F5F5F5", // gris claro
    justifyContent: "flex-end",
    paddingBottom: 20,

    
  },


   
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
   
    fontSize: 16,
    color: "#111",
    fontFamily: 'Medium'
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    fontFamily: 'Regular'
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  scroll: {
    flex: 1,

  },
  scrollContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -HEADER_HEIGHT / 2,
    paddingVertical: 20,

  },

  scrollText: {
    fontSize: 16,
    marginBottom: 12,
  },
  HorizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tab: {
    backgroundColor: "#F5F7FA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#adc92b", // azul oscuro
  },
  tabText: {
    fontSize: 14,
    color: "#222",

    fontFamily: 'Medium'
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
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
    backgroundColor: '#adc92b',
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
  locationText: {
    fontSize: 14,
    fontFamily: 'Medium'
  },


});

export default styles;
