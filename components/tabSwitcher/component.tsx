import { View, Text, Pressable, FlatList } from 'react-native';
import React, { useState } from 'react';
import { styles } from '@/components/tabSwitcher/tab.styles';
import { ITab, ITabProps } from './iTab.props';
import { COLORS } from '@/constants/theme';


const TabSwitcher = ({ title, data, onPress, tabStyle, tabContainerStyle, tabTextStyle }: Omit<ITabProps, 'onPress'> & { onPress: (value: string) => void }) => {
  const [active, setActive] = useState<ITab>(data[0]);

  return (
    <View style={styles.typeView}>
      {title && <Text style={styles.text}>{title}</Text>}

      <View style={[styles.tabContainer, tabContainerStyle]}>
        {data.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              onPress(item.value); // Pasa el valor del tipo seleccionado
              setActive(item); // Actualiza el estado interno del TabSwitcher
            }}
            style={[
              styles.tab,
              tabStyle,
              item.id === active?.id && styles.activeTab,
            ]}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabText,
                tabTextStyle,
                item.id === active?.id && styles.tabTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default TabSwitcher;
