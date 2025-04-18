// filepath: c:\Users\98312\OneDrive\Escritorio\Segunda_mano\components\swiper\SlideItem.tsx
import React from 'react';
import { Image, StyleSheet, Text, View, Dimensions, Animated, Easing } from 'react-native';
import { Slide } from './data/index';
import Button from '../button/component';

const { width, height } = Dimensions.get('screen');

interface SlideItemProps {
  item: Slide;
}

const SlideItem: React.FC<SlideItemProps> = ({ item }) => {
  const translateYImage = new Animated.Value(40);

  Animated.timing(translateYImage, {
    toValue: 0,
    duration: 1000,
    useNativeDriver: true,
    easing: Easing.bounce,
  }).start();

  return (
    <View style={styles.container}>
      <Animated.Image
        source={item.img}
        resizeMode="contain"
        style={[ styles.image, { transform: [ { translateY: translateYImage, }, ], }, ]} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default SlideItem;

const styles = StyleSheet.create({

  
  container: {
    width,
    height,
    marginTop : -100,
 
  },
  image: {
    marginTop: 20,
    flex: 0.6,
    width: '100%',
  },
  content: {
    flex: 0.4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: 18,
    marginVertical: 12,
    color: '#333',
    fontFamily: 'Poppins',
  },

});