import { StyleSheet } from 'react-native';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    icon: {
        marginHorizontal: 8,
        marginTop: 23,
    },
    main: {
        flex: 1,
        paddingHorizontal: 8,
  
    },

    date: {
        backgroundColor: '#dde2f3',
        color: '#445',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 10,
        fontWeight: 'bold',
        fontSize: 13,
        overflow: 'hidden'
    },
 header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 45,
  paddingBottom: 10,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
  paddingHorizontal: 10,
},

icon2: {
  marginTop: 23,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#f5f5f5',
  alignItems: 'center',
  justifyContent: 'center',
},

headerContent: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
 
  minWidth: 0, // Para textos largos, evita que rompa layout
  justifyContent: 'flex-start', // <--- Ojo aquí
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

        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 15,
        columnGap: scale(10),
        paddingRight: scale(9),
        paddingLeft: scale(10),
    },
    image: {
        width: 40,
        height: 40,
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
        width: '70%',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(12),
        paddingBottom: scale(8),
    },

    inputBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginRight: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 4,
        paddingHorizontal: 4,
        color: '#000',
        fontFamily: 'Regular'
    },

    sendButton: {
        width: 45,
        height: 45,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewContainer: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginVertical: 10,
        alignSelf: 'flex-start',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },

    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },

    previewCloseButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    previewCloseText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },


});

export default styles;
