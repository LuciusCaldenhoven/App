import { COLORS } from '@/constants/theme';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const PILL_WIDTH = width * 0.9;
const TAB_WIDTH = PILL_WIDTH / 2;

type TabSwitcherProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const TabSwitcherr = ({ activeTab, setActiveTab }: TabSwitcherProps) => {
  const translateX = useSharedValue(activeTab === 'Productos' ? 0 : TAB_WIDTH);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = (tab: string) => {
    setActiveTab(tab);
    translateX.value = withTiming(tab === 'Productos' ? 0 : TAB_WIDTH, {
      duration: 250,
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Animated.View style={[styles.activeBackground, animatedStyle]} />
        {['Productos', 'Reviews'].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => handlePress(tab)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {

    alignItems: 'center',

  },
  container: {
    width: PILL_WIDTH,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    padding: 3,

    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  activeBackground: {
    position: 'absolute',
    height: 39,
    width: TAB_WIDTH - 18,
    backgroundColor: '#f7f8fd',
    borderRadius: 8,
    zIndex: 1,
    left: 7,

  },
  tabButton: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'SemiBold'
  },
  activeTabText: {
    color: COLORS.main,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#888',
  },
});
