import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, SHADOWS } from "@/constants/theme";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 6,
        marginHorizontal: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    info: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },
    category: {
        fontSize: 13,
        color: "#888",
        marginVertical: 2,
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        width: "100%",
    },

    infoContainer: {
        flex: 1, // permite que ocupe el espacio restante
    },

    verticalActions: {
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 12,
    },
    iconButton: {
        padding: 6,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    message: {
        textAlign: "center",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
    },
    cancelText: {
        fontWeight: "bold",
    },
    deleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: "#FF5A5F",
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
});
