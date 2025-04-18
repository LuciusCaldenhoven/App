// filepath: c:\Users\98312\OneDrive\Escritorio\Segunda_mano\components\swiper\Slider.tsx
import { Animated, FlatList, StyleSheet, View, Text } from 'react-native';
import React, { useRef, useState } from 'react';
import Slides, { Slide } from './data/index';
import SlideItem from './SlideItem';
import Pagination from './Pagination';

const Slider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver: false,
    }
  );

  const handleOnViewableItemsChanged = useRef(({ viewableItems }: any) => {
    setIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View>
      <Text style={{ fontSize: 24, marginTop: 100, fontFamily: 'Poppins', marginLeft:10 }}>¿Qué subirás?</Text>
      <FlatList
        data={Slides}
        renderItem={({ item }: { item: Slide }) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination data={Slides} scrollX={scrollX} index={index} />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({});