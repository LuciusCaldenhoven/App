import React, { useCallback, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COLORS } from '@/constants/theme';
import { scale } from '@/constants/scale';

interface InputSelectProps {
  label: string;
  data: { title: string; description?: string }[];
  value: string;
  onChangeText: (value: string) => void;
  iconComponent?: JSX.Element;
  onFocus?: () => void;
  duration?: number;
}

const InputSelect = ({
  label,
  data,
  value,
  onChangeText,
  iconComponent,
  onFocus,
  duration = 200,
}: InputSelectProps) => {
  const borderWidth = useRef(new Animated.Value(1.25)).current;
  const transY = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const animateTransform = (toValue: number) => {
    Animated.timing(transY, {
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  const animateBorderWidth = (toValue: number) => {
    Animated.timing(borderWidth, {
      toValue,
      duration,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  const handleFocus = () => {
    animateTransform(-40);
    animateBorderWidth(2);
    onFocus?.();
  };

  const handleBlur = (currentValue: string) => {
    if (!currentValue) {
      animateTransform(0);
      animateBorderWidth(1.25);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  const borderColor = borderWidth.interpolate({
    inputRange: [0, 2],
    outputRange: ['black', '#0a5fff'],
  });

  const labelColor = borderWidth.interpolate({
    inputRange: [0, 2],
    outputRange: ['grey', 'black'],
  });

  const fontSize = borderWidth.interpolate({
    inputRange: [0, 2],
    outputRange: [14, 12],
  });

  const transX = transY.interpolate({
    inputRange: [-40, 0],
    outputRange: [-10, 0],
  });

  return (
    <Animated.View style={[styles.container, { borderWidth, borderColor }]}>
      <Animated.View style={[styles.labelContainer, { transform: [{ translateY: transY }, { translateX: transX }] }]}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          {iconComponent}
          <Animated.Text style={{ color: labelColor, fontSize, fontFamily: 'Medium' }}>{label}</Animated.Text>
        </View>
      </Animated.View>

      <Pressable onPress={() => { handleFocus(); handlePresentModalPress(); }} style={styles.input}>
        <Text style={{ flex: 1, fontFamily: 'Medium', fontSize: 14, color: 'black' }}>{selectedItem?.title ?? value}</Text>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onDismiss={() => { if (!selectedItem) handleBlur(''); }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} pressBehavior="close" />
        )}
      >
        <BottomSheetScrollView style={styles.bottomSheet} contentContainerStyle={{ paddingBottom: 40 }}>
          {data.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setSelectedItem(item);
                onChangeText(item.title);
                bottomSheetModalRef.current?.dismiss();
                handleBlur(item.title);
              }}
              style={styles.itemContainer}
            >
              <Text style={styles.bottomInfo}>{item.title}</Text>
              {item.description && <Text style={[styles.bottomInfo, { fontSize: 12, color: 'grey' }]}>{item.description}</Text>}
            </Pressable>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    paddingLeft: 10,
    top: 16,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    color: '#1A1A1A',
  },
  itemContainer: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(12),
  },
  bottomInfo: {
    paddingLeft: scale(12),
    fontFamily: 'Medium',
    fontSize: 14,
    color: '#111827',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    flex: 0.8,
    borderRadius: scale(12),
    paddingTop: scale(12),
  },
});

export default InputSelect;
