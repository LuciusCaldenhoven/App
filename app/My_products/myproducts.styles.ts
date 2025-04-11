import { StyleSheet } from "react-native";
import { COLORS, FontSize } from "@/constants/theme";
import { scale } from "@/constants/scale";

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
    noProductsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    noProductsText: {
        fontSize: FontSize.FONT_18Px,
        color: COLORS.placeholder,
        textAlign: "center",
    },
});