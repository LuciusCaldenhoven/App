import { View, Text, TouchableOpacity } from 'react-native';
import React, { JSX, useState } from 'react';

import { createStyles } from './singlelist.styles';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { renderBorderBottom, renderMarginBottom } from '@/constants/ui-utils';

interface ISingleListProps {
  component: JSX.Element;
  text: string;
  onPress?: () => void;
}

const SingleList = ({ component, text, onPress }: ISingleListProps) => {
  const styles = createStyles();
  const [isDisabled, setIsDisabled] = useState(false);

  const handlePress = () => {
    if (isDisabled) return; 
    setIsDisabled(true); 
    onPress?.(); 
    setTimeout(() => setIsDisabled(false), 1000); 
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.container}
        disabled={isDisabled} 
      >
        <View style={styles.frcg}>
          <View>{component}</View>
          <Text style={styles.text}>{text}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" color={COLORS.black} size={scale(24)} />
      </TouchableOpacity>
      {renderBorderBottom(1)}
      {renderMarginBottom(12)}
    </View>
  );
};

export default SingleList;