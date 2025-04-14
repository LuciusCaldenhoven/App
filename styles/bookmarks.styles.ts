import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 12; // 🔥 Para 2 columnas con espacio

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 8,
        marginBottom: 12,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40, 
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
    
});
