import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: COLORS.background, // Fondo del contenedor
  },
  contentContainer: {
    flex: 1, // Permite que el contenido crezca dentro del contenedor principal
    
  },
  header: {
    flexDirection: "row", // Alinea los elementos en fila
    alignItems: "center", // Centra los elementos verticalmente
    justifyContent: "space-between", // Espacia los elementos entre sí
    paddingHorizontal: 16, // Espaciado lateral
    paddingVertical: 12, // Espaciado superior e inferior
    borderBottomWidth: 0.5, // Línea divisoria
    borderBottomColor: COLORS.surface, // Color de la línea divisoria
  },
  headerTitle: {
    fontSize: 18, // Tamaño del texto
    fontWeight: "600", // Peso de la fuente
    color: COLORS.white, // Color del texto
  },
  contentDisabled: {
    opacity: 0.7, // Reduce la opacidad cuando está deshabilitado
  },
  shareButton: {
    paddingHorizontal: 12, // Espaciado dentro del botón
    paddingVertical: 6, // Espaciado vertical
    minWidth: 60, // Ancho mínimo del botón
    alignItems: "center", // Centra el texto dentro del botón
    justifyContent: "center", // Centra el contenido dentro del botón
  },
  shareButtonDisabled: {
    opacity: 0.5, // Reduce la opacidad cuando el botón está deshabilitado
  },
  shareText: {
    color: COLORS.primary, // Color del texto
    fontSize: 16, // Tamaño del texto
    fontWeight: "600", // Peso de la fuente
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
    fontSize: 16, // Tamaño del texto
  },
  content: {
    flex: 1, // Permite que el contenido crezca dinámicamente
  },
  scrollContent: {
    flexGrow: 1, // Permite que el contenido se expanda y haga scroll si es necesario
    paddingBottom: 20,
  },
  imageSection: {
    width: width, // Ocupa todo el ancho de la pantalla
    height: width, // Hace que la sección de imagen sea cuadrada
    backgroundColor: COLORS.surface, // Color de fondo de la sección de imagen
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
  },
  previewImage: {
    width: "100%", // La imagen ocupa todo el ancho disponible
    height: "100%", // La imagen ocupa todo el alto disponible
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
    padding: 16, // Espaciado interno
    flex: 1, // Permite que el contenido crezca dentro de la sección
    justifyContent: "center", // Centra el contenido verticalmente
    gap: 12, // Espaciado entre inputs
  },
  captionContainer: {
    flexDirection: "row", // Alinea el avatar y el input en fila
    alignItems: "flex-start", // Alinea los elementos al inicio
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
    width: "100%", // Ocupa todo el ancho disponible
    height: "50%", // Ajusta la altura del carrusel
    alignItems: "center", // Centra el contenido horizontalmente
  },
  imageWrapper: {
    width: width, // Cada imagen ocupa el ancho completo
    height: "100%", // Ocupa toda la altura disponible
    justifyContent: "center", // Centra la imagen verticalmente
    alignItems: "center", // Centra la imagen horizontalmente
    marginHorizontal: 0, // Espaciado entre imágenes
  },
  conditionLabel: {
    fontSize: 16, // Tamaño del texto
    fontWeight: "bold", // Texto en negrita
    color: "#FFFFFF", // Color del texto
    marginBottom: 8, // Espacio entre el label y los botones
  },
  conditionOptions: {
    flexDirection: "row", // Alinea los botones en fila
    gap: 12, // Espacio entre "Nuevo" y "Usado"
  },
});
