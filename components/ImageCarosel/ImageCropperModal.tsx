import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  PanResponder,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SQUARE = Math.min(SCREEN_WIDTH - 80, (SCREEN_HEIGHT * 0.7 - 150) * 0.8);

const ASPECT_RATIOS = [
  { name: "Free Crop", icon: "crop-outline", ratio: null },
  { name: "1:1", icon: "square-outline", ratio: 1 },
];

type Crop = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

type Props = {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onCrop: (croppedUri: string) => void;
};

const ImageCropperModal: React.FC<Props> = ({
  visible,
  imageUri,
  onClose,
  onCrop,
}) => {
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // Free Crop
  const [cropPosition, setCropPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  // 1:1 Instagram-style
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastPan = useRef({ x: 0, y: 0 });
  const [minPan, setMinPan] = useState({ x: 0, y: 0 });
  const [maxPan, setMaxPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Calcular tamaño imagen al abrir o cambiar
  useEffect(() => {
    if (visible && imageUri) {
      setSelectedRatio(null);
      setCropPosition({ top: 0, bottom: 0, left: 0, right: 0 });
      pan.setValue({ x: 0, y: 0 });
      lastPan.current = { x: 0, y: 0 };
      Image.getSize(imageUri, (width, height) => setImageSize({ width, height }));
    }
  }, [visible, imageUri]);

  // Calcula escala y límites cuando hay 1:1 y tamaño listo
  useEffect(() => {
    if (selectedRatio === 1 && imageSize) {
      const s = Math.max(SQUARE / imageSize.width, SQUARE / imageSize.height);
      setScale(s);

      const shownW = imageSize.width * s;
      const shownH = imageSize.height * s;
      setMinPan({
        x: -(shownW - SQUARE) / 2,
        y: -(shownH - SQUARE) / 2,
      });
      setMaxPan({
        x: (shownW - SQUARE) / 2,
        y: (shownH - SQUARE) / 2,
      });
      pan.setValue({ x: 0, y: 0 });
      lastPan.current = { x: 0, y: 0 };
    }
  }, [selectedRatio, imageSize]);

  // PanResponder para 1:1 Instagram-style
  const movePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => selectedRatio === 1,
      onPanResponderMove: (_, gesture) => {
        if (selectedRatio !== 1) return;
        let newX = lastPan.current.x + gesture.dx;
        let newY = lastPan.current.y + gesture.dy;
        // Limitar para no ver gris dentro del cuadrado
        newX = Math.max(minPan.x, Math.min(newX, maxPan.x));
        newY = Math.max(minPan.y, Math.min(newY, maxPan.y));
        pan.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: (_, gesture) => {
        if (selectedRatio !== 1) return;
        let newX = lastPan.current.x + gesture.dx;
        let newY = lastPan.current.y + gesture.dy;
        newX = Math.max(minPan.x, Math.min(newX, maxPan.x));
        newY = Math.max(minPan.y, Math.min(newY, maxPan.y));
        lastPan.current = { x: newX, y: newY };
      },
    })
  ).current;

  // PanResponders para Free Crop
  const createPanResponder = (edge: "top" | "bottom" | "left" | "right") =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => selectedRatio === null,
      onPanResponderMove: (_, gestureState) => {
        setCropPosition((prev) => {
          const areaHeight = cropArea.height;
          const areaWidth = cropArea.width;
          const minCrop = 0;
          const minArea = 50;

          let newValue = prev[edge];

          if (edge === "top") {
            newValue = Math.max(
              minCrop,
              Math.min(prev.top + gestureState.dy, areaHeight - prev.bottom - minArea)
            );
          }
          if (edge === "bottom") {
            newValue = Math.max(
              minCrop,
              Math.min(prev.bottom - gestureState.dy, areaHeight - prev.top - minArea)
            );
          }
          if (edge === "left") {
            newValue = Math.max(
              minCrop,
              Math.min(prev.left + gestureState.dx, areaWidth - prev.right - minArea)
            );
          }
          if (edge === "right") {
            newValue = Math.max(
              minCrop,
              Math.min(prev.right - gestureState.dx, areaWidth - prev.left - minArea)
            );
          }

          return { ...prev, [edge]: newValue };
        });
      },
    });

  const topPanResponder = createPanResponder("top");
  const bottomPanResponder = createPanResponder("bottom");
  const leftPanResponder = createPanResponder("left");
  const rightPanResponder = createPanResponder("right");

  // Calcula el área para free crop
  function getCropArea() {
    if (!imageSize) return { width: 100, height: 100 };
    if (selectedRatio === null) {
      let maxWidth = SCREEN_WIDTH - 80;
      let maxHeight = (SCREEN_HEIGHT * 0.7 - 150) * 0.8;
      const imgRatio = imageSize.width / imageSize.height;
      const areaRatio = maxWidth / maxHeight;
      if (imgRatio > areaRatio) {
        maxHeight = maxWidth / imgRatio;
      } else {
        maxWidth = maxHeight * imgRatio;
      }
      return { width: maxWidth, height: maxHeight };
    } else {
      return { width: SQUARE, height: SQUARE };
    }
  }

  const cropArea = getCropArea();

  const renderAspectRatioItem = ({
    item,
  }: {
    item: { name: string; icon: string; ratio: number | null };
  }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedRatio(item.ratio);
        setCropPosition({ top: 0, bottom: 0, left: 0, right: 0 });
        pan.setValue({ x: 0, y: 0 });
        lastPan.current = { x: 0, y: 0 };
      }}
      style={[
        styles.ratioItem,
        selectedRatio === item.ratio && styles.selectedRatioItem,
      ]}
    >
      <Ionicons
        name={item.icon as any}
        size={24}
        color={selectedRatio === item.ratio ? "#adc92b" : "#888"}
      />
      <Text
        style={[
          styles.ratioLabel,
          selectedRatio === item.ratio ? styles.selectedRatioLabel : {},
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Crop real
  const handleCrop = async () => {
    if (!imageUri || !imageSize) return;

    let cropConfig: Crop;

    if (selectedRatio === null) {
      // Free Crop
      const scaleW = imageSize.width / cropArea.width;
      const scaleH = imageSize.height / cropArea.height;
      const width = cropArea.width - (cropPosition.left + cropPosition.right);
      const height = cropArea.height - (cropPosition.top + cropPosition.bottom);
      cropConfig = {
        originX: Math.round((cropPosition.left || 0) * scaleW),
        originY: Math.round((cropPosition.top || 0) * scaleH),
        width: Math.round(width * scaleW),
        height: Math.round(height * scaleH),
      };
    } else {
      // 1:1 Instagram-style
      const imgW = imageSize.width;
      const imgH = imageSize.height;
      const s = scale;
      const shownW = imgW * s;
      const shownH = imgH * s;
      const { x, y } = lastPan.current;
      const offsetX = (shownW - SQUARE) / 2 - x;
      const offsetY = (shownH - SQUARE) / 2 - y;
      const originX = Math.round((offsetX / shownW) * imgW);
      const originY = Math.round((offsetY / shownH) * imgH);
      const width = Math.round((SQUARE / shownW) * imgW);
      const height = Math.round((SQUARE / shownH) * imgH);
      cropConfig = {
        originX: Math.max(0, Math.min(originX, imgW - width)),
        originY: Math.max(0, Math.min(originY, imgH - height)),
        width,
        height,
      };
    }

    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ crop: cropConfig }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );
    onCrop(result.uri);
  };

  if (!visible || !imageUri || !imageSize) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Preview */}
          <View style={styles.previewContainer}>
            <View
              style={[
                styles.imageWrapper,
                { width: cropArea.width, height: cropArea.height },
              ]}
            >
              {/* Free Crop */}
              {selectedRatio === null && (
                <>
                  <View
                    style={{
                      width: cropArea.width - (cropPosition.left + cropPosition.right),
                      height: cropArea.height - (cropPosition.top + cropPosition.bottom),
                      overflow: "hidden",
                      position: "absolute",
                      top: cropPosition.top,
                      left: cropPosition.left,
                    }}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: cropArea.width,
                        height: cropArea.height,
                        resizeMode: "cover",
                        marginLeft: -cropPosition.left,
                        marginTop: -cropPosition.top,
                      }}
                    />
                  </View>
                  {/* Handles */}
                  <View
                    style={[styles.cropHandle, styles.topHandle]}
                    {...topPanResponder.panHandlers}
                  >
                    <View style={styles.handleLine} />
                  </View>
                  <View
                    style={[styles.cropHandle, styles.bottomHandle]}
                    {...bottomPanResponder.panHandlers}
                  >
                    <View style={styles.handleLine} />
                  </View>
                  <View
                    style={[styles.cropHandle, styles.leftHandle]}
                    {...leftPanResponder.panHandlers}
                  >
                    <View style={[styles.handleLine, { width: 4, height: 40 }]} />
                  </View>
                  <View
                    style={[styles.cropHandle, styles.rightHandle]}
                    {...rightPanResponder.panHandlers}
                  >
                    <View style={[styles.handleLine, { width: 4, height: 40 }]} />
                  </View>
                </>
              )}

              {/* 1:1 Instagram style */}
              {selectedRatio === 1 && (
                <>
                  <View
                    style={{
                      width: SQUARE,
                      height: SQUARE,
                      overflow: "hidden",
                      position: "relative",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Animated.Image
                      source={{ uri: imageUri }}
                      style={{
                        width: imageSize.width * scale,
                        height: imageSize.height * scale,
                        position: "absolute",
                        left: (SQUARE - imageSize.width * scale) / 2,
                        top: (SQUARE - imageSize.height * scale) / 2,
                        transform: [{ translateX: pan.x }, { translateY: pan.y }],
                      }}
                      {...movePanResponder.panHandlers}
                    />
                    {/* Borde cuadrado */}
                    <View
                      pointerEvents="none"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: SQUARE,
                        height: SQUARE,
                        borderColor: "#adc92b",
                        borderWidth: 2,
                        zIndex: 2,
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Ratios */}
          <View style={styles.ratioContainer}>
            <FlatList
              horizontal
              data={ASPECT_RATIOS}
              renderItem={renderAspectRatioItem}
              keyExtractor={(item) => item.name}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ratioList}
            />
          </View>

          {/* Confirm y cerrar */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleCrop}>
            <Ionicons name="checkmark" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: SCREEN_HEIGHT * 0.6,
    padding: 20,
    flexDirection: "column",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  cropHandle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  topHandle: {
    top: 0,
    width: "100%",
    height: 20,
  },
  bottomHandle: {
    bottom: 0,
    width: "100%",
    height: 20,
  },
  leftHandle: {
    left: 0,
    width: 20,
    height: "100%",
  },
  rightHandle: {
    right: 0,
    width: 20,
    height: "100%",
  },
  handleLine: {
    width: 40,
    height: 4,
    backgroundColor: "#adc92b",
    borderRadius: 2,
  },
  ratioContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  ratioList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  ratioItem: {
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 8,
  },
  selectedRatioItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#adc92b",
  },
  ratioLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  selectedRatioLabel: {
    color: "#adc92b",
    fontWeight: "bold",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#adc92b",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default ImageCropperModal;
