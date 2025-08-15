// ChatInputBar.tsx
import React, { Dispatch, SetStateAction, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, NativeSyntheticEvent, TextInputContentSizeChangeEventData, Platform } from 'react-native';
import { CircleX, Plus, Image as ImageIcon, ArrowUp, ImagePlus } from 'lucide-react-native';
import { scale } from '@/constants/scale';
import { Id } from '@/convex/_generated/dataModel';
import { COLORS } from '@/constants/theme';

interface ChatInputBarProps {
  imagePreview: string | null;
  setImagePreview: (img: string | null) => void;
  selectedImage: Id<'_storage'> | string | null;
  setSelectedImage: Dispatch<SetStateAction<Id<'_storage'> | null>>;
  showProductBar: boolean;
  setShowProductBar: (show: boolean) => void;
  productId: any;
  imageUrl: string | undefined | null;
  newMessage: string;
  setNewMessage: (txt: string) => void;
  captureImage: () => void;
  handleSendMessage: () => void;
  isSending: boolean;
  uploading: boolean;
}

const MIN_INPUT_H = 40;
const MAX_INPUT_H = 120;
const INPUT_GROW_MS = 140;

const AnimatedTextInput = Animated.createAnimatedComponent(require('react-native').TextInput);

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  imagePreview,
  setImagePreview,
  selectedImage,
  setSelectedImage,
  showProductBar,
  setShowProductBar,
  productId,
  imageUrl,
  newMessage,
  setNewMessage,
  captureImage,
  handleSendMessage,
  isSending,
  uploading,
}) => {
  const disabled = isSending || uploading || (!newMessage.trim() && !selectedImage);

  // auto-grow
  const [contentH, setContentH] = useState(MIN_INPUT_H);
  const inputH = useRef(new Animated.Value(MIN_INPUT_H)).current;
  const targetH = useMemo(() => Math.min(Math.max(contentH, MIN_INPUT_H), MAX_INPUT_H), [contentH]);

  useEffect(() => {
    Animated.timing(inputH, { toValue: targetH, duration: INPUT_GROW_MS, useNativeDriver: false }).start();
  }, [targetH, inputH]);

  const onContentSizeChange = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    setContentH(e.nativeEvent.contentSize.height);
  };

  return (
    <View style={styles.sendMessageContainer}>
      {imagePreview && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imagePreview }} style={styles.previewImage} />
          <TouchableOpacity
            onPress={() => { setImagePreview(null); setSelectedImage(null); }}
            style={styles.previewCloseButton}
          >
            <Text style={styles.previewCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {showProductBar && productId && (
        <View style={styles.productBar}>
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.productImage} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle}>{productId.post.title}</Text>
            {productId.post.price != null && <Text style={styles.productPrice}>${productId.post.price}</Text>}
          </View>
          <TouchableOpacity onPress={() => setShowProductBar(false)}>
            <CircleX size={30} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        {/* Píldora de input como iOS/Android Messages */}
        <View style={styles.pill}>

          <TouchableOpacity
            onPress={captureImage}
            disabled={uploading || isSending}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={{paddingBottom:13}}
          >
            <ImagePlus size={28} color={COLORS.main} strokeWidth={1.8} style={styles.pillIcon} />
          </TouchableOpacity>

          <AnimatedTextInput
            style={[styles.textInput, { height: inputH, textAlignVertical: 'top' }]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Mensaje"
            placeholderTextColor="#888"
            returnKeyType="send"
            blurOnSubmit={false}
            autoCorrect
            autoCapitalize="sentences"
            multiline
            onContentSizeChange={onContentSizeChange}
            scrollEnabled={targetH >= MAX_INPUT_H}
            onSubmitEditing={() => { if (!disabled) handleSendMessage(); }}
          />
           <TouchableOpacity
          onPress={handleSendMessage}
          disabled={disabled}
          style={[styles.sendBtnCircle, { opacity: disabled ? 0.5 : 1 }]}
          activeOpacity={0.8}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ArrowUp size={20} color="#fff" />
          )}
        </TouchableOpacity>
        </View>

        {/* Botón de enviar circular */}
       
      </View>
    </View>
  );
};

export default ChatInputBar;

/* -------------------
   🎨 ESTILOS
------------------- */
const styles = StyleSheet.create({
  sendMessageContainer: {

  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  // Píldora similar a la de la captura
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    paddingTop: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E6EA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  pillIcon: {
    marginHorizontal: 6,
    marginTop: 0,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
    paddingHorizontal: 6,
    fontFamily: 'Regular',
  },

  // botón circular a la derecha
  sendBtnCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#adc92b', // se ve como la bolita negra de la captura
  },

  /* Preview imagen + barra de producto (igual que tenías) */
  productBar: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    borderColor: '#403c3c',
  },
  productImage: { width: 45, height: 45, borderRadius: 6, marginRight: 8 },
  productTitle: { fontFamily: 'Medium', fontSize: 15, color: '#222' },
  productPrice: { color: '#888', fontSize: 15, fontFamily: 'Medium' },

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
  previewImage: { width: '100%', height: '100%', borderRadius: 12 },
  previewCloseButton: {
    position: 'absolute',
    top: 5, right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24, height: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  previewCloseText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
