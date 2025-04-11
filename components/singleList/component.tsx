import {View, Text} from 'react-native';
import React, {JSX} from 'react';

import {createStyles} from './singlelist.styles';
import { scale } from '@/constants/scale';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ISingleListProps {
  component: JSX.Element;
  text: string;
}

const SingleList = ({component, text}: ISingleListProps) => {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <View style={styles.frcg}>
        <View style={styles.iconContainer}>{component}</View>
        <Text style={styles.text}>{text}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        color={COLORS.gray}
        size={scale(24)}
      />
    </View>
  );
};

export default SingleList;