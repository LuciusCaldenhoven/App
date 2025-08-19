import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";

import { styles } from "@/styles/filter.styles";
import { COLORS } from "@/constants/theme";
import TabSwitcher from "@/components/tabSwitcher/component";
import { renderBorderBottom, renderMarginBottom, renderMarginTop } from "@/constants/ui-utils";
import exportData from "./filter.data";
import Button from "@/components/button/component";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import AnimatedSelectableBox from "@/components/tagSelector/tagSelector";
import { api } from "@/convex/_generated/api";
import PriceRangeInput from "@/components/PriceRangeInput";
import LottieView from "lottie-react-native";

type FilterProps = {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    title: string;
    category: string;
    type: string;
    condition: string[];
    priceRange: number[];
    date: string;
  }) => void;
  category?: string;
  title?: string;
  nivel2?: string;
  nivel3?: string;
  nivel4?: string;
  subcategory?: string;
  search: boolean;
};

export default function Filter({
  visible,
  onClose,
  onApplyFilters,
  category,
  title,
  nivel2,
  nivel3,
  nivel4,
  subcategory,
  search
}: FilterProps) {
  const screenWidth = Dimensions.get("window").width;
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [highestPrice, setHighestPrice] = useState<number | null>(null);

  // Estado local SOLO para lo que el usuario modifica dentro del modal
  const [filters, setFilters] = useState<{
    title: string;
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
    priceRange: [0, 1000000],
    date: "",
  });

  /**
   * 🔑 Las queries usan directamente `title` y `category` de las props,
   * así reaccionan al instante cuando cambian en SearchPage.
   */
  const stats = useQuery(api.posts.getFilteredStats, {
    search: search,
    title: title ? String(title) : undefined,
    category: category ? String(category) : undefined,
    type: filters.type || undefined,
    condition: filters.condition.length > 0 ? filters.condition.join(",") : undefined,
    priceRange: filters.priceRange,
    nivel2: nivel2 ? String(nivel2) : undefined,
    nivel3: nivel3 ? String(nivel3) : undefined,
    nivel4: nivel4 ? String(nivel4) : undefined,
    subcategory: subcategory ? String(subcategory) : undefined,
  });

  const filteredPrices = useQuery(api.posts.getFilteredPrices, {
    search: search,
    title: title ? String(title) : undefined,
    category: category ? String(category) : undefined,
    type: filters.type || undefined,
    condition: filters.condition.length > 0 ? filters.condition.join(",") : undefined,
    priceRange: filters.priceRange,
    nivel2: nivel2 ? String(nivel2) : undefined,
    nivel3: nivel3 ? String(nivel3) : undefined,
    nivel4: nivel4 ? String(nivel4) : undefined,
    subcategory: subcategory ? String(subcategory) : undefined,
  });

  // Sincroniza el estado visible con las props cada vez que se abre el modal
  useEffect(() => {
    if (!visible) return;
    setFilters((prev) => ({
      ...prev,
      title: title || "",
      category: category || "",
    }));
  }, [visible, title, category]);

  // Actualiza el mayor precio al abrir o cuando cambia la consulta
  useEffect(() => {
    if (visible && filteredPrices) {
      setHighestPrice(filteredPrices.highestPrice || 0);
    }
  }, [visible, filteredPrices]);

  // Si todavía tienes el "tope" inicial, sustitúyelo por el mayor precio real
  useEffect(() => {
    if (visible && highestPrice !== null && filters.priceRange[1] === 1000000) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], highestPrice],
      }));
    }
  }, [highestPrice, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyFilters = () => {
    onApplyFilters(filters); // el padre hará MERGE y conservará nivel2/nivel3/nivel4/subcategory
    onClose();
  };

  const handleClearAll = () => {
    setFilters({
      title: title || "",
      category: category || "",
      type: "",
      condition: [],
      priceRange: [0, highestPrice || 2000],
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
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar búsqueda</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} style={styles.closeButton} />
            </TouchableOpacity>
          </View>

          {/* Contenido */}
          <ScrollView
            scrollEnabled={scrollEnabled}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Tipos */}
            <View style={styles.box}>
              <TabSwitcher
                title="Tipos"
                data={exportData.data}
                onPress={(selectedType) => {
                  setFilters((prev) => ({ ...prev, type: String(selectedType) }));
                }}
              />
            </View>

            {/* Rango de precio */}
            <View style={styles.box}>
              <View className="frsb" style={styles.frsb}>
                <Text style={styles.text}>Rango de precio</Text>
              </View>

              <View style={{ padding: 25, alignItems: "center" }}>
                <MultiSlider
                  values={filters.priceRange}
                  min={0}
                  max={highestPrice || 2000}
                  step={1}
                  sliderLength={screenWidth - 85}
                  onValuesChange={(values) => setFilters((prev) => ({ ...prev, priceRange: values as number[] }))}
                  onValuesChangeStart={() => setScrollEnabled(false)}
                  onValuesChangeFinish={() => setScrollEnabled(true)}
                  selectedStyle={{ backgroundColor: COLORS.black }}
                  unselectedStyle={{ backgroundColor: "#ddd" }}
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
                  onChange={(range) => setFilters((prev) => ({ ...prev, priceRange: [range[0], range[1]] }))}
                />
              </View>
            </View>

            {/* Condición */}
            <View style={styles.box}>
              <View style={styles.frsb}>
                <Text style={styles.text}>Condición</Text>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", paddingVertical: 16 }}>
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

            {/* Fecha */}
            <View style={styles.box}>
              <View style={styles.frsb}>
                <Text style={styles.text}>Fecha de publicación</Text>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", paddingVertical: 14 }}>
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

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.frsb}>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAll}>Limpiar todo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleApplyFilters}>
              <Button
                text={stats?.totalPosts !== undefined ? `Mostrar ${stats.totalPosts} productos` : ""}
                component={
                  stats?.totalPosts === undefined ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                      <LottieView
                        source={require("@/assets/animations/Loading.json")}
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
      </View>
    </Modal>
  );
}
