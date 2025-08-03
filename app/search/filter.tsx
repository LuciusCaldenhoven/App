// app/search/filter.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/filter.styles";
import { COLORS, SIZES } from "@/constants/theme";
import TabSwitcher from "@/components/tabSwitcher/component";
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import exportData from "./filter.data";
import Button from "@/components/button/component";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AnimatedSelectableBox from "@/components/tagSelector/tagSelector";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PriceRangeInput from "@/components/PriceRangeInput";
import LottieView from "lottie-react-native";


type FilterProps = {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  category?: string;
  title?: string;
};

export default function Filter({ visible, onClose, onApplyFilters, category, title }: FilterProps) {
  const screenWidth = Dimensions.get('window').width;
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [highestPrice, setHighestPrice] = useState<number | null>(null);


  const [filters, setFilters] = useState<{
    title: string,
    category: string;
    type: string;
    condition: string[];
    priceRange: number[];
    date: string;
  }>({
    title: title || "",
    category: category || "",
    type: "",
    condition: [],
    priceRange: [0, 15000],
    date: "",
  });

  const stats = useQuery(api.posts.getFilteredStats, {
    title: filters.title || undefined,
    category: filters.category || undefined,
    type: filters.type || undefined,
    condition: filters.condition.length > 0 ? filters.condition.join(",") : undefined,
    priceRange: filters.priceRange,
    date: filters.date || undefined,
    location: undefined,
  });


  const filteredPrices = useQuery(api.posts.getFilteredPrices, {
    title: title || undefined,
    category: category || undefined,
  });

  useEffect(() => {
    if (visible && filteredPrices) {
      setHighestPrice(filteredPrices.highestPrice || 0);
    }
  }, [visible, filteredPrices]);

  useEffect(() => {
    if (
      visible &&
      highestPrice !== null &&
      filters.priceRange[1] === 15000
    ) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], highestPrice],
      }));
    }
  }, [highestPrice, visible]);



  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();

  };

  const handleClearAll = () => {
    setFilters({
      title: title || "",
      category: category || "",
      type: "",
      condition: [],
      priceRange: [0, 1500],
      date: "",
    });
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
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => { onClose() }}  >

      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar búsqueda</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} style={styles.closeButton} />
            </TouchableOpacity>
          </View>

          <ScrollView scrollEnabled={scrollEnabled} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 100 }} >



            <View style={styles.box}>
              <TabSwitcher
                title="Tipos"
                data={exportData.data}
                onPress={(selectedType) => {
                  setFilters((prev) => ({ ...prev, type: String(selectedType) }));
                }}
              />
            </View>
            <View style={styles.box}>
              <View style={styles.frsb}>
                <Text style={styles.text}>Rango de precio</Text>
              </View>

              <View style={{ padding: 25, alignItems: 'center' }}>
                <MultiSlider
                  values={filters.priceRange}
                  min={0}
                  max={highestPrice || 2000}
                  step={1}
                  sliderLength={screenWidth - 85}
                  onValuesChange={(values) =>
                    setFilters((prev) => ({ ...prev, priceRange: values }))
                  }
                  onValuesChangeStart={() => setScrollEnabled(false)}
                  onValuesChangeFinish={() => setScrollEnabled(true)}

                  selectedStyle={{ backgroundColor: COLORS.black }}
                  unselectedStyle={{ backgroundColor: '#ddd' }}
                  markerStyle={styles.mark}
                  pressedMarkerStyle={styles.pressed}
                  touchDimensions={{
                    height: 600,
                    width: 600,
                    borderRadius: 300,
                    slipDisplacement: 1000,
                  }}

                />

              </View>
              <View style={styles.frsb}>
                <PriceRangeInput
                  value={[filters.priceRange[0] ?? 0, filters.priceRange[1] ?? 0]}
                  onChange={(range) =>
                    setFilters((prev) => ({ ...prev, priceRange: [range[0], range[1]] }))
                  }
                />
              </View>
            </View>

            <View style={styles.box}>
              <View style={styles.frsb}>
                <Text style={styles.text}>Condicion</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 16 }}>
                {exportData.condicionData.map((item) => (
                  <AnimatedSelectableBox
                    key={item.id}
                    label={item.label}
                    isSelected={filters.condition.includes(item.value)}
                    onToggle={() => toggleSeleccion(item.value)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.frsb}>
                <Text style={styles.text}>Fecha de publicacion</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 14 }}>
                {exportData.fecha.map((item) => (
                  <AnimatedSelectableBox
                    key={item.id}
                    label={item.label}
                    isSelected={filters.date === item.value}
                    onToggle={() => setFilters((prev) => ({ ...prev, date: item.value }))}
                  />
                ))}
              </View>
            </View>

          </ScrollView>
        </View>


        <View style={styles.footer}>
          <View style={styles.frsb}>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAll}>Limpiar todo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApplyFilters}>
              <Button
              text={
                stats?.totalPosts !== undefined
                  ? `Mostrar ${stats.totalPosts} productos`
                  : ""
              }
              component={
                stats?.totalPosts === undefined ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                    <LottieView
                      source={require('@/assets/animations/Loading.json')}
                      autoPlay
                      loop
                      style={{ width: 220, height: 220 }}
                    />
                  </View>
                ) : undefined
              }
              textStyles={styles.btnTextStyle}
              buttonStyles={styles.btnContainerStyle}
            />
            </TouchableOpacity>

          </View>
        </View>
      </View >
    </Modal >
  );
}

