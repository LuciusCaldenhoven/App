import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TextInput, TouchableOpacity, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MapPin, MessageCircle } from "lucide-react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 160;

const items = [
  { id: "1", image: require("@/assets/images/banners/image_4.jpg") },
  { id: "2", image: require("@/assets/images/banners/image_5.jpg") },

];

const tabItems = ["Recomendacion", "Celulares", "Motos", "Servicios"];



export default function OverlayScrollExample() {
  const [activeTab, setActiveTab] = useState("Recomendacion");
  return (
    <View style={styles.container}>
      {/* Parte fija con fondo gris claro */}
      <View style={styles.topSection} pointerEvents="box-none">
        {/* Header visual */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <MapPin size={24} strokeWidth={2.2} color="#222" />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>Tu ubicacion</Text>
            <Text style={styles.subtitle}>Hola</Text>
          </View>

          <View style={styles.iconWrapper}>
            <MessageCircle size={24} strokeWidth={2.2} color="#222" />
          </View>

        </View>

        <View style={styles.containerCarousel}>
          <Carousel
            mode="vertical-stack"
            modeConfig={{
              showLength: 3,          // Cuántos ítems se muestran en stack
              scaleInterval: 0.08,    // Cuánto se escalan los del fondo
              opacityInterval: 0.2,   // Opacidad para ítems atrás
            }}
            width={width * 0.85}
            height={160}
            autoPlay
            loop
            data={items}
            scrollAnimationDuration={10000}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image
                  source={item.image}
                  style={styles.image}
                  contentFit="cover"
                />
              </View>
            )}
          />

        </View>
      </View>


      {/* Contenido scrollable */}
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 230, paddingBottom: 30, }} >
        <View style={styles.scrollContent}>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#666" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Que quieres comprar?"
                placeholderTextColor="#666"
                style={styles.input}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.HorizontalContainer}
          >
            {tabItems.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, isActive && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>



          <View style={styles.SectionContainer}>
            <Text style={styles.sectionTitle}>Cerca tuyo</Text>
            <TouchableOpacity style={styles.iconWrapper2}>
              <Ionicons name="chevron-forward" size={18} color="#111" />
            </TouchableOpacity>
          </View>
          {[...Array(20)].map((_, i) => (
            <Text key={i} style={styles.scrollText}>
              Línea {i + 1}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerCarousel: {
    paddingVertical: 20,
    alignItems: "center",
  },
  SectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Regular',
    color: "#111",
  },

  iconWrapper2: {
    alignItems: 'center',
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 999,
    width: 45,
  },

  item: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F7FA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",

    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: 'Regular'
  },

  iconWrapper: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2, // para Android
  },

  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 60,
    backgroundColor: "#F5F5F5", // gris claro
    justifyContent: "flex-end",
    paddingBottom: 20,

    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    color: "#111",
    fontFamily: 'Medium'
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    fontFamily: 'Regular'
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -HEADER_HEIGHT / 2,
    paddingVertical: 20,
  },
  scrollText: {
    fontSize: 16,
    marginBottom: 12,
  },
  HorizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tab: {
    backgroundColor: "#F5F7FA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#041B2D", // azul oscuro
  },
  tabText: {
    fontSize: 14,
    color: "#222",

    fontFamily: 'Medium'
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
  },

});
