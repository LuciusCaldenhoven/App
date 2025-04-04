import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES, SHADOWS } from "@/constants/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SIZES.small,
        flexDirection: "row",
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        backgroundColor: "#FFF",
        ...SHADOWS.medium,
        shadowColor: COLORS.lightWhite,
    },

    image: {
        width: 70,
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignContent: "center",
    },
 
    productImg: {
        width: "100%",
        height: 65,
        borderRadius: SIZES.small,
        resizeMode: "cover",
    },

    textContainer: {
        flex: 1,
        marginHorizontal: SIZES.medium,
    },

    productTitle: {
        fontSize: SIZES.medium,
        fontFamily: "Bold",
        color: COLORS.primary,
    },
    supplier: {
        fontSize: SIZES.small + 2,
        fontFamily: "Regular",
        color: COLORS.gray,
        marginTop: 3,
    },
    bookmarkIcon: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 6,
        borderRadius: 15,
    },

});
