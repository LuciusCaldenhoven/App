import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
 imageCarousel: {
        marginVertical: 10,
        height: 110,
        backgroundColor: "white",
    },
    imageWrapper: {
        marginHorizontal: 5,
        overflow: "hidden",
        paddingBottom: 30,
    },
    emptyImageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    emptyImageText: {
        color: COLORS.grey,
        fontSize: 16,
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
});

export default styles;