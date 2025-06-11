import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const DOT_COUNT = 3;
const DOT_COLOR = '#FFFFFF';

const WaveDotsLoader = () => {
  const animations = Array.from({ length: DOT_COUNT }, () => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    const loops = animations.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150), // delay progresivo
          Animated.timing(anim, {
            toValue: -8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay((DOT_COUNT - index - 1) * 150), // delay para completar el ciclo total
        ])
      );
    });

    loops.forEach(loop => loop.start());
    return () => loops.forEach(loop => loop.stop());
  }, []);

  return (
    <View style={styles.container}>
      {animations.map((translateY, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: DOT_COLOR,
              transform: [{ translateY }],
            },
          ]}
        />
      ))}
    </View>
  );
};

export default WaveDotsLoader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
