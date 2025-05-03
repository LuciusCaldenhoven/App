import { TouchableOpacity, View, Text, Pressable } from 'react-native';

import {CategoryBoxProps} from './categoryBox.props';



export const CategoryBox = ({ icon, title, backgroundColor = '#fff', onPress, width = 110, height = 110, textColor, }: CategoryBoxProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ backgroundColor, width, height, borderRadius: 25, justifyContent: 'center', alignItems: 'center', }}>
        {icon}
        <Text style={{ marginTop: 8, fontFamily : 'Medium', color: textColor}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
