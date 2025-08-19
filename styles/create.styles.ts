import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { COLORS } from "@/constants/theme";
import { scale } from "@/constants/scale";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({

  contentContainer: {
   
    backgroundColor: COLORS.white, 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  pagerView: {
    flex: 1,
  },
  title:{
    fontSize: 28,
    fontFamily: "SemiBold",
    color: COLORS.black,
    
    paddingHorizontal: scale(18),
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1, 
    borderColor: "#e0e0e0" 

  },
  backBtn: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: "Medium",
    paddingLeft: 50,
  },
  contentDisabled: {
    opacity: 0.7, 
  },
  shareButton: {
    paddingHorizontal: 12,
    
    minWidth: 60, 
    alignItems: "center", 
    justifyContent: "center", // Centra el contenido dentro del botón
  },
  shareButtonDisabled: {
    opacity: 0.5, 
    color: 'red'
  },
  shareText: {
    fontSize: 17, // Tamaño del texto
    fontFamily: "Medium", // Fuente del texto

  },
  shareTextDisabled: {
    color: COLORS.grey, // Color del texto cuando está deshabilitado
  },
  emptyImageContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    gap: 12, // Espaciado entre elementos internos
  },
  emptyImageText: {
    color: COLORS.grey, // Color del texto
    fontSize: 16, 
    fontFamily: 'Regular'
  },
  content: {
    flex: 1, // Permite que el contenido crezca dinámicamente
  },
  imageSection: {
    width: width, // Ocupa todo el ancho de la pantalla
    height: width, // Hace que la sección de imagen sea cuadrada
    backgroundColor: COLORS.surface, // Color de fondo de la sección de imagen
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
  },
  previewImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4,
    borderRadius: 10,
  },
  changeImageButton: {
    position: "absolute", // Se posiciona sobre la imagen
    bottom: 16, // Margen inferior
    right: 16, // Margen derecho
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Fondo semitransparente
    flexDirection: "row", // Alinea icono y texto en fila
    alignItems: "center", // Centra verticalmente
    padding: 8, // Espaciado interno
    borderRadius: 8, // Bordes redondeados
    gap: 6, // Espacio entre icono y texto
  },
  changeImageText: {
    color: COLORS.white, // Color del texto
    fontSize: 14, // Tamaño del texto
    fontWeight: "500", // Peso del texto
  },
  inputSection: {
    paddingVertical: 17, 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
   
  },
  captionContainer: {
    flexDirection: "row", 
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 36, // Tamaño del avatar
    height: 36, // Tamaño del avatar
    borderRadius: 18, // Hace que la imagen sea circular
    marginRight: 12, // Espacio entre el avatar y el input
  },
  captionInput: {
    backgroundColor: "#1A1A1A", // Color de fondo del input
    color: "#FFFFFF", // Color del texto
    fontSize: 16, // Tamaño del texto
    padding: 12, // Espaciado interno
    borderRadius: 8, // Bordes redondeados
    minHeight: 80, // Altura mínima del input
    textAlignVertical: "top", // Alinea el texto arriba
    borderWidth: 1, // Borde alrededor del input
    borderColor: "#333", // Color del borde
  },
  input: {
    backgroundColor: "#1A1A1A", // Color de fondo del input
    color: "#FFFFFF", // Color del texto
    fontSize: 16, // Tamaño del texto
    padding: 12, // Espaciado interno
    borderRadius: 8, // Bordes redondeados
    marginBottom: 8, // Espacio entre inputs
    borderWidth: 1, // Borde alrededor del input
    borderColor: "#333", // Color del borde
  },
  conditionContainer: {
    flexDirection: "column", // Alinea los elementos en columna
    marginBottom: 12, // Espaciado antes del siguiente input
  },
  selected: {
    backgroundColor: COLORS.primary, // Fondo del botón seleccionado
    color: COLORS.white, // Color del texto
    paddingVertical: 8, // Espaciado vertical
    paddingHorizontal: 16, // Espaciado horizontal
    borderRadius: 8, // Bordes redondeados
    fontWeight: "600", // Peso de la fuente
  },
  unselected: {
    backgroundColor: COLORS.surface, // Fondo del botón no seleccionado
    color: COLORS.grey, // Color del texto
    paddingVertical: 8, // Espaciado vertical
    paddingHorizontal: 16, // Espaciado horizontal
    borderRadius: 8, // Bordes redondeados
    fontWeight: "600", // Peso de la fuente
  },
  imageCarousel: {
    marginVertical: 10,
    height: 110,
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginHorizontal: 5,
    overflow: "hidden",
    paddingBottom: 30,
  },
  conditionLabel: {
    fontSize: 16, // Tamaño del texto
    fontWeight: "bold", // Texto en negrita
    color: "#FFFFFF", // Color del texto
    marginBottom: 8, // Espacio entre el label y los botones
  },
  conditionOptions: {
    flexDirection: "row",
    gap: 12,
  },
  addImageButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
  },
  addImageText: {
    color: COLORS.black,
    fontSize: 14,
    marginTop: 5,
    fontFamily: "Medium",
  },
  editButton: {
    position: "absolute",
    top: 5,
    left: 5, 
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5, 
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },

  inputGroup: {
    marginBottom: 30,
  },
  inputs: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: '#444',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  inputGrayBorder: {
    borderColor: '#ddd',
  },
  inputBlueBorder: {
    borderColor: '#0a5fff',
  },
  inputRedBorder: {
    borderColor: '#d94242',
  },
  buttonSide: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a5fff',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#0a5fff',
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 6,
    color: '#222',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
