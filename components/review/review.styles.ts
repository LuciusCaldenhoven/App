import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    cardContainer: {
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1.2,
        borderColor: '#514e51',
        borderRadius: 16,
        padding: 16,
        width: 240,
        minHeight: 160,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    username: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
    },
    ratingText: {
        fontSize: 13,
        color: '#555',
    },
    commentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    comment: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#333',
        lineHeight: 20,
    },
});


