import React, { useEffect } from 'react';
import { View, Text, Image, StatusBar, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';

const { height } = Dimensions.get('window');
const hp = (percent: number) => (height * percent) / 100;

export default function WelcomeScreen({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onAnimationFinish(); 
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);
  const opacity = useSharedValue(1);
  
    useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;

    setTimeout(() => {
      ring1padding.value = withSpring(hp(5));
    }, 100);

    setTimeout(() => {
      ring2padding.value = withSpring(hp(5.5));
    }, 300);

    
    const fadeTimeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {

        if (finished) runOnJS(onAnimationFinish)();
      });
    }, 2100);

    return () => clearTimeout(fadeTimeout);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    padding: ring1padding.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    padding: ring2padding.value,
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, fadeStyle]}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.outerRing, ring2Style]}>
        <Animated.View style={[styles.innerRing, ring1Style]}>
          <Image
            source={require('../assets/images/welcome.png')}
            style={styles.logo}
          />
        </Animated.View>
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>Compra y vende</Text>
        <Text style={styles.title}>Diuna</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#adc92b', // Amber-500
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  outerRing: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
  },
  innerRing: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
  },
  logo: {
    width: hp(20),
    height: hp(20),
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(4),
  },
  title: {
    fontSize: hp(7),
    fontFamily:"Bold",
    color: 'white',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: hp(3),
    fontFamily:"SemiBold",
    color: 'white',
    letterSpacing: 1.2,
    marginTop: 4,
  },
});
