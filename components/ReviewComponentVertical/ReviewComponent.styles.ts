import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";


export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    closeButton: {
        position: "relative",
        top: 3,
        zIndex: 20,
        paddingBottom: 3,
    },
    modalContainer: {
        backgroundColor: '#fff',

        paddingHorizontal: 20,
        paddingTop: 20,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 28,
        fontFamily: "SemiBold",
        color: COLORS.black,
        paddingTop: 8,
        paddingBottom: 8,
    },
    closeText: {
        color: '#007AFF',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    username: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    ratingText: {
        fontSize: 14,
        color: '#555',
    },
    comment: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 14,
        minHeight: 90,
        textAlignVertical: 'top',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        fontSize: 15,
        color: '#333',
    },
});