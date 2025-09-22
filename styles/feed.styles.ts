import { Dimensions, Platform, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

const carouselHeight = Math.round(width * 0.42);


const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* BACK PLATE: fondo blanco que aparece detrás del header+search */
  backPlate: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "white",
  zIndex: 5,
  elevation: 5,
  borderBottomLeftRadius: 35,
  borderBottomRightRadius: 35,
},

    containerCarousel: {
    paddingBottom: 15,
    alignItems: "center",
  },
  headerContainer: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 6,
},
headerTexts: {
  flex: 1,
  marginRight: 10, // espacio para el chevron
},
headerSmall: {
  fontSize: 13,
  color: "#666",
  fontFamily: "Regular",
  marginBottom: 2,
},
headerLarge: {
  fontSize: 16,
  color: "#111",
  fontFamily: "Medium",
  includeFontPadding: false, // para mejor alineación en Android
},
chevronButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "rgba(0,0,0,0.06)", // círculo gris claro como en la imagen
  alignItems: "center",
  justifyContent: "center",
},

  /* HEADER (absolute en el componente) */
  headerRow: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Medium",
    color: "#111",
  },
  headerLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  headerLocationText: {
    marginLeft: 6,
    marginRight: 4,
    fontSize: 14,
    color: "#444",
    fontFamily: "Regular",
    maxWidth: width * 0.45,
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
    backgroundColor: "#e4e1e1ff",
    padding: 8,
    borderRadius: 999,
    width: 45,
  },

  /* SEARCH button (se posiciona absolute en Index) */
  searchWrapper: {
    // deja vacío: la posición la maneja Index.jsx
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    paddingHorizontal: 14,
    // sombra ligera
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#7a7a7a",
    fontFamily: "Regular",
  },

  /* scroll / contenido */
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  bannerPlaceholder: {
    width: width,
    height: Math.round(width * 0.42),
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerImage: {
    width: width - 32,
    height: Math.round(width * 0.42),
    borderRadius: 12,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    fontFamily: "Regular",
  },
});

export default styles;
