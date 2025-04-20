import {KeyboardTypeOptions, StyleProp, ViewStyle} from 'react-native';
import {JSX} from 'react';
export interface IInputProps {
  onChangeText: (e: string) => void;
  secureTextEntry?: boolean;
  placeholder: string;
  isSecure?: boolean;
  onSecurePress?: (e: any) => void;
  keyboardType?: KeyboardTypeOptions | undefined;
  containerStyle?: ViewStyle;
  leftAction?: JSX.Element;
  value?: string;
}