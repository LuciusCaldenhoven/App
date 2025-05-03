// app/search/filter.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Pressable, TextInput, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/filter.styles";
import { COLORS, SIZES } from "@/constants/theme";
import TabSwitcher from "@/components/tabSwitcher/component";
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import InputComponent from "@/components/input/component";
import exportData from "./filter.data";
import Button from "@/components/button/component";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Dropdown } from "react-native-element-dropdown";
import AnimatedSelectableBox from "@/components/tagSelector/tagSelector";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type FilterProps = {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
};

export default function Filter({ visible, onClose, onApplyFilters }: FilterProps) {
  const screenWidth = Dimensions.get('window').width;
  const [filters, setFilters] = useState<{
    type: string;
    condition: string[];
    priceRange: number[];
    date: string;
  }>({
    type: "",
    condition: [],
    priceRange: [0, 1000],
    date: "",
  });

  // Consulta el número de productos filtrados
  const productCount = useQuery(api.posts.getFilteredProductCount, {
    ...filters,
    condition: filters.condition.join(","),
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const toggleSeleccion = (item: string) => {
    setFilters((prev) => ({
      ...prev,
      condition: prev.condition.includes(item)
        ? prev.condition.filter((i) => i !== item)
        : [...prev.condition, item],
    }));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar búsqueda</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} style={styles.closeButton} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {renderMarginBottom(16)}
            <Text style={styles.label}>Ordenar por</Text>
            {renderMarginBottom(16)}
            <Dropdown
              data={exportData.ordenarPorData}
              labelField="label"
              valueField="value"
              value={filters.type}
              onChange={(item) =>
                setFilters((prev) => ({ ...prev, type: item.value }))
              }
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.itemText}
              renderRightIcon={() => (
                <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
              )}
              renderItem={(item, selected) => (
                <View
                  style={[
                    styles.item,
                    selected ? styles.itemSelected : null,
                  ]}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
              )}
            />
            {renderMarginBottom(16)}
            <TabSwitcher
              title="Tipos"
              data={exportData.data}
              onPress={(selectedType) => {
                console.log("Tipo seleccionado:", selectedType);
                setFilters((prev) => ({ ...prev, type: String(selectedType) }));
              }}
            />

            {renderBorderBottom(0)}
            {renderMarginBottom(16)}

            <View style={styles.frsb}>
              <Text style={styles.text}>Rango de precio</Text>
            </View>
            <View style={{ paddingHorizontal: 25 }}>
              <MultiSlider
                values={filters.priceRange}
                min={0}
                max={1000}
                step={1}
                sliderLength={screenWidth - 85}
                onValuesChange={(values) =>
                  setFilters((prev) => ({ ...prev, priceRange: values }))
                }
                selectedStyle={{ backgroundColor: COLORS.black }}
                unselectedStyle={{ backgroundColor: '#ddd' }}
                markerStyle={{ backgroundColor: COLORS.white }}
              />
            </View>

            <View style={styles.frsb}>
              <InputComponent
                keyboardType="numeric"
                value={filters.priceRange[0].toString()}
                onChangeText={(e) => {
                  const value = Number(e);
                  if (!isNaN(value)) setFilters((prev) => ({ ...prev, priceRange: [value, prev.priceRange[1]] }));
                }}
                placeholder="Mínimo"
                containerStyle={styles.inputContainer}
              />

              <InputComponent
                keyboardType="numeric"
                value={filters.priceRange[1].toString()}
                onChangeText={(e) => {
                  const value = Number(e);
                  if (!isNaN(value)) setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
                }}
                placeholder="Máximo"
                containerStyle={styles.inputContainer}
              />
            </View>

            {renderMarginTop(16)}
            {renderBorderBottom(10)}
            {renderMarginBottom(16)}

            <View style={styles.frsb}>
              <Text style={styles.text}>Condicion</Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}>
              {exportData.condicionData.map((item) => (
                <AnimatedSelectableBox
                  key={item.id}
                  label={item.label}
                  isSelected={filters.condition.includes(item.value)}
                  onToggle={() => toggleSeleccion(item.value)}
                />
              ))}
            </View>
            <View style={styles.frsb}>
              <Text style={styles.text}>Fecha de publicacion</Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}>
              {exportData.fecha.map((item) => (
                <AnimatedSelectableBox
                  key={item.id}
                  label={item.label}
                  isSelected={filters.date === item.value}
                  onToggle={() => setFilters((prev) => ({ ...prev, date: item.value }))}
                />
              ))}
            </View>

            {renderMarginTop(16)}
            {renderBorderBottom(10)}
            {renderMarginBottom(16)}

            {renderBorderBottom(10)}
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <View style={styles.frsb}>
            <TouchableOpacity>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApplyFilters}>
              {productCount === undefined ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Button
                  text={`Mostrar ${productCount || 0} productos`}
                  textStyles={styles.btnTextStyle}
                  buttonStyles={styles.btnContainerStyle}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

