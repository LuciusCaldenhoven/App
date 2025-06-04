import React, { useRef } from 'react';
import { Animated, Easing, StyleSheet, TextInput, View, KeyboardTypeOptions } from 'react-native';
import { COLORS } from '@/constants/theme';

interface InputTextProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  iconComponent?: JSX.Element;
  onFocus?: () => void;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  minHeight?: number;
  duration?: number;
}

const InputText = ({
  label,
  value,
  onChangeText,
  iconComponent,
  onFocus,
  keyboardType,
  multiline,
  minHeight,
  duration = 200,
}: InputTextProps) => {
  const borderWidth = useRef(new Animated.Value(1.25)).current;
  const transY = useRef(new Animated.Value(0)).current;

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

  const handleBlur = () => {
    if (!value) {
      animateTransform(0);
      animateBorderWidth(1.25);
    }
  };

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

      <TextInput
        style={[styles.input, { height: minHeight, fontFamily: 'Medium', fontSize: 14, color: 'black' }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={keyboardType}
        multiline={multiline}
      />
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
});

export default InputText;
