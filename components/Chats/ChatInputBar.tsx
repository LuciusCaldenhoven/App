import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { CircleX, Paperclip, Send } from 'lucide-react-native';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';
import { Id } from '@/convex/_generated/dataModel';
import product from '@/assets/categoria/data';

interface ChatInputBarProps {
  imagePreview: string | null;
  setImagePreview: (img: string | null) => void;
  selectedImage: string | null;
  setSelectedImage: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  showProductBar: boolean;
  setShowProductBar: (show: boolean) => void;
  productId: any;
  imageUrl: string | undefined;
  newMessage: string;
  setNewMessage: (txt: string) => void;
  captureImage: () => void;
  handleSendMessage: () => void;

}

const   ChatInputBar: React.FC<ChatInputBarProps> = ({ imagePreview, setImagePreview, selectedImage, setSelectedImage, showProductBar,setShowProductBar, productId, imageUrl, newMessage, setNewMessage, captureImage, handleSendMessage, }) => {
  const styles = localStyles;

  return (
    <View style={styles.sendMessageContainer}>

      {imagePreview && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imagePreview }} style={styles.previewImage} />
          <TouchableOpacity
            onPress={() => {
              setImagePreview(null);
              setSelectedImage(null);
            }}
            style={styles.previewCloseButton}
          >
            <Text style={styles.previewCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Barra de producto seleccionada (solo si aplica) */}
      {showProductBar && productId && (
        <View style={styles.productBar}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle}>
              {productId.post.title}
            </Text>
            {productId.post.price && (
              <Text style={styles.productPrice}>
                ${productId.post.price}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setShowProductBar(false)}>
            <CircleX size={30} color="black" style={{justifyContent:'center'}} />
          </TouchableOpacity>
        </View>
      )}

      {/* Barra de input de mensaje */}
      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <TouchableOpacity onPress={captureImage}>
            <Paperclip size={scale(20)} color="#555" style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Escriba su mensaje"
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!newMessage.trim() && !selectedImage}
          style={[
            styles.sendButton,
            { backgroundColor: newMessage.trim() || selectedImage ? '#adc92b' : '#ccc' },
          ]}
        >
          <View style={{ marginRight: 2 }}>
            <Send size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInputBar;

// -------------------
// 🎨 ESTILOS LOCALES
// -------------------

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  productBar: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    borderColor: '#403c3c'
  },
  icon: {
    marginHorizontal: 8,
    marginTop: 23,
  },
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginRight: 8,
  },
  productTitle: {
    fontFamily: 'Medium',
    fontSize: 15,
    color: '#222',
  },
  productPrice: {
    color: '#888',
    fontSize: 15,
    fontFamily: 'Medium',
  },
  main: {
    flex: 1,
    paddingHorizontal: scale(18),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 115,
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
    paddingRight: 150,
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
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
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

