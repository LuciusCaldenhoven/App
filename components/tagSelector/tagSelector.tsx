import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
};

export default function AnimatedSelectableBox({ label, isSelected, onToggle }: Props) {
    const borderColor = useSharedValue(isSelected ? '#adc92b' : '#ccc');
    const backgroundColor = useSharedValue(isSelected ? '#dfe8ab' : '#fff');
    
    React.useEffect(() => {
        borderColor.value = withTiming(isSelected ? '#adc92b' : '#ccc', { duration: 200 });
        backgroundColor.value = withTiming(isSelected ? '#dfe8ab' : '#fff', { duration: 200 });
    }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    backgroundColor: backgroundColor.value,
  }));

  return (
    <Pressable onPress={onToggle}>
      <Animated.View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderWidth: 2,
            borderRadius: 16,
            marginRight: 10,
            marginBottom: 10,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ color:  '#000', fontFamily:"Medium" }}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}
