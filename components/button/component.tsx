import React, { useState } from 'react';
import { Pressable, Text, Touchable, TouchableOpacity } from 'react-native';
import { createStyles } from '@/components/button/button.styles';
import { IButtonProps } from './IButton.props';

const Button = ({ text, textStyles, buttonStyles, onPress, component }: IButtonProps) => {
  const styles = createStyles();
  const [isDisabled, setIsDisabled] = useState(false);

  const handlePress = (e: any) => {
    if (isDisabled) return;
    setIsDisabled(true); 
    onPress?.(e); 
    setTimeout(() => setIsDisabled(false), 1000); 
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, buttonStyles]}
      disabled={isDisabled} 
    >
      {component}
      <Text style={[styles.text, textStyles]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;