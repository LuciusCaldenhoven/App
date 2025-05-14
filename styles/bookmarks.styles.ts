import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { COLORS } from "@/constants/theme";
import { scale } from "@/constants/scale";

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
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surface,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        paddingTop: 80,
        paddingHorizontal: scale(18),
    },
    listContainer: {
        paddingVertical: 10,
    },

});
