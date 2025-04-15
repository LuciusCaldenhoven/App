import { COLORS, SIZES } from "@/constants/theme";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16; // 🔹 Ajusta el ancho de los posts en una vista de dos columnas

export const styles = StyleSheet.create({
    searchContainer: {
        position: "relative",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.medium,
        marginVertical: SIZES.medium,
        height: 50,
        width: 330,
        paddingHorizontal: 0, // 🔥 Evita espacios extra
        marginHorizontal: SIZES.small,
        
        
    },
    searchIcon: {
        marginHorizontal: 10,
        color: COLORS.gray,
        marginTop: SIZES.small,
    },
    searchWrapper: {
        width: "90%",
        backgroundColor: COLORS.secondary,
        marginRight: SIZES.small,
        borderRadius: SIZES.small,
    },
    searchBtn: {
        width: 50,
        height: "100%",
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    searchInput: {

        fontFamily: "JetBrainsMono-Medium",
        width: "80%",
        height: "100%",
        paddingHorizontal: 0,
        alignSelf: "center", 
    },
    resultsContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: "black",
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40 
    },
    searchImage: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    },
    noResultsText: {
        fontSize: 16,
        color: COLORS.gray,
        marginTop: 10,
    },
    closeBtn: {
        marginLeft: 10,
        padding: 10,
    },
    

});