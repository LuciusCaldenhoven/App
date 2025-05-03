import { scale } from "@/constants/scale";
import { COLORS, SIZES} from "@/constants/theme";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16; // 🔹 Ajusta el ancho de los posts en una vista de dos columnas

const styles = StyleSheet.create({
  // 🔹 Contenedor principal de la app
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
     
  },

  // 🔹 Estilos para el encabezado de la app (donde aparece "ReVende")
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    
    borderBottomColor: COLORS.surface,
  },

  // 🔹 Estilo del título en el header
  headerTitle: {
    fontSize: 24,
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
  },

  // 🔹 Contenedor de historias (Stories)
  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },

  // 🔹 Cada historia dentro de la sección de historias
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 72,
  },

  // 🔹 Anillo alrededor de cada historia
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 4,
  },

  // 🔹 Cuando el usuario no tiene historias disponibles
  noStory: {
    borderColor: COLORS.grey,
  },

  // 🔹 Imagen del avatar en las historias
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.background,
  },

  // 🔹 Nombre del usuario en la historia
  storyUsername: {
    fontSize: 11,
    color: COLORS.white,
    textAlign: "center",
  },

  // 🔹 Estilos del post en general
  post: {
    marginBottom: 16,
  },

  // 🔹 Contenedor de la parte superior de un post (usuario + opciones)
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },

  // 🔹 Contenedor del avatar y nombre del usuario en el post
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  // 🔹 Avatar del usuario en un post
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },

  // 🔹 Nombre del usuario en el post
  postUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },

  // 🔹 Botones de acción en los posts (Like, Comentarios, Guardar)
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // 🔹 Botones de "Like" y "Comentarios"
  postActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  // 🔹 Texto que muestra la cantidad de likes en un post
  likesText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 6,
  },

  // 🔹 Contenedor de la descripción del post
  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  // 🔹 Nombre del usuario en la descripción del post
  captionUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
    marginRight: 6,
  },

  // 🔹 Texto de la descripción del post
  captionText: {
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },

  // 🔹 Texto que indica cuántos comentarios hay
  commentsText: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 4,
  },

  // 🔹 Indica el tiempo transcurrido desde que se publicó el post
  timeAgo: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 8,
  },

  // 🔹 Estilos del modal de comentarios
  modalContainer: {
    backgroundColor: COLORS.background,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
  },

  // 🔹 Cabecera del modal de comentarios
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },

  // 🔹 Título del modal de comentarios
  modalTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // 🔹 Lista de comentarios dentro del modal
  commentsList: {
    flex: 1,
  },

  // 🔹 Estilos de cada comentario en el modal
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },

  // 🔹 Avatar del usuario en los comentarios
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },

  // 🔹 Contenedor del comentario
  commentContent: {
    flex: 1,
  },

  // 🔹 Nombre del usuario en un comentario
  commentUsername: {
    color: COLORS.white,
    fontWeight: "500",
    marginBottom: 4,
  },

  // 🔹 Texto del comentario
  commentText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },

  // 🔹 Tiempo desde que se publicó el comentario
  commentTime: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 4,
  },

  // 🔹 Input para escribir comentarios
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },

  // 🔹 Input de texto en el modal de comentarios
  input: {
    flex: 1,
    color: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    fontSize: 14,
  },

  // 🔹 Botón de publicar comentario
  postButton: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  // 🔹 Botón de publicar deshabilitado
  postButtonDisabled: {
    opacity: 0.5,
  },

  // 🔹 Centrar elementos dentro de un contenedor
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  // 🔹 Contenedor de cada post en el feed (en columnas de 2)
  postContainer: {
    width: ITEM_WIDTH,
    margin: 3,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    overflow: "hidden",
    paddingBottom: 10,
  },

  // 🔹 Imagen del post (producto)
  postImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  // 🔹 Contenedor de la info del producto
  postInfo: {
    padding: 5,
  },

  // 🔹 Título del producto
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },

  // 🔹 Precio del producto
  postPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // 🔹 Descripción corta del producto
  postCaption: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 4,
  },
  
  textStyle: {
    fontFamily: "Bold", // 🔥 Fuente correctamente definida
    fontSize: 40,
  },
  appBarWrapper: {
    paddingBottom: 10,
    marginTop: SIZES.small, 
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.gray,
  },
  appBar: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    fontFamily: "Bold", // 🔥 Usa la fuente correcta cargada con expo-font
    fontSize: SIZES.medium, // ✅ Tamaño definido en la constante SIZES
    color: COLORS.gray, // ✅ Color definido en la constante COLORS
  },
  
  titulo: {
    fontFamily: "Bold",
    fontSize: SIZES.xLarge ,
    paddingHorizontal: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 16,
  },

  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    alignItems: 'center',
    width: 355,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    marginVertical: 10,
  },
  searchInput: {

    fontFamily: "JetBrainsMono-Medium",
    width: "80%",
    height: "100%",
    paddingHorizontal: 0,
    alignSelf: "center", 
},

  
});

export default styles;
