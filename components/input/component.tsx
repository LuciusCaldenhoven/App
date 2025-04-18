import React from 'react';
import {Image, Pressable, TextInput, View} from 'react-native';
import {createStyles} from '@/components/input/input.styles';
import { COLORS, } from "@/constants/theme";
import assets from '../../assets';
import {IInputProps} from './input.props';
import { scale } from '@/constants/scale';

const InputComponent = ({
  onChangeText,
  secureTextEntry,
  placeholder,
  isSecure,
  onSecurePress,
  keyboardType,
  containerStyle,
  leftAction,
}: IInputProps) => {
  const styles = createStyles();
  const {eye} = assets;

  return (
    <View style={[styles.container, containerStyle]}>
      {leftAction && <View style={{ marginLeft: scale(10) }}>{leftAction}</View>}

      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {isSecure && (
        <Pressable onPress={onSecurePress}>
          <Image source={eye} style={styles.eye} resizeMode="contain" />
        </Pressable>
      )}
    </View>
  );
};

export default InputComponent;