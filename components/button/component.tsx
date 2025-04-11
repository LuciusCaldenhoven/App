import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { createStyles } from '@/styles/button.styles';
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
    <Pressable
      onPress={handlePress}
      style={[styles.container, buttonStyles]}
      disabled={isDisabled} 
    >
      {component}
      <Text style={[styles.text, textStyles]}>{text}</Text>
    </Pressable>
  );
};

export default Button;