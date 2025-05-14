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
    bookmark: {
        marginLeft: 10,
        padding: 6,
    },

});
