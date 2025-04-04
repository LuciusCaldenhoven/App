import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 12; // 🔥 Para 2 columnas con espacio

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surface,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "JetBrainsMono-Medium",
        color: COLORS.primary,
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        width: ITEM_WIDTH,
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        overflow: "hidden",
        margin: 3,
    },
    image: {
        width: "100%",
        height: 150,
    },
    infoContainer: {
        padding: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.white,
        marginBottom: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    bookmarkIcon: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 6,
        borderRadius: 15,
    },
    noBookmarks: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    noBookmarksText: {
        color: COLORS.primary,
        fontSize: 18,
        marginTop: 10,
    },
});
