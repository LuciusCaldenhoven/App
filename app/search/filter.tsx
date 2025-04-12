// app/search/filter.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/filter.styles";
import { COLORS, SIZES } from "@/constants/theme";
import TabSwitcher from "@/components/tabSwitcher/component";
import { ITab } from "@/components/tabSwitcher/iTab.props";
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import Slider from '@react-native-community/slider';
import InputComponent from "@/components/input/component";
import { data, condicionData } from "./filter.data";
import Button from "@/components/button/component";



type FilterProps = {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
};




export default function Filter({ visible, onClose, onApplyFilters }: FilterProps) {

  const [value, setValue] = useState(0)
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar búsqueda</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.primary} />

            </TouchableOpacity>

          </View>
          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={styles.separator} />

            <TabSwitcher
              title='Tipos'
              data={data}
              onPress={e => console.log(e)}
            />

            {renderBorderBottom(0)}
            {renderMarginBottom(16)}

            <View style={styles.frsb}>
              <Text style={styles.text}>Rango de precio</Text>
              <Text style={styles.text}>S/{value}</Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={min}
              maximumValue={max}
              step={1}
              minimumTrackTintColor={COLORS.black}
              maximumTrackTintColor={COLORS.black}
              thumbTintColor={COLORS.black}
              value={value}
              onValueChange={e => setValue(e)}
            />

            <View style={styles.frsb}>
              <InputComponent
                keyboardType="numeric"
                onChangeText={e => setMin(Number(e))}
                placeholder="Min"
                containerStyle={styles.inputContainer}
              />
              <InputComponent
                keyboardType="numeric"
                onChangeText={e => setMax(Number(e))}
                placeholder="Max"
                containerStyle={styles.inputContainer}
              />
            </View>

            {renderMarginTop(16)}
            {renderBorderBottom(10)}
            {renderMarginBottom(16)}

            <TabSwitcher
              title="Condicion"
              data={condicionData}
              onPress={e => console.log(e)}
              tabContainerStyle={styles.tabContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
            />

            {renderMarginTop(8)}

            <InputComponent
              keyboardType="default"
              onChangeText={e => console.log(e)}
              placeholder="Ubicación"
            />

            {renderMarginTop(16)}
            {renderBorderBottom(10)}
            {renderMarginBottom(16)}
            <TabSwitcher
              title="Condicion"
              data={condicionData}
              onPress={e => console.log(e)}
              tabContainerStyle={styles.tabContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
            />
            <TabSwitcher
              title="Condicion"
              data={condicionData}
              onPress={e => console.log(e)}
              tabContainerStyle={styles.tabContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
            />

            {renderBorderBottom(10)}
            {renderMarginBottom(16)}
            <View style={styles.frsb}>
              <Text style={styles.clearAll}>Clear All</Text>
              <Button
                text= "Show 100+ cars"
                textStyles={styles.btnTextStyle}
                buttonStyles={styles.btnContainerStyle}
              />
            </View>

            {renderMarginBottom(16)}

          </ScrollView>
        </View>
      </View>
    </Modal>

  );
}

