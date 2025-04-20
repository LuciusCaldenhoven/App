import { StyleSheet } from 'react-native';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    icon:{
        marginHorizontal: 8,
        marginTop: 23,
    },
    main: {
        flex: 1,
        paddingHorizontal: scale(18),
        paddingVertical: scale(8),
    },
    header: {
        flexDirection: 'row',
        paddingTop: scale(20),
        height: 90,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignContent: 'center',
        alignItems: 'center',
        paddingRight: 130,
    },
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        minHeight: 40,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    sendButton: {
        backgroundColor: '#EEA217',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        alignSelf: 'flex-end',
    },
    sendButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
        maxWidth: '80%',
    },
    userMessageContainer: {
        backgroundColor: '#791363',
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    messageText: {
        fontSize: 16,
        flexWrap: 'wrap',
    },
    userMessageText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: '#c7c7c7',
    },
    sendInput: {
        flex: 1,
        marginBottom: 20,
    },
    sendMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: scale(8),
        columnGap: scale(10),
        paddingRight: scale(9),
        paddingLeft: scale(18),
    },
    image: {
        width: 37,
        height: 37,
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 10,
        marginTop: 23,
    },
    text: {
        fontSize: 18,
        fontFamily: 'Regular',
        color: COLORS.black,
        marginTop: 23,
    }
});

export default styles;
