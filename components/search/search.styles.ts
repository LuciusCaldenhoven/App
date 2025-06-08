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
        borderRadius: SIZES.medium,
        marginVertical: SIZES.medium,
        height: 50,
        width: 330,
        paddingHorizontal: 0, 
        marginHorizontal: SIZES.small,
        backgroundColor: 'blue',
    },
    searchIcon: {
        marginHorizontal: 10,
        color: COLORS.gray,
        marginTop: SIZES.small,
    },
    searchWrapper: {
        width: "90%",
        backgroundColor: COLORS.green,
        marginRight: SIZES.small,
        borderRadius: SIZES.small,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 16,
      },
    
      searchBtn: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        padding: 14,
        alignItems: 'center',
        width: "95%",
        
        borderRadius: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
          width: 1,
          height: 1,
        },
        marginVertical: 10,
      },
      filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#A2A0A2',
        borderRadius: 24,
      },
    searchInput: {
        fontFamily: "Medium",
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
        paddingTop: 50
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