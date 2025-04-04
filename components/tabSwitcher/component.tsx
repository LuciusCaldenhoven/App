import { View, Text, Pressable, FlatList } from 'react-native';
import React, { useState } from 'react';
import { styles } from '@/styles/tab.styles';
import { ITab, ITabProps } from './iTab.props';

const TabSwitcher = ({ title, data, onPress, tabStyle,tabContainerStyle,tabTextStyle }: ITabProps) => {
  const [active, setActive] = useState<ITab>(data[0]);

  return (
    <View style={styles.typeView}>
      {title && <Text style={styles.text}>{title}</Text>}

      <View style={[styles.tabContainer, tabContainerStyle]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          data={data}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onPress(item);
                setActive(item);
              }}
              style={[
                styles.tab,
                tabStyle,
                item.id === active.id && styles.activeTab
              ]}
            >
              <Text style={[styles.tabText,tabTextStyle, item.id === active.id && styles.tabTextActive]}>{item.label}</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

export default TabSwitcher;
