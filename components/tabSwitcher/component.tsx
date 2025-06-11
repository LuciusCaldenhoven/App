import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import { styles } from '@/components/tabSwitcher/tab.styles';
import { ITab, ITabProps } from './iTab.props';

const screenWidth = Dimensions.get('window').width;

const TabSwitcher = ({ title, data, onPress, tabStyle, tabContainerStyle, tabTextStyle, }: Omit<ITabProps, 'onPress'> & { onPress: (value: string) => void }) => {

  const [active, setActive] = useState<ITab>(data[0]);
  const [tabWidth, setTabWidth] = useState(screenWidth / data.length);
  const animatedLeft = useRef(new Animated.Value(0)).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    const totalWidth = e.nativeEvent.layout.width;
    setTabWidth(totalWidth / data.length);
  };

  const animate = (index: number) => {
    Animated.spring(animatedLeft, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const index = data.findIndex((i) => i.id === active.id);
    animate(index);
  }, [active]);

  return (
    <View style={styles.typeView}>
      <View style={{paddingBottom: 10}}>
        {title && <Text style={styles.text}>{title}</Text>}
      </View>

      <View style={[styles.tabContainer, tabContainerStyle]} onLayout={handleLayout}>
        {/* Indicator animado */}
        <Animated.View
          pointerEvents="none"

          style={[
            styles.indicator,
            {
              width: tabWidth - 4,
              left: animatedLeft,
            },
          ]}
        />

        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            <Pressable
              onPress={() => {
                onPress(item.value);
                setActive(item);
              }}
              style={[
                styles.tab,
                tabStyle,
              ]}
              accessibilityRole="button"
            >
              <Text style={[ styles.tabText, tabTextStyle, item.id === active?.id && styles.tabTextActive, ]} >
                {item.label}
              </Text>
            </Pressable>
            {index !== data.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default TabSwitcher;
