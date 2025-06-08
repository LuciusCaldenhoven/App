import { scale } from "@/constants/scale";
import { COLORS } from "@/constants/theme";
import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {

        paddingBottom: 50,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 80,
    },
    header: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        marginBottom: 15,
        paddingHorizontal: 10,
    },

    title: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        paddingTop: 20,
        paddingHorizontal: scale(18),
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        borderColor: "#ddd",
        borderWidth: 1,
        fontSize: 15,
        color: "#222",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: COLORS.black,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 8,
    },
    soldButton: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#30C04F", // verde tipo "éxito"
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    inputSection: {
        paddingVertical: 17,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
});
