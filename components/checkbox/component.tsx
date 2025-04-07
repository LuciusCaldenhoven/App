import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {createStyles} from './checkbox.styles';
import { scale } from "@/constants/scale";
import { COLORS } from "@/constants/theme";
import {ICheckBoxProps} from './ICheckbox.props';
import { MaterialIcons } from '@expo/vector-icons';

const CheckBoxComponent = ({
  onPress = () => {},
  isChecked = false,
}: ICheckBoxProps) => {
  const styles = createStyles();
  const [checked, setChecked] = useState(isChecked);
  return (
    <Pressable
      onPress={() => {
        setChecked(!checked);
        onPress(!checked);
      }}
      style={styles.container}>
      {checked && (
        <MaterialIcons name="check" size={scale(20)} color={COLORS.white} />
      )}
    </Pressable>
  );
};

export default CheckBoxComponent;