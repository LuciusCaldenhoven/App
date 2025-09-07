import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Plus } from "lucide-react-native";
import LottieView from "lottie-react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { router } from "expo-router";

import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import styles from "./myproducts.styles";
import PostProduct from "@/components/PostProduct/PostProduct";
import snap from "@/assets/animations/Chasquido.json";

/* -------------------------------------------------------
   MyProducts — Header + Tabs con subrayado elástico
------------------------------------------------------- */

type TabKey = "En venta" | "Vendidos";

export default function MyProducts() {
  const { userId } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TabKey>("En venta");

  // Data
  const posts = useQuery(api.posts.getNotSoldPostsByUser, {});
  const postsSold = useQuery(api.posts.getSoldPostsByUser, {});
  const isLoading = posts === undefined || postsSold === undefined;

  const countOnSale = posts?.length ?? 0;
  const countSold = postsSold?.length ?? 0;

  const renderList = () => {
    if (selectedTab === "En venta") {
      if (!posts || posts.length === 0) return <NoProductsFound />;
      return (
        <FlatList
          data={posts}
          numColumns={1}
          keyExtractor={(item: any) => String(item._id)}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: post }) => <PostProduct post={post} />}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      if (!postsSold || postsSold.length === 0) return <NoProductsSold />;
      return (
        <FlatList
          data={postsSold}
          numColumns={1}
          keyExtractor={(item: any) => String(item._id)}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: post }) => <PostProduct post={post} />}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>

      {/* Header */}
      <View style={H.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={H.side}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={25} color="#111827" />
        </TouchableOpacity>

        <Text numberOfLines={1} style={H.title}>Mis productos</Text>

        {/* Spacer para centrar el título */}
        <View style={H.side} />
      </View>

      {/* Tabs con subrayado elástico (siempre visibles) */}
      <TabsElastic
        value={selectedTab}
        onChange={(k) => setSelectedTab(k as TabKey)}
        items={[
          { key: "En venta", label: "En venta", count: countOnSale },
          { key: "Vendidos", label: "Vendidos", count: countSold },
        ]}
      />

      {/* Contenido */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 160 }}>
            <LottieView source={snap} autoPlay loop style={{ width: 240, height: 240 }} />
          </View>
        ) : (
          renderList()
        )}
      </View>
    </View>
  );
}

/* ---------------- Tabs (subrayado elástico) ---------------- */

function TabsElastic({
  items,
  value,
  onChange,
}: {
  items: { key: string; label: string; count?: number }[];
  value: string;
  onChange: (k: string) => void;
}) {
  const [measures, setMeasures] = useState<{ x: number; w: number }[]>(
    items.map(() => ({ x: 0, w: 0 }))
  );
  const animX = useRef(new Animated.Value(0)).current;
  const animW = useRef(new Animated.Value(0)).current;

  const activeIdx = Math.max(0, items.findIndex((i) => i.key === value));

  useEffect(() => {
    const m = measures[activeIdx];
    if (!m) return;
    Animated.spring(animX, {
      toValue: m.x,
      useNativeDriver: false,
      stiffness: 200,
      damping: 22,
      mass: 0.6,
    }).start();
    Animated.spring(animW, {
      toValue: m.w,
      useNativeDriver: false,
      stiffness: 200,
      damping: 22,
      mass: 0.6,
    }).start();
  }, [activeIdx, measures, animX, animW]);

  return (
    <View style={A.wrap}>
      <View style={A.row}>
        {items.map((it, idx) => {
          const active = it.key === value;
          return (
            <TouchableOpacity
              key={it.key}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                setMeasures((prev) => {
                  const next = [...prev];
                  next[idx] = { x, w: width };
                  return next;
                });
              }}
              style={A.item}
              activeOpacity={0.85}
              onPress={() => onChange(it.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text style={[A.text, active ? A.textActive : A.textIdle]}>{it.label}</Text>
              {typeof it.count === "number" && (
                <Text style={[A.count, active ? A.countActive : A.countIdle]}> {it.count}</Text>
              )}
            </TouchableOpacity>
          );
        })}
        {/* Indicador elástico auto-ancho */}
        <Animated.View
          style={[A.indicator, { left: animX, width: animW, backgroundColor: COLORS.main }]}
        />
      </View>
    </View>
  );
}

/* ---------------- Empty states ---------------- */

function NoProductsFound() {
  return (
    <View style={ES.wrap}>
      {/* Ilustración simple */}
      <View style={ES.illustration}>
        <Feather name="box" size={28} color={COLORS.main} />
      </View>

      <Text style={ES.title}>Aún no has publicado</Text>
      <Text style={ES.subtitle}>
        Sube tu primer artículo y llega a cientos de personas en minutos.
      </Text>

      {/* CTA principal */}
      <View style={ES.tipsRow}>
        <TipChip label="Fotos claras" />
        <TipChip label="Precio competitivo" />
        <TipChip label="Descripción breve" />
      </View>
    </View>
  );
}

function TipChip({ label }: { label: string }) {
  return (
    <View style={ES.chip}>
      <Feather name="check" size={12} color="#4B5563" />
      <Text style={ES.chipText}>{label}</Text>
    </View>
  );
}

const ES = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontFamily: "SemiBold",
    color: COLORS.main,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Regular",
    marginBottom: 18,
    maxWidth: 320,
  },
  cta: {
    height: 44,
    minWidth: 180,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: COLORS.main,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  ctaText: {
    color: "#fff",
    fontFamily: "Medium",
    fontSize: 15,
  },
  tipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  chipText: {
    fontSize: 12,
    color: "#4B5563",
    fontFamily: "Medium",
  },
});


function NoProductsSold() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ color: COLORS.main, fontSize: 20, fontFamily: "Medium", marginBottom: 6 }}>
        Aún no has vendido productos
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" }}>
        Cuando marques algo como vendido, aparecerá aquí
      </Text>
    </View>
  );
}

/* ---------------- estilos locales ---------------- */

const H = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(17,24,39,0.08)",
    backgroundColor: "#FFFFFF",
  },
  side: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    color: "#111827",
    fontFamily: "SemiBold",
  },
});

const A = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(17,24,39,0.08)",
    paddingHorizontal: 12,
  },
  row: { flexDirection: "row", position: "relative" },
  item: { paddingVertical: 12, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" },
  text: { fontFamily: "SemiBold", fontSize: 15 },
  textIdle: { color: "#6B7280" },
  textActive: { color: "#111827" },
  count: { fontFamily: "Medium", fontSize: 14, marginLeft: 2 },
  countIdle: { color: "#9CA3AF" },
  countActive: { color: "#4B5563" },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    borderRadius: 2,
  },
});
