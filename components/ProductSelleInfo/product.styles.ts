import { scale } from "@/constants/scale";
import { COLORS, SIZES } from "@/constants/theme";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16;

const HEADER_HEIGHT = 160;
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
      statsColumn: {
        alignItems: "flex-start",
        justifyContent: "center",
        paddingVertical: 10,
    },

    statValue: {
        fontSize: 18,
        fontFamily: 'SemiBold',
        color: "#000",
    },

    statLabel: {
        fontSize: 13,
        color: "gray",
        fontFamily: 'Meidum',
        marginBottom: 6,
    },

    statDivider: {
        height: 1,
        width: 80,
        backgroundColor: "#e0e0e0",
        marginVertical: 6,
    },
  profileInfo: {
        alignItems: "center",
        justifyContent: "center",
    },
    textRating: {
        marginTop: 4,
        fontSize: 14,
        color: "gray",
    },
    card: {
        paddingLeft: 10,
        alignItems: "center",
        paddingBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#fff",
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "gray",
    },
   infoRow: {
        gap: 80,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 40,

    },
  floatingButtonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
    },
    textContainer: {
        marginLeft: 70,
        justifyContent: "center",
    },
    locationContainer: {
        marginTop: 6,

    },
    textLocation: {
        fontFamily: "Regular",
        fontSize: 14,
        maxWidth: 200,
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
    color: "#111",
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
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "85%",
    height: "100%",
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F7FA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",

    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: 'Regular'
  },

iconWrapper: {
  position: 'absolute',
  top: 50,
  left: 20,
  zIndex: 100,
  justifyContent: 'center',
  alignItems: 'center',
  width: 40,
  height: 40,
},

iconBackground: {
  position: 'absolute',
  width: 40,
  height: 40,
  backgroundColor: 'rgba(255, 255, 255, 0.6)',

  borderRadius: 20, // la mitad de width/height
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: -1, // detrás del ícono
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
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

        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 16,

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
    backgroundColor: '#7ea437',
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
