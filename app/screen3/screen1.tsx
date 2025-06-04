import React, { useState } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const colors = ['#FFA07A', '#8FBC8F', '#87CEFA', '#FFDEAD', '#DDA0DD'];

const CarouselWithDots = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={200}
        data={colors}
        autoPlay
        loop
        autoPlayInterval={6000}
        scrollAnimationDuration={300}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ index, item }) => (
          <View style={[styles.item, { backgroundColor: item }]}>
            <Text style={styles.text}>Slide {index + 1}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {colors.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default CarouselWithDots;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
    width: 10,
    height: 10,
  },
});
